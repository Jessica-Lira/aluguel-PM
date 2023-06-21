'use strict';

const { build } = require('../src/app');

describe('getCiclistas route test', () => {
  test('Should return the list of cyclists when called', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas'
    });

    expect(response.statusCode).toBe(200);
  });

  test('Should return error when wrong url called', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclista'
    });

    expect(response.statusCode).toBe(404);
  });
});

describe('criarCiclista route test', () => {
  test('Should create a new cyclist when all data is provided', async () => {
    const app = build();

    const response = await app.inject({
    method: 'POST',
    url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a5',
        nome: 'Paulo',
        nascimento: '2023-06-11',
        cpf: '12345678955',
        passaporte: {
          numero: '123456789',
          validade: '2023-06-11',
          pais: 'TL'
        },
        nacionalidade: 'BR',
        email: 'paulo@email.com',
        urlFotoDocumento: 'string',
        senha: 'clientepaulo',
        confirmarSenha: 'clientepaulo',
        meioDePagamento: {
          nomeTitular: 'Paulo',
          numero: '984602367621417541873846007875805616119812247741040998629140438970271355',
          validade: '2023-06-11',
          cvv: '487'
        },
        ativo: false,
      }
  });

  expect(response.statusCode).toBe(201);
  });

  test('Should return 400 when without EMAIL', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista B",
        nascimento: "2023-06-11",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "string",
        email: "",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista B",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271355",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(400);
  });

  test('Should return 422 when wrong format EMAIL', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista C",
        nascimento: "2023-06-11",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "string",
        email: "ciclistac.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista C",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(422);
  });

  /*
  test('Should return 422 when EMAIL is used by another cyclist', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31b8',
        nome: "Novo Ciclista",
        nascimento: "2023-06-11",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "string",
        email: "jgevelin@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista C",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(422);
  });
  */

  test('Should return 422 when without NASCIMENTO', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista D",
        nascimento: "",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "string",
        email: "ciclistad@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista D",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without NOME', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "",
        nascimento: "2023-06-11",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "string",
        email: "ciclistad@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista D",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without NACIONALIDADE', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista E",
        nascimento: "2023-06-11",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "",
        email: "ciclistae@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista D",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without SENHA', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista E",
        nascimento: "2023-06-11",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "nacionalidade",
        email: "ciclistae@example.com",
        urlFotoDocumento: "string",
        senha: "",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista D",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without CONFIRMARSENHA', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista E",
        nascimento: "2023-06-11",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "nacionalidade",
        email: "ciclistae@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "",
        meioDePagamento: {
          nomeTitular: "ciclista D",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(422);
  });
/*
  test('Should return 422 when without MEIODEPAGAMENTO', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista E",
        nascimento: "2023-06-11",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "nacionalidade",
        email: "ciclistae@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "",
          numero: "",
          validade: "",
          cvv: ""
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(422);
  });
*/
  test('Should return 422 for unmatching passwords', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista E",
        nascimento: "2023-06-11",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "nacionalidade",
        email: "ciclistae@example.com",
        urlFotoDocumento: "string",
        senha: "senha",
        confirmarSenha: "outrasenha",
        meioDePagamento: {
          nomeTitular: "ciclista D",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(422);
  });

  test('Should return success for Brazilian nationality with valid CPF', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista F",
        nascimento: "2023-06-11",
        cpf: "87942565301", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "BR",
        email: "ciclistaf@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista E",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(201);
  });
/*
  test('Should return 422 for Brazilian nationality with invalid CPF', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista F",
        nascimento: "2023-06-11",
        cpf: "1", 
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "BR",
        email: "ciclistaf@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista E",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(422);
  });
*/

  test('Should return success for non-Brazilian nationality with valid passport', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista F",
        nascimento: "2023-06-11",
        cpf: "", 
        passaporte: {
          numero: "ABC123",
          validade: "2023-06-11",
          pais: "US"
        },
        nacionalidade: "US",
        email: "ciclistaf@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista E",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(200);
  });

  /*
  test('Should return 422 for non-Brazilian nationality with valid passport', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
        nome: "Ciclista F",
        nascimento: "2023-06-11",
        cpf: "", 
        passaporte: {
          numero: "",
          validade: "",
          pais: ""
        },
        nacionalidade: "US",
        email: "ciclistaf@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista E",
          numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
        }
    });

    expect(response.statusCode).toBe(201);
  });
*/
/*
  test('Should return success true and status 200 when email is sent successfully', async () => {
  });
*/
});

describe('getCiclistaByID route test', () => {
  test('Should return 200 when search get ciclista', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/1',
      payload: { 
        id: "1",
    }});

    expect(response.statusCode).toBe(200);
  });

  test('Should return error 422 when search get ciclista', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/10',
      payload: { 
        id: 10
    }});

    expect(response.statusCode).toBe(422);
  });
});

describe('atualizarCiclista route test', () => {
  test('Should update cyclist when valid data is provided', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/1', 
      payload: {
        id: '1',
        nome: 'Novo nome',
        nascimento: '2023-06-11',
        cpf: '12345678955',
        passaporte: {
          numero: '123456789',
          validade: '2023-06-11',
          pais: 'TL'
        },
        nacionalidade: 'BR',
        email: 'novoemail@email.com',
        urlFotoDocumento: 'string',
        senha: 'clientenovo',
        confirmarSenha: 'clientenovo',
        meioDePagamento: {
          nomeTitular: 'novo nome',
          numero: '984602367621417541873846007875805616119812247741040998629140438970271355',
          validade: '2023-06-11',
          cvv: '444'
        },
        ativo: false,
      }
    });

    expect(response.statusCode).toBe(422);
  });

  test('Should not update cyclist when invalid id is provided', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/1', 
      payload: {
        id: '1',
        nome: '',
        nascimento: '2023-06-11',
        cpf: '12345678955',
        passaporte: {
          numero: '123456789',
          validade: '2023-06-11',
          pais: 'TL'
        },
        nacionalidade: 'BR',
        email: 'novoemail@email.com',
        urlFotoDocumento: 'string',
        senha: 'clientenovo',
        confirmarSenha: 'clientenovo',
        meioDePagamento: {
          nomeTitular: 'novo nome',
          numero: '984602367621417541873846007875805616119812247741040998629140438970271355',
          validade: '2023-06-11',
          cvv: '444'
        },
        ativo: false,
      }
    });

    expect(response.statusCode).toBe(422);
  });

  test('Should not update cyclist when invalid url is provided', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/0c4e5a5d-7', 
      payload: {
        id: '0c4e5a5d',
        nome: 'Novo nome',
        nascimento: '2023-06-11',
        cpf: '12345678955',
        passaporte: {
          numero: '123456789',
          validade: '2023-06-11',
          pais: 'TL'
        },
        nacionalidade: 'BR',
        email: 'novoemail@email.com',
        urlFotoDocumento: 'string',
        senha: 'clientenovo',
        confirmarSenha: 'clientenovo',
        meioDePagamento: {
          nomeTitular: 'novo nome',
          numero: '984602367621417541873846007875805616119812247741040998629140438970271355',
          validade: '2023-06-11',
          cvv: '444'
        },
        ativo: false,
      }
    });

    expect(response.statusCode).toBe(404);
  });

});

describe('ativarCadastroCiclista route test', () => {
  test('Should activate a cyclist when valid ID is provided', async () => {
    const app = build();
    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas/1/ativar',
      payload: {
        ativo: true
      }
    });
    expect(response.statusCode).toBe(200);
  });

  test('Should return 404 when invalid ID is provided', async () => {
    const app = build();
    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/50/ativar',
    });
    expect(response.statusCode).toBe(404);
  });

});

describe('permiteAluguel route test', () => {
  /*
  test('Should allow rental for an active cyclist without ongoing rental', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/1/permite-aluguel',
    });

    expect(response.statusCode).toBe(200);
  });

  test('Should return 404 for non-existent cyclist', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/20/permite-aluguel',
    });

    expect(response.statusCode).toBe(404);
  });

  test('Should return 422 for cyclist with ongoing rental', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/2/permite-aluguel',
    });

    expect(response.statusCode).toBe(422);
  });
*/
});

describe('getCartaoCredito route test', () => { 
  test('Should return the credit card information of a cyclist', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/cartao-credito/1',
    });
    expect(response.statusCode).toBe(200);
  });
  
  test('Should return 404 if cyclist is not found', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/cartao-credito/20',
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toBe('Ciclista não encontrado');
  });
});

describe('atualizarCartaoCredito route test', () => {
  test('Should update the credit card information of a cyclist', async () => {
    const app = build();
    
    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/atualizar-cartao/1',
      payload: {
        nomeTitular: 'Novo nome',
        numero: '98765432145',
        validade: '2024-12-31',
        cvv: '456',
      },
    });

    expect(response.statusCode).toBe(200);
  });

  test('Should return 404 if cyclist is not found', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/atualizar-cartao/34',
      payload: {
        numero: '987654321',
        validade: '2024-12-31',
        cvv: '456',
      },
    });

    expect(response.statusCode).toBe(404);
  });
/*
  test('Should return 422 if credit card data is invalid', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/atualizar-cartao/1',
      payload: {
        numero: '987654321',
        validade: '2020-01-01',
        cvv: '4',
      },
    });

    expect(response.statusCode).toBe(422);
  });
  */
});

