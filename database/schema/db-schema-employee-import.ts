export const employeeImportSchema = {
  title: 'task schema',
  version: 0,
  description: 'describes a task',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    task: {
      type: 'string',
      maxLength: 255
    },
    completed: { type: 'boolean' },
  },
  required: ['id', 'task'],
};