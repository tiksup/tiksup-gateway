import axios from 'axios'
import { registerUserSchema, loginUserSchema } from '../schemas/UserSchema.js'
import User from '../models/authModel.js'
import 'dotenv/config'

export const registerUser = async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body

  const { error } = registerUserSchema.validate({ first_name, last_name, username, email, password })

  if (error) {
    return res.status(400).json({
      error: error.details[0].message.replace(/"/g, '')
    })
  }

  try {
    const endpointURL = `${process.env.WORKER_URL}/api/register`
    const request = { first_name, last_name, username, email, password }

    const response = await axios.post(endpointURL, request)

    return res.json({ success: true, data: response.data })
  } catch (err) {
    console.error('Error from Worker service:', err.message)

    try {
      const result = await User.registerUser({ username, email: username, password })

      if (result.error) {
        return res.status(500).json({ error: result.error })
      }

      return res.json({ success: true })
    } catch (dbErr) {
      console.error('Database registration error:', dbErr.message)
      return res.status(500).json({ error: 'Something went wrong during registration.' })
    }
  }
}

export const loginUser = async (req, res) => {
  const { username, password } = req.body

  const { error } = loginUserSchema.validate({ username, password })

  if (error) {
    return res.status(400).json({
      error: error.details[0].message.replace(/"/g, '')
    })
  }

  try {
    const endpointURL = `${process.env.WORKER_URL}/api/login`
    const request = { username, password }

    const response = await axios.post(endpointURL, request)

    return res.json(response.data)
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return res.status(401).json(err.response.data)
    }

    console.error('Error from Worker service:', err.message)

    try {
      const user = await User.findByNameAndPassword({ usernameOrEmail: username, password })

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
}

export const deleteUser = async (req, res) => {
  const { userId } = req.params

  try {
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
