'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const getTranca = async () => {
  //  console.log("Chamando função getTranca");
    return axios.get(`https://gentle-bracelet-wasp.cyclic.app/tranca`)
        .then(response  => {
            log.info('Requisição de tranca retornada com sucesso');
  //          console.log("@@@@@#@@ response ", response.data);
            return response.data;
        }).catch(err => {
            log.error('Falha no requisição lista de trancas');
    //        console.log("@@@@@@@@ error", err.response.data);
            return err.response.data;
        })
}

module.exports = {
    getTranca,
}