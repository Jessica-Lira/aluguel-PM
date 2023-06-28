const { v4: uuidv4 } = require('uuid');
const { ciclistas } = require('../dataCiclistas.js');

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

    if (novoCiclista === undefined) {
      return reply.status(404).send('Requisição mal formada. Dados não fornecidos.');
    }

    novoCiclista.id = uuidv4();
    novoCiclista.ativo = false; //STATUS ATIVO INATIVO OU ESPERANDO CONFIRMAÇÃO
    novoCiclista.statusAluguel = false;

    const resultadoVerificacaoEmail = await validacoes.verificarEmail(novoCiclista.email);
    //console.log("Email Resultado Verificacao Ciclista: "+resultadoVerificacaoEmail.success)
    if (!resultadoVerificacaoEmail.success) {
      return reply.status(resultadoVerificacaoEmail.status).send(resultadoVerificacaoEmail.message);
    }

    const camposObrigatorios = ['email', 'nacionalidade', 'nascimento', 'nome', 'senha', 'confirmarSenha', 'meioDePagamento'];
    if (!validacoes.verificarCamposObrigatorios(novoCiclista, camposObrigatorios)) {
      return reply.status(422).send('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.');
    }

    const regexDataNascimento = /^\d{4}-\d{2}-\d{2}$/; // Verificar formato da data de nascimento (yyyy-MM-dd)
    if (!regexDataNascimento.test(novoCiclista.nascimento)) {
      return reply.status(422).send('Formato inválido para a data de nascimento. Use o formato yyyy-MM-dd.');
    }

    if (novoCiclista.meioDePagamento.nomeTitular === '' || 
    novoCiclista.meioDePagamento.cvv ==='' || 
    novoCiclista.meioDePagamento.numero === '' || novoCiclista.meioDePagamento.validade ==='') {
      return reply.status(422).send('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.');
    }

    const regexDataValidadeCartao = /^\d{4}-\d{2}$/; 
    if (!regexDataValidadeCartao.test(novoCiclista.meioDePagamento.validade)) {
      return reply.status(422).send('Formato inválido para a data de validade do cartão. Use o formato yyyy-MM.');
    }
  
    const resultadoVerificacaoSenha = await validacoes.verificarConfirmacaoSenha(novoCiclista);
    if (!resultadoVerificacaoSenha.success) {
      return reply.status(resultadoVerificacaoSenha.status).send(resultadoVerificacaoSenha.message);
    }

    const resultadoVerificacaoNacionalidade = await validacoes.verificarNacionalidade(novoCiclista);
    if (!resultadoVerificacaoNacionalidade.success) {
      return reply.status(resultadoVerificacaoNacionalidade.status).send(resultadoVerificacaoNacionalidade.message);
    }
  
    const resultadoValidacaoCartao = await validacoes.validarCartaoCredito(novoCiclista.meioDePagamento);
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

    if (ciclista.ativo === 'true') {
      return reply.status(200).send('Ciclista já ativo.');
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
  const bicicleta = {
    "id": 0,
    "marca": "string",
    "modelo": "string",
    "ano": "string",
    "numero": 0,
    "status": "string"
  };

  if (!ciclista) {
    return reply.status(404).send('Ciclista não encontrado');
  }

  if (ciclista.statusAluguel === true) {
    return reply.status(200).send("Biblicleta alugada" + JSON.stringify(bicicleta)); 
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

  if (!tranca || tranca.status != "ocupada") {
    return reply.status(422).send('Número da tranca inválido');
  } //falta o tranca nao responde

  if (!bicicleta) {
    return reply.status(404).send('Não existe bicicleta na tranca');
  }

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

  //cobranca
  const aluguel = {
    dataHoraRetirada: new Date(),
    numeroTranca,
    numeroBicicleta: bicicleta.numero,
    cartaoCobranca: ciclista.meioDePagamento.numero,
    ciclista: ciclista.nome, 
    valorAluguel: "",
  };

  enviarEmail(ciclista.email, "Aluguel solicitado" + JSON.stringify(aluguel));
  bicicleta.status = 'em uso';
  tranca.status = 'livre';
  
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
  const tranca = { numeroTranca: "01", status: "disponivel" };
  const bicicleta = { numeroBicicleta: "01", status: "em uso" };
  const dataHoraDevolucao = moment().format('YYYY-MM-DD HH:mm:ss');

  if (!ciclista.statusAluguel) {
    return reply.status(400).send('O ciclista não possui uma bicicleta alugada');
  }

  if (tranca === undefined || tranca.status != "disponivel") {
    return reply.status(422).send('Número da tranca inválido');
  } //falta o tranca nao responde

  if (bicicleta === undefined || bicicleta.status != 'em uso') {
    return reply.status(404).send('Número da bicicleta inválido');
  }

  const valorAluguel = calcularValorAluguel("27/06/2023", "10:00", "27/06/2023", "13:30");
  console.log(`Valor do aluguel: R$ ${valorAluguel}`);

  const aluguel = {
    dataHoraRetirada: dataHoraRetirada,
    dataHoraDevolucao: new Date(),
    numeroTranca: tranca.numeroTranca,
    numeroBicicleta: bicicleta.numeroBicicleta,
    cartaoCobranca: ciclista.meioDePagamento.numero,
    ciclista: ciclista.nome, 
    valorAluguel: valorAluguel,
  };
  console.log( 'aluguel' + aluguel)

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

    const isEmailValid = validacoes.validarFormatoEmail(email);
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
    const isValid = validacoes.validarCartaoCredito(dadosAtualizados);
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

const enviarEmail = async (email, mensagem) => {
    // Envio de e-mail vi API

    return { 
      success: true, status: 200, message: 'E-mail enviado com sucesso.'
    };
};

//METODOS AUX DO POST ALUGUEL

const verificarPagamento = async (meioDePagamento, bicicleta) => {
  // Simulacao da cobrança
  //const pagamento = pagamento.realizarCobranca(meioDePagamento, bicicleta);

  const pagamento = true;

  if (!pagamento) { return {success: false, status: 404, message: ''}  }
  return { success: true, status: 200 };
};

const calcularValorAluguel = async(dataInicio, horaInicio, dataFim, horaFim) => {
  const formatoDataHora = "DD/MM/YYYY HH:mm";
  const dataHoraInicio = moment(dataInicio + " " + horaInicio, formatoDataHora);
  const dataHoraFim = moment(dataFim + " " + horaFim, formatoDataHora);

  const duracaoAluguel = moment.duration(dataHoraFim.diff(dataHoraInicio));
  const horasIniciais = moment.duration(2, 'hours');
  const meiaHoraExcedente = moment.duration(30, 'minutes');
  let valorTotal = 0;

  if (duracaoAluguel <= horasIniciais) {
    valorTotal = 0;
  } else {
    const duracaoExcedente = duracaoAluguel.subtract(horasIniciais);
    valorTotal = 10.0;
    while (duracaoExcedente > meiaHoraExcedente) {
      valorTotal += 5.0;
      duracaoExcedente.subtract(meiaHoraExcedente);
    }
  }
  return valorTotal.toFixed(2);
}

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
