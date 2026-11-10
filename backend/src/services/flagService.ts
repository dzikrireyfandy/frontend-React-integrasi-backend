import { FlagRepository, type FlagStatus } from '../repositories/flagRepository.ts';

const ALLOWED_STATUS: FlagStatus[] = ['pending', 'resolved', 'dismissed'];

export class FlagService {
  constructor(private flagRepository: FlagRepository = new FlagRepository()) {}

  async getAll() {
    return this.flagRepository.findAll();
  }

  async updateStatus(id: number, status: FlagStatus) {
    if (!ALLOWED_STATUS.includes(status)) {
      throw new Error('VALIDATION_ERROR:status harus salah satu dari pending, resolved, dismissed');
    }
    const existing = await this.flagRepository.findById(id);
    if (!existing) throw new Error('NOT_FOUND:Flag tidak ditemukan');
    return this.flagRepository.updateStatus(id, status);
  }
}
