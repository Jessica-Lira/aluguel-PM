const { ciclistas } = require('../dataCiclistas.js');

function verificarCamposObrigatorios(objeto, campos) {
    for (const campo of campos) {
      if (!objeto[campo]) {
        return false;
      }
    }
    return true;
};

function verificarEmail(email) {
    if (!email) {
      return ({
        success: false,
        status: 400,
        message: 'E-mail não fornecido',
      });
    }
  
    const isEmailValid = validarFormatoEmail(email);
    if (!isEmailValid) {
      return {
        success: false,
        status: 422,
        message: 'Formato de e-mail inválido',
      };
    }
  
    if (ciclistas.find((c) => c.email === email)) {
      return {
        success: false,
        status: 200,
        message: 'E-mail já está em uso por outro ciclista. Escolha um e-mail diferente.'
      };
    } else {
        return {
          success: true,
          status: 200
        };
    }
};

function validarFormatoEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

function verificarNacionalidade(novoCiclista) {
  const { nacionalidade } = novoCiclista;
  if (nacionalidade?.toUpperCase() === 'BR') { //MUDAR PRA BRASILEIRO OU ESTRANGEIRO
    if (novoCiclista.cpf === '' || novoCiclista.cpf.length !== 11) {
      return {
        success: false,
        status: 422,
        message: 'Dados inválidos. O CPF deve ser preenchido corretamente.',
      };
    }
  } else if (!novoCiclista.passaporte?.numero || !novoCiclista.passaporte?.pais) {
      return {
        success: false,
        status: 422,
        message: 'Dados inválidos. O passaporte deve ser preenchido corretamente.',
      };
  }
    return { success: true };
}; 

function verificarConfirmacaoSenha(novoCiclista) {
  const { senha, confirmarSenha } = novoCiclista;

  if (senha !== confirmarSenha) {
    return {
      success: false,
      status: 422,
      message: 'Dados inválidos. A senha e a confirmação de senha devem ser iguais.',
    };
  }
  return { success: true };
};

function validarCartaoCredito(cartao){
  // Lógica de validação do cartão de crédito real por API

  let cartaoAprovado = cartao.cvv !== "666";

  if (cartaoAprovado) {
    return { success: true, status: 200, message: '' };
  } else {
    return { success: false, status: 422, message: 'O cartão foi recusado. Entre com um cartão valido.' };
  }
};

function verificarCartaoCredito(cartao) {
  const { nomeTitular, numero, validade, cvv } = cartao;

  return (
    (!nomeTitular || typeof nomeTitular === 'string') ||
    (!numero || numero.length === 16) ||
    (!validade || typeof validade === 'string') ||
    (!cvv || cvv.length === 3)
  );
};

module.exports = {
    verificarCamposObrigatorios,
    verificarEmail,
    validarFormatoEmail,
    verificarNacionalidade,
    verificarConfirmacaoSenha,
    validarCartaoCredito,
    verificarCartaoCredito
};
