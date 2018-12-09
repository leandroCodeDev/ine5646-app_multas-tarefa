import React from 'react'
import PropTypes from 'prop-types'

import {Panel} from 'primereact/panel'
import {InputTextarea} from 'primereact/inputtextarea'
import {Button} from 'primereact/button'
import {Card} from 'primereact/card'
import {Growl} from 'primereact/growl'

import servicos from '../servicos'
import util_masks from './util_masks'

class CadastraEmMassa extends React.Component {
  constructor() {
    super()
    this.state = {
      dados: undefined,
      cadastrando: false,
      msgErro: undefined
    }
  }

  naoPodeCadastrar () {
    return (
      this.state.dados === undefined ||
      this.state.dados === '' ||
      this.state.msgErro !== undefined)
      ? 1 : 0
  }

  cadastre() {
    switch (this.props.tipo) {
    case 'proprietario':
      servicos
        .cadastreProprietariosEmMassa(this.state.dados)
        .then((dadosInvalidos) => {
          const dados = dadosInvalidos.reduce((a,b) => `${a}${b}\n`, '')
          this.setState({dados, cadastrando: false})})
        .catch((erro) => {this.setState({msgErro: erro.message, cadastrando: false})})
      this.setState({cadastrando: true, msgErro: undefined})
      break
    case 'veiculo':
      servicos
        .cadastreVeiculosEmMassa(this.state.dados)
        .then((dadosInvalidos) => {
          const dados = dadosInvalidos.reduce((a,b) => `${a}${b}\n`, '')
          this.setState({dados, cadastrando: false})})
        .catch((erro) => {this.setState({msgErro: erro.message, cadastrando: false})})
      this.setState({cadastrando: true, msgErro: undefined})
      break
    case 'multa':
      servicos
        .cadastreMultasEmMassa(this.state.dados)
        .then((dadosInvalidos) => {
          const dados = dadosInvalidos.reduce((a,b) => `${a}${b}\n`, '')
          this.setState({dados, cadastrando: false})})
        .catch((erro) => {this.setState({msgErro: erro.message, cadastrando: false})})
      this.setState({cadastrando: true, msgErro: undefined})
      break

    default:
      this.setState({msgErro: 'ainda nao implementado', cadastrando: true})
    }
  }

  render() {
    let titulo
    let instrucao
    let exemplo

    if (this.state.msgErro !== undefined) {
      this.growl.show({
        severity: 'error',
        summary: 'Erro',
        detail: this.state.msgErro
      })
    }
    switch (this.props.tipo) {
    case 'proprietario':
      titulo = 'Cadastro em Massa de Proprietários'
      instrucao = 'Digite o CPF e o nome do proprietário'
      exemplo = `${util_masks.cpfMask},Zé Ninguém`
      break
    case 'veiculo':
      titulo = 'Cadastro em Massa de Veículos'
      instrucao = 'Digite a placa, o CPF do proprietário e o ano de fabricação'
      exemplo = `ABA2018,${util_masks.cpfMask},1976`
      break
    case 'multa':
      titulo = 'Cadastro em Massa de Multas'
      instrucao = 'Digite a placa e a pontuação'
      exemplo = 'ABA2018,07'
      break
    default:
      titulo = `Cadastro em Massa de ${this.props.tipo} ainda não pronto`
    }

    return (
      <Panel header={titulo}>
        <Growl ref={(el) => {this.growl = el}}/>
        <Card title='Instruções' subtitle={instrucao}>
          <span>Exemplo: <br/>{exemplo}</span>
        </Card>
        <InputTextarea
          rows={10}
          cols={30}
          value={this.state.dados}
          onChange={(ev) => this.setState({dados: ev.target.value})}/>
        <br/>
        <Button
          label='Cadastrar'
          className='p-button-success'
          disabled={this.naoPodeCadastrar.bind(this)()}
          onClick={this.cadastre.bind(this)}/>
        <Button
          label='Cancelar'
          className='p-button-danger'
          onClick={this.props.cancelar}/>
      </Panel>
    )
  }
}

CadastraEmMassa.propTypes = {
  cancelar : PropTypes.func.isRequired,
  tipo : PropTypes.oneOf(['proprietario', 'veiculo', 'multa']).isRequired
}

export default CadastraEmMassa
