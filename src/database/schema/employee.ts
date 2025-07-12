export const employeeSchema = {
  title: 'employee schema',
  version: 0,
  description: 'describes a employee',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    surname: {
      type: 'string',
      maxLength: 50
    },
    firstName: {
      type: 'string',
      maxLength: 50
    },
  },
  required: ['id', 'surname', 'firstName'],
};