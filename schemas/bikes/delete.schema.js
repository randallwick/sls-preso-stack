module.exports = {
  inputSchema: {
    properties: {
      pathParameters: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        }
      },
    },
  },
}
