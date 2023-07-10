'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const getBicicleta = async () => {
    console.log("Chamando função getBicicleta");
    return axios.get(`https://gentle-bracelet-wasp.cyclic.app/bicicleta/${idTBicicleta}`)
        .then(response  => {
            log.info('Requisição retornada com sucesso');
            console.log("@@@@@#@@ response ", response);
            return response;
        }).catch(err => {
            log.error('Falha no requisição lista de biciletas');
            console.log("@@@@@@@@ error", err.response);
            return err.response;
        })
}

module.exports = {
    getBicicleta,
}