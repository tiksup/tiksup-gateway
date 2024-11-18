import { MongoClient } from "mongodb";
import 'dotenv/config'

const MONGO_HOST = process.env.MONGO_HOST
const MONGO_PORT = process.env.MONGO_PORT
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_DATABASE = process.env.MONGO_DATABASE

export const mongoConnection = async () => { 
  try {
    const uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}?authSource=admin`
    const client = new MongoClient(uri);
    await client.connect()

    return client.db(MONGO_DATABASE)
  } catch (err) {
    console.log(err)
    throw err
  }
}
