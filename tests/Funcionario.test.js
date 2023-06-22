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

/************* TESTES DE POST DE FUNCIONARIO *************/

describe('POST de Funcionario na rota /funcionarios', () => {
  test('Deve dar SUCESSO no POST de um funcionario', async () => {
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

//CAMPOS DE E-MAIL

describe('POST de Funcionario na rota /funcionarios SEM EMAIL', () => {
  test('Deve dar ERRO no POST de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario7",
        confirmacaoSenha: "senhafuncionario7",
        nome: "funcionario7",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario7"
    }});
    console.log(response.body)
    expect(response.statusCode).toBe(422);
  });
}); 

describe('POST de Funcionario na rota /funcionarios com EMAIL INVALIDO', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario8",
        confirmacaoSenha: "senhafuncionario8",
        email: "funcionario8email",
        nome: "funcionario8",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario8"
    }});
    console.log(response.body)
    expect(response.statusCode).toBe(422);
  });
}); 

describe('POST de Funcionario na rota /funcionarios com EMAIL REPETIDO', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario9",
        confirmacaoSenha: "senhafuncionario9",
        email: "funcionario1@example.com",
        nome: "funcionario9",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario9"
    }});
    console.log(response.body)
    expect(response.statusCode).toBe(422);
  });
});  

//CAMPOS OBRIGATÓRIOS

describe('POST de Funcionario na rota /funcionarios SEM CAMPOS DE SENHA E NOME', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        email: "funcionario10@example.com",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario10"
    }});
    console.log(response.body)
    expect(response.statusCode).toBe(422);
  });
});  

describe('POST de Funcionario na rota /funcionarios COM SENHAS DIFERENTES', () => {
  test('Deve dar erro de post de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/funcionarios',
      payload: { 
        senha: "senhafuncionario11",
        confirmacaoSenha: "senha11",
        email: "funcionario11@example.com",
        nome: "funcionario11",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario11"
    }});
    console.log(response.body)
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

/************* TESTES DE BUSCA DE FUNCIONARIOS POR ID *************/

describe('GET de Funcionario na rota /funcionarios/:id com id VALIDO', () => {
  test('Deve dar SUCESSO no GET de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/funcionarios/b57a9ded-dd1e-44ba-8c10-d231efb70ad1'
    });

    expect(response.statusCode).toBe(200);
  });
});  

describe('GET de Funcionario na rota /funcionarios/:id com id INVALIDO', () => {
  test('Deve dar FALHA no GET de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/funcionarios/10'
    });

    expect(response.statusCode).toBe(422);
  });
}); 

describe('GET de Funcionario na rota /funcionarios/:id com id INEXISTENTE', () => {
  test('Deve dar FALHA no GET de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/funcionarios/54d268a8-a397-4b1d-b116-18c53059566c'
    });

    expect(response.statusCode).toBe(404);
  });
}); 

/************* TESTES DE ATUALIZAÇÃO DE FUNCIONARIOS POR ID *************/

describe('PUT de Funcionario na rota /funcionarios/:id com id valido', () => {
  test('Deve dar sucesso no put de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/funcionarios/b57a9ded-dd1e-44ba-8c10-d231efb70ad1',
      payload: { 
        senha: "senhafuncionario1",
        confirmacaoSenha: "senhafuncionario1",
        email: "funcionarioteste1@example.com",
        nome: "funcionarioteste1",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario1"
    }});
    //console.log(response.body)
    expect(response.statusCode).toBe(200);
  });
});  

describe('PUT de Funcionario na rota /funcionarios/:id com id invalido', () => {
  test('Deve dar falha no put de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/funcionarios/10',
      payload: { 
        senha: "senhafuncionario1",
        confirmacaoSenha: "senhafuncionario1",
        email: "funcionarioteste1@example.com",
        nome: "funcionarioteste1",
        idade: 0,
        funcao: "funcionario",
        cpf: "cpfdofuncionario1"
    }});
    //console.log(response.body)
    expect(response.statusCode).toBe(404);
  });
});  

/************* TESTES DE REMOÇÃO DE FUNCIONARIOS POR ID *************/

describe('DELETE de Funcionario na rota /funcionarios/:id com id valido', () => {
  test('Deve dar SUCESSO no DELETE de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'DELETE',
      url: '/funcionarios/b57a9ded-dd1e-44ba-8c10-d231efb70ad1'
    });
    expect(response.statusCode).toBe(200);
  });
}); 

describe('DELETE de Funcionario na rota /funcionarios/:id com id invalido', () => {
  test('Deve dar FALHA no DELETE de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'DELETE',
      url: '/funcionarios/AAA'
    });
    expect(response.statusCode).toBe(422);
  });
}); 

describe('DELETE de Funcionario na rota /funcionarios/:id com id INEXISTENTE', () => {
  test('Deve dar FALHA no DELETE de um funcionario', async () => {
    const app = build();

    const response = await app.inject({
      method: 'DELETE',
      url: '/funcionarios/54d268a8-a397-4b1d-b116-18c53059566c'
    });
    expect(response.statusCode).toBe(404);
  });
}); 
