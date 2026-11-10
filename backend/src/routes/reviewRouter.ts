import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get('/', (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.parameters['stall_id'] = { in: 'query', type: 'integer', description: 'Filter review berdasarkan warung' }
  // #swagger.responses[200] = { description: 'Daftar review (join user)' }
  return reviewController.getAll(req, res);
});

reviewRouter.post('/', (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }
  // #swagger.responses[201] = { description: 'Review dibuat' }
  return reviewController.create(req, res);
});

reviewRouter.delete('/:id', (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Review terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return reviewController.delete(req, res);
});

export { reviewRouter };
