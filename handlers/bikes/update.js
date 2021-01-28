const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const middy = require('@middy/core')
const validator = require('@middy/validator')
const errorHandler = require('@middy/http-error-handler')
const jsonBodyParser = require('@middy/http-json-body-parser')
const eventNormalizer = require('@middy/http-event-normalizer')
const responseSerializer = require('../../middleware/http-response.serializer')
const cors = require('@middy/http-cors')
const createError = require('http-errors')
const status = require('http-status')

const { inputSchema, outputSchema } = require('../../schemas/bikes/update.schema')

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const logic = async (event, context) => {
  const { id } = event.pathParameters
  const {
    imageUrl,
    isAwesome,
    make,
    model,
    name,
    year,
  } = event.body
  const timestamp = new Date().getTime()

  const ExpressionAttributeNames = Object.entries({
    '#name_text': 'name',
    '#year_int': 'year',
  })
    .reduce((prev, [key, value]) => {
      if (event.body[value]) {
        prev[key] = value
      }

      return prev
    }, {})

  const ExpressionAttributeValues = Object.entries({
    ':imageUrl': imageUrl,
    ':isAwesome': isAwesome,
    ':make': make,
    ':model': model,
    ':name': name,
    ':year': year,
    ':updatedAt': timestamp,
  })
    .reduce((prev, [key, value]) => {
      if (value) {
        prev[key] = value
      }

      return prev
    }, {})

  const ExpressionAttributeNamesLookup = Object.entries(ExpressionAttributeNames)
    .reduce((prev, [key, value]) => {
      prev[value] = key
      return prev
    }, {})

  const UpdateExpressionItems = Object.keys(ExpressionAttributeValues)
    .map((key) => {
      const strippedKey = key.slice(1)
      const safeKey = ExpressionAttributeNamesLookup[strippedKey] || strippedKey
      return `${safeKey} = ${key}`
    })

  if (!UpdateExpressionItems.length) {
    throw new createError.BadRequest()
  }

  const UpdateExpression = `SET ${UpdateExpressionItems.join(', ')}`

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id },
    ExpressionAttributeValues,
    UpdateExpression,
    ReturnValues: 'ALL_NEW',
  }

  if (Object.keys(ExpressionAttributeNames).length) {
    params.ExpressionAttributeNames = ExpressionAttributeNames
  }

  const response = {}

  try {
    const result = await dynamoDb.update(params).promise()
    console.log(result)
    const { Attributes } = result
    response.statusCode = status.OK
    response.body = { data: Attributes }
  } catch (error) {
    console.log(error)
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
