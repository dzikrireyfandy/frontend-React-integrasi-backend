import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  constructor(private likeService: LikeService = new LikeService()) {}

  private handleError(res: Response, error: unknown): Response {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.startsWith('VALIDATION_ERROR:')) return res.status(400).json({ status: 'fail', message: msg.split(':')[1] });
    if (msg.startsWith('DUPLICATE:')) return res.status(409).json({ status: 'fail', message: msg.split(':')[1] });
    if (msg.startsWith('NOT_FOUND:')) return res.status(404).json({ status: 'fail', message: msg.split(':')[1] });
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: msg });
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const like = await this.likeService.create(req.body);
      return res.status(201).json({ status: 'success', message: 'Like berhasil ditambahkan', data: like });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const like = await this.likeService.delete(Number(req.params.id));
      return res.status(200).json({ status: 'success', message: 'Like berhasil dihapus', data: like });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
