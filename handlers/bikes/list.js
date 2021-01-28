const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const middy = require('@middy/core')
const validator = require('@middy/validator')
const errorHandler = require('@middy/http-error-handler')
const eventNormalizer = require('@middy/http-event-normalizer')
const responseSerializer = require('../../middleware/http-response.serializer')
const cors = require('@middy/http-cors')
const status = require('http-status')

const { outputSchema } = require('../../schemas/bikes/list.schema')

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = { TableName: process.env.DYNAMODB_TABLE }

const logic = async (event, context) => {
  const response = {}

  try {
    const { Items } = await dynamoDb.scan(params).promise()
    response.statusCode = status.OK
    response.body = { data: Items }
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
  .use(responseSerializer())
  .use(validator({ outputSchema }))
  // .use(cors())
  .use(errorHandler())
