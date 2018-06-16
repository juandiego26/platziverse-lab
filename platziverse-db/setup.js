'use strict'

const db = require('./')
const debug = require('debug')('platziverse:db:setup')
const chalk = require('chalk')

async function setup () {
  const value = process.argv.filter(arg => arg === '-y' || arg === '--yes')[0]

  if (value === '-y' || value === '--yes') {
    const config = {
      database: process.env.DB_NAME || 'platziverse',
      username: process.env.DB_USER || 'platzi',
      password: process.env.DB_PASS || 'platzi',
      host: process.env.DB_HOST || 'localhost',
      dialect: process.env.DB_USAGE || 'postgres',
      setup: true,
      logging: m => debug(m)
    }

    await db(config).catch(handleFatalError)

    console.log('Success!')
    process.exit(0)
  } else {
    console.log(chalk.green(`The database is ok!`))
  }
}

function handleFatalError (err) {
  console.error(chalk.red(err.message))
  console.error(chalk.red(err.stack))
  process.exit(1)
}

setup()
