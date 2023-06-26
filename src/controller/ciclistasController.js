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

    const resultadoEnvioEmail = await enviarEmail(ciclista.email, 'OS dados da sua conta foram atualizados!' + JSON.stringify(ciclista));
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
    return reply.status(200).send("Biblicleta alugada"); //retorna a bike?
  } else {
    return reply.status(200).send(null);
  }
} catch (error) {
  reply.code(500).send('Erro interno do servidor');
}

}

const postAluguel = async (request, reply) => {
  try {
  const { id } = request.params; 
  const ciclista = ciclistas.find(c => c.id === id);
  const numeroTranca = "01";  // ???

  const tranca = await verificarTranca(numeroTranca); // Verificar status da tranca
  if (!tranca || tranca.status != "ocupada") {
    return reply.status(422).send('Número da tranca inválido');
  } //falta o tranca nao responde

  const bicicleta = await lerBicicleta(tranca); // Ver qual bicicleta está na tranca
  if (!bicicleta) {
    return reply.status(404).send('Não existe bicicleta na tranca');
  }

  // Verificar se o ciclista pode pegar a bicicleta
  if (!ciclista) {
    return reply.status(404).send('Ciclista não encontrado');
  }

  if (ciclista.statusAluguel === true) { // Enviar email com dados do aluguel em andamento
    enviarEmail(ciclista.email, "Aluguel em andamento" + JSON.stringify(ciclista.aluguel)); 
    return reply.status(422).send('Ciclista já possui um aluguel em andamento');
  }
  
  if (ciclista.ativo === false) {
    return reply.status(422).send({
      codigo: '422', mensagem: 'Ciclista inativo. Ative sua conta.'
    });
  }

  if (bicicleta.status == 'em reparo') {
    return reply.status(404).send('Bicicleta em reparo');
  }

  const confirmacaoPagamento = await verificarPagamento(pagamento);
  if (!confirmacaoPagamento) { //falta o erro no pagamento
    return reply.status(404).send('Pagamento não autorizado');
  }

  bicicleta.status = 'em uso';
  tranca.status = 'livre';

  //cobranca
  const aluguel = {
    dataHoraRetirada: new Date(),
    numeroTranca,
    numeroBicicleta: bicicleta.numero,
    cartaoCobranca: ciclista.meioDePagamento.numero,
    ciclista: ciclista.nome,
    valorCobrado, // ???
  };

  enviarEmail(ciclista.email, "Aluguel solicitado" + JSON.stringify(aluguel));

  return reply.status(200).send('Aluguel realizado com sucesso' + JSON.stringify(aluguel));
} catch (error) {
  console.error(error);
  reply.status(500).send('Erro interno do servidor');
}
};

const postDevolucao = async (request, reply) => {
try {
  const { id } = request.params; 
  const ciclista = ciclistas.find(c => c.id === id);
  const numeroTranca = "01";  // ???
  const numeroBicicleta = "01";

  if (!ciclista.statusAluguel) {
    return reply.status(400).send('O ciclista não possui uma bicicleta alugada');
  }

  const tranca = await verificarTranca(numeroTranca); // Verificar status da tranca
  if (!tranca || tranca.status != "disponivel") {
    return reply.status(422).send('Número da tranca inválido');
  } //falta o tranca nao responde

  if (!numeroBicicleta || numeroBicicleta.status != 'em uso') {
    return reply.status(404).send('Número da bicicleta inválido');
  }

  const aluguel = {
    dataHoraRetirada: new Date(),
    numeroTranca,
    numeroBicicleta: bicicleta.numero,
    cartaoCobranca: ciclista.meioDePagamento.numero,
    ciclista: ciclista.nome, 
    valorCobrado: "valorTotalAPAgar",   // falta calcular o valor a pagar
  };

  const confirmacaoPagamento = await verificarPagamento(pagamento);
  if (!confirmacaoPagamento) { //falta o erro no pagamento
    return reply.status(404).send('Pagamento não autorizado');
  }

  bicicleta.status = 'disponivel';
  tranca.status = 'ocupada';

  enviarEmail(ciclista.email, "Aluguel" + JSON.stringify(aluguel));

  return reply.status(200).send('Bicicleta devolvida com sucesso');
} catch (error) {
  console.error(error);
  reply.status(422).send('Dados inválidos');
}
};

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
        //message: 'E-mail já está em uso por outro ciclista. Escolha um e-mail diferente.',
        emailExists: true,
      });
    } else {
      return reply.status(200).send({
        success: true,
        status: 200,
        //message: 'E-mail disponível.',
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
    return { 
      success: true, status: 200, message: 'E-mail enviado com sucesso.'
    };
};

//METODOS AUX DO POST ALUGUEL
const verificarTranca = async (numeroTranca) => {
  // Simular de verificacao da tranca - outro microsserviço
  if (!tranca) { return {success: false, status: 404, message: ''}  }
  return { success: true, status: 200 };
};

const lerBicicleta = async (tranca) => {
  // Simulacao de leitura da bicicleta na tranca - outro microsserviço

  //const bicicleta = bicicleta.lerBicicleta(tranca); - como simulamos isso?

  if (!bicicleta) { return {success: false, status: 404, message: ''}  }
  return { success: true, status: 200 };
};

const verificarPagamento = async (meioDePagamento, bicicleta) => {
  // Simulacao da cobrança
  //const pagamento = pagamento.realizarCobranca(meioDePagamento, bicicleta);

  if (!pagamento) { return {success: false, status: 404, message: ''}  }
  return { success: true, status: 200 };
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
  getBicicletaAlugada,
  postAluguel,
  postDevolucao
}