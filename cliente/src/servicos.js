// Serviços para acessar o lado servidor
import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

const cadastraProprietario = gql`
mutation cadastraProprietario($cpf: ID!, $nome: String!) {
  cadastraProprietario(cpf: $cpf, nome: $nome)
}`

const cadastraProprietariosEmMassa = gql`
mutation cadastraProprietariosEmMassa($dados: [String]!) {
  cadastraProprietariosEmMassa(dados: $dados)
}`

const cadastraVeiculosEmMassa = gql`
mutation cadastraVeiculosEmMassa($dados: [String]!) {
  cadastraVeiculosEmMassa(dados: $dados)
}`

const cadastraMultasEmMassa = gql`
mutation cadastraMultasEmMassa($dados: [String]!) {
  cadastraMultasEmMassa(dados: $dados)
}`

const cadastraVeiculo = gql`
mutation cadastraVeiculo($cpf: ID!, $placa: ID!, $ano: Int!) {
  cadastraVeiculo(cpf: $cpf, placa: $placa, ano: $ano) {
    cadastrou motivo
  }
}`

const cadastraMulta = gql`
mutation cadastraMulta($placa: ID!, $pontos: Int!) {
  cadastraMulta(placa: $placa, pontos: $pontos) {
    id motivo
  }
}`

const pesquisaProprietario = gql`
query pesquisaProprietario($cpf: ID!) {
  proprietario(cpf: $cpf) {
    cpf
    nome
  }
}`

const multasDeProprietario = gql`
query multasDeProprietario($cpf: ID!) {
  multasDeProprietario(cpf: $cpf) {
    proprietario {
      cpf
      nome
    }
    veiculos {
      placa
      pontos
    }
  }
}
`

const pesquisaTodosProprietarios = gql`
query pesquisaTodosProprietarios {
  proprietarios {
    cpf
    nome
  }
}`

const pesquisaVeiculo = gql`
query pesquisaVeiculo($placa: ID!) {
  veiculo(placa: $placa) {
    placa
    ano
    proprietario_cpf
  }
}`

const pesquisaMultaCompleta = gql`
query pesquisaMultaCompleta($id: ID!) {
  multaCompleta(id: $id) {
    id
    pontos
    placa
    cpf
    nome
  }
}`

const pesquisaVeiculoComProprietario = gql`
query pesquisaVeiculoComProprietario($placa: ID!) {
  veiculoComProprietario(placa: $placa) {
    veiculo {
      placa
      ano
    }
    proprietario {
      cpf
      nome
    }
  }
}`

const pesquisaVeiculosDoProprietario = gql`
query pesquisaVeiculosDoProprietario($cpf: ID!) {
  veiculosDoProprietario(cpf: $cpf) {
    placa
    ano
  }
}`

const pesquisaMultasDoVeiculo = gql`
query pesquisaMultasDoVeiculo($placa: ID!) {
  multasDoVeiculo(placa: $placa) {
    id
    pontos
  }
}`


const cliente = new ApolloClient()

const servicos = {
  cadastreProprietario : (cpf, nome) => {
    const prom = cliente.mutate({
      mutation: cadastraProprietario,
      variables: {cpf, nome}
    })
    return prom
      .then((r) => Promise.resolve(r.data.cadastraProprietario))
      .catch(() => Promise.reject(new Error('Servidor fora do ar!')))
  },

  cadastreProprietariosEmMassa : (texto) => {
    const dados = texto.split('\n').filter(linha => linha.length > 0)
    const prom = cliente.mutate({
      mutation: cadastraProprietariosEmMassa,
      variables: {dados}
    })
    return prom
      .then((r) => Promise.resolve(r.data.cadastraProprietariosEmMassa))
      .catch(() => Promise.reject(new Error('Servidor fora do ar!')))
  },

  cadastreVeiculosEmMassa : (texto) => {
    const dados = texto.split('\n').filter(linha => linha.length > 0)
    const prom = cliente.mutate({
      mutation: cadastraVeiculosEmMassa,
      variables: {dados}
    })
    return prom
      .then((r) => Promise.resolve(r.data.cadastraVeiculosEmMassa))
      .catch(() => Promise.reject(new Error('Servidor fora do ar!')))
  },

  cadastreMultasEmMassa : (texto) => {
    const dados = texto.split('\n').filter(linha => linha.length > 0)
    const prom = cliente.mutate({
      mutation: cadastraMultasEmMassa,
      variables: {dados}
    })
    return prom
      .then((r) => Promise.resolve(r.data.cadastraMultasEmMassa))
      .catch(() => Promise.reject(new Error('Servidor fora do ar!')))
  },

  cadastreVeiculo : (cpf, placa, ano) => {
    const prom = cliente.mutate({
      mutation: cadastraVeiculo,
      variables: {cpf, placa, ano}
    })
    return prom
      .then((r) => Promise.resolve(r.data.cadastraVeiculo))
      .catch(() => Promise.reject(new Error('Servidor fora do ar!')))
  },

  cadastreMulta : (placa, pontos) => {
    const prom = cliente.mutate({
      mutation: cadastraMulta,
      variables: {placa, pontos}
    })
    return prom
      .then((r) => Promise.resolve(r.data.cadastraMulta))
      .catch(() => Promise.reject(new Error('Servidor fora do ar!')))
  },

  pesquiseProprietario : (cpf) => {
    const prom = cliente.query({
      query: pesquisaProprietario,
      variables: {cpf},
      fetchPolicy: 'no-cache'
    })
    return prom
      .then((r) => Promise.resolve(r.data.proprietario))
      .catch(() => Promise.reject(new Error('Servidor fora do ar')))
  },

  pesquiseMultasDeProprietario : (cpf) => {
    const prom = cliente.query({
      query: multasDeProprietario,
      variables: {cpf},
      fetchPolicy: 'no-cache'
    })
    return prom
      .then((r) => Promise.resolve(r.data.multasDeProprietario))
      .catch(() => Promise.reject(new Error('Servidor fora do ar')))
  },

  pesquiseTodosProprietarios : () => {
    const prom = cliente.query({
      query: pesquisaTodosProprietarios,
      fetchPolicy: 'no-cache'
    })
    return prom
      .then((r) => Promise.resolve(r.data.proprietarios))
      .catch(() => Promise.reject(new Error('Servidor fora do ar')))
  },


  pesquiseVeiculo : (placa) => {
    const prom = cliente.query({
      query: pesquisaVeiculo,
      variables: {placa},
      fetchPolicy: 'no-cache'
    })
    return prom
      .then((r) => Promise.resolve(r.data.veiculo))
      .catch(() => Promise.reject(new Error('Servidor fora do ar')))
  },

  pesquiseMultaCompleta : (id) => {
    const prom = cliente.query({
      query: pesquisaMultaCompleta,
      variables: {id},
      fetchPolicy: 'no-cache'
    })
    return prom
      .then((r) => Promise.resolve(r.data.multaCompleta))
      .catch(() => Promise.reject(new Error('Servidor fora do ar')))
  },

  pesquiseVeiculoComProprietario : (placa) => {
    const prom = cliente.query({
      query: pesquisaVeiculoComProprietario,
      variables: {placa},
      fetchPolicy: 'no-cache'
    })
    return prom
      .then((r) => Promise.resolve(r.data.veiculoComProprietario))
      .catch(() => Promise.reject(new Error('Servidor fora do ar')))
  },

  pesquiseVeiculosDoProprietario : (cpf) => {
    const prom = cliente.query({
      query: pesquisaVeiculosDoProprietario,
      variables: {cpf},
      fetchPolicy: 'no-cache'
    })
    return prom
      .then((r) => Promise.resolve(r.data.veiculosDoProprietario))
      .catch(() => Promise.reject(new Error('Sevidor fora do ar')))
  },

  pesquiseMultasDeVeiculo : (placa) => {
    const prom = cliente.query({
      query: pesquisaMultasDoVeiculo,
      variables: {placa},
      fetchPolicy: 'no-cache'
    })
    return prom
      .then((r) => Promise.resolve(r.data.multasDoVeiculo))
      .catch(() => Promise.reject(new Error('Sevidor fora do ar')))
  }


}

export default servicos
