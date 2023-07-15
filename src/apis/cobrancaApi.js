'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const cobranca = async (valor, ciclista) => {
  //  console.log("Chamando função realizar cobranca");
    const body = {valor, ciclista}
    return axios.post('https://gentle-bee-shrug.cyclic.app/cobranca', body)
        .then(response  => {
            log.info('Pedido de cobranca realizado');
    //        console.log("@@@@@#@@ response ", response);
            return response;
        }).catch(err => {
            log.error('Falha no pedido de cobranca');
   //         console.log("@@@@@@@@ error", err.response);
            return err.response;
        })
}

module.exports = {
    cobranca,
}