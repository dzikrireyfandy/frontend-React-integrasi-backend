import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags, users } from '../db/schema.ts';

export type FlagStatus = 'pending' | 'resolved' | 'dismissed';

export class FlagRepository {
  async findAll() {
    const db = await getDb();
    return db
      .select({
        id: flags.id,
        reviewId: flags.reviewId,
        reportedBy: flags.reportedBy,
        reportedByName: users.name,
        reason: flags.reason,
        status: flags.status,
        createdAt: flags.createdAt,
      })
      .from(flags)
      .innerJoin(users, eq(flags.reportedBy, users.id))
      .orderBy(flags.id);
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(flags).where(eq(flags.id, id));
    return rows[0];
  }

  async updateStatus(id: number, status: FlagStatus) {
    const db = await getDb();
    const rows = await db.update(flags).set({ status }).where(eq(flags.id, id)).output();
    return rows[0];
  }
}
