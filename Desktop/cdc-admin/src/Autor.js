import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './components/InputCustomizado';
import PubSub from 'pubsub-js';

class FormularioAutor extends Component {
    constructor() {
        super();

        this.state = { nome: '', email: '', senha: '' };
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviarForm(event) {
        event.preventDefault();

        $.ajax({
            url: "https://cdc-react.herokuapp.com/api/autores",
            contentType: "application/json",
            dataType: "json",
            type: "post",
            data: JSON.stringify
                (
                    {
                        nome: this.state.nome,
                        email: this.state.email,
                        senha: this.state.senha
                    }
                ),
            success: function (novaListagem) {
                PubSub.publish('atualiza-listagem-autores', novaListagem);
            },
            error: function (resposta) {
                console.log('Erro');
            }
        });
    }

    setNome(event) {
        this.setState({ nome: event.target.value })
    }

    setEmail(event) {
        this.setState({ email: event.target.value })
    }

    setSenha(event) {
        this.setState({ senha: event.target.value })
    }


    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviarForm.bind(this)} method="post">
                    <InputCustomizado label="Nome" id="nome" type="text" value={this.state.nome} onChange={this.setNome} />

                    <InputCustomizado label="Email" id="email" type="email" value={this.state.email} onChange={this.setEmail} />

                    <InputCustomizado label="Senha" id="senha" type="password" value={this.state.senha} onChange={this.setSenha} />

                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        );
    }
}

class TabelaAutores extends Component {   

    render () {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(pessoa => {
                                // return é o React.createElement por baixo dos panos
                                return (
                                    <tr key={pessoa.id}>
                                        <td> {pessoa.nome} </td>
                                        <td> {pessoa.email} </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }   
}


export default class AutorBox extends Component {

    // state é uma variavel, que vai receber um JSON, que representa o estado do objeto
    // só podemos guardar estado na variavel state
    // nao pode usar o this, antes de chamar o super() que é a invocacao do construtor da classe que esta herdando

    constructor() {
        super();
        this.state = { lista: [] };
    }


    // Para que a tela não comece vazia, existe a funcao componentDidMount(), 
    // significa  'componente acabou de ser montado'
    // Após o render() ser executado, essa funcao componentDidMount() é chamada

    // ------------------

    // Existe também uma outra função que pode ser executada antes do método render() ser chamado
    // que é a componentWillMount ()

    componentWillMount() {
        $.ajax({
                url: "https://cdc-react.herokuapp.com/api/autores",
                dataType: 'json',
                success: function (resposta) {
                    // a ideia é que sempre que mudar o estado (state), o React invoque o método render()
                    // pra isso foi criada a funcao do React chamada setState, informada a propriedade que será atualizada
                    this.setState({ lista: resposta });

                    // console.log(this.state.lista);
                    // como o jquery não tem a função setState, foi preciso usar o método bind() para usar o this do React
                    // O this nesse caso é do success
                }.bind(this)
            }
        );

        PubSub.subscribe('atualiza-lista-autores', function (topico, novaLista){
            this.setState({lista:novaLista})
        }.bind(this));
    }   

    render(){
        return (
            <div>
                <FormularioAutor/>
                <TabelaAutores lista={this.state.lista}/>
            </div>
        );
    }
}
