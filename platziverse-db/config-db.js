const debug = require('debug')('platziverse:db:setup')

// Objeto de configuración de la Base de Datos
module.exports = function (init = true) {
  return {
    database: process.env.DB_NAME || 'platziverse', // Nombre de la DB
    username: process.env.DB_USER || 'platzi', // Usuario
    password: process.env.DB_PASS || 'platzi', // Password
    local: process.env.DB_HOST || 'localhost', // Dirección IP
    dialect: 'postgres', // Nombre del gestor de DBs a usar en el proyecto
    logging: s => debug(s),
    setup: init // Restuaración de la BD
  }
}
