import React, { Component } from 'react';

export default class InputCustomizado extends Component {
    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                {/* Os parametros sao recebidos pelo atributo props. Guarda todos os parametros que foram passados para o componente */}
                {/* Todos os parametros ficam na variavel props que armazena um JSON */}
                <input id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value} onChange={this.props.onChange} />
            </div>
        )
    }
}

