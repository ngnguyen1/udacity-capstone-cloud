import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getDocForUser } from '../../../businessLogic/docs'
import { getUserId } from '../../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const docId = event.pathParameters.docId
    const userId = getUserId(event)
    const course = await getDocForUser(userId, docId)
    return {
         statusCode: 200,
         body: JSON.stringify({
            item: course
         }) 
      }
    }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
)