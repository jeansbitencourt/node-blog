const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
const consign = require('consign')
require('dotenv').config()

app.use(cookieParser())
app.use(expressValidator())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

consign()
  .include('server/routes')
  .then('server/utils')
  .then('server/models')
  .then('server/controllers')
  .into(app)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true)
  mongoose.set('useFindAndModify', false)
  mongoose.set('useUnifiedTopology', true)
  mongoose.set('useNewUrlParser', true)
  mongoose.connect(app.server.utils.DB.URLCONN).then(
    () => {
      console.log('Database is connected')
    },
    (err) => {
      console.log('Can not connect to the database ' + err)
    }
  )

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
