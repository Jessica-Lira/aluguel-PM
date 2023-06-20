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
  //caso negativo
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
  /*
  test('Should return 404 when request body is not provided', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
    });

    expect(response.statusCode).toBe(404);
  });

  test('Should return 422 when required fields are missing', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        nome: 'Paulo',
        email: 'paulo@example.com',
      }
    });

    expect(response.statusCode).toBe(422);
  });

  //teste se o email ta em uso por outro ciclista
  //teste se envia email

  test('Should return success for matching passwords', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        nome: 'Paulo',
        nascimento: '2023-06-11',
        cpf: '12345678955',
        passaporte: {
          numero: '123456789',
          validade: '2023-06-11',
          pais: 'TL'
        },
        nacionalidade: 'BR',
        email: 'paulo@example.com',
        senha: 'clientepaulo',
        confirmarSenha: 'clientepaulo',
        meioDePagamento: {
          nomeTitular: 'Paulo',
          numero: '984602367621417541873846007875805616119812247741040998629140438970271355',
          validade: '2023-06-11',
          cvv: '4857'
        },
        ativo: false,
      }
    });

    expect(response.statusCode).toBe(200);
  });

  test('Should return 422 for non-matching passwords', async () => {
    const app = build();

    const response = await app.inject({
      method: 'POST',
      url: '/ciclistas',
      payload: {
        nome: 'Paulo',
        nascimento: '2023-06-11',
        cpf: '12345678955',
        passaporte: {
          numero: '123456789',
          validade: '2023-06-11',
          pais: 'TL'
        },
        nacionalidade: 'BR',
        email: 'paulo@example.com',
        senha: 'clientepaulo',
        confirmarSenha: 'senhadiferente',
        meioDePagamento: {
          nomeTitular: 'Paulo',
          numero: '984602367621417541873846007875805616119812247741040998629140438970271355',
          validade: '2023-06-11',
          cvv: '4857'
        },
        ativo: false,
      }
    });

    expect(response.statusCode).toBe(422);
  });
  describe('verificarNacionalidade function test', () => {
  test('Should return success for Brazilian nationality with valid CPF', async () => {
    const novoCiclista = {
      nacionalidade: 'BR',
      cpf: '12345678910',
    };

    const resultado = await verificarNacionalidade(novoCiclista);

    expect(resultado.success).toBe(true);
  });

  test('Should return error for Brazilian nationality with invalid CPF', async () => {
    const novoCiclista = {
      nacionalidade: 'BR',
      cpf: '123',
    };

    const resultado = await verificarNacionalidade(novoCiclista);

    expect(resultado.status).toBe(422);
  });

  test('Should return success for non-Brazilian nationality with valid passport', async () => {
    const novoCiclista = {
      nacionalidade: 'US',
      passaporte: {
        numero: 'ABC123',
        pais: 'USA',
      },
    };

    const resultado = await verificarNacionalidade(novoCiclista);

    expect(resultado.success).toBe(true);
  });

  test('Should return error for non-Brazilian nationality with invalid passport', async () => {
    const novoCiclista = {
      nacionalidade: 'US',
      passaporte: {
        numero: '',
        pais: '',
      },
    };

    const resultado = await verificarNacionalidade(novoCiclista);

    expect(resultado.status).toBe(422);
  });
});

  */
});

describe('getCiclistaByID route test', () => {
  /*
  test('Should return 200 when search get ciclista', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/:id',
      payload: { 
        id: "0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a5",
    }});

    expect(response.statusCode).toBe(200);
  });
  */
  test('Should return error 422 when search get ciclista', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/:id',
      payload: { 
        id: 1
    }});

    expect(response.statusCode).toBe(422);
  });
});

describe('atualizarCiclista route test', () => {
  /*
  test('Should update an existing cyclist when valid data is provided', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a5', 
      payload: {
        id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a5',
        nome: 'Novo nome',
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
          cvv: '4857'
        },
        ativo: false,
      }
    });

    expect(response.statusCode).toBe(200);
  });
*/
});

describe('ativarCadastroCiclista route test', () => {
  /*
  test('Should activate a cyclist when valid ID is provided', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a5',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('Ciclista ativado');

    const ciclista = ciclistas.find(c => c.id === '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a5'); 
    expect(ciclista.ativo).toBe(true);
  });

  test('Should return 404 when invalid ID is provided', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/invalid-id',
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toContain('Ciclista não encontrado');
  });
  */
});

describe('permiteAluguel route test', () => {
  /*
  test('Should allow rental for an active cyclist without ongoing rental', async () => {
    const app = build();
    const ciclista = {
      id: '1',
      ativo: true,
      statusAluguel: false,
    };
    ciclistas.push(ciclista);

    const response = await app.inject({
      method: 'GET',
      url: '/permite-aluguel/1',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(true);
  });

  test('Should return 404 for non-existent cyclist', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/permite-aluguel/2',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      codigo: '404',
      mensagem: 'Ciclista não encontrado',
    });
  });

  test('Should return 422 for cyclist with ongoing rental', async () => {
    const app = build();
    const ciclista = {
      id: '3',
      ativo: true,
      statusAluguel: true,
    };
    ciclistas.push(ciclista);

    const response = await app.inject({
      method: 'GET',
      url: '/permite-aluguel/3',
    });

    expect(response.statusCode).toBe(422);
    expect(response.json()).toEqual({
      codigo: '422',
      mensagem: 'Ciclista já possui um aluguel em andamento',
    });
  });
  */
});

describe('getCartaoCredito route test', () => {
  /*
  test('Should return the credit card information of a cyclist', async () => {
    
    const app = build();
    const ciclista = {
      id: '1',
      nome: 'João',
      meioDePagamento: {
        numero: '123456789',
        validade: '2023-06-11',
        cvv: '123',
      },
      // Outros campos do ciclista
    };
    ciclistas.push(ciclista);

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/1/cartao-credito',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      numero: '123456789',
      validade: '2023-06-11',
      cvv: '123',
    });
  });

  test('Should return 404 if cyclist is not found', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/2/cartao-credito',
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toBe('Ciclista não encontrado');
  });
});
*/
});

describe('atualizarCartaoCredito route test', () => {
  /*
  test('Should update the credit card information of a cyclist', async () => {
    const app = build();
    const ciclista = {
      id: '1',
      nome: 'João',
      meioDePagamento: {
        numero: '123456789',
        validade: '2023-06-11',
        cvv: '123',
      },
      // Outros campos do ciclista
    };
    ciclistas.push(ciclista);

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/1/cartao-credito',
      payload: {
        numero: '987654321',
        validade: '2024-12-31',
        cvv: '456',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('Dados do cartão de crédito atualizados' + JSON.stringify({
      numero: '987654321',
      validade: '2024-12-31',
      cvv: '456',
    }));
  });

  test('Should return 404 if cyclist is not found', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/2/cartao-credito',
      payload: {
        numero: '987654321',
        validade: '2024-12-31',
        cvv: '456',
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toBe('Ciclista não encontrado');
  });

  test('Should return 422 if credit card data is invalid', async () => {
    const app = build();
    const ciclista = {
      id: '1',
      nome: 'João',
      meioDePagamento: {
        numero: '123456789',
        validade: '2023-06-11',
        cvv: '123',
      },
      // Outros campos do ciclista
    };
    ciclistas.push(ciclista);

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/1/cartao-credito',
      payload: {
        numero: '987654321',
        validade: '2020-01-01',
        cvv: '456',
      },
    });

    expect(response.statusCode).toBe(422);
    expect(response.body).toBe('Dados inválidos. Forneça um cartão válido.');
  });
});
*/
});
