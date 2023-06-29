'use strict'

const ciclistasController = require('../controller/ciclistasController');

const routesCiclista = async (fastify) => {

    fastify.get('/ciclistas', ciclistasController.getCiclistas);
    fastify.post('/ciclistas', ciclistasController.criarCiclista);
    fastify.get('/ciclistas/:id', ciclistasController.getCiclistaById);
    fastify.put('/ciclistas/:id', ciclistasController.atualizarCiclista);
    fastify.post('/ciclistas/:id/ativar', ciclistasController.ativarCadastroCiclista);
    fastify.get('/ciclistas/:id/permiteAluguel', ciclistasController.permiteAluguel);
    fastify.get('/cartaoDeCredito/:id', ciclistasController.getCartaoCredito);
    fastify.put('/ciclistas/cartaoDeCredito/:id', ciclistasController.atualizarCartaoCredito);
    fastify.get('/ciclistas/existeEmail/:email', ciclistasController.getExisteEmail);
    fastify.get('/ciclistas/:id/bicicletaAlugada', ciclistasController.getBicicletaAlugada);
    fastify.post('/ciclistas/aluguel', ciclistasController.postAluguel);
    fastify.post('/ciclistas/devolucao', ciclistasController.postDevolucao);
}

module.exports = routesCiclista;
