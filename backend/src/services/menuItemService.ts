import { MenuItemRepository, type MenuItemInput } from '../repositories/menuItemRepository.ts';

export class MenuItemService {
  constructor(private menuItemRepository: MenuItemRepository = new MenuItemRepository()) {}

  async getAll() {
    return this.menuItemRepository.findAll();
  }

  async getById(id: number) {
    const item = await this.menuItemRepository.findById(id);
    if (!item) throw new Error('NOT_FOUND:Menu item tidak ditemukan');
    return item;
  }

  private validate(input: Partial<MenuItemInput>) {
    if (!input.stallId || !input.name || input.price === undefined) {
      throw new Error('VALIDATION_ERROR:stallId, name, dan price wajib diisi');
    }
    if (input.price < 0) throw new Error('VALIDATION_ERROR:price tidak boleh negatif');
  }

  async create(input: MenuItemInput) {
    this.validate(input);
    return this.menuItemRepository.create(input);
  }

  async update(id: number, input: MenuItemInput) {
    this.validate(input);
    await this.getById(id);
    return this.menuItemRepository.update(id, input);
  }

  async delete(id: number) {
    await this.getById(id);
    return this.menuItemRepository.remove(id);
  }
}
