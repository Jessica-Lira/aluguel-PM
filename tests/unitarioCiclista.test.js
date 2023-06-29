const { uuid } = require('uuidv4');
const serviceValidacaoCiclista = require('../src/services/validacoesCiclista');
const {bodyCiclista} = require("./ciclistaMock");
const {bodyCiclistaSemEmail} = require("./ciclistaMock");

console.log(bodyCiclista)
console.log(bodyCiclistaSemEmail)

test('VALIDAÇÃO de SENHA deve ser um SUCESSO', () => {
  expect(serviceValidacaoCiclista.verificarConfirmacaoSenha("senhateste","senhateste")).toHaveProperty('success', true);
});

test('VALIDAÇÃO de SENHA deve FALHAR', () => {
  expect(serviceValidacaoCiclista.verificarConfirmacaoSenha("senhateste","senhadiferente")).toHaveProperty('success', false);
});

test('VALIDAÇÃO de CAMPOS OBRIGATÓRIOS deve ser um SUCESSO', () => {
  expect(serviceValidacaoCiclista.verificarCamposObrigatorios(bodyCiclista,['email', 'nacionalidade', 'nascimento', 'nome', 'senha', 'confirmarSenha', 'meioDePagamento'])).toBe(true);
});

test('VALIDAÇÃO de CAMPOS OBRIGATÓRIOS deve FALHAR', () => {
  expect(serviceValidacaoCiclista.verificarCamposObrigatorios(bodyCiclistaSemEmail,['email', 'nacionalidade', 'nascimento', 'nome', 'senha', 'confirmarSenha','meioDePagamento'])).toBe(false);
});

test('VALIDAÇÃO de EMAIL deve ser um SUCESSO', () => {
  expect(serviceValidacaoCiclista.verificarEmail("teste@gmail.com")).toHaveProperty('success', true);
});

test('VALIDAÇÃO de EMAIL deve FALHAR', () => {
  expect(serviceValidacaoCiclista.verificarEmail("testegmail.com")).toHaveProperty('success', false);
});




