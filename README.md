<h1 align="center">
   Sistema de controle de bicicletário
</h1>

Microsserviço:
- `Aluguel`

<h4 align="center"> 
	Status: <br>
	🚧  Em construção...  🚧
</h4>

<br>
Modelo:<br>
<a target="_blank">https://app.swaggerhub.com/apis/pasemes/sistema-de_controle_de_bicicletario2/1</a>

<br>
Casos de Uso:

- UC01 Cadastrar Ciclista
- UC06 Alterar Dados Ciclista
- UC07 Alterar Cartão
- UC15 Manter Cadastro de Funcionário

Endpoints:
  <ul>
    <li><input type="checkbox" checked>POST /ciclista</li>
    <li><input type="checkbox" checked>GET /ciclista/{idCiclista}</li>
    <li><input type="checkbox" checked>PUT /ciclista/{idCiclista}</li>
    <li><input type="checkbox" checked>POST /ciclista/{idCiclista}/ativar</li>
    <li><input type="checkbox" checked>GET /ciclista/{idCiclista}/permiteAluguel</li>
    <li><input type="checkbox">GET /ciclista/{idCiclista}/bicicletaAlugada</li>
    <li><input type="checkbox" checked>GET /ciclista/{idCiclista}</li>
    <li><input type="checkbox" checked>GET /ciclista/existeEmail/{email}</li>
    <li><input type="checkbox" checked>GET /funcionario</li>
    <li><input type="checkbox" checked>POST /funcionario</li>
    <li><input type="checkbox" checked>GET /funcionario/{idFuncionario}</li>
    <li><input type="checkbox" checked>PUT /funcionario/{idFuncionario}</li>
    <li><input type="checkbox" checked>DELETE /funcionario/{idFuncionario}</li>
    <li><input type="checkbox" checked>GET /cartaoDeCredito/{idCiclista}</li>
    <li><input type="checkbox" checked>PUT /cartaoDeCredito/{idCiclista}</li>
    <li><input type="checkbox">POST /aluguel</li>
    <li><input type="checkbox">POST /devolucao</li>
  </ul>

A entrega deve ter:

- Testes unitários em abundância (escopo de método), utilizando mocks;

- A ferramenta Sonar configurada (no sonarcloud.io) com: (i) 0 Bug, (ii) 0 Vulnerability, (iii)  0 Code Smells nas severidades blocker, critical e major (minor e info sem restrições), (iv) testes unitários com cobertura de código mínima de 80% e (v) menos de 1% de duplicação de código. 

Estar disponibilizado no Heroku (ou em outra plataforma escolhida).

<br>
<h4> 🔧 Instalação </h4>

- Clone o repositório 
```
$ git clone https://github.com/grupo-A-PM/Aluguel
```

- Acesse a pasta do projeto no terminal/cmd 
```
$ cd .\Aluguel\
```

- Instale as dependências com `npm`
```
$ npm install
```
- Inicie o servidor com `npm`
```
$ npm run dev
```

## 🚀 Como testar 
```
$ npm test
```
## 🚀 Demonstração

<h4 align="center">
  Você pode visualizar a aplicação funcionando através do link: <br>

  <a target="_blank">site aqui</a>
  
</h4>

