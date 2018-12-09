import React from 'react'

import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'

import PropTypes from 'prop-types'

import MostraMultas from './MostraMultas.jsx'

import servicos from '../servicos'

class MostraVeiculos extends React.Component {

  constructor(props) {
    super(props)
    let veiculos
    if (props.veiculos !== undefined)
      veiculos = props.veiculos
    this.state = {veiculos}
  }

  altereBotaoMostrar() {
    if (this.state.veiculos !== undefined)
      this.setState({veiculos: undefined})
    else
      servicos.pesquiseVeiculosDoProprietario(this.props.cpf)
        .then((veiculos) => {
          this.setState({veiculos})
        })
        .catch((erro) => {
          this.growl.show({
            severity: 'error',
            summary: 'Veículos do Proprietário',
            detail: erro.message})
        })
  }


  render() {
    let btOcultar
    if (this.props.ocultavel)
      btOcultar = <Button label='Ocultar' onClick={this.altereBotaoMostrar.bind(this)}/>

    if (this.state.veiculos === undefined)
      return <Button label='Mostrar' onClick={this.altereBotaoMostrar.bind(this)}/>

    if (this.state.veiculos.length === 0)
      return <h4>Não possui</h4>

    return <div>
      <DataTable value={this.state.veiculos} autoLayout={true}>
        <Column field='placa' header='Placa'/>
        <Column field='ano' header='Ano'/>
        <Column
          header='Multas'
          body={(v) => (<MostraMultas veiculo={v}/>)}/>
      </DataTable>
      {btOcultar}
    </div>
  }
}

MostraVeiculos.propTypes = {
  cpf: PropTypes.string.isRequired,
  veiculos: PropTypes.arrayOf(PropTypes.object),
  ocultavel: PropTypes.bool.isRequired
}

export default MostraVeiculos
