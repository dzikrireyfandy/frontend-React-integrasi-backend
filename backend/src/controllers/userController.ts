import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';

export class UserController {
  constructor(private userService: UserService = new UserService()) {}

  private handleError(res: Response, error: unknown): Response {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.startsWith('VALIDATION_ERROR:')) return res.status(400).json({ status: 'fail', message: msg.split(':')[1] });
    if (msg.startsWith('DUPLICATE:')) return res.status(409).json({ status: 'fail', message: msg.split(':')[1] });
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server', error: msg });
  }

  getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const usersList = await this.userService.getAllUsers();
      return res.status(200).json({ status: 'success', message: 'Daftar user berhasil diambil', data: usersList });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json({ status: 'success', message: 'User berhasil dibuat', data: user });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
