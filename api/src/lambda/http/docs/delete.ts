import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteDoc } from '../../../businessLogic/docs'
import { getUserId } from '../../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Deleting a doc - Processing event - ", event)

    const docId = event.pathParameters.docId
    const userId = getUserId(event)

    await deleteDoc(userId, docId)
  
  return {
    statusCode: 200,
    body: JSON.stringify({})
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