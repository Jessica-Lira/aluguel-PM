'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const enviarEmail = async (email, assunto, mensagem) => {
    //console.log("Chamando função enviar email");
    const body = {email, assunto, mensagem}
    return axios.post('https://gentle-bee-shrug.cyclic.app/enviarEmail', body)
        .then(response  => {
            log.info('Pedido de email realizado');
           // console.log("@@@@@#@@ response ", response); 
            return response;
        }).catch(err => {
            log.error('Falha no pedido de email');
          //  console.log("@@@@@@@@ error", err.response);
            return err.response;
        })
}

module.exports = {
    enviarEmail,
}