import React from 'react'

import {Growl} from 'primereact/growl'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'

import PropTypes from 'prop-types'

import MostraVeiculos from './MostraVeiculos.jsx'

class MostraProprietarios extends React.Component {

  render() {
    return (
      <div>
        <Growl ref={(el) => {this.growl = el}}/>
        <DataTable value={this.props.proprietarios} autoLayout={true} resizableColumns={true}>
          <Column field='cpf' header='CPF'/>
          <Column field='nome' header='Nome'/>
          <Column
            header='Veículos'
            body={(p) => <MostraVeiculos cpf={p.cpf} ocultavel={true}/>}/>
        </DataTable>

      </div>
    )
  }
}

MostraProprietarios.propTypes = {
  proprietarios : PropTypes.arrayOf(PropTypes.object).isRequired
}

export default MostraProprietarios
