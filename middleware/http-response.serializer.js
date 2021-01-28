const responseSerializer = require('@middy/http-response-serializer')

const defaultOptions = {
  serializers: [
    {
      regex: /^application\/xml$/,
      serializer: ({ body }) => `<message>${body}</message>`,
    },
    {
      regex: /^application\/json$/,
      serializer: ({ body }) => JSON.stringify(body)
    },
    {
      regex: /^text\/plain$/,
      serializer: ({ body }) => body
    }
  ],
  default: 'application/json'
}

module.exports = (options = defaultOptions) => {
  return responseSerializer(options)
}
