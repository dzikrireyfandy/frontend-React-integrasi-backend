import { LikeRepository, type LikeInput } from '../repositories/likeRepository.ts';

export class LikeService {
  constructor(private likeRepository: LikeRepository = new LikeRepository()) {}

  async create(input: LikeInput) {
    if (!input.reviewId || !input.userId) {
      throw new Error('VALIDATION_ERROR:reviewId dan userId wajib diisi');
    }
    const already = await this.likeRepository.exists(input.reviewId, input.userId);
    if (already) throw new Error('DUPLICATE:User sudah like review ini');
    return this.likeRepository.create(input);
  }

  async delete(id: number) {
    const removed = await this.likeRepository.remove(id);
    if (!removed) throw new Error('NOT_FOUND:Like tidak ditemukan');
    return removed;
  }
}
