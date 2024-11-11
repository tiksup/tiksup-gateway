import 'dotenv/config'
import { Kafka } from 'kafkajs'

console.log('KAFKA_SERVER:', process.env.KAFKA_SERVER)

const kafka = new Kafka({
  clientId: 'myapp',
  brokers: [process.env.KAFKA_SERVER]
})

export const producer = kafka.producer()

export const initProductor = async () => {
  await producer.connect()
  console.log('Kafka producer connected')
}
