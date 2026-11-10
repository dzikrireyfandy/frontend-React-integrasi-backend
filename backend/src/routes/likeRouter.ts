import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post('/', (req, res) => {
  // #swagger.tags = ['Likes']
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LikeInput' } }
  // #swagger.responses[201] = { description: 'Like ditambahkan' }
  return likeController.create(req, res);
});

likeRouter.delete('/:id', (req, res) => {
  // #swagger.tags = ['Likes']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Like dihapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return likeController.delete(req, res);
});

export { likeRouter };
