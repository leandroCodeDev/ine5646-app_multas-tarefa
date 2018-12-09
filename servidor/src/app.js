import {PORTA} from './env'
import https from 'https'
import fs from 'fs'
import path from 'path'

import express from 'express'

import { configuraApolloServer } from './apollo'


const opcoes = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.pem'))
}

const app = express()
app.use(express.static(path.resolve(__dirname, '../publico')))

const server = https.createServer(opcoes, app)

configuraApolloServer(app, server)

server.listen(PORTA, () => {
  // eslint-disable-next-line no-console
  console.log(`Vá para https://localhost:${PORTA}/graphql para executar consultas!`)
})
