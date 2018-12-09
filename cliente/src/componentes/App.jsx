import React from 'react'

import 'primereact/resources/themes/nova-light/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'


import BarraDeMenu, {itensDoMenu} from './BarraDeMenu.jsx'
import CadastraEmMassa from './CadastraEmMassa.jsx'
import CadastraProprietario from './CadastraProprietario.jsx'
import CadastraVeiculo from './CadastraVeiculo.jsx'
import CadastraMulta from './CadastraMulta.jsx'
import PesquisaProprietario from './PesquisaProprietario.jsx'
import PesquisaTodosProprietarios from './PesquisaTodosProprietarios.jsx'
import PesquisaMultasDeProprietario from './PesquisaMultasDeProprietario.jsx'
import PesquisaVeiculo from './PesquisaVeiculo.jsx'
import PesquisaMulta from './PesquisaMulta.jsx'

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      executando : itensDoMenu.nada
    }
  }

  altereItem (item) {
    this.setState({executando: item})
  }

  canceleItem () {
    this.setState({executando: itensDoMenu.nada})
  }

  render () {
    let conteudo
    switch (this.state.executando) {
    case itensDoMenu.nada :
      conteudo = null
      break
    case itensDoMenu.proprietario_cadastro:
      conteudo = <CadastraProprietario cancelar={this.canceleItem.bind(this)}/>
      break
    case itensDoMenu.proprietario_cadastro_em_massa:
      conteudo = <CadastraEmMassa tipo='proprietario' cancelar={this.canceleItem.bind(this)}/>
      break
    case itensDoMenu.veiculo_cadastro:
      conteudo = <CadastraVeiculo cancelar={this.canceleItem.bind(this)}/>
      break
    case itensDoMenu.veiculo_cadastro_em_massa:
      conteudo = <CadastraEmMassa tipo='veiculo' cancelar={this.canceleItem.bind(this)}/>
      break
    case itensDoMenu.multa_cadastro:
      conteudo = <CadastraMulta cancelar={this.canceleItem.bind(this)}/>
      break
    case itensDoMenu.multa_cadastro_em_massa:
      conteudo = <CadastraEmMassa tipo='multa' cancelar={this.canceleItem.bind(this)}/>
      break
    case itensDoMenu.proprietario_pesquisa:
      conteudo = <PesquisaProprietario cancelar={this.canceleItem.bind(this)}/>
      break
    case itensDoMenu.proprietario_pesquisa_todos:
      conteudo = <PesquisaTodosProprietarios cancelar={this.canceleItem.bind(this)}/>
      break
    case itensDoMenu.proprietario_pesquisa_multas:
      conteudo = <PesquisaMultasDeProprietario cancelar={this.canceleItem.bind(this)}/>
      break
    case itensDoMenu.veiculo_pesquisa:
      conteudo = <PesquisaVeiculo cancelar={this.canceleItem.bind(this)}/>
      break
    case itensDoMenu.multa_pesquisa:
      conteudo = <PesquisaMulta cancelar={this.canceleItem.bind(this)}/>
      break
    default:
      conteudo = <h2>Opção {this.state.executando} ainda nao implementada</h2>
    }

    return (
      <div>
        <BarraDeMenu itemSelecionado={this.altereItem.bind(this)}/>
        <div>{conteudo}</div>
      </div>
    )
  }
}

export default App
