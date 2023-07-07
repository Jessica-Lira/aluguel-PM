'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const bicicletaStatus = async (idBicicleta, acao) => {
    console.log("Chamando função alterar status bicicleta");
    const body = {idBicicleta, acao}
    return axios.post(`https://gentle-bracelet-wasp.cyclic.app/bicicleta/${idBicicleta}/status/${acao}`, body)
        .then(response  => {
            log.info('Status da bicicleta alterado com sucesso');
            console.log("@@@@@#@@ response ", response); 
            return response;
        }).catch(err => {
            log.error('Falha na requisição para alterar status bicicleta');
            console.log("@@@@@@@@ error", err.response);
            return err.response;
        })
}

module.exports = {
    bicicletaStatus,
}