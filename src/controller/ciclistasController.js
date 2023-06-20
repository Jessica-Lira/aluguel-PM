const { v4: uuidv4 } = require('uuid');
const { ciclistas } = require('../data.js');

const getCiclistas = async (request, reply) => { //metodo aux , nao tem cdu
  try {
    return reply.status(200).send(ciclistas);
  } catch (error) {
    console.error(error);
    reply.status(404).send('Erro ao obter ciclistas');
  }
};

const criarCiclista = async (request, reply) => {
  try {
    const { body: novoCiclista } = request;

    if (!novoCiclista) {
      return reply.status(404).send('Requisição mal formada. Dados não fornecidos.');
    }

    novoCiclista.id = uuidv4();
    novoCiclista.ativo = false;
    novoCiclista.statusAluguel = false;

    const resultadoVerificacaoEmail = await verificarEmail(novoCiclista.email);
    if (!resultadoVerificacaoEmail.success) {
      return reply.status(resultadoVerificacaoEmail.status).send(resultadoVerificacaoEmail.message);
    }

    const camposObrigatorios = ['email', 'nacionalidade', 'nascimento', 'nome', 'senha', 'confirmarSenha', 'meioDePagamento'];
    if (!verificarCamposObrigatorios(novoCiclista, camposObrigatorios)) {
      return reply.status(422).send('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.');
    }
  
    const resultadoVerificacaoSenha = await verificarConfirmacaoSenha(novoCiclista);
    if (!resultadoVerificacaoSenha.success) {
      return reply.status(resultadoVerificacaoSenha.status).send(resultadoVerificacaoSenha.message);
    }

    const resultadoVerificacaoNacionalidade = await verificarNacionalidade(novoCiclista);
    if (!resultadoVerificacaoNacionalidade.success) {
      return reply.status(resultadoVerificacaoNacionalidade.status).send(resultadoVerificacaoNacionalidade.message);
    }
  
    const resultadoValidacaoCartao = await validarCartaoCredito(novoCiclista.meioDePagamento);
    if (!resultadoValidacaoCartao.success) {
      return reply.status(resultadoValidacaoCartao.status).send(resultadoValidacaoCartao.message);
    }

      const resultadoEnvioEmail = await enviarEmail(novoCiclista.email, 'Email enviado!');
      if (!resultadoEnvioEmail.success) {
        return reply.status(resultadoEnvioEmail.status).send(resultadoEnvioEmail.message);
      }

      ciclistas.push(novoCiclista);
      return reply.status(201).send(novoCiclista);
    }
  catch (error) {
    console.error(error);
    reply.status(404).send('Requisição mal formada');
  }
};

const getCiclistaById = async(request, reply) => {
  try {
    const { id } = request.params;
    const ciclista = ciclistas.find(c => c.id === id);

    if (!ciclista) {
      return reply.status(422).send({
        codigo: "422",
        mensagem: "Dados inválidos. Por favor entre com um ciclista valido."
      });
    }

    const dadosCiclista = getDadosCiclista(ciclista);

    return reply.send(dadosCiclista);
  } catch (error) {
    console.error(error);
    reply.status(404).send({
      codigo: "404",
      mensagem: "Requisição não encontrada."
    });
  }
};

const atualizarCiclista = async(request, reply) => {
  try {
    const { id } = request.params;
    const dadosAtualizados = request.body;
    const ciclista = ciclistas.find(c => c.id === id);

    if (!ciclista) {
      return reply.status(404).send('Ciclista não encontrado');
    }

if (dadosAtualizados.nacionalidade === 'BR' && (!dadosAtualizados.cpf || dadosAtualizados.cpf.length !== 11) || 
    (!dadosAtualizados.passaporte?.numero || !dadosAtualizados.passaporte?.pais)) {
  return reply.status(422).send('Dados inválidos. Preencha todos os campos obrigatórios corretamente.');
}

      if (dadosAtualizados.senha !== dadosAtualizados.confirmarSenha) {
        return reply.status(422).send('Dados inválidos. A senha e a confirmação de senha devem ser iguais.');
      }

      const resultadoEnvioEmail = await enviarEmail(novoCiclista.email, 'Email enviado!');
      if (!resultadoEnvioEmail.success) {
        return reply.status(resultadoEnvioEmail.status).send(resultadoEnvioEmail.message);
      }

      ciclistas[ciclistas.indexOf(ciclista)] = { ...ciclista, ...dadosAtualizados };

      return reply.status(200).send('Dados atualizados' + JSON.stringify(ciclista));
    } 
   catch (error) {
      console.error(error);
      reply.status(422).send('Dados inválidos');
    }
};

const ativarCadastroCiclista = async (request, reply) => {
  try {
    const { id } = request.params;
    const ciclista = ciclistas.find(c => c.id === id);

    if (!ciclista) {
      return reply.status(404).send('Ciclista não encontrado');
    }

    ciclista.ativo = true;
    ciclista.dataConfirmacaoAtivacao = new Date(); // Registrar a data/hora da confirmação

    return reply.status(200).send('Ciclista ativado' + JSON.stringify(ciclista))
  } catch (error) {
    console.error(error);
    reply.status(422).send('Dados inválidos');
  }
};

const permiteAluguel = async (request, reply) => {
  try {
    const { id } = request.params;
    const ciclista = ciclistas.find(c => c.id === id && c.ativo);

    if (!ciclista) {
      return reply.status(404).send({
        codigo: '404',
        mensagem: 'Ciclista não encontrado'
      });
    }
    
    const opcaoAluguel = ciclista.statusAluguel;
    if (opcaoAluguel === true) {
      return reply.status(422).send({
        codigo: '422',
        mensagem: 'Ciclista já possui um aluguel em andamento'
      });
    }

    const cadastroAtivo = !!ciclista.ativo;

    return reply.status(200).send(cadastroAtivo);

  } catch (error) {
    console.error(error);
    reply.status(500).send('Erro ao verificar aluguel de bicicleta');
  }
};

/* ********                EMAIL                   ********    */
const verificarEmail = async (email) => {
  if (!email) {
    return ({
      success: false,
      status: 400,
      message: 'E-mail não fornecido',
    });
  }

  const isEmailValid = validateEmailFormat(email);
  if (!isEmailValid) {
    return {
      success: false,
      status: 422,
      message: 'Formato de e-mail inválido',
    };
  }

  const emailEmUso = ciclistas.find((c) => c.email === email);
  if (emailEmUso) {
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

const validateEmailFormat = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/* ********                CARTAO                   ********    */
const getCartaoCredito = async (request, reply) => {
  try {
    const { id } = request.params;
    const ciclista = ciclistas.find(c => c.id === id);

    if (!ciclista) {
      return reply.status(404).send('Ciclista não encontrado');
    }

    const cartaoCredito = ciclista.meioDePagamento;

    return reply.status(200).send(cartaoCredito);
  } catch (error) {
    console.error(error);
    reply.status(422).send('Dados inválidos');
  }
};

const atualizarCartaoCredito = async (request, reply) => {
  try {
    const { id } = request.params;
    const dadosAtualizados = request.body;
    const ciclista = ciclistas.find(c => c.id === id);

    if (!ciclista) {
      return reply.status(404).send('Ciclista não encontrado');
    }

    //validar cartao
    const isValid = verificarCartaoCredito(dadosAtualizados);
    if (!isValid) {
      return reply.status(422).send('Dados inválidos. Forneça um cartão válido.');
    }

    //enviar email

    ciclista.meioDePagamento = { ...ciclista.meioDePagamento, ...dadosAtualizados };

    return reply.status(200).send('Dados do cartão de crédito atualizados' + JSON.stringify(ciclista.meioDePagamento));
  } catch (error) {
    console.error(error);
    reply.status(422).send('Dados inválidos');
  }
};


module.exports = {
  getCiclistas,
  criarCiclista,
  getCiclistaById,
  atualizarCiclista,
  ativarCadastroCiclista,
  permiteAluguel,
  getCartaoCredito,
  atualizarCartaoCredito
}
