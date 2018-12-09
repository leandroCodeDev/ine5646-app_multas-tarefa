import React from 'react'
import PropTypes from 'prop-types'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Growl} from 'primereact/growl'
import {Card} from 'primereact/card'

import servicos from '../servicos'
import util_masks from './util_masks'
import MostraVeiculos from './MostraVeiculos.jsx'

class PesquisaVeiculo extends React.Component {

  constructor() {
    super()
    this.state = {
      placaDefinida: false,
      placa: undefined,
      veiculoComProprietario: undefined
    }
  }

  pesquise(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor

    const prom = servicos.pesquiseVeiculoComProprietario(this.state.placa)
    prom
      .then((veiculoComProprietario) => {
        if (veiculoComProprietario !== null) {
          this.setState({veiculoComProprietario})
          this.growl.show({
            severity: 'success',
            summary: 'Pesquisa por Veículo',
            detail: 'Veículo encontrado!'})
        } else {
          return Promise.reject(new Error(`Não existe veículo com placa ${this.state.placa}`))
        }
      })
      .catch((erro) => {
        this.setState({veiculoComProprietario: undefined})
        this.growl.show({
          severity: 'error',
          summary: 'Pesquisa por Veículo',
          detail: erro.message})
      })
    this.setState({veiculoComProprietario: undefined})
  }

  definiuPlaca () {
    this.setState({placaDefinida : true})
  }

  armazenePlaca (ev) {
    if (ev.value !== this.state.placa) {
      this.setState({
        placa: ev.value,
        placaDefinida: false,
        veiculoComProprietario: undefined
      })
    }
  }

  render() {
    let veiculo = null
    if (this.state.veiculoComProprietario !== undefined) {
      const p = this.state.veiculoComProprietario.proprietario
      const v = this.state.veiculoComProprietario.veiculo
      const titulo = `Proprietário CPF ${p.cpf} Nome: ${p.nome}`
      veiculo =
        <Panel header={titulo}>
          <MostraVeiculos
            cpf={p.cpf}
            ocultavel={false}
            veiculos={[v]}/>
        </Panel>
    }
    return (
      <Panel header='Pesquisar Veículo'>
        <Growl ref={(el) => {this.growl = el}}/>
        <Card>
          <form onSubmit={this.pesquise.bind(this)}>
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
          </form>
          <Button
            label='Pesquisar'
            className='p-button-success'
            type='submit'
            disabled={this.state.placaDefinida === false}
            onClick={this.pesquise.bind(this)}/>

          <Button
            label='Cancelar'
            className='p-button-danger'
            onClick={this.props.cancelar}/>
        </Card>
        <div>{veiculo}</div>
      </Panel>
    )
  }
}

PesquisaVeiculo.propTypes = {
  cancelar : PropTypes.func.isRequired
}

export default PesquisaVeiculo
