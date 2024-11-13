import { validateToken } from '../config/jwt'

export const authMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization
    if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

    const token = authorization.substring(7)
    const validation = validateToken(token)

    if (validation === null) throw new Error('invalid token')

    req.authUser = validation
    return next()
  } catch (err) {
    return res.status(401).json({ error: err.message })
  }
}

module.exports = authMiddleware
