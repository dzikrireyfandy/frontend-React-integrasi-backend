import type { Request, Response } from 'express';
import { MenuItemService } from '../services/menuItemService.ts';

export class MenuItemController {
  constructor(private menuItemService: MenuItemService = new MenuItemService()) {}

  private handleError(res: Response, error: unknown): Response {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.startsWith('VALIDATION_ERROR:')) return res.status(400).json({ status: 'fail', message: msg.split(':')[1] });
    if (msg.startsWith('NOT_FOUND:')) return res.status(404).json({ status: 'fail', message: msg.split(':')[1] });
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: msg });
  }

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const items = await this.menuItemService.getAll();
      return res.status(200).json({ status: 'success', message: 'Daftar menu berhasil diambil (join stall)', data: items });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.getById(Number(req.params.id));
      return res.status(200).json({ status: 'success', message: 'Detail menu berhasil diambil', data: item });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.create(req.body);
      return res.status(201).json({ status: 'success', message: 'Menu berhasil dibuat', data: item });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.update(Number(req.params.id), req.body);
      return res.status(200).json({ status: 'success', message: 'Menu berhasil diupdate', data: item });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.delete(Number(req.params.id));
      return res.status(200).json({ status: 'success', message: 'Menu berhasil dihapus', data: item });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
