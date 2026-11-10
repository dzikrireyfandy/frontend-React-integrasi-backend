import bcrypt from 'bcrypt';
import { UserRepository, type CreateUserInput, type UserRole } from '../repositories/userRepository.ts';
import type { UserResponseDto } from '../dtos/userDto.ts';

const ALLOWED_ROLES: UserRole[] = ['admin', 'owner', 'customer'];

export class UserService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  private toDto(row: { id: number; name: string; email: string; role: string; passwordHash?: string; createdAt: Date | null }): UserResponseDto {
    return { id: row.id, name: row.name, email: row.email, role: row.role, createdAt: row.createdAt };
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const rows = await this.userRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async createUser(input: { name: string; email: string; password: string; role: string }): Promise<UserResponseDto> {
    if (!input.name || !input.email || !input.password || !input.role) {
      throw new Error('VALIDATION_ERROR:name, email, password, dan role wajib diisi');
    }
    if (!ALLOWED_ROLES.includes(input.role as UserRole)) {
      throw new Error('VALIDATION_ERROR:role harus salah satu dari admin, owner, customer');
    }

    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new Error('DUPLICATE:Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(input.password, 10);
    const payload: CreateUserInput = { name: input.name, email: input.email, passwordHash, role: input.role as UserRole };
    const row = await this.userRepository.create(payload);
    return this.toDto(row);
  }
}
