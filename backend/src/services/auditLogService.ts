import { AuditLogRepository, type AuditLogInput } from '../repositories/auditLogRepository.ts';

export class AuditLogService {
  constructor(private auditLogRepository: AuditLogRepository = new AuditLogRepository()) {}

  async getAll() {
    return this.auditLogRepository.findAll();
  }

  async create(input: AuditLogInput) {
    if (!input.userId || !input.action || !input.targetTable || !input.targetId) {
      throw new Error('VALIDATION_ERROR:userId, action, targetTable, dan targetId wajib diisi');
    }
    return this.auditLogRepository.create(input);
  }
}
