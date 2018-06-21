'use strict'

const debug = require('debug')('platziverse:web')
const http = require('http')
const path = require('path') // modulo recomendado para hacer op con la ruta del sistema de archivos
const express = require('express')
const socketio = require('socket.io')
const chalk = require('chalk')
const PlatziverseAgent = require('platziverse-agent')

const { pipe } = require('./utils')

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = socketio(server) // instancia de socket.io
const agent = new PlatziverseAgent() // instancia de agent

// middleware de express static path join es como la ruta ./public - ./ + public
app.use(express.static(path.join(__dirname, 'public')))
// Socket.io / WebSockets
io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  pipe(agent, socket)
})

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
  agent.connect()
})
