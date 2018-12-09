import React from 'react'
import PropTypes from 'prop-types'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Growl} from 'primereact/growl'

import servicos from '../servicos'
import util_masks from './util_masks'

class CadastraVeiculo extends React.Component {

  constructor() {
    super()
    this.state = {
      proprietario : { cpf: undefined, nome: undefined},
      placa : undefined,
      ano : undefined,
      proprietarioDefinido : false,
      placaDefinida : false,
      anoDefinido : false
    }
  }

  naoPodeCadastrar () {
    return (
      !this.state.proprietarioDefinido ||
      !this.state.placaDefinida ||
      !this.state.anoDefinido)
      ? 'disabeld' : 0
  }

  pesquiseProprietario (cpf) {
    servicos
      .pesquiseProprietario(cpf)
      .then((proprietario) => {
        if (proprietario === null) {
          this.growl.show({
            severity: 'warn',
            summary: 'Aviso',
            detail: `CPF ${cpf} não cadastrado!`})
          this.setState({proprietarioDefinido: false})
        } else {
          this.setState({proprietario, proprietarioDefinido: true})
        }
      })
      .catch ((erro) => {
        this.growl.show({
          severity: 'error',
          summary: 'Erro',
          detail: erro.message
        })
      })
  }

  definiuPlaca () {
    this.setState({placaDefinida : true})
  }

  definiuAno () {
    this.setState({anoDefinido : true})
  }

  armazeneCPF (ev) {
    if (ev.value !== this.state.proprietario.cpf) {
      this.setState({
        proprietarioDefinido: false,
        proprietario: {cpf: ev.value, nome: undefined}
      })
      if (ev.value.length === util_masks.cpfTam)
        this.pesquiseProprietario(ev.value)
    }
  }

  armazenePlaca (ev) {
    let placa = ev.value.toUpperCase()
    if (placa !== this.state.placa) {
      this.setState({placa, placaDefinida: false})
    }
  }

  armazeneAno (ev) {
    if (ev.value !== this.state.ano) {
      this.setState({ano: ev.value, anoDefinido: false})
    }
  }


  cadastre(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor
    ev.persist()  // obrigatório por causa do ev.target abaixo

    servicos
      .cadastreVeiculo(this.state.proprietario.cpf, this.state.placa, parseInt(this.state.ano))
      .then(({cadastrou, motivo}) => {
        if (!cadastrou)
          return Promise.reject(new Error(motivo))

        ev.target.reset()
        this.setState({
          proprietario: {cpf: undefined, nome: undefined},
          proprietarioDefinido: false,
          placa: undefined,
          placaDefinida: false,
          ano: undefined,
          anoDefinido: false})
        this.growl.show({
          severity: 'success',
          summary: 'Cadastro de Veículo',
          detail: 'Cadastro feito!'})
      })
      .catch((erro) => {
        this.growl.show({
          severity: 'error',
          summary: 'Cadastro de Veículo',
          detail: erro.message})
      })
  }

  render() {
    return (
      <Panel header='Cadastrar Veículo'>
        <Growl ref={(el) => {this.growl = el}}/>
        <form onSubmit={this.cadastre.bind(this)}>
          <p>
          CPF do Proprietário :
            <br/>
            <InputMask
              value={this.state.proprietario.cpf}
              onChange={this.armazeneCPF.bind(this)}
              mask={util_masks.cpfMask}
              unmask={true}
              size={util_masks.cpfMask.length}/>
          </p>
          <p>
          Nome do Proprietário :
            <br/>
            <span>{this.state.proprietario.nome}</span>
          </p>
          <p>
          Placa :
            <br/>
            <InputMask
              value={this.state.placa}
              onComplete={this.definiuPlaca.bind(this)}
              onChange={this.armazenePlaca.bind(this)}
              mask={util_masks.placaMask}
              unmask={true}
              size={util_masks.placaMask.length}/>
          </p>
          <p>
          Ano :
            <br/>
            <InputMask
              value={this.state.ano}
              onComplete={this.definiuAno.bind(this)}
              onChange={this.armazeneAno.bind(this)}
              mask={util_masks.anoMask}
              unmask={true}
              size={util_masks.anoMask.length}/>
          </p>
          <Button
            label='Cadastrar'
            className='p-button-success'
            type='submit'
            disabled={this.naoPodeCadastrar.bind(this)()}/>
          <Button
            label='Cancelar'
            className='p-button-danger'
            onClick={this.props.cancelar}/>
        </form>
      </Panel>
    )
  }
}

CadastraVeiculo.propTypes = {
  cancelar : PropTypes.func.isRequired
}

export default CadastraVeiculo
