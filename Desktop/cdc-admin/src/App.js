import React, { Component } from 'react';
// import './App.css';
import './css/pure-min.css';
import './css/side-menu.css';
import $ from 'jquery';
import InputCustomizado from './components/InputCustomizado';

class App extends Component {

   // state é uma variavel, que vai receber um JSON, que representa o estado do objeto
    // só podemos guardar estado na variavel state
    // nao pode usar o this, antes de chamar o super() que é a invocacao do construtor da classe que esta herdando

  constructor () {
    super();
    this.state = {
      lista: [],
      nome: '',
      email: '',
      senha: ''
    };

    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
  }

  // Para que a tela não comece vazia, existe a funcao componentDidMount(), 
  // significa  'componente acabou de ser montado'
  // Após o render() ser executado, essa funcao componentDidMount() é chamada

  // ------------------

  // Existe também uma outra função que pode ser executada antes do método render() ser chamado
  // que é a componentWillMount ()

  componentWillMount () {
      $.ajax({
        url: "https://cdc-react.herokuapp.com/api/autores",
        dataType: 'json',
        success: function (resposta) {
          // a ideia é que sempre que mudar o estado (state), o React invoque o método render()
          // pra isso foi criada a funcao do React chamada setState, informada a propriedade que será atualizada
          this.setState({lista: resposta});
          
          // console.log(this.state.lista);
          // como o jquery não tem a função setState, foi preciso usar o método bind() para usar o this do React
          // O this nesse caso é do success
        }.bind(this)
      }
    );
  }

  enviarForm (event) {
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
      success: function (resposta){
        this.setState({lista:resposta})
        console.log(resposta);
        
      }.bind(this),
      error: function(resposta) {
        console.log('Erro');
      }
    });
  } 

  setNome (event){
    this.setState({nome:event.target.value})
  }

  setEmail (event){
    this.setState({email:event.target.value})
  }

  setSenha (event){
    this.setState({senha:event.target.value})
  }
  

  render() {
    return (
      <div className="App">

        <div id="layout">
          <a href="#menu" id="menuLink" className="menu-link">
        <span></span>
          </a>

          <div id="menu">
            <div className="pure-menu">
              <a className="pure-menu-heading" href="#">Company</a>

              <ul className="pure-menu-list">
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>

                <li className="pure-menu-item menu-item-divided">
                  <a href="#" className="pure-menu-link">Livros</a>
                </li>

              </ul>
            </div>
          </div>

          {/* BEGIN MAIN */}
          <div id="main">
            <div className="header">
              <h1>Cadastro de Autores</h1>
            </div>
            <div className="content" id="content">
              <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviarForm.bind(this)} method="post">
                  {/* NOME */}
                  <InputCustomizado label="Nome" id="nome" type="text" value={this.state.nome} onChange={this.setNome}/>
               
                  {/* EMAIL */}
                  <InputCustomizado label="Email" id="email" type="email" value={this.state.email} onChange={this.setEmail}/>

                  {/* SENHA */}
                  <InputCustomizado label="Senha" id="senha" type="password" value={this.state.senha} onChange={this.setSenha}/>

                  <div className="pure-control-group">
                    <label></label>
                    <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                  </div>
                </form>

              </div>
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
                            this.state.lista.map( pessoa => { 
                            // return é o React.createElement por baixo dos panos
                            return (
                            <tr key={pessoa.id}>
                              <td> { pessoa.nome } </td>
                              <td> { pessoa.email } </td>
                            </tr>
                            );
                          }) 
                        } 
                  </tbody>
                </table>
              </div>
            </div>
          </div> 
          {/* END MAIN */}

        </div>
      </div>
    );
  }
}

export default App;
