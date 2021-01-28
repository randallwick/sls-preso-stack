module.exports = {
  inputSchema: {
    properties: {
      pathParameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        }
      },
      body: {
        type: 'object',
        properties: {
          imageUrl: { type: 'string', format: 'uri' },
          isAwesome: { type: 'boolean' },
          make: { type: 'string' },
          model: { type: 'string' },
          name: { type: 'string' },
          year: {
            type: 'integer',
            minimum: 1900,
            maximum: new Date().getUTCFullYear() + 1,
          },
        },
      },
    },
  },
  outputSchema: {
    properties: {
      body: {
        type: 'object',
        properties: {
          data: {
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
        },
      },
    },
  },
}
