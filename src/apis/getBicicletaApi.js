'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const getBicicleta = async () => {
   // console.log("Chamando função getBicicleta");
    return axios.get(`https://gentle-bracelet-wasp.cyclic.app/bicicleta`)
        .then(response  => {
            log.info('Requisição getBicicleta retornada com sucesso');
     //       console.log("@@@@@@@@@@@@@@@@@@@@@@@@@ getBike", response.data)
            return response.data;
        }).catch(err => {
            log.error('Falha no requisição lista de bicicletas');
      //      console.log("@@@@@@@@ error", err.response);
            return err.response.data;
        })
}

const getBicicletaByID = async (idBicicleta) => {
   // console.log("Chamando função getBicicletaID");
    return axios.get(`https://gentle-bracelet-wasp.cyclic.app/bicicleta/${idBicicleta}`)
        .then(response  => {
            log.info('Requisição getBicicletaID retornada com sucesso');
            return response.data;
        }).catch(err => {
            log.error('Falha no requisição lista de bicicletas');
       //     console.log("@@@@@@@@ error", err.response);
            return err.response.data;
        })
}

module.exports = {
    getBicicleta,
    getBicicletaByID
}