import React from 'react'
import PropTypes from 'prop-types'

import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Growl} from 'primereact/growl'
import {Card} from 'primereact/card'

import servicos from '../servicos'
import util_masks from './util_masks'

class PesquisaMulta extends React.Component {

  constructor() {
    super()
    this.state = {
      idMultaDefinido: false,
      idMulta: undefined,
      multa: undefined
    }
  }

  pesquise(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor

    const prom = servicos.pesquiseMultaCompleta(this.state.idMulta)
    prom
      .then((multa) => {
        if (multa !== null) {
          this.setState({multa})
        } else {
          return Promise
            .reject(new Error(`Não existe multa com Id ${this.state.idMulta}`))
        }
      })
      .catch((erro) => {
        this.setState({multa: undefined})
        this.growl.show({
          severity: 'error',
          summary: 'Pesquisa por Multa',
          detail: erro.message})
      })
    this.setState({multa: undefined})
  }

  definiuId () {
    this.setState({idMultaDefinido : true})
  }

  armazeneId (ev) {
    if (ev.value !== this.state.idMulta) {
      this.setState({idMulta: ev.value, idMultaDefinido: false, multa: undefined})
    }
  }

  render() {
    let multa = null
    if (this.state.multa !== undefined)
      multa = this.__exibeMulta(this.state.multa)

    return (
      <Panel header='Pesquisar Multa'>
        <Growl ref={(el) => {this.growl = el}}/>
        <Card>
          <form onSubmit={this.pesquise.bind(this)}>
            <p>
              Id :
              <br/>
              <InputMask
                value={this.state.idMulta}
                onComplete={this.definiuId.bind(this)}
                onChange={this.armazeneId.bind(this)}
                mask={util_masks.idMultaMask}
                unmask={true}
                size={util_masks.idMultaMask.length}/>
            </p>
          </form>
          <Button
            label='Pesquisar'
            className='p-button-success'
            type='submit'
            disabled={this.state.idMultaDefinido === false}
            onClick={this.pesquise.bind(this)}/>

          <Button
            label='Cancelar'
            className='p-button-danger'
            onClick={this.props.cancelar}/>
        </Card>
        <div>{multa}</div>
      </Panel>
    )
  }

  __exibeMulta (multa) {
    return (
      <DataTable value={[multa]} autoLayout={true}>
        <Column field='id' header='Id'/>
        <Column field='pontos' header='Pontos'/>
        <Column field='placa' header='Placa do Veículo'/>
        <Column field='cpf' header='CPF do Proprietário'/>
        <Column field='nome' header='Nome do Proprietário'/>
      </DataTable>
    )
  }
}

PesquisaMulta.propTypes = {
  cancelar : PropTypes.func.isRequired
}

export default PesquisaMulta
