'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const getBicicleta = async () => {
    console.log("Chamando função getBicicleta");
    return axios.get(`https://gentle-bracelet-wasp.cyclic.app/bicicleta`)
        .then(response  => {
            log.info('Requisição getBicicleta retornada com sucesso');
            return response.data;
        }).catch(err => {
            log.error('Falha no requisição lista de biciletas');
            console.log("@@@@@@@@ error", err.response);
            return err.response.data;
        })
}

module.exports = {
    getBicicleta,
}