import jwt from 'jsonwebtoken'

const { JWT_SECRET } = process.env

export default function userExtractor (authorization) {
  if (!authorization) throw new Error('authorization is required')
  if (!authorization.toLowerCase().startsWith('bearer')) throw new Error('authorization must starts with bearer')
  if (authorization.includes('undefined')) throw new Error('token is required')

  const [, token] = authorization.split(' ')

  const { sub: userId } = jwt.verify(token, JWT_SECRET)

  return userId
}
