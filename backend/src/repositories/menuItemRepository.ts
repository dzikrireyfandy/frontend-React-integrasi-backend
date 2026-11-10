import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems, stalls } from '../db/schema.ts';

export interface MenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable?: boolean;
}

export class MenuItemRepository {
  // JOIN ke STALLS supaya response ikut menampilkan nama warung
  // (poin: MENU_ITEMS Full CRUD + JOIN stall)
  async findAll() {
    const db = await getDb();
    return db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        stallName: stalls.name,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .orderBy(menuItems.id);
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        stallName: stalls.name,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(eq(menuItems.id, id));
    return rows[0];
  }

  // Dipakai juga di Materi 3 (poin 15/18): daftar menu milik satu warung
  async findByStallId(stallId: number) {
    const db = await getDb();
    return db.select().from(menuItems).where(eq(menuItems.stallId, stallId));
  }

  async create(input: MenuItemInput) {
    const db = await getDb();
    const rows = await db
      .insert(menuItems)
      .output()
      .values({
        stallId: input.stallId,
        name: input.name,
        price: input.price,
        isAvailable: input.isAvailable ?? true,
      });
    return this.findById(rows[0].id);
  }

  async update(id: number, input: MenuItemInput) {
    const db = await getDb();
    await db
      .update(menuItems)
      .set({ stallId: input.stallId, name: input.name, price: input.price, isAvailable: input.isAvailable ?? true })
      .where(eq(menuItems.id, id));
    return this.findById(id);
  }

  async remove(id: number) {
    const existing = await this.findById(id);
    const db = await getDb();
    await db.delete(menuItems).where(eq(menuItems.id, id));
    return existing;
  }
}
