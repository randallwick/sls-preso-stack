const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const middy = require('@middy/core')
const validator = require('@middy/validator')
const errorHandler = require('@middy/http-error-handler')
const eventNormalizer = require('@middy/http-event-normalizer')
const responseSerializer = require('../../middleware/http-response.serializer')
const createError = require('http-errors')
const status = require('http-status')

const { inputSchema, outputSchema } = require('../../schemas/bikes/get.schema')

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const logic = async (event, context) => {
  const { id } = event.pathParameters

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id },
  }

  const response = {}

  try {
    const { Item } = await dynamoDb.get(params).promise()
    if (Item) {
      response.statusCode = status.OK
      response.body = { data: Item }
    } else {
      throw new createError.NotFound()
    }
  } catch (error) {
    response.statusCode = error.statusCode || status.INTERNAL_SERVER_ERROR
    response.body = {
      error: error.message || 'the request failed',
    }
  }

  return response
}

exports.handler = middy(logic)
  .use(eventNormalizer())
  .use(responseSerializer())
  .use(validator({ inputSchema, outputSchema }))
  .use(errorHandler())
