export const departmentSchema = {
  title: 'department schema',
  version: 0,
  description: 'describes a department',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    name: {
      type: 'string',
      maxLength: 50
    }
  },
  required: ['id', 'name'],
};