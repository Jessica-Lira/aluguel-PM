const { uuid } = require('uuidv4');
const serviceValidacaoCiclista = require('../src/services/validacoesCiclista');
const {bodyCiclista} = require("./ciclistaMock");
const {bodyCiclistaSemEmail} = require("./ciclistaMock");

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

test('VALIDAÇÃO de DATA NASCIMENTO deve ser um SUCESSO', () => {
  //console.log(serviceValidacaoCiclista.validarDataNascimento("1990-03-13"))
  expect(serviceValidacaoCiclista.validarDataNascimento("1990-03-13")).toBe(true)
});

test('VALIDAÇÃO de DATA NASCIMENTO  deve FALHAR', () => {
  //console.log(serviceValidacaoCiclista.validarDataNascimento("13-04-1990"))
  expect(serviceValidacaoCiclista.validarDataNascimento("13-04-1990")).toBe(false)
});

test('VALIDAÇÃO de MEIO DE PAGAMENTO deve ser um SUCESSO', () => {
  expect(serviceValidacaoCiclista.validarMeioDePagamento("string",
  "984602367621417541873846007875805616119812247741040998629140438970271355",
  "2023-06-11",
  "4857")).toBe(true)
});

test('VALIDAÇÃO de MEIO DE PAGAMENTO  deve FALHAR', () => {
  expect(serviceValidacaoCiclista.validarMeioDePagamento("","","","")).toBe(false)
});

test('VALIDAÇÃO de DATA VALIDADE CARTAO deve ser um SUCESSO', () => {
  expect(serviceValidacaoCiclista.validarDataValidadeCartao("2028-12")).toBe(true)
});

test('VALIDAÇÃO de DATA VALIDADE CARTAO  deve FALHAR', () => {
  expect(serviceValidacaoCiclista.validarDataValidadeCartao("12-2028")).toBe(false)
});




