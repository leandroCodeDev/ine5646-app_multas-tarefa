import React from 'react'
import PropTypes from 'prop-types'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {InputText} from 'primereact/inputtext'
import {Button} from 'primereact/button'
import {Growl} from 'primereact/growl'

import servicos from '../servicos'
import util_masks from './util_masks'

class CadastraProprietario extends React.Component {
  constructor() {
    super()
    this.state = {
      cpf : undefined,
      cpfDefinido : false,
      nome : undefined,
    }
    this.cadastre = this.cadastre.bind(this)
    this.armazeneCPF = this.armazeneCPF.bind(this)
    this.definiuCPF = this.definiuCPF.bind(this)
    this.armazeneNome = this.armazeneNome.bind(this)
    this.naoPodeCadastrar = this.naoPodeCadastrar.bind(this)
  }

  naoPodeCadastrar () {
    if (this.state.cpfDefinido === false || this.state.nome === undefined || this.state.nome.trim() === '')
      return 'disabled'
    else
      return 0
  }

  definiuCPF () {
    this.setState({cpfDefinido : true})
  }

  armazeneNome (ev) {
    this.setState({nome: ev.target.value})
  }

  armazeneCPF (ev) {    
    if (ev.value !== this.state.cpf) {
      this.setState({cpf: ev.value, cpfDefinido: false})
    }
    
  }

  cadastre(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor
    ev.persist()  // obrigatório por causa do ev.target abaixo

    const prom = servicos.cadastreProprietario(this.state.cpf, this.state.nome)
    prom
      .then((cadastrou) => {
        if (!cadastrou)
          return Promise.reject(new Error('Proprietário já cadastrado'))

        ev.target.reset()
        this.setState({nome: undefined, cpf: undefined, cpfDefinido: false})
        this.growl.show({
          severity: 'success',
          summary: 'Cadastro de Proprietário',
          detail: 'Cadastro feito!'})
      })
      .catch((erro) => {
        this.growl.show({
          severity: 'error',
          summary: 'Cadastro de Proprietário',
          detail: erro.message})
      })
  }

  render() {
    return (
      <Panel header='Cadastrar Proprietário'>
        <Growl ref={(el) => {this.growl = el}}/>
        <form onSubmit={this.cadastre}>
          <p>
          CPF :
            <br/>
            <InputMask
              value={this.state.cpf}
              onComplete={this.definiuCPF}
              onChange={this.armazeneCPF}
              mask={util_masks.cpfMask}
              unmask={true}
              size={util_masks.cpfMask.length}/>
          </p>
          <p>
          Nome :
            <br/>
            <InputText
              type='text'
              onChange={this.armazeneNome}
              size='30'/>
          </p>
          <Button
            label='Cadastrar'
            className='p-button-success'
            type='submit'
            disabled={this.naoPodeCadastrar()}/>
          <Button
            label='Cancelar'
            className='p-button-danger'
            onClick={this.props.cancelar}/>
        </form>
      </Panel>
    )
  }
}

CadastraProprietario.propTypes = {
  cancelar : PropTypes.func.isRequired
}

export default CadastraProprietario
