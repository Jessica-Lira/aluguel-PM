'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const trancaStatus = async (idTranca, acao) => {
    console.log("Chamando função alterar status tranca");
    const body = {idTranca, acao}
    return axios.post(`https://gentle-bracelet-wasp.cyclic.app/tranca/${idTranca}/status/${acao}`, body)
        .then(response  => {
            log.info('Status da tranca alterado com sucesso');
            console.log("@@@@@#@@ response ", response); 
            return response;
        }).catch(err => {
            log.error('Falha na requisição para alterar status tranca');
            console.log("@@@@@@@@ error", err.response);
            return err.response;
        })
}

module.exports = {
    trancaStatus,
}