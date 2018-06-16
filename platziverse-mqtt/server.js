'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-db')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}
// configurar el servidor
const settings = {
  port: 1883,
  backend
}
// Objeto de configuracion para inicializar la BD
const config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'platzi',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: s => debug(s)
}
// instanciar el servidor
const server = new mosca.Server(settings)

let Agent, Metric

// Evento para cuando un cliente se conecta al servidor
server.on('clientConnected', client => {
  debug(`Client Connected: ${client.id}`)
})
// Evento para cuando un cliente se desconecta del servidor
server.on('clientDisconnected', client => {
  debug(`Client Disconnected: ${client.id}`)
})
// Evento mas importante cuando hay un mensaje publicado en el servidor
server.on('published', (packet, client) => {
  debug(`Received: ${packet.topic}`)
  debug(`Payload: ${packet.payload}`)
})
// eventEmitter evento cuando el servidor este corriendo
server.on('ready', async () => {
  const services = await db(config).catch(handleFatalError)

  Agent = services.Agent
  Metric = services.Metric

  console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
})
// cada vez que se trabaje con un eventEmitter se debe manejar los errores
server.on('error', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.red('[Fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}
// buena practica de desarrollo cuando hay algun tipo de excepcion
// que no fue manejada, para pasar a nivel del proceso
process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
