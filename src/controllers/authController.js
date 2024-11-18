import { loginUserSchema, userValidation } from '../schemas/userSchema.js'
import User from '../models/authModel.js'
import { generateToken } from '../config/jwt.js'
import 'dotenv/config'

export const registerUser = async (req, res) => {
  try {
    const { first_name, username, email, password } = req.body

    const { error } = userValidation(req.body)

    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/"/g, '')
      })
    }

    const result = await User.registerUser({ first_name, username, email, password })

    if (result.error) {
      if (result.error.startsWith('llave duplicada') || data.error.startsWith('duplicate key')) {
        return res.status(400).json({ error: 'the user you are trying to register already exists' })
      }
      return res.status(400).json({ error: 'register error' })
    }
    const user = await User.findByNameAndPassword({ usernameOrEmail: username, password: password })

    const token = generateToken({ id: user.id, username: user.username })
    return res.json({ success: true, token })
  } catch (err) {
    console.error('Database registration error:', err.message)
    return res.status(500).json({ error: 'Something went wrong during registration.' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    const { error } = loginUserSchema.validate({ username, password })

    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/"/g, '')
      })
    }

    const user = await User.findByNameAndPassword({ usernameOrEmail: username, password: password })

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    if (user.error) {
      return res.status(404).json({ error: 'Invalid username or password' })
    }

    const token = generateToken({ id: user.id, username: user.username })
    return res.json({ success: true, token })
  } catch (err) {
    console.error('Database authentication error:', err.message)
    return res.status(500).json({ error: 'Something went wrong during login.' })
  }
}
