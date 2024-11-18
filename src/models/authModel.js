import { dbConnectionPg } from '../config/postgres.js'
import bcrypt from 'bcrypt'

const saltRounds = 10

class User {
  static async findByNameAndPassword ({ usernameOrEmail, password }) {
    let connection
    try {
      connection = await dbConnectionPg()

      const { rows } = await connection.query(`
        SELECT id, username, password
        FROM users 
        WHERE username=$1 OR email=$1;`,
      [usernameOrEmail])

      if (rows.length === 0) return null

      const isPasswordCorrect = await bcrypt.compare(password, rows[0].password)
      if (!isPasswordCorrect) return null

      return rows[0]
    } catch (error) {
      console.error(`\x1b[31mAn error occurred: ${error}\x1b[0m`)
      return { error: error.message }
    } finally {
      if (connection) connection.release()
    }
  }

  static async registerUser ({ first_name, username, email, password }) {
    let connection
    try {
      connection = await dbConnectionPg()

      const salt = await bcrypt.genSalt(saltRounds)
      const hashedPassword = await bcrypt.hash(password, salt)
      await connection.query(`
        INSERT INTO users(first_name, username, email, password)
        VALUES ($1, $2, $3, $4);`,
      [first_name, username, email, hashedPassword])

      return { success: true }
    } catch (error) {
      console.error(`\x1b[31mAn error occurred: ${error}\x1b[0m`)
      return { error: error.message }
    } finally {
      if (connection) connection.release()
    }
  }
}

export default User
