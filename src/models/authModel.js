import { dbConnectionPg } from '../../config/config.js'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const pool = new Pool(dbConnectionPg)

const saltRounds = 10

class User {
  static async findByNameAndPassword ({ usernameOrEmail, password }) {
    try {
      const { rows } = await pool.query(`
        SELECT id, username, email, password
        FROM users 
        WHERE username=$1 OR email=$1;
      `, [usernameOrEmail])
      if (rows.length === 0) return null

      const isPasswordCorrect = await bcrypt.compare(password, rows[0].password)
      if (!isPasswordCorrect) return null

      return rows[0]
    } catch (error) {
      console.error(`\x1b[31mOcurrió un error: ${error}\x1b[0m`)
      return { error: error.message }
    }
  }

  static async registerUser ({ username, email, password }) {
    try {
      const salt = await bcrypt.genSalt(saltRounds)
      const hashedPassword = await bcrypt.hash(password, salt)

      await pool.query(`
        INSERT INTO users(username, email, password)
        VALUES ($1, $2, $3);
      `, [username, email, hashedPassword])

      return { success: true }
    } catch (error) {
      console.error(`\x1b[31mOcurrió un error: ${error}\x1b[0m`)
      return { error: error.message }
    }
  }

  static async createUser ({ username, email, password }) {
    try {
      const salt = await bcrypt.genSalt(saltRounds)
      const hashedPassword = await bcrypt.hash(password, salt)

      await pool.query(`
        INSERT INTO users(username, email, password)
        VALUES ($1, $2, $3);
      `, [username, email, hashedPassword])

      return { success: true }
    } catch (error) {
      console.error(`\x1b[31mOcurrió un error: ${error}\x1b[0m`)
      return { error: error.message }
    }
  }

  static async deleteUser (userId) {
    try {
      await pool.query(`
        DELETE FROM users WHERE id=$1;
      `, [userId])

      return { success: true }
    } catch (error) {
      console.error(`\x1b[31mOcurrió un error: ${error}\x1b[0m`)
      return { error: error.message }
    }
  }
}

export default User
