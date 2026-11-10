import type { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLogService.ts';

export class AuditLogController {
  constructor(private auditLogService: AuditLogService = new AuditLogService()) {}

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const logs = await this.auditLogService.getAll();
      return res.status(200).json({ status: 'success', message: 'Daftar audit log berhasil diambil', data: logs });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: String(error) });
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const log = await this.auditLogService.create(req.body);
      return res.status(201).json({ status: 'success', message: 'Audit log berhasil dicatat', data: log });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.startsWith('VALIDATION_ERROR:')) return res.status(400).json({ status: 'fail', message: msg.split(':')[1] });
      return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: msg });
    }
  };
}
