import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();
const flagController = new FlagController();

flagRouter.get('/', (req, res) => {
  // #swagger.tags = ['Flags']
  // #swagger.responses[200] = { description: 'Daftar flag (join user pelapor)' }
  return flagController.getAll(req, res);
});

flagRouter.put('/:id', (req, res) => {
  // #swagger.tags = ['Flags']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/FlagStatusInput' } }
  // #swagger.responses[200] = { description: 'Status flag ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return flagController.updateStatus(req, res);
});

export { flagRouter };
