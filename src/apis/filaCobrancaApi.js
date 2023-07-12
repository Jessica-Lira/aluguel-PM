'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const filaCobranca = async (valor, ciclista) => {
    console.log("Chamando função colocar na fila cobranca");
    const body = {valor, ciclista}
    return axios.post('https://gentle-bee-shrug.cyclic.app/filaCobranca', body)
        .then(response  => {
            log.info('Adicionado na fila de cobranca com sucesso');
            console.log("@@@@@#@@ response ", response.data);
            return response;
        }).catch(err => {
            log.error('Falha no pedido de adicionar na fila de cobranca');
            console.log("@@@@@@@@ error", err.response.data);
            return err.response.data;
        })
}

module.exports = {
    filaCobranca,
}