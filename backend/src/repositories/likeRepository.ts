import { count, eq, and } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes, reviews } from '../db/schema.ts';

export interface LikeInput {
  reviewId: number;
  userId: number;
}

export class LikeRepository {
  async exists(reviewId: number, userId: number): Promise<boolean> {
    const db = await getDb();
    const rows = await db
      .select({ id: likes.id })
      .from(likes)
      .where(and(eq(likes.reviewId, reviewId), eq(likes.userId, userId)));
    return rows.length > 0;
  }

  async create(input: LikeInput) {
    const db = await getDb();
    const rows = await db.insert(likes).output().values({ reviewId: input.reviewId, userId: input.userId });
    await this.syncLikeCount(input.reviewId);
    return rows[0];
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(likes).where(eq(likes.id, id));
    return rows[0];
  }

  async remove(id: number) {
    const existing = await this.findById(id);
    if (!existing) return undefined;
    const db = await getDb();
    await db.delete(likes).where(eq(likes.id, id));
    await this.syncLikeCount(existing.reviewId);
    return existing;
  }

  // Fitur tambahan: jaga like_count di REVIEWS tetap sinkron dengan tabel LIKES
  private async syncLikeCount(reviewId: number) {
    const db = await getDb();
    const agg = await db.select({ cnt: count() }).from(likes).where(eq(likes.reviewId, reviewId));
    await db.update(reviews).set({ likeCount: Number(agg[0]?.cnt ?? 0) }).where(eq(reviews.id, reviewId));
  }
}
