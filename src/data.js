const { v4: uuidv4 } = require('uuid');

let ciclistas = [
    {
      id: "1",
      nome: "Joao Gabriel",
      nascimento: "2023-06-11",
      cpf: "87942565300", 
      passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TX"
      },
      nacionalidade: "string",
      email: "jgevelin@example.com",
      urlFotoDocumento: "string",
      senha: "string",
      meioDePagamento: {
        nomeTitular: "string",
        numero: "984602367621417541873846007875805616119812247741040998629140438970271355",
        validade: "2023-06-11",
        cvv: "4857"
      },
      ativo: false,
      statusAluguel: false
    },
    {
      id: "2",
      nome: "Mariana",
      nascimento: "2023-06-11",
      cpf: "87942565300", 
      passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TX"
      },
      nacionalidade: "string",
      email: "user@example.com",
      urlFotoDocumento: "string",
      senha: "string",
      meioDePagamento: {
        nomeTitular: "string",
        numero: "984602367621417541873846007875805616119812247741040998629140438970271355",
        validade: "2023-06-11",
        cvv: "4857"
      },
      ativo: false,
      statusAluguel: true
    },
    {
      id: "3",
      nome: "Joao Pedro",
      nascimento: "2023-06-11",
      cpf: "87942565300", 
      passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TX"
      },
      nacionalidade: "string",
      email: "user@example.com",
      urlFotoDocumento: "string",
      senha: "string",
      meioDePagamento: {
        nomeTitular: "string",
        numero: "984602367621417541873846007875805616119812247741040998629140438970271355",
        validade: "2023-06-11",
        cvv: "4857"
      },
      ativo: true,
      statusAluguel: false
    },
    {
      id: "4",
      nome: "Jessica",
      nascimento: "2023-06-11",
      cpf: "87942565300", 
      passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TX"
      },
      nacionalidade: "string",
      email: "jessica@example.com",
      urlFotoDocumento: "string",
      senha: "string",
      meioDePagamento: {
        nomeTitular: "string",
        numero: "984602367621417541873846007875805616119812247741040998629140438970271355",
        validade: "2023-06-11",
        cvv: "444"
      },
      ativo: true,
      statusAluguel: false
    },
];

let funcionarios = [
  {
      id: "1",
      matricula: "mat1",
      senha: "senhafuncionario1",
      confirmacaoSenha: "senhafuncionario1",
      email: "funcionario1@example.com",
      nome: "funcionario1",
      idade: 0,
      funcao: "funcionario",
      cpf: "cpfdofuncionario1"
  },
  {
      id: "2",
      matricula: "mat2",
      senha: "senhafuncionario2",
      confirmacaoSenha: "senhafuncionario2",
      email: "funcionario2@example.com",
      nome: "funcionario2",
      idade: 0,
      funcao: "funcionario",
      cpf: "cpfdofuncionario2"
  },
  {
      id: "3",
      matricula: "mat3",
      senha: "senhafuncionario3",
      confirmacaoSenha: "senhafuncionario3",
      email: "funcionario3@example.com",
      nome: "funcionario3",
      idade: 0,
      funcao: "funcionario",
      cpf: "cpfdofuncionario3"
  },
  {
      id: "4",
      matricula: "mat4",
      senha: "senhafuncionario4",
      confirmacaoSenha: "senhafuncionario4",
      email: "funcionario4@example.com",
      nome: "funcionario4",
      idade: 0,
      funcao: "funcionario",
      cpf: "cpfdofuncionario4"
  },
  {
      id: "5",
      matricula: "mat5",
      senha: "senhafuncionario5",
      confirmacaoSenha: "senhafuncionario5",
      email: "funcionario5@example.com",
      nome: "funcionario5",
      idade: 0,
      funcao: "funcionario",
      cpf: "cpfdofuncionario5"
  }
]

module.exports = {
  ciclistas, 
  funcionarios
}
