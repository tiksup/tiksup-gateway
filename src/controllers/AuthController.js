import { loginUserSchema, userValidation } from '../schemas/UserSchema.js'
import User from '../models/authModel.js'
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

    return res.json({ success: true, data: result })
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
    // Usamos la función findByNameAndPassword del modelo User
    const user = await User.findByUsernameAndPassword({ usernameOrEmail: username, password })

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    return res.json({
      success: true,
      user
    })
  } catch (dbErr) {
    console.error('Database authentication error:', dbErr.message)
    return res.status(500).json({ error: 'Something went wrong during login.' })
  }
}

export const deleteUser = async (req, res) => {
  const { userId } = req.params

  try {
    // Usamos la función deleteUser del modelo User
    const result = await User.deleteUserById(userId)

    if (result.error) {
      return res.status(500).json({ error: result.error })
    }

    return res.json({ success: true, message: 'User deleted successfully' })
  } catch (err) {
    console.error('Error deleting user:', err.message)
    return res.status(500).json({ error: 'Something went wrong during deletion.' })
  }
}
