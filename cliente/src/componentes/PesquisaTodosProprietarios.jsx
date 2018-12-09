import React from 'react'
import PropTypes from 'prop-types'

import {Panel} from 'primereact/panel'
import {Button} from 'primereact/button'
import {Growl} from 'primereact/growl'
import {Card} from 'primereact/card'

import servicos from '../servicos'
import MostraProprietarios from './MostraProprietarios.jsx'

class PesquisaTodosProprietarios extends React.Component {

  constructor() {
    super()
    this.state = {
      proprietarios: undefined
    }
  }

  pesquise(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor

    const prom = servicos.pesquiseTodosProprietarios()
    prom
      .then(proprietarios => {
        if (proprietarios.length > 0 ) {
          this.setState({proprietarios})
          this.growl.show({
            severity: 'success',
            summary: 'Pesquisa Todos Proprietários',
            detail: 'Proprietários encontrados!'})
        } else {
          return Promise.reject(new Error('Não há nenhum proprietário cadastrado'))
        }
      })
      .catch((erro) => {
        this.setState({proprietarios: undefined})
        this.growl.show({
          severity: 'error',
          summary: 'Pesquisa Todos Proprietários',
          detail: erro.message})
      })
    this.setState({proprietarios: undefined})
  }


  render() {
    let proprietarios = null
    if (this.state.proprietarios !== undefined)
      proprietarios = <MostraProprietarios proprietarios={this.state.proprietarios}/>

    return (
      <Panel header='Pesquisar Todos Proprietários'>
        <Growl ref={(el) => {this.growl = el}}/>
        <Card>
          <form onSubmit={this.pesquise.bind(this)}>
          </form>
          <Button
            label='Pesquisar'
            className='p-button-success'
            type='submit'
            onClick={this.pesquise.bind(this)}/>

          <Button
            label='Cancelar'
            className='p-button-danger'
            onClick={this.props.cancelar}/>
        </Card>
        <div>{proprietarios}</div>
      </Panel>
    )
  }
}

PesquisaTodosProprietarios.propTypes = {
  cancelar : PropTypes.func.isRequired
}

export default PesquisaTodosProprietarios
