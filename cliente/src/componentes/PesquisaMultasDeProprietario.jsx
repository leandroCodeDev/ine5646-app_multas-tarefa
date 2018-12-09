import React from 'react'
import PropTypes from 'prop-types'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Growl} from 'primereact/growl'
import {Card} from 'primereact/card'
import {Chart} from 'primereact/chart'
import servicos from '../servicos'
import util_masks from './util_masks'

class PesquisaMultasDeProprietario extends React.Component {

  constructor() {
    super()
    this.state = {
      cpfDefinido: false,
      cpf: undefined,
      proprietario: undefined,
      veiculos: undefined,
      pesquisando: false
    }
  }

  pesquise(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor

    const prom = servicos.pesquiseMultasDeProprietario(this.state.cpf)
    prom
      .then(({proprietario, veiculos}) => {
        if (proprietario !== null) {
          this.setState({proprietario, veiculos, pesquisando: false})
        } else {
          return Promise.reject(new Error(`Não existe proprietário com CPF ${this.state.cpf}`))
        }
      })
      .catch((erro) => {
        this.setState({proprietario: undefined, veiculos: undefined, pesquisando: false})
        this.growl.show({
          severity: 'error',
          summary: 'Pesquisa Multas de Proprietário',
          detail: erro.message})
      })
    this.setState({proprietario: undefined, veiculos: undefined, pesquisando: true})
  }

  definiuCPF () {
    this.setState({cpfDefinido : true})
  }

  armazeneCPF (ev) {
    if (ev.value !== this.state.cpf) {
      this.setState({cpf: ev.value, cpfDefinido: false, proprietario: undefined})
    }
  }

  render() {
    let grafico = null
    if (this.state.proprietario !== undefined) {
      const placas = this.state.veiculos.map(v => v.placa)
      const pontos = this.state.veiculos.map(v => v.pontos)
      const dados = {
        labels: placas,
        datasets: [
          {
            label: 'Pontuação do Veículo',
            data: pontos,
            fill: false,
            backgroundColor: 'orange'
          }
        ]
      }
      const opcoes = {
        title: {
          display: true,
          text: `Proprietário: ${this.state.proprietario.nome} CPF: ${this.state.proprietario.cpf}`
        }
      }
      grafico = <Chart type='bar' data={dados} options={opcoes}/>
    }

    return (
      <Panel header='Pesquisar Multas de Proprietário'>
        <Growl ref={(el) => {this.growl = el}}/>
        <Card>
          <form onSubmit={this.pesquise.bind(this)}>
            <p>
              CPF :
              <br/>
              <InputMask
                value={this.state.cpf}
                onComplete={this.definiuCPF.bind(this)}
                onChange={this.armazeneCPF.bind(this)}
                mask={util_masks.cpfMask}
                unmask={true}
                size={util_masks.cpfMask.length}/>
            </p>
          </form>
          <Button
            label='Pesquisar'
            className='p-button-success'
            type='submit'
            disabled={this.state.cpfDefinido === false || this.state.pesquisando}
            onClick={this.pesquise.bind(this)}/>

          <Button
            label='Cancelar'
            className='p-button-danger'
            onClick={this.props.cancelar}/>
        </Card>
        <div>{grafico}</div>
      </Panel>
    )
  }
}

PesquisaMultasDeProprietario.propTypes = {
  cancelar : PropTypes.func.isRequired
}

export default PesquisaMultasDeProprietario
