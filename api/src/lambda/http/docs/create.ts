import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateDocRequest } from '../../../requests/CreateDocRequest'
import { getUserId } from '../../utils'
import { createDoc } from '../../../businessLogic/docs'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing Event ", event)

    const newDoc: CreateDocRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const result = await createDoc(newDoc, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: result
      }),
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)