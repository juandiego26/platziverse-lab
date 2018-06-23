#!/usr/bin/env node

'use strict'

/* eslint new-cap: "off" */
const blessed = require('blessed')
const contrib = require('blessed-contrib')
const PlatziverseAgent = require('platziverse-agent')

// pantalla con la que vamos a trabajar
const agent = new PlatziverseAgent()
const screen = blessed.screen()

const agents = new Map()
const agentMetrics = new Map()

const grid = new contrib.grid({
  rows: 1,
  cols: 4,
  screen
})
// arbol donde vamos a tener la lista de los agentes
const tree = grid.set(0, 0, 1, 1, contrib.tree, {
  label: 'Connected Agents'
})
// Componente del chart
const line = grid.set(0, 1, 1, 3, contrib.line, {
  label: 'Metric',
  showLegend: true,
  minY: 0,
  xPadding: 5
})

agent.on('agent/connected', payload => {
  const { uuid } = payload.agent

  if (!agents.has(uuid)) {
    agents.set(uuid, payload.agent)
    agentMetrics.set(uuid, {})
  }

  renderData()
})

function renderData () {
  const treeData = {}

  for (let [ uuid, val ] of agents) {
    const title = `${val.name} - (${val.pid})`
    treeData[title] = {
      uuid,
      agent: true,
      children: {}
    }
  }

  tree.setData({
    extended: true,
    children: treeData
  })
  screen.render()
}

// combinación de teclas para salir
screen.key([ 'escape', 'q', 'C-c' ], (ch, key) => {
  process.exit(0)
})
// renderizar todos los componentes
agent.connect()
screen.render()
