let apiId
const env = process.env.REACT_APP_ENV || 'dev'

if (env === 'dev') {
  apiId = 'ovt4z3e1lh'
}

if (env === 'test') {
  apiId = 'fbj5zxcxsi'
}
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/${env}`

console.log('hahah')
export const authConfig = {
  domain: 'dev-wezy5on5inhbm31s.us.auth0.com',
  clientId: '8OXmZQh1SN0utILEELONAojRi9jm10KB',
  callbackUrl: 'http://localhost:3000/callback'
}
