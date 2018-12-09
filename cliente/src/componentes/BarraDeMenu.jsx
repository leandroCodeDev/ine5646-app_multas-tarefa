import React from 'react'
import {Menubar} from 'primereact/menubar'

import PropTypes from 'prop-types'

class BarraDeMenu extends React.Component {

  constructor() {
    super()


    this.itens = [
      {
        label: 'Proprietário',
        items: [
          {
            label: 'Cadastrar...',
            command: () => { this.props.itemSelecionado(itensDoMenu.proprietario_cadastro) }
          },
          {
            label: 'Cadastrar em massa...',
            command: () => { this.props.itemSelecionado(itensDoMenu.proprietario_cadastro_em_massa) }
          },
          {
            label: 'Pesquisar...',
            command: () => { this.props.itemSelecionado(itensDoMenu.proprietario_pesquisa) }
          },
          {
            label: 'Pesquisar Todos',
            command: () => { this.props.itemSelecionado(itensDoMenu.proprietario_pesquisa_todos) }
          },
          {
            label: 'Pesquisar Multas Por Veículo...',
            command: () => { this.props.itemSelecionado(itensDoMenu.proprietario_pesquisa_multas)}
          }
        ]
      },

      {
        label: 'Veículo',
        items: [
          {
            label: 'Cadastrar...',
            command: () => { this.props.itemSelecionado(itensDoMenu.veiculo_cadastro) }
          },
          {
            label: 'Cadastrar em massa...',
            command: () => { this.props.itemSelecionado(itensDoMenu.veiculo_cadastro_em_massa) }
          },
          {
            label: 'Pesquisar...',
            command: () => { this.props.itemSelecionado(itensDoMenu.veiculo_pesquisa) }
          }
        ]
      },

      {
        label: 'Multa',
        items: [
          {
            label: 'Cadastrar...',
            command: () => { this.props.itemSelecionado(itensDoMenu.multa_cadastro) }
          },
          {
            label: 'Cadastrar em massa...',
            command: () => { this.props.itemSelecionado(itensDoMenu.multa_cadastro_em_massa) }
          },
          {
            label: 'Pesquisar...',
            command: () => { this.props.itemSelecionado(itensDoMenu.multa_pesquisa) }
          }
        ]
      },

    ]
  }

  render () {
    return (<Menubar model={this.itens}> </Menubar>)
  }
}

BarraDeMenu.propTypes = {
  itemSelecionado : PropTypes.func.isRequired
}

// Lista os itens possíveis da barra de menu
export const itensDoMenu = {
  nada: 'nada',
  proprietario_cadastro : 'p_c',
  proprietario_cadastro_em_massa : 'p_c_m',
  proprietario_pesquisa : 'p_p',
  proprietario_pesquisa_todos : 'p_p_t',
  proprietario_pesquisa_multas : 'p_p_m',
  veiculo_cadastro : 'v_c',
  veiculo_cadastro_em_massa : 'v_c_m',
  veiculo_pesquisa : 'v_p',
  multa_cadastro : 'm_c',
  multa_cadastro_em_massa : 'm_c_m',
  multa_pesquisa : 'm_p'
}

export default BarraDeMenu
