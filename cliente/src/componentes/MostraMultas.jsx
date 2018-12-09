import React from 'react'

import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'

import PropTypes from 'prop-types'

import servicos from '../servicos'

class MostraMultas extends React.Component {
  constructor() {
    super()
    this.state = {multas: undefined, msg: undefined}
  }

  mostreMultas() {
    const prom = servicos.pesquiseMultasDeVeiculo(this.props.veiculo.placa)
    prom
      .then((multas) => this.setState({multas, msg: undefined}))
      .catch((erro) => this.setState({msg: erro.message}))
    this.setState({msg: 'pesquisando...'})
  }

  fechar() {
    this.setState({multas: undefined, msg: undefined})
  }

  render() {
    let conteudo
    if (this.state.msg !== undefined)
      conteudo = <p>{this.state.msg}</p>
    else
    if (this.state.multas === undefined)
      conteudo = <Button label='Ver' onClick={this.mostreMultas.bind(this)}/>
    else {
      if (this.state.multas.length === 0)
        conteudo = <p>Não há!</p>
      else {
        conteudo = <div>
          <DataTable value={this.state.multas} autoLayout={true}>
            <Column field='id' header='ID'/>
            <Column field='pontos' header='Pontos'/>
          </DataTable>
          <Button label='Fechar' onClick={this.fechar.bind(this)}/>
        </div>
      }
    }

    return conteudo
  }
}

MostraMultas.propTypes = {
  veiculo : PropTypes.object.isRequired
}

export default MostraMultas
