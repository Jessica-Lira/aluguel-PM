'use strict';

const axios = require('axios');
const log = require('../utils/logUtils');

const getPermiteAluguel = async (idCiclista) => {
   // console.log("Chamando função getPermiteAluguel");

    return axios.get(`https://sore-jade-clownfish-veil.cyclic.app/ciclistas/${idCiclista}/permiteAluguel`)
    // return axios.get(`http://localhost:3000/ciclistas/${idCiclista}/permiteAluguel`)
        .then(response  => {
            log.info('Requisição permiteAluguel retornada com sucesso');
           console.log("@@@@@#@@", response.data);
            return response.data;
        }).catch(err => {
            log.error('Falha na requisição permiteAluguel');
           // console.log("@@@@@@@@ error", err.response);
            return err.response.data;
        })
}

module.exports = {
    getPermiteAluguel,
}