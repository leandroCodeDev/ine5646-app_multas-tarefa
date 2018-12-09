/* eslint-disable no-console */
import dotenv from 'dotenv'

dotenv.config()

let comErro = false

if (process.env.PORTA === undefined) {
  console.log('Variável PORTA não definida no arquivo .env')
  comErro = true
}

if (process.env.URL_MULTAS_DB === undefined) {
  console.log('Variável URL_MULTAS_DB não definida no arquivo .env')
  comErro = true
}
  
if (comErro) {
  process.exit(1)
}

export const PORTA=parseInt(process.env.PORTA)
export const URL_MULTAS_DB=process.env.URL_MULTAS_DB
