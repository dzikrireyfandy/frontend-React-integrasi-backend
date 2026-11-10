import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLogController.ts';

const auditLogRouter = Router();
const auditLogController = new AuditLogController();

auditLogRouter.get('/', (req, res) => {
  // #swagger.tags = ['AuditLogs']
  // #swagger.responses[200] = { description: 'Daftar audit log (join user)' }
  return auditLogController.getAll(req, res);
});

auditLogRouter.post('/', (req, res) => {
  // #swagger.tags = ['AuditLogs']
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuditLogInput' } }
  // #swagger.responses[201] = { description: 'Audit log dicatat' }
  return auditLogController.create(req, res);
});

export { auditLogRouter };
