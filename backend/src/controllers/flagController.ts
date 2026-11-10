import type { Request, Response } from 'express';
import { FlagService } from '../services/flagService.ts';

export class FlagController {
  constructor(private flagService: FlagService = new FlagService()) {}

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const flagsList = await this.flagService.getAll();
      return res.status(200).json({ status: 'success', message: 'Daftar flag berhasil diambil', data: flagsList });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: String(error) });
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const flag = await this.flagService.updateStatus(Number(req.params.id), req.body.status);
      return res.status(200).json({ status: 'success', message: 'Status flag berhasil diupdate', data: flag });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.startsWith('VALIDATION_ERROR:')) return res.status(400).json({ status: 'fail', message: msg.split(':')[1] });
      if (msg.startsWith('NOT_FOUND:')) return res.status(404).json({ status: 'fail', message: msg.split(':')[1] });
      return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: msg });
    }
  };
}
