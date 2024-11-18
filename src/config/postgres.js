import 'dotenv/config'
import pkg from 'pg'

const config = {
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT) ?? 5432,
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'movies'
}

const { Pool } = pkg
const pool = new Pool(config)

export const dbConnectionPg = async () => {
  let retries = 5

  while (retries > 0) {
    try {
      return await pool.connect()
    } catch (error) {
      retries--
      console.error(`\x1b[33mTrying to establish a connection to the database\x1b[0m => ${error}`)
      await new Promise(resolve => setTimeout(resolve, 6000))
    }
  }
  console.error('\x1b[31m\nCould not establish connection after attempts\n\x1b[0m')
  throw new Error('Could not establish connection after attempts')
}