'use strict'

const ciclistasController = require('../controller/ciclistasController');

const routesCiclista = async (fastify) => {

    fastify.get('/ciclistas', ciclistasController.getCiclistas);
    fastify.post('/ciclistas', ciclistasController.criarCiclista);
    fastify.get('/ciclistas/:id', ciclistasController.getCiclistaById);
    fastify.put('/ciclistas/:id', ciclistasController.atualizarCiclista);
    fastify.post('/ciclistas/:id/ativar', ciclistasController.ativarCadastroCiclista);
    fastify.get('/ciclistas/:id/permite-aluguel', ciclistasController.permiteAluguel);
    fastify.get('/ciclistas/cartao-credito/:id', ciclistasController.getCartaoCredito);
    fastify.put('/ciclistas/atualizar-cartao/:id', ciclistasController.atualizarCartaoCredito);
    fastify.get('/ciclistas/getExisteEmail/:email', ciclistasController.getExisteEmail);
    fastify.get('/ciclistas/:id/bicicleta-alugada', ciclistasController.getBicicletaAlugada);
    
}

module.exports = routesCiclista;