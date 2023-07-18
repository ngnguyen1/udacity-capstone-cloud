import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateDoc } from '../../../businessLogic/docs'
import { UpdateDocRequest } from '../../../requests/UpdateDocRequest'
import { getUserId } from '../../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Updating a doc - Processing event - ", event)

    const docId = event.pathParameters.docId
    const userId = getUserId(event)
    const updatedDoc: UpdateDocRequest = JSON.parse(event.body)

    await updateDoc(userId, docId, updatedDoc)

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
