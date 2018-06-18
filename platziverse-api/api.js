'use strict'

const debug = require('debug')('platziverse:api:routes')
const express = require('express')

const api = express.Router()

// ruta tipo get retorna los agentes conectados en el servidor
api.get('/agents', (req, res) => {
  debug('A request has come to /agents')
  res.send({})
})

// ruta del agente con su uuid
api.get('/agent/:uuid', (req, res) => {
  const { uuid } = req.params
  res.send({ uuid })
})

// ruta get retorna metricas tiene reportadas un agente especifíco
api.get('/metrics/:uuid', (req, res) => {
  const { uuid } = req.params
  res.send({ uuid })
})

// ruta get retorna métricas aagente especifico con su tipo.
api.get('/metrics/:uuid/:type', (req, res) => {
  const { uuid, type } = req.params
  res.send({ uuid, type })
})

module.exports = api
