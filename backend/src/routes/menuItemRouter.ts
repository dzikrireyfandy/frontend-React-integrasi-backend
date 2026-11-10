import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';

const menuItemRouter = Router();
const menuItemController = new MenuItemController();

menuItemRouter.get('/', (req, res) => {
  // #swagger.tags = ['MenuItems']
  // #swagger.responses[200] = { description: 'Daftar menu (join stall)' }
  return menuItemController.getAll(req, res);
});

menuItemRouter.post('/', (req, res) => {
  // #swagger.tags = ['MenuItems']
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
  // #swagger.responses[201] = { description: 'Menu dibuat' }
  return menuItemController.create(req, res);
});

menuItemRouter.get('/:id', (req, res) => {
  // #swagger.tags = ['MenuItems']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail menu' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return menuItemController.getById(req, res);
});

menuItemRouter.put('/:id', (req, res) => {
  // #swagger.tags = ['MenuItems']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
  // #swagger.responses[200] = { description: 'Menu ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return menuItemController.update(req, res);
});

menuItemRouter.delete('/:id', (req, res) => {
  // #swagger.tags = ['MenuItems']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Menu terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return menuItemController.delete(req, res);
});

export { menuItemRouter };
