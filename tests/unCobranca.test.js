'use strict';

const cobranca = require ('../src/apis/cobrancaApi.js')
const axios = require('axios');
jest.mock('axios');

describe('Cobranca Test route test', () => {

    test ('Should return success', async () => {
        axios.post = jest.fn().mockResolvedValue({statusCode: 200, message: "ok"});
        await expect(cobranca.cobranca({valor: "10", ciclista: "2"})).resolves.not.toThrow();
    });

});