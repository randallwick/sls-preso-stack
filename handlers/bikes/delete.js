const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const middy = require('@middy/core')
const validator = require('@middy/validator')
const errorHandler = require('@middy/http-error-handler')
const jsonBodyParser = require('@middy/http-json-body-parser')
const eventNormalizer = require('@middy/http-event-normalizer')
const responseSerializer = require('../../middleware/http-response.serializer')
const cors = require('@middy/http-cors')
const status = require('http-status')

const { inputSchema, outputSchema } = require('../../schemas/bikes/delete.schema')

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const logic = async (event, context) => {
  const { id } = event.pathParameters

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id },
  }

  const response = {}

  try {
    await dynamoDb.delete(params).promise()
    response.statusCode = status.NO_CONTENT
    response.body = {}
  } catch (error) {
    response.statusCode = error.statusCode || status.INTERNAL_SERVER_ERROR
    response.body = {
      error: 'the request failed',
    }
  }

  return response
}

exports.handler = middy(logic)
  .use(eventNormalizer())
  .use(jsonBodyParser())
  .use(responseSerializer())
  .use(validator({ inputSchema, outputSchema }))
  .use(cors())
  .use(errorHandler())
