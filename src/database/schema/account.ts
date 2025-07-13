export const accountSchema = {
  title: 'account schema',
  version: 0,
  description: 'describes an account',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 100 
    },
    username: {
      type: 'string',
      maxLength: 255 
    }, 
    password: {
      type: 'string',
      maxLength: 150
    }, 
    role: {
      type: 'string',
      maxLength: 50
    }, 
    tokens: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          token: {
            type: 'string'
          },
          issuedAt: {
            type: 'string',
            format: 'date-time'
          }
        },
        required: ['token']
      }
    } 
  },
  required: ['id', 'username', 'password', 'role'],
  indexes: ['username']
}; 