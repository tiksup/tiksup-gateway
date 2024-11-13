import { loginUserSchema, userValidation } from '../schemas/UserSchema.js'
import User from '../models/authModel.js'
import { generateToken } from '../config/jwt'
import 'dotenv/config'

export const registerUser = async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body

  // Validación usando el esquema de registro
  const { error } = userValidation(req.body)

  if (error) {
    return res.status(400).json({
      error: error.details[0].message.replace(/"/g, '')
    })
  }

  try {
    // Usamos la función de registro de tu modelo User
    const result = await User.registerUser({ first_name, last_name, username, email, password })

    if (result.error) {
      return res.status(500).json({ error: result.error })
    }

    // Generamos el token JWT para el usuario recién registrado
    const token = generateToken({ id: result.id, username: result.username })
    return res.json({ success: true, token })
  } catch (dbErr) {
    console.error('Database registration error:', dbErr.message)
    return res.status(500).json({ error: 'Something went wrong during registration.' })
  }
}

export const loginUser = async (req, res) => {
  const { username, password } = req.body

  // Validación usando el esquema de login
  const { error } = loginUserSchema.validate({ username, password })

  if (error) {
    return res.status(400).json({
      error: error.details[0].message.replace(/"/g, '')
    })
  }

  try {
    // Autenticamos al usuario
    const user = await User.findByNameAndPassword({ usernameOrEmail: username, password })

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // Generación del token JWT
    const token = generateToken({ id: user.id, username: user.username })
    return res.json({ success: true, token })
  } catch (dbErr) {
    console.error('Database authentication error:', dbErr.message)
    return res.status(500).json({ error: 'Something went wrong during login.' })
  }
}

export const deleteUser = async (req, res) => {
  const { userId } = req.params

  try {
    // Usamos la función deleteUser del modelo User
    const result = await User.deleteUser(userId)

    if (result.error) {
      return res.status(500).json({ error: result.error })
    }

    return res.json({ success: true, message: 'User deleted successfully' })
  } catch (err) {
    console.error('Error deleting user:', err.message)
    return res.status(500).json({ error: 'Something went wrong during deletion.' })
  }
}
