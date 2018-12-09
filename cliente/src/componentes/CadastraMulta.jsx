import React from 'react'
import PropTypes from 'prop-types'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Growl} from 'primereact/growl'

import servicos from '../servicos'
import util_masks from './util_masks'

class CadastraMulta extends React.Component {

  constructor() {
    super()
    this.state = {
      placa : undefined,
      placaDefinida : false,
      pontos : undefined,
      pontosDefinidos: false
    }
  }

  naoPodeCadastrar () {
    return (!this.state.placaDefinida || !this.state.pontosDefinidos)
      ? 'disabeld' : 0
  }

  pesquiseVeiculo (placa) {
    servicos
      .pesquiseVeiculo(placa)
      .then((veiculo) => {
        if (veiculo === null) {
          this.growl.show({
            severity: 'warn',
            summary: 'Aviso',
            detail: `Placa ${placa} não cadastrada!`})
        } else {
          this.setState({placaDefinida: true, pontosDefinidos: false})
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

  armazenePlaca (ev) {
    let placa = ev.value.toUpperCase()
    if (placa !== this.state.placa) {
      this.setState({placa: placa, placaDefinida: false})
      if (ev.value.length === util_masks.placaTam)
        this.pesquiseVeiculo(placa)
    }
  }

  armazenePontos (ev) {
    if (ev.value !== this.state.pontos) {
      this.setState({pontos: ev.value, pontosDefinidos: false})
    }
  }

  pontosDefinidos () {
    this.setState({pontosDefinidos: true})
  }

  cadastre(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor
    ev.persist()  // obrigatório por causa do ev.target abaixo

    servicos
      .cadastreMulta(this.state.placa, parseInt(this.state.pontos))
      .then(({id, motivo}) => {
        if (id === null)
          return Promise.reject(new Error(motivo))

        ev.target.reset()
        this.setState({
          placa: undefined,
          placaDefinida: false,
          pontos: undefined,
          pontosDefinidos: false
        })
        this.growl.show({
          severity: 'success',
          summary: 'Cadastro de Multa',
          detail: `Multa cadastrada com ID ${id}`
        })
      })
      .catch((erro) => {
        this.growl.show({
          severity: 'error',
          summary: 'Cadastro de Multa',
          detail: erro.message
        })
      })
  }

  render() {
    return (
      <Panel header='Cadastrar Multa'>
        <Growl ref={(el) => {this.growl = el}}/>
        <form onSubmit={this.cadastre.bind(this)}>
          <p>
          Placa :
            <br/>
            <InputMask
              value={this.state.placa}
              onChange={this.armazenePlaca.bind(this)}
              mask={util_masks.placaMask}
              unmask={true}
              size={util_masks.placaMask.length}/>
          </p>
          <p>
          Pontos :
            <br/>
            <InputMask
              value={this.state.pontos}
              onChange={this.armazenePontos.bind(this)}
              onComplete={this.pontosDefinidos.bind(this)}
              mask={util_masks.pontosMask}
              unmask={true}
              size={util_masks.pontosMask.length}/>
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

CadastraMulta.propTypes = {
  cancelar : PropTypes.func.isRequired
}

export default CadastraMulta
