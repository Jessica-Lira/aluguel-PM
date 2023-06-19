'use strict';

const { build } = require('../src/app')

describe('requests the "/funcionarios" route', () => {

  test('Deve retornar a lista de funcionarios quando chamada', async () => {
      const app = build();

      const response = await app.inject({
         method: "GET",
         url: "/funcionarios"
      });
      
      expect(response.statusCode).toBe(200);
  })
})

describe('POST de Funcionario na rota /funcionarios', () => {
  test('Deve postar um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario6",
        confirmacaoSenha: "senhafuncionario6",
        email: "funcionario6@example.com",
        nome: "funcionario6",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario6"
    }});

    expect(response.statusCode).toBe(200);
  });
});

/************* TESTES DE EMAIL *************/

describe('POST de Funcionario na rota /funcionarios sem email', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario6",
        confirmacaoSenha: "senhafuncionario6",
        nome: "funcionario6",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario6"
    }});

    expect(response.statusCode).toBe(422);
  });
}); 

describe('POST de Funcionario na rota /funcionarios com email invalido', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario6",
        confirmacaoSenha: "senhafuncionario6",
        email: "funcionario6email",
        nome: "funcionario6",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario6"
    }});

    expect(response.statusCode).toBe(422);
  });
}); 

describe('POST de Funcionario na rota /funcionarios com email repetido', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario6",
        confirmacaoSenha: "senhafuncionario6",
        email: "funcionario1@example.com",
        nome: "funcionario6",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario6"
    }});

    expect(response.statusCode).toBe(422);
  });
}); 

/************* TESTES DE CAMPOS OBRIGATÓRIOS *************/

describe('POST de Funcionario na rota /funcionarios sem campo obrigatório SENHA', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        confirmacaoSenha: "senhafuncionario6",
        email: "funcionario1@example.com",
        nome: "funcionario6",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario6"
    }});

    expect(response.statusCode).toBe(422);
  });
}); 

describe('POST de Funcionario na rota /funcionarios sem campo CONFIRMAÇÃO SENHA', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario6",
        email: "funcionario1@example.com",
        nome: "funcionario6",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario6"
    }});

    expect(response.statusCode).toBe(422);
  });
}); 

describe('POST de Funcionario na rota /funcionarios sem campo NOME', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario6",
        confirmacaoSenha: "senhafuncionario6",
        email: "funcionario1@example.com",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario6"
    }});

    expect(response.statusCode).toBe(422);
  });
}); 

describe('POST de Funcionario na rota /funcionarios sem campo EMAIL', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario6",
        confirmacaoSenha: "senhafuncionario6",
        nome: "funcionario6",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario6"
    }});

    expect(response.statusCode).toBe(422);
  });
}); 

/************* TESTES DE CAMPOS DE SENHA *************/

describe('POST de Funcionario na rota /funcionarios com senhas diferentes', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario7",
        confirmacaoSenha: "senhafuncionario6",
        email: "funcionario6email",
        nome: "funcionario6",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario6"
    }});

    expect(response.statusCode).toBe(422);
  });
}); 

/************* TESTES DE BUSCA DE FUNCIONARIOS *************/

describe('GET de Funcionario na rota /funcionarios/:id com id valido', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/funcionarios/:id',
      payload: { 
        id: 1
    }});

    expect(response.statusCode).toBe(200);
  });
}); 

describe('GET de Funcionario na rota /funcionarios/:id com id invalido', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/funcionarios/:id',
      payload: { 
        id: 10
    }});

    expect(response.statusCode).toBe(500);
  });
}); 

