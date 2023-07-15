'use strict';

const { build } = require('../src/app');
const {
  bodyCiclista, bodyCiclistaSemEmail, bodyCiclistaFormatoEmailErrado, bodyCiclistaInvalidPassaport,
  bodyCiclistaEmailJaEmUso, bodyCartaoInvalido, bodyCiclistaSemCampoNASCIMENTO, bodyCiclistaFormatoNASCIMENTOErrado,
  bodyCiclistaSemCampoNOME, bodyCiclistaSemCampoNACIONALIDADE, bodyCiclistaSemCampoSENHA, bodyCiclistaSemCampoCONFIRMARSENHA,
  bodyCiclistaSemCampoMEIODEPAGAMENTOSemTudo, bodyCiclistaSemCampoMEIODEPAGAMENTOSemNome, bodyCiclistaFormatoMEIODEPAGAMENTOErrado,
  bodyCiclistaSemCampoMEIODEPAGAMENTOSemNumero, bodyCiclistaSemCampoMEIODEPAGAMENTOSemValidade,
  bodyCiclistaSemCampoMEIODEPAGAMENTOSemCVV, bodyCiclistaUnmatchingPasswords, bodyCiclistaBrazilianWithCPF,
  bodyCiclistaNonBrazilianWithPassport, bodyDadosAtualizados
} = require("./ciclistaMock");
const app = build();
const axios = require('axios');
const { criarCiclista, atualizarCiclista } = require('../src/controller/ciclistasController.js');
const getEmailApi = require('../src/apis/getEmailApi.js');
const validaCartaoDeCreditoApi = require('../src/apis/validaCartaoDeCreditoApi.js');
const enviarEmailApi = require('../src/apis/enviarEmailApi.js');

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

describe('criarCiclista route test', () => {
  
  test('deve criar um novo ciclista com sucesso', async () => {

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    getEmailApi.getEmail = jest.fn().mockResolvedValue({ data: { exists: true } });
    validaCartaoDeCreditoApi.validaCartaoDeCredito = jest.fn().mockResolvedValue({ statusCode: 200, message: "ok" });
    enviarEmailApi.enviarEmail = jest.fn().mockResolvedValue({});

    await criarCiclista(bodyCiclista, reply);

    expect(reply.status).toHaveBeenCalled();
  });

  test('deve lidar com falha na chamada da API getEmailApi', async () => {

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    getEmailApi.getEmail = jest.fn().mockRejectedValue(new Error('Falha na chamada da API getEmailApi'));
    validaCartaoDeCreditoApi.validaCartaoDeCredito = jest.fn().mockResolvedValue({ statusCode: 200, message: "ok" });
    enviarEmailApi.enviarEmail = jest.fn().mockResolvedValue({});

    await criarCiclista(bodyCiclista, reply);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith('Requisição mal formada. Dados não fornecidos.');
  });

  test('Should return 404 erro when no data is provided', async () => {
    const response = await callCriarCiclista(undefined);
    expect(response.statusCode).toBe(404);
  });

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

describe('atualizarCiclista route test', () => {
/*
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
          validade: '2023-06',
          cvv: '487'
        },
        ativo: false,
      }
    });

    getEmailApi.getEmail = jest.fn().mockResolvedValue({ data: { exists: true } });
    validaCartaoDeCreditoApi.validaCartaoDeCredito = jest.fn().mockResolvedValue({ statusCode: 200, message: "ok" });
    enviarEmailApi.enviarEmail = jest.fn().mockResolvedValue({});

    await atualizarCiclista(response, reply);

    expect(reply.status).toHaveBeenCalledWith(200);
    //expect(response.statusCode).toBe(200);
    
  });
  */

  test('deve retornar 404 se o ciclista não for encontrado', async () => {
    const request = {
      params: {
        id: 'ciclista-id-inexistente'
      },
      body: {}
    };

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await atualizarCiclista(request, reply);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith('Ciclista não encontrado');
  });

  test('deve retornar 422 se os dados atualizados forem inválidos', async () => {
    const ciclistas = [{
      id: '4',
      nacionalidade: 'BR',
      cpf: '',
      passaporte: {}
    }];

    const request = {
      params: {
        id: '4'
      },
      body: {
        nacionalidade: 'BR',
        cpf: '',
        passaporte: {}
      }
    };

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    getEmailApi.getEmail = jest.fn().mockResolvedValue({ data: { exists: true } });
    validaCartaoDeCreditoApi.validaCartaoDeCredito = jest.fn().mockResolvedValue({ statusCode: 200, message: "ok" });
    enviarEmailApi.enviarEmail = jest.fn().mockResolvedValue({});

    await atualizarCiclista(request, reply, ciclistas);

    expect(reply.status).toHaveBeenCalledWith(422);
    expect(reply.send).toHaveBeenCalledWith('Dados inválidos. Preencha todos os campos obrigatórios corretamente.');
  });

  test('Should return 404 when invalid ID is provided', async () => {
    const app = build();
    const response = await app.inject({
      method: 'PUT',
      url: '/ciclistas/289',
    });
    expect(response.statusCode).toBe(404);
  });

/*
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
        
*/
});

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

describe('getBiciletaAlugada route test', () => {
  /*
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
*/
  test('Should return error 404 if cyclist dont exist', async () => {
    const app = build();
    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas/898/bicicletaAlugada'
    });
    expect(response.statusCode).toBe(404);
  });

});
/*
describe('postAluguel route test', () => {
  test('Should return success if Aluguel success', async () => {
    const app = build();
    const response = await app.inject({
      method: 'POST',
      url: '/aluguel',
      payload: {
        "ciclista": "3",
        "trancaInicio": "2000"
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