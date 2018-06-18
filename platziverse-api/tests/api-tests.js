'use strict'

const test = require('ava')
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixtures = require('./fixtures/agent')

let sandbox = null // sanbox de sinon
let server = null // server fake for test
let dbStub = null // Stub de la DB
let AgentStub = {} // Stub de Agents
let MetricStub = {} // Stub de Metrics

// hook que se ejecuta antes de los tests
test.beforeEach(async () => {
  sandbox = sinon.createSandbox() // creamos el sandbox

  dbStub = sandbox.stub() // stub de DB
  dbStub.returns(Promise.resolve({
    Agent: AgentStub,
    Metric: MetricStub
  }))

  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected))

  const api = proxyquire('../api', {
    'platziverse-db': dbStub
  })

  server = proxyquire('../server', {
    './api': api
  })
})

// hook que se ejecuta despues de cada test
test.afterEach(() => {
  sandbox && sandbox.restore() // restauramos el sandbox si existe
})

test.serial.cb('/api/agents', t => {
  request(server)
    .get('/api/agents/')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      let body = JSON.stringify(res.body)
      let expected = JSON.stringify(agentFixtures.connected)
      t.deepEqual(body, expected, 'response body should be the expected')
      t.end()
    })
})

test.serial.todo('/api/agent/:uuid')
test.serial.todo('/api/agent/:uuid - not found')

test.serial.todo('/api/metrics/:uuid')
test.serial.todo('/api/metrics/:uuid - not found')

test.serial.todo('/api/metrics/:uuid/:type')
test.serial.todo('/api/metrics/:uuid/:type - not found')
