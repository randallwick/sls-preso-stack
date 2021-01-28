module.exports = {
  outputSchema: {
    properties: {
      body: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                imageUrl: { type: 'string', format: 'uri' },
                isAwesome: { type: 'boolean', default: true },
                make: { type: 'string' },
                model: { type: 'string' },
                name: { type: 'string' },
                year: {
                  type: 'integer',
                  minimum: 1900,
                  maximum: new Date().getUTCFullYear() + 1,
                },
              },
              required: ['imageUrl', 'make', 'model', 'name', 'year'],
            },
          }
        }
      },
    },
  },
}
