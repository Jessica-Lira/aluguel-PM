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

//STATUS ATIVO INATIVO OU ESPERANDO CONFIRMAÇÃO
const criarCiclista = async (request, reply) => {
  try {
    const { body: novoCiclista } = request;

    if (novoCiclista === undefined) {
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
    if (novoCiclista.meioDePagamento.nomeTitular === '' || 
    novoCiclista.meioDePagamento.cvv ==='' || 
    novoCiclista.meioDePagamento.numero === '' || novoCiclista.meioDePagamento.validade ==='') {
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

    return reply.status(200).send(dadosCiclista);
  } catch (error) {
    reply.status(404).send({ codigo: "404", mensagem: "Requisição não encontrada."});
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

if ( (dadosAtualizados.nacionalidade === 'BR' && (!dadosAtualizados.cpf || dadosAtualizados.cpf.length !== 11)) || 
    (!dadosAtualizados.passaporte?.numero || !dadosAtualizados.passaporte?.pais)) {
  return reply.status(422).send('Dados inválidos. Preencha todos os campos obrigatórios corretamente.');
}

      if (dadosAtualizados.senha !== dadosAtualizados.confirmarSenha) {
        return reply.status(422).send('Dados inválidos. A senha e a confirmação de senha devem ser iguais.');
      }

      const resultadoEnvioEmail = await enviarEmail(ciclista.email, 'Email enviado!');
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
    const ciclista = ciclistas.find(c => c.id === id);

    if (!ciclista) {
      return reply.status(404).send({
        codigo: '404',
        mensagem: 'Ciclista não encontrado'
      });
    }
    
    if (ciclista.statusAluguel === true) {
      return reply.status(422).send({
        codigo: '422',
        mensagem: 'Ciclista já possui um aluguel em andamento'
      });
    }

    if (ciclista.ativo === false) {
      return reply.status(422).send({
        codigo: '422',
        mensagem: 'Ciclista inativo. Ative sua conta.'
      });
    }

    return reply.status(200).send("Escolha uma bike para alugar.");

  } catch (error) {
    console.error(error);
    reply.status(500).send('Erro ao verificar aluguel de bicicleta');
  }
};

const getBicicletaAlugada = async (request, reply) => {
try {
  const { id } = request.params;
  const ciclista = ciclistas.find(c => c.id === id);

  if (!ciclista) {
    return reply.status(404).send('Ciclista não encontrado');
  }

  if (ciclista.statusAluguel === true) {
    return reply.status(200).send("Biblicleta alugada");
  } else {
    return reply.status(200).send(null);
  }
} catch (error) {
  reply.code(500).send('Erro interno do servidor');
}

}

/// post aluguel
//a tranca com o status “ocupada”, a bicicleta com o status “disponível”.
//ciclista informa o número da tranca. 
//valida a tranca (Número da tranca inválido. / tranca nao responde)
//sistema le a bike na tranca (Não existe bicicleta na tranca.)
//verifica ciclista pode pegar bicicleta: verifica alguel/ativo - envia email com dados do aluguel atual E msg / bike status “em reparo”).
// cobranca 
//confirma pagamento (Erro no pagamento ou pagamento não autorizado)
//bike status em uso e tranca livre
//Devem ser registrados: a data/hora da retirada, o número da tranca, o número da bicicleta, o cartão usado para cobrança e o ciclista que a pegou.
// msg email para o ciclista informando os dados do aluguel da bicicleta -  incluindo horário, totem de bicicletas e o valor cobrado.

/// post devolucao
//-tranca deve possuir o status “disponível”, a bicicleta deve possuir o status “em uso”.
//valida o número da bicicleta.
//calcula o valor a pagar
//registra os dados da devolução da bicicleta - cobrança - Erro no pagamento ou pagamento não autorizado.
//altera o status da bicicleta para “disponível”.
//altera tranca alterando seu status para “ocupada”.
//mensagem para o ciclista informando os dados da devolução da bicicleta
//bicicleta devolvida - em reparo

/* ********                EMAIL                   ********    */
const getExisteEmail = async (request, reply) => {
  try {
    const { email } = request.params;

    if (!email) {
      return reply.status(400).send({
        success: false,
        status: 400,
        message: 'E-mail não fornecido',
      });
    }

    const isEmailValid = validateEmailFormat(email);
    if (!isEmailValid) {
      return reply.status(422).send({
        success: false,
        status: 422,
        message: 'Formato de e-mail inválido',
      });
    }

    const existingCyclist = ciclistas.find((c) => c.email === email);
    if (existingCyclist) {
      return reply.status(200).send({
        success: true,
        status: 200,
        message: 'E-mail já está em uso por outro ciclista. Escolha um e-mail diferente.',
        emailExists: true,
      });
    } else {
      return reply.status(200).send({
        success: true,
        status: 200,
        message: 'E-mail disponível.',
        emailExists: false,
      });
    }
  } catch (error) {
    console.error(error);
    reply.status(422).send({
      success: false,
      status: 422,
      message: 'Erro ao verificar a existência do e-mail',
    });
  }
};

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

    //cartao aprovado/reprovado
    const isValid = verificarCartaoCredito(dadosAtualizados);
    if (!isValid) {
      return reply.status(422).send('Dados inválidos. Forneça um cartão válido.');
    }

    const resultadoEnvioEmail = await enviarEmail(ciclista, 'Email enviado!');
    if (!resultadoEnvioEmail.success) {
      return reply.status(resultadoEnvioEmail.status).send(resultadoEnvioEmail.message);
    }

    ciclista.meioDePagamento = { ...ciclista.meioDePagamento, ...dadosAtualizados };

    return reply.status(200).send('Dados do cartão de crédito atualizados' + JSON.stringify(ciclista.meioDePagamento));
  } catch (error) {
    console.error(error);
    reply.status(422).send('Dados inválidos');

  }
};

// AUX metodos
const getDadosCiclista = (ciclista) => {
  return {
    id: ciclista.id,
    status: ciclista.ativo ? 'Ativo' : 'Inativo',
    nome: ciclista.nome,
    nascimento: ciclista.nascimento,
    cpf: ciclista.cpf,
    passaporte: {
      numero: ciclista.passaporte.numero,
      validade: ciclista.passaporte.validade,
      pais: ciclista.passaporte.pais
    },
    nacionalidade: ciclista.nacionalidade,
    email: ciclista.email,
    urlFotoDocumento: ciclista.urlFotoDocumento
  };
};

//MUDAR PRA BRASILEIRO OU ESTRANGEIRO
const verificarNacionalidade = async (novoCiclista) => {
  const { nacionalidade } = novoCiclista;
if (nacionalidade?.toUpperCase() === 'BR') {
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

const verificarConfirmacaoSenha = (novoCiclista) => {
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

const verificarCartaoCredito = (cartao) => {
  const { nomeTitular, numero, validade, cvv } = cartao;

  return (
    (!nomeTitular || typeof nomeTitular === 'string') ||
    (!numero || numero.length === 16) ||
    (!validade || typeof validade === 'string') ||
    (!cvv || cvv.length === 3)
  );
};

const validarCartaoCredito = async (cartao) => {
  // Lógica de validação do cartão de crédito real por API

  let cartaoAprovado = cartao.cvv !== "666";

  if (cartaoAprovado) {
    return { success: true, status: 200, message: '' };
  } else {
    return { success: false, status: 422, message: 'O cartão foi recusado. Entre com um cartão valido.' };
  }
};

const verificarCamposObrigatorios = (objeto, campos) => {
  for (const campo of campos) {
    if (!objeto[campo]) {
      return false;
    }
  }
  return true;
};

const enviarEmail = async (email, mensagem) => {

    // Envio de e-mail vi API
    return { success: true, status: 200, message: 'E-mail enviado com sucesso.'};

};


module.exports = {
  getCiclistas,
  criarCiclista,
  getCiclistaById,
  atualizarCiclista,
  ativarCadastroCiclista,
  permiteAluguel,
  getCartaoCredito,
  atualizarCartaoCredito,
  getExisteEmail,
  getBicicletaAlugada
}