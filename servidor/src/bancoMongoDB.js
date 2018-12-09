import {URL_MULTAS_DB} from './env'
import {MongoClient} from 'mongodb'
import executaPromisesEmSerie from './util'

import v4 from 'uuid/v4'

process.on('exit', () => { desconecta() })

process.on('SIGINT', () => { process.exit(1) })

let cliente

// Collections usadas pela aplicação
let proprietarios
let veiculos
let multas

// Conecta com o bando de dados
function conecta (url) {
  MongoClient
    .connect(url, {useNewUrlParser: true})
    .then(c => {
      cliente = c
      proprietarios = cliente.db().collection('proprietarios')
      veiculos = cliente.db().collection('veiculos')
      multas = cliente.db().collection('multas')
      // eslint-disable-next-line no-console
      console.log('Conectou no banco...')
    })
    .catch(erro => {
      // eslint-disable-next-line no-console
      console.log(`Erro ao conectar com o banco: ${url} \n ${erro.message}`)
      process.exit(2)
    })
}

// Encerra conexão com banco de dados
function desconecta () {
  if (cliente !== undefined) {
    cliente.close()
    // eslint-disable-next-line no-console
    console.log('Desconectou do banco.')
  }
}

conecta(URL_MULTAS_DB)

const banco = {
  cadastreProprietario: async (cpf, nome) => {
    let resposta
    const key = await proprietarios.findOne({cpf}, {returnKey: true})
    if (key !== null) {
      resposta = false
    } else {
      await proprietarios.insertOne({_id: cpf, cpf, nome})
      resposta = true
    }
    return resposta
  },

  cadastreProprietariosEmMassa: async (proprietarios) => {
    const resultados = await executaPromisesEmSerie(proprietarios, validaECadastraProprietario)
    return resultados.filter(resultado => resultado.length > 0)
  },

  cadastreVeiculosEmMassa: async (veiculos) => {
    const resultados = await executaPromisesEmSerie(veiculos, validaECadastraVeiculo)
    return resultados.filter(resultado => resultado.length > 0)
  },

  cadastreMultasEmMassa: async (multas) => {
    const resultados = await executaPromisesEmSerie(multas, validaECadastraMulta)
    return resultados.filter(resultado => resultado.length > 0)
  },

  cadastreVeiculo: async (cpf, placaInformada, ano) => {
    let placa = placaInformada.toUpperCase() 
    let resultado
    let key = await proprietarios.findOne({cpf}, {returnKey: true})
    if (key === null) {
      resultado = {cadastrou: false, motivo: 'CPF não cadastrado'}
    } else {
      key = await veiculos.findOne({placa}, {returnKey: true})
      if (key !== null) {
        resultado = {cadastrou: false, motivo: 'Veículo já cadastrado'}
      } else {
        if (ano <= 1900) {
          resultado = {cadastrou: false, motivo: 'Ano tem que ser maior que 1900'}
        } else {
          await veiculos.insertOne({_id: placa, placa, proprietario_cpf: cpf, ano})
          resultado = {cadastrou: true}
        }
      }
    }
    return resultado
  },

  cadastreMulta: async (placaInformada, pontos) => {
    let resultado
    let placa = placaInformada.toUpperCase()
    const key = await veiculos.findOne({placa}, {returnKey: true})
    if (key === null) {
      resultado = {id: null, motivo: 'Veículo não cadastrado'}
    } else {
      if (pontos < 1) {
        resultado = {id: null, motivo: 'Pontos tem que ser maior que zero'}
      } else {
        const id = v4().substring(0, 8)
        await multas.insertOne({_id: id, id, veiculo_placa: placa, pontos})
        resultado = {id}
      }
    }

    return resultado
  },

  proprietarios: async () => proprietarios.find({}).toArray(),

  proprietario: async (cpf) => proprietarios.findOne({cpf}),

  veiculo: async (placa) => veiculos.findOne({placa: placa.toUpperCase()}),

  veiculoComProprietario: async (placa) => {
    const veiculo = await veiculos.findOne({placa: placa.toUpperCase()})
    if (veiculo === null) {
      return null
    }
    const proprietario = await proprietarios.findOne({cpf: veiculo.proprietario_cpf})
    return {veiculo, proprietario}
  },

  veiculosDoProprietario: async (cpf) => {
    const key = await proprietarios.findOne({cpf}, {returnKey: true})
    if (key === null) {
      return null
    }

    return veiculos.find({proprietario_cpf: cpf}).toArray()
  },

  multasDoVeiculo: async (placa) => {
    const key = await veiculos.findOne({placa: placa.toUpperCase()}, {returnKey: true})
    if (key === null) {
      return null
    }

    return multas.find({veiculo_placa: placa.toUpperCase()}).toArray()
  },

  multaCompleta: async (id) => {
    let resultado = null
    const multa = await multas.findOne({_id: id})

    if (multa !== null) {
      const veiculo = await veiculos.findOne({placa: multa.veiculo_placa})
      const proprietario = await proprietarios.findOne({cpf: veiculo.proprietario_cpf})
      resultado = {
        id,
        pontos: multa.pontos,
        placa: multa.veiculo_placa,
        cpf: proprietario.cpf,
        nome: proprietario.nome
      }
    }
    return resultado
  },

  multasDeProprietario: async (cpf) => {
    const proprietario = await banco.proprietario(cpf)
    if (proprietario === null) return {proprietario, veiculos: null}

    const veiculosDoProprietario = await banco.veiculosDoProprietario(cpf)
    const promsMulta = veiculosDoProprietario.map(async v => {
      let multas = await banco.multasDoVeiculo(v.placa)

      // se um veículo não possui multas então cria multa fictícia com 0 pontos
      if (multas.length === 0) multas = [{veiculo_placa: v.placa, pontos: 0}]
      return multas
    })

    // Promise.all aguarda que todas as promises obtenham seus valores e coloca
    // os resultados em um array
    const multasDosVeiculos = await Promise.all(promsMulta)

    // Para cada array de multas, obtem o somatório dos pontos
    const veiculos = multasDosVeiculos.map(multasDoVeiculo => {
      const placa = multasDoVeiculo[0].veiculo_placa
      return multasDoVeiculo.reduce((pv, multa) => ({placa: pv.placa, pontos: pv.pontos + multa.pontos}), {placa, pontos: 0})
    }
    )
    return {proprietario, veiculos}
  }
}

async function validaECadastraProprietario (proprietario) {
  const dados = proprietario.split(',')

  if (dados.length !== 2) {
    return `${proprietario} <--- ERRO: deve ter CPF e nome`
  }

  const cpf = cpfStringToNumber(dados[0])
  if (isNaN(parseInt(cpf))) {
    return `${proprietario} <--- ERRO: CPF deve ser número!`
  }

  const nome = dados[1].trim()
  if (nome.length === 0) {
    return `${proprietario} <--- ERRO: nome tem que ter pelo menos uma letra`
  }

  const r = await banco.cadastreProprietario(cpf, nome)
  if (r) return ''
  return `${proprietario} <--- ERRO: Já cadastrado`
}

async function validaECadastraVeiculo (veiculo) {
  const dados = veiculo.split(',')

  if (dados.length !== 3) {
    return `${veiculo} <--- ERRO: deve ter placa, CPF e ano`
  }

  const placa = dados[0].trim().toUpperCase()
  if (placa.match(/[A-Z][A-Z][A-Z][0-9][0-9][0-9][0-9]/) == null) {
    return `${veiculo} <-- ERRO: placa inválida`
  }

  const cpf = cpfStringToNumber(dados[1])
  if (isNaN(parseInt(cpf))) {
    return `${veiculo} <-- ERRO: CPF deve ser número!`
  }

  const ano = parseInt(dados[2].trim())
  if (isNaN(ano)) {
    return `${veiculo} <-- ERRO: ano tem que ser número`
  }

  const r = await banco.cadastreVeiculo(cpf, placa, ano)
  if (r.cadastrou) return ''
  return `${veiculo} <--- ERRO: ${r.motivo}`
}

async function validaECadastraMulta (multa) {
  const dados = multa.split(',')

  if (dados.length !== 2) {
    return `${multa} <-- ERRO: deve ter placa e pontos`
  }

  const placa = dados[0].trim()
  if (placa.match(/[A-Z][A-Z][A-Z][0-9][0-9][0-9][0-9]/) == null) {
    return `${multa} <-- ERRO: placa inválida`
  }

  const pontos = parseInt(dados[1].trim())
  if (isNaN(pontos)) {
    return `${multa} <-- ERRO: pontos tem que ser número`
  }

  const r = await banco.cadastreMulta(placa, pontos)
  if (r.id !== null) return ''
  return `${multa} <--- ERRO: ${r.motivo}`
}

function cpfStringToNumber(sCPF) {
  const er = /\d\d\d.\d\d\d.\d\d\d-\d\d/ // 999.999.999-99
  if (!sCPF.match(er))
    return 'formato-invalido'
  return sCPF.replace('.','').replace('.','').replace('.','').replace('-','')
}
export default banco
