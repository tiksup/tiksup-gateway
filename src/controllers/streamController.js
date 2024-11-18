import { producer } from '../config/kafka.js'
import { streamDataSchema } from '../schemas/streamDataSchema.js'
import 'dotenv/config'

export const postUserMovieData = async (req, res) => {
  try {
    const { movie_id, watching_time, watching_repeat, interactions, next } = req.body
    const { error, value } = streamDataSchema.validate({
      user_id: req.authUser.id,
      movie_id,
      watching_time,
      watching_repeat,
      interactions,
      next
    })

    if (error) {
      return res.status(400).json({
        serror: error.details[0].message.replace(/"/g, '')
      })
    }

    const messageJson = {
      user_id: req.authUser.id,
      movie_id: value.movie_id,
      watching_time: value.watching_time,
      watching_repeat: value.watching_repeat,
      interactions: value.data,
      next
    }

    const messageString = JSON.stringify(messageJson)
    await producer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [{ value: messageString }]
    })

    res.status(200).json({ message: 'Message sent to Kafka successfully' })
  } catch (error) {
    console.error('Error sending message to Kafka:', error)
    return res.status(500).json({ error: 'Error sending message to Kafka' })
  }
}
