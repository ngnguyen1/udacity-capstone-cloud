import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getDocsForUser } from '../../../businessLogic/docs'
import { getUserId } from '../../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing Event ", event)

    const userId = getUserId(event)
    const docs = await getDocsForUser(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: docs
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)