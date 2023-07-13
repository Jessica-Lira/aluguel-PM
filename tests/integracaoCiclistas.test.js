'use strict';

const { build } = require('../src/app');
const {
  bodyCiclista, bodyCiclistaSemEmail, bodyCiclistaFormatoEmailErrado, bodyCiclistaInvalidPassaport,
  bodyCiclistaEmailJaEmUso, bodyCartaoInvalido, bodyCiclistaSemCampoNASCIMENTO, bodyCiclistaFormatoNASCIMENTOErrado,
  bodyCiclistaSemCampoNOME, bodyCiclistaSemCampoNACIONALIDADE, bodyCiclistaSemCampoSENHA, bodyCiclistaSemCampoCONFIRMARSENHA,
  bodyCiclistaSemCampoMEIODEPAGAMENTOSemTudo, bodyCiclistaSemCampoMEIODEPAGAMENTOSemNome, bodyCiclistaFormatoMEIODEPAGAMENTOErrado,
  bodyCiclistaSemCampoMEIODEPAGAMENTOSemNumero, bodyCiclistaSemCampoMEIODEPAGAMENTOSemValidade,
  bodyCiclistaSemCampoMEIODEPAGAMENTOSemCVV, bodyCiclistaUnmatchingPasswords, bodyCiclistaBrazilianWithCPF,
  bodyCiclistaNonBrazilianWithPassport,
} = require("./ciclistaMock");
const app = build();

const axios = require('axios');
jest.mock('axios');

const callCriarCiclista = async (body) => {
  return await app.inject({
    method: 'POST',
    url: '/ciclistas',
    payload: body
  })
};

const callGetCiclistas = async () => {
  return await app.inject({
    method: 'GET',
    url: '/ciclistas'
  })
}

describe('getCiclistas route test', () => {
  test('Should return the list of cyclists when called', async () => {
    const response = await callGetCiclistas();

    expect(response.statusCode).toBe(200);
  });

  test('Should return error when wrong url called', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/ciclista'
    });

    expect(response.statusCode).toBe(404);
  });

});
/*
describe('criarCiclista route test', () => {
  test('Should create a new cyclist when all data is provided', async () => {
    const response = await callCriarCiclista(bodyCiclista);
    expect(response.statusCode).toBe(201);
  });

  test('Should return 404 erro when no data is provided', async () => {
    const response = await callCriarCiclista(undefined);

    expect(response.statusCode).toBe(404);
  });

  test('Should return 400 when without EMAIL', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemEmail);

    expect(response.statusCode).toBe(400);
  });

  test('Should return 422 when wrong EMAIL format', async () => {
    const response = await callCriarCiclista(bodyCiclistaFormatoEmailErrado);

    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 for non-Brazilian nationality with invalid passport', async () => {
    const response = await callCriarCiclista(bodyCiclistaInvalidPassaport);
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 for invalid credit card', async () => {
    const response = await callCriarCiclista(bodyCartaoInvalido);
    expect(response.statusCode).toBe(422);
  });

  test('Should return message when EMAIL is used by another cyclist', async () => {
    const response = await callCriarCiclista(bodyCiclistaEmailJaEmUso);

    expect(response.body).toBe('E-mail já está em uso por outro ciclista. Escolha um e-mail diferente.')
    expect(response.statusCode).toBe(200);
  });

  test('Should return 422 when without NASCIMENTO', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemCampoNASCIMENTO);

    expect(response.body).toBe('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when invalid NASCIMENTO format', async () => {
    const response = await callCriarCiclista(bodyCiclistaFormatoNASCIMENTOErrado);

    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without NOME', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemCampoNOME);

    expect(response.body).toBe('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without NACIONALIDADE', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemCampoNACIONALIDADE);

    expect(response.body).toBe('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without SENHA', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemCampoSENHA);

    expect(response.body).toBe('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without CONFIRMARSENHA', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemCampoCONFIRMARSENHA);

    expect(response.body).toBe('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without MEIODEPAGAMENTO - all', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemCampoMEIODEPAGAMENTOSemTudo);

    expect(response.body).toBe('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without MEIODEPAGAMENTO - nome titular', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemCampoMEIODEPAGAMENTOSemNome);

    expect(response.body).toBe('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without MEIODEPAGAMENTO - numero', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemCampoMEIODEPAGAMENTOSemNumero);

    expect(response.body).toBe('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without MEIODEPAGAMENTO - validade', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemCampoMEIODEPAGAMENTOSemValidade);

    expect(response.body).toBe('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 invalid format MEIODEPAGAMENTO - validade', async () => {
    const response = await callCriarCiclista(bodyCiclistaFormatoMEIODEPAGAMENTOErrado); 

    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 when without MEIODEPAGAMENTO - cvv', async () => {
    const response = await callCriarCiclista(bodyCiclistaSemCampoMEIODEPAGAMENTOSemCVV);

    expect(response.body).toBe('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 for unmatching passwords', async () => {
    const response = await callCriarCiclista(bodyCiclistaUnmatchingPasswords);

    expect(response.body).toBe('Dados inválidos. A senha e a confirmação de senha devem ser iguais.')
    expect(response.statusCode).toBe(422);
  });

  test('Should return success for Brazilian nationality with valid CPF', async () => {
    const response = await callCriarCiclista(bodyCiclistaBrazilianWithCPF);

    expect(response.statusCode).toBe(201);
  });

  test('Should return success for non-Brazilian nationality with valid passport', async () => {
    const response = await callCriarCiclista(bodyCiclistaNonBrazilianWithPassport);

    expect(response.statusCode).toBe(200);
  });
});
*/
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

  test('Should return error 422 when search wrong id ciclista', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/10',
      payload: {
        id: 10
      }});

    expect(response.statusCode).toBe(422);
  });

  test('Should return error 404 when wrong url called', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclista'
    });

    expect(response.statusCode).toBe(404);
  });
});
/*
describe('atualizarCiclista route test', () => {
  test('Should update cyclist when valid data is provided', async () => {
    const app = build();
    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/4',
      payload: {
        id: '777',
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
          numero: '1234512345123456',
          validade: '2023-06-11',
          cvv: '487'
        },
        ativo: false,
      }
    });
    expect(response.statusCode).toBe(200);
  });

  test('Should not update cyclist when invalid id is provided', async () => {
    const app = build();
    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/88',
      payload: {
        id: '15',
        nome: 'john doe',
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

  test('Should not update cyclist when without fields', async () => {
    const app = build();
    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/2',
      payload: {
        id: '2',
        nome: '',
        nascimento: '',
        cpf: '',
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

  test('Should return 422 for unmatching passwords', async () => {
    const app = build();
    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/5',
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

  test('Should return success for non Brazilian with valid passport', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/5',
      payload: {
        id: '5',
        nome: "Ciclista F",
        nascimento: "2023-06-11",
        cpf: "",
        passaporte: {
          numero: "string",
          validade: "2023-06-11",
          pais: "TX"
        },
        nacionalidade: "PT",
        email: "ciclistaf@example.com",
        urlFotoDocumento: "string",
        senha: "string",
        confirmarSenha: "string",
        meioDePagamento: {
          nomeTitular: "ciclista E",
          numero: "1234567812345678",
          validade: "2023-06-11",
          cvv: "455"
        },
        ativo: false,
      }
    });

    expect(response.statusCode).toBe(200);
  });

});
*/
describe('ativarCadastroCiclista route test', () => {
  test('Should activate a cyclist when valid ID is provided and cyclist is not active', async () => {
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

  test('Should return success if cyclist is active', async () => {
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
  test('Should allow rental for an active cyclist SEM ALUGUEL EM ANDAMENTO', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/3/permiteAluguel',
    });
    expect(response.statusCode).toBe(200);
  });

  test('Should return 404 for non-existent cyclist', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/20/permiteAluguel',
    });
    expect(response.statusCode).toBe(404);
  });

  test('Should return 422 for cyclist COM ALUGUEL EM ANDAMENTO', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/2/permiteAluguel',
    });
    expect(response.statusCode).toBe(422);
  });

  test('Should return 422 for cyclist COM CONTA INATIVA mesmo sem aluguel em andamento', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/5/permiteAluguel',
    });
    expect(response.statusCode).toBe(422);
  });

});

describe('getCartaoCredito route test', () => {
  test('Should return the credit card information of a cyclist', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/cartaoDeCredito/1',
    });
    expect(response.statusCode).toBe(200);
  });

  test('Should return 404 if cyclist is not found', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/cartaoDeCredito/20',
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toBe('Ciclista não encontrado');
  });
});
/*
describe('atualizarCartaoCredito route test', () => {
  test('Should update the credit card information of a cyclist', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/cartaoDeCredito/1',
      payload: {
        nomeTitular: 'Novo nome',
        numero: '4242424242424242',
        validade: '2024-12',
        cvv: '456',
      },
    });

    expect(response.statusCode).toBe(200);
  });

  test('Should return 404 if cyclist is not found', async () => {
    const app = build();

    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/cartaoDeCredito/34',
      payload: {
        nomeTitular: 'Novo nome',
        numero: '987654321',
        validade: '2024-12-31',
        cvv: '456',
      },
    });

    expect(response.statusCode).toBe(404);
  });
});
*/
describe('getExisteEmail route test', () => {
  test('Should return sucess if email exists in a cyclist', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/existeEmail/user@example.com',
    });
    expect(response.statusCode).toBe(200);
  });

  test('Should return sucess if email available', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/existeEmail/email@example.com',
    });
    expect(response.statusCode).toBe(200);
  });

  test('Should return 400 if without email', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/existeEmail/',
    });
    expect(response.statusCode).toBe(400);
  });

  test('Should return 422 if with wrong email format', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/existeEmail/user.com',
    });
    expect(response.statusCode).toBe(422);
  });

});
/*
describe('getBiciletaAlugada route test', () => {
  test('Should return sucess if cyclist have a rent', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/2/bicicletaAlugada',
    });
    expect(response.statusCode).toBe(200);
  });

  test('Should return sucess if cyclist dont have a rent', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/1/bicicletaAlugada',
    });
    expect(response.statusCode).toBe(200);
  });

  test('Should return error 404 if cyclist dont exist', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/898/bicicletaAlugada'
    });
    expect(response.statusCode).toBe(404);
  });

});

describe('postAluguel route test', () => {
  test('Should return success if Aluguel success', async () => {
    const app = build();
    const response = await app.inject({
      method: 'POST',
      url: '/aluguel',
      payload: {
        "ciclista": "3",
        "trancaInicio": "0"
      }
    });
    expect(response.body).toBe('Aluguel realizado com sucesso')
    expect(response.statusCode).toBe(200);
  });

  test('Should return message if Aluguel fail because another aluguel exist', async () => {
    const app = build();
    const response = await app.inject({
      method: 'POST',
      url: '/aluguel',
      payload: {
        "ciclista": "2",
        "trancaInicio": "0"
      }
    });
    expect(response.body).toBe('Ciclista já possui um aluguel em andamento')
  });

  test('Should return message if Aluguel fail because cyclist is not active', async () => {
    const app = build();
    const response = await app.inject({
      method: 'POST',
      url: '/aluguel',
      payload: {
        "ciclista": "5",
        "trancaInicio": "0"
      }
    });
    expect(response.statusCode).toBe(422);
  });

  test('Should return message if Aluguel fail because cyclist dont exist', async () => {
    const app = build();
    const response = await app.inject({
      method: 'POST',
      url: '/aluguel',
      payload: {
        "ciclista": "6",
        "trancaInicio": "0"
      }
    });
    expect(response.body).toBe('Ciclista não encontrado')
  });

})

describe('postDevolucao route test', () => {
  test('Should return sucess if Devolucao sucess', async () => {
    const app = build();
    const response = await app.inject({
      method: 'POST',
      url: '/devolucao',
      payload: {
        "idTranca": 0,
        "idBicicleta": "1"
      }
    });
    expect(response.statusCode).toBe(200);
  });  

  test('Should return 422 if Devolucao failed', async () => {
    const app = build();
    const response = await app.inject({
      method: 'POST',
      url: '/devolucao',
      payload: {
        "idTranca": 0,
        "idBicicleta": "2"
      }
    });
    expect(response.statusCode).toBe(422);
  });  
})
*/