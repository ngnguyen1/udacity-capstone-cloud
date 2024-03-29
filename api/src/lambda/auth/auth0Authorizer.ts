import 'source-map-support/register'

import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { verify, decode } from 'jsonwebtoken'
import Axios from 'axios'

import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')
const jwksUrl = 'https://dev-wezy5on5inhbm31s.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  logger.info('Verifying token',authHeader.substring(0,20))
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  const kid: string = jwt.header.kid
  const jwks = await Axios.get(jwksUrl)
  const signingKey = jwks.data.keys.filter((k) => k.kid === kid)[0]
  
  logger.info('singning keys',signingKey)
  if(!signingKey){
    throw new Error('invalid token:${kid}')
  }
  const x5c = signingKey.x5c[0]
  const cert = `-----BEGIN CERTIFICATE-----\n${x5c}\n-----END CERTIFICATE-----`
  if (!jwt) {
    throw new Error('invalid token')
  }

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
