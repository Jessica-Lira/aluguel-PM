'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const destrancarTranca = async (idTranca, bicicletaId) => {
    console.log("Chamando função alterar status tranca");
    const body = {idBicicleta: bicicletaId}
    return axios.post(`https://gentle-bracelet-wasp.cyclic.app/tranca/${idTranca}/destrancar`, body)
        .then(response  => {
            log.info('Status da tranca alterado com sucesso');
            console.log("@@@@@#@@ response ", response.status);
            return response.status;
        }).catch(err => {
            log.error('Falha na requisição para alterar status tranca');
            console.log("@@@@@@@@ error", err.response.data);
            return err.response.data;
        })
}

const trancarTranca = async (idTranca, bicicletaId) => {
    console.log("Chamando função alterar status tranca");
    const body = {idBicicleta: bicicletaId}
    return axios.post(`https://gentle-bracelet-wasp.cyclic.app/tranca/${idTranca}/trancar`, body)
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
    destrancarTranca,
    trancarTranca,
}