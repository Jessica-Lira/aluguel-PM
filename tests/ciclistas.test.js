'use strict';

const { build } = require('../src/app');

describe('getCiclistas route test', () => {
  test('Should return the list of cyclists when called', async () => {
    const app = build();

    const response = await app.inject({
      method: 'GET',
      url: '/ciclistas'
    });

    expect(response.statusCode).toBe(200);
  });
});