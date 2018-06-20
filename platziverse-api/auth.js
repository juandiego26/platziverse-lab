'use strict'

const jwt = require('jsonwebtoken')

function sign (payload, secret, callback) { // Función firmar payload
  jwt.sign(payload, secret, callback)
}

function verify (token, secret, callback) { // Función verificar token
  jwt.verify(token, secret, callback)
}

module.exports = {
  sign,
  verify
}
