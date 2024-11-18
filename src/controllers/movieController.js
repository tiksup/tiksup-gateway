import { client } from '../config/redis.js'
import axios from 'axios'
import 'dotenv/config'

export const getMovies = async (req, res) => {
  try {
    const recommendationsString = await client.get(`user:${decodedToken.user_id}:recommendations`)
    const recommendations = JSON.parse(recommendationsString)
    if (!recommendations || recommendations.movies.length === 0) {
      console.log('Using random data')

      const endpointURL = `${process.env.WORKER_URL}/random-movies`

      const randomMovies = await axios.get(endpointURL, {
        headers: {
          Authorization: authHeader
        }
      })

      return res.json(randomMovies.data)
    }

    res.json(recommendations)
  } catch (err) {
    res.status(500).send('Error: ' + err.message)
  }
}
