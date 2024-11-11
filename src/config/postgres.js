import 'dotenv/config'
import pkg from 'pg'

const { Pool } = pkg

// Database connection configuration
const config = {
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT) ?? 5432,
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'movies'
}

// Create a new pool instance
const pool = new Pool(config)

// Function to establish a connection to PostgreSQL
export const dbConnectionPg = async () => {
  let retries = 5

  while (retries > 0) {
    try {
      const client = await pool.connect()
      console.log('Connected to PostgreSQL')
      return client
    } catch (error) {
      retries--
      console.error(`Error connecting to PostgreSQL: ${error.message}`)
      if (retries > 0) {
        console.log(`Retrying... attempts remaining: ${retries}`)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }
  console.error('Could not establish connection after multiple attempts')
  throw new Error('Could not establish PostgreSQL connection after retries')
}

// Optionally, create a function to query the database
export const queryPg = async (text, params) => {
  const client = await dbConnectionPg()
  try {
    const res = await client.query(text, params)
    return res.rows
  } catch (error) {
    console.error('Error executing query:', error.message)
    throw error
  } finally {
    client.release()
  }
}
