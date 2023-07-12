'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const destrancarTranca = async (idTranca, bicicletaId, acao) => {
    console.log("Chamando função alterar status tranca");
    const body = {idBicicleta: bicicletaId}
    return axios.post(`https://gentle-bracelet-wasp.cyclic.app/tranca/${idTranca}/status/${acao}`, body)
        .then(response  => {
            log.info('Status da tranca alterado com sucesso');
            console.log("@@@@@#@@ response ", response.data);
            return response.data;
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
            console.log("@@@@@#@@ response ", response.data);
            return response.data;
        }).catch(err => {
            log.error('Falha na requisição para alterar status tranca');
            console.log("@@@@@@@@ error", err.response.data);
            return err.response.data;
        })
}

module.exports = {
    destrancarTranca,
    trancarTranca,
}