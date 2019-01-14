express = require "express"
app = express()
path = require 'path'

app.use express.static path.join __dirname, '/dist', '/public'

app.listen 3001, () ->
    console.log "you are listening on 3001"
