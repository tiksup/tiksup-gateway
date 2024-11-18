import { client } from '../config/redis.js'
import 'dotenv/config'
import { mongoConnection } from '../config/mongo.js'

export const getMovies = async (req, res) => {
  const mongoClient = await mongoConnection()
  try {
    const recommendationsString = await client.get(`user:${req.authUser.id}:recommendations`)
    const recommendations = JSON.parse(recommendationsString)
    if (!recommendations || recommendations.movies.length === 0) {
      console.log('Using random data')
      const collection = mongoClient.collection('movies')

      const randomMovies = await collection.aggregate([
        { $sample: { size: 15 } },
        {
          $project: {
            id: "$_id",
            _id: 0,
            url: 1,
            title: 1,
            genre: 1,
            protagonist: 1,
            director: 1,
          }
        }
      ]).toArray()

      const response = {
        user: req.authUser.id,
        movies: randomMovies
      }
      return res.json(response)
    }

    res.json(recommendations)
  } catch (err) {
    res.status(500).send('Error: ' + err.message)
  }
}
