const { v4: uuidv4 } = require('uuid');
const { ciclistas } = require('../data/dataCiclistas.js');
const validacoes = require('../services/validacoesCiclista.js')
const aluguel = require('../services/serviceAluguel.js')
const enviarEmailApi = require ('../apis/enviarEmailApi.js')
const validaCartaoDeCreditoApi = require ('../apis/validaCartaoDeCreditoApi.js')
const cobrancaApi = require ('../apis/cobrancaApi.js')
const filaCobrancaApi = require ('../apis/filaCobrancaApi.js')
const getBicicletaApi = require ('../apis/getBicicletaApi.js')
const getTrancaApi = require ('../apis/getTrancaApi.js')
const bicicletaStatusApi = require ('../apis/bicicletaStatusApi.js')
const trancaStatusApi = require ('../apis/trancaStatusApi.js')
const permiteAluguelApi = require("../apis/permiteAluguelApi");
const getEmailApi = require("../apis/getEmailApi");
const moment = require('moment');

let alugueis = [{
  "dataHoraRetirada": new Date().toISOString(),
  "dataHoraDevolucao": "",
  "numeroTranca": "123",
  "numeroBicicleta": 2000,
  "cartaoCobranca": "984602367621417541873846007875805616119812247741040998629140438970271355",
  "ciclista": "2",
  "valorAluguel": "10",
},];

let devolucoesAlugueis = [{
  "bicicleta": 123,
  "horaInicio": "2023-06-29T02:52:31.331Z",
  "trancaFim": 0,
  "horaFim": "2023-06-29T02:52:31.331Z",
  "cobranca": 0,
  "ciclista": 0
}];

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

    const verificaEmail = await getEmailApi.getEmail(novoCiclista.email);
    if (verificaEmail.message !== 'E-mail disponível.') {
      return reply.status(verificaEmail.status).send(verificaEmail.message);
    }

    const camposObrigatorios = ['email', 'nacionalidade', 'nascimento', 'nome', 'senha', 'confirmarSenha', 'meioDePagamento'];
    if (!validacoes.verificarCamposObrigatorios(novoCiclista, camposObrigatorios)) {
      return reply.status(422).send('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.');
    }

    if (!validacoes.validarDataNascimento(novoCiclista.nascimento)) {
      return reply.status(422).send('Formato inválido para a data de nascimento. Use o formato yyyy-MM-dd.');
    }

    if (!validacoes.validarMeioDePagamento(novoCiclista.meioDePagamento.nomeTitular, 
    novoCiclista.meioDePagamento.cvv,
    novoCiclista.meioDePagamento.numero, 
    novoCiclista.meioDePagamento.validade)) {
      return reply.status(422).send('Dados inválidos. Preencha todos os campos obrigatórios e tente novamente.');
    }

    if (!validacoes.validarDataValidadeCartao(novoCiclista.meioDePagamento.validade)) {
      return reply.status(422).send('Formato inválido para a data de validade do cartão. Use o formato yyyy-MM.');
    }
  
    const resultadoVerificacaoSenha = validacoes.verificarConfirmacaoSenha(novoCiclista.senha, novoCiclista.confirmarSenha);
    if (!resultadoVerificacaoSenha.success) {
      return reply.status(resultadoVerificacaoSenha.status).send(resultadoVerificacaoSenha.message);
    }

    const resultadoVerificacaoNacionalidade = validacoes.verificarNacionalidade(novoCiclista);
    if (!resultadoVerificacaoNacionalidade.success) {
      return reply.status(resultadoVerificacaoNacionalidade.status).send(resultadoVerificacaoNacionalidade.message);
    }

    const resultadoValidacaoCartao = await validaCartaoDeCreditoApi.validaCartaoDeCredito(novoCiclista.meioDePagamento.nomeTitular, novoCiclista.meioDePagamento.numero, novoCiclista.meioDePagamento.validade, novoCiclista.meioDePagamento.cvv);
    if (resultadoValidacaoCartao.status !== 200) {
      return reply.status(resultadoValidacaoCartao.status).send(resultadoValidacaoCartao.data + ". O cartão foi recusado. Entre com um cartão valido.");
    } 

    const resultadoEnvioEmail = await enviarEmailApi.enviarEmail(novoCiclista.email, "Bicicletário System", "Cadastro realizado."  + JSON.stringify(novoCiclista));
    if (resultadoEnvioEmail.status !== 200) {
      return reply.status(resultadoEnvioEmail.status).send(resultadoEnvioEmail.data + ". Email não enviado");
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

    const verificaEmail = await getEmailApi.getEmail(dadosAtualizados.email);
    if (verificaEmail.message !== 'E-mail disponível.') {
      return reply.status(verificaEmail.status).send(verificaEmail.message);
    }

    if (dadosAtualizados.senha !== dadosAtualizados.confirmarSenha) {
      return reply.status(422).send('Dados inválidos. A senha e a confirmação de senha devem ser iguais.');
    }

    const resultadoEnvioEmail = await enviarEmailApi.enviarEmail(ciclista.email, "Bicicletário System", "Os dados da sua conta foram atualizados!." + JSON.stringify(ciclista));
    if (resultadoEnvioEmail.status !== 200) {
      return reply.status(resultadoEnvioEmail.status).send(resultadoEnvioEmail.data + ". Email não enviado.");
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
    const requestId = uuidv4(); // x-id-requisicao
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

    if (aluguel.verificarStatus(ciclista.statusAluguel) === true) {
      return reply.status(422).send({
        codigo: '422',
        mensagem: 'Ciclista já possui um aluguel em andamento',
        email: ciclista.email,
        ciclistaId: ciclista.id
      });
    }

    if (aluguel.verificarStatus(ciclista.ativo) === false) {
      return reply.status(422).send({
        codigo: '422',
        mensagem: 'Ciclista inativo. Ative sua conta.'
      });
    }

    return reply.status(200).send({mensagem: "Escolha uma bike para alugar.", ciclista});

  } catch (error) {
    console.error(error);
    reply.status(500).send('Erro ao verificar aluguel de bicicleta');
  }
};

const getBicicletaAlugada = async (request, reply) => {
  try {
    const ciclistaId = request.params.id;
    const ciclista = ciclistas.find(c => c.id === ciclistaId);
    if(ciclista === undefined){
      return reply.status(404).send('Ciclista não encontrado');
    }
    const aluguelDoCiclista = alugueis.find(c => c.ciclista === ciclistaId);

    if(aluguelDoCiclista === undefined){
      return reply.status(404).send('Ciclista sem aluguel em andamento');
    }

    const bicicletas = await getBicicletaApi.getBicicleta();

    const bicicleta = bicicletas.find(b => b.numero === parseInt(aluguelDoCiclista.numeroBicicleta));

    const response = {
      message: "Biblicleta alugada",
      bicicleta
    }

    if (bicicleta.message === 'Bicicleta encontrada') {
      return reply.status(200).send(response);
    } else {
      return reply.status(200).send({});
    }
  } catch (error) {
    reply.code(500).send('Erro interno do servidor');
  }
}

const postAluguel = async (request, reply) => {

  try {
    const numeroTranca = request.body.trancaInicio;
    const ciclistaId = request.body.ciclista;

    const permiteAluguel = await permiteAluguelApi.getPermiteAluguel(ciclistaId);

    if (permiteAluguel.mensagem === 'Ciclista já possui um aluguel em andamento') { // Enviar email com dados do aluguel em andamento
      const aluguel = alugueis.find(a => a.ciclista === permiteAluguel.ciclistaId);
      await enviarEmailApi.enviarEmail(permiteAluguel.email, "Bicicletário System",  "Aluguel em andamento \n" + JSON.stringify(aluguel));
      return reply.status(422).send('Ciclista já possui um aluguel em andamento.');
    }

    const resultadoTranca = await getTrancaApi.getTranca();
    const tranca = resultadoTranca.find(t => t.numero === parseInt(numeroTranca))
    if (tranca === undefined) {
      return reply.status(404).send(JSON.stringify(tranca) + ". Número da tranca inválido");
    }

    if(tranca.bicicleta === 0){
      return reply.status(404).send('Não existe bicicleta na tranca');
    }

    const resultadoBicicleta = await getBicicletaApi.getBicicleta();
    const bicicleta = resultadoBicicleta.find(b => b.numero === parseInt(tranca.bicicleta));

    if (bicicleta.status === 'EM_REPARO') {
      return reply.status(404).send('Bicicleta em reparo');
    }

    //cobranca
    const confirmacaoPagamento = await cobrancaApi.cobranca(10, ciclistaId);
    if(confirmacaoPagamento.status !== "PAGA") {
      await filaCobrancaApi.filaCobranca(10, ciclistaId);
      return reply.status(404).send('Pagamento não autorizado');
    }

    const aluguel = {
      "dataHoraRetirada": new Date().toISOString(),
      "dataHoraDevolucao": "",
      "numeroTranca": tranca.numero,
      "numeroBicicleta": bicicleta.numero,
      "cartaoCobranca": permiteAluguel.ciclista.meioDePagamento.numero,
      "ciclista": permiteAluguel.ciclista.id,
      "valorAluguel": 10,
    };
    alugueis.push(aluguel);
    console.log("@@@@@@@@@@  ALUGUEIS  @@@@@@@@@2", alugueis);

    const respostaTranca = await trancaStatusApi.destrancarTranca(tranca.id, bicicleta.id);
    if(respostaTranca !== 200) {
      return reply.status(422).send("Tranca não responde");
    }

    const respostaBicicleta = await bicicletaStatusApi.bicicletaStatus(bicicleta.id, "EM_USO");
    if(respostaBicicleta.message !== 'Dados atualizados') {
      return reply.status(422).send("Erro ao atualizar status da bicicleta");
    }

    await enviarEmailApi.enviarEmail(permiteAluguel.ciclista.email, "Bicicletário System", "Aluguel solicitado \n" + JSON.stringify(aluguel));

    return reply.status(200).send('Aluguel solicitado com sucesso' );
  } catch (error) {
    console.error(error);
    reply.status(500).send('Erro interno do servidor');
  }
};

const postDevolucao = async (request, reply) => {
  console.log("CHAMANDO POST DEVOLUÇÃO");
  try {
    const { idTranca, idBicicleta, solicitouReparo } = request.body;

    const resultadoBicicleta = await getBicicletaApi.getBicicleta();
    const bicicleta = resultadoBicicleta.find(b => b.id === parseInt(idBicicleta));
    if(bicicleta === undefined) {
      return reply.status(422).send("Número da bicicleta inválido");
    }

    const aluguel = alugueis.find(a => a.numeroBicicleta === bicicleta.numero);
    console.log("!!!!!!!!aluguel", aluguel);
    const ciclista = ciclistas.find(c => c.id === aluguel.ciclista);

    const dataHoraDevolucao = new Date().toISOString();

    const temCobrancaExtra = calcularDiferencaEValor("2023-06-29T00:22:54.485Z", "2023-06-29T03:52:54.485Z");
    console.log("$@342342342342342342342342342342342", temCobrancaExtra)

    if(temCobrancaExtra !== 0){
      const realizarCobranca = await cobrancaApi.cobranca(temCobrancaExtra, ciclista.id);
      if(realizarCobranca.status !== 200) {
        await filaCobrancaApi.filaCobranca(temCobrancaExtra, ciclista.id);
        return reply.status(422).send("Erro na tentativa de cobrança. Cobrança enviada para fila.");
      }
    }

    alugueis = alugueis.filter(a => a.ciclista !== ciclista.id);
    aluguel.dataHoraDevolucao = dataHoraDevolucao;
    aluguel.valorAluguel = parseInt(aluguel.valorAluguel) + parseInt(temCobrancaExtra);

    ciclista.statusAluguel = false;
    const devolucao = {
      "bicicleta": idBicicleta,
      "horaInicio": aluguel.dataHoraRetirada,
      "trancaFim": idTranca,
      "horaFim": dataHoraDevolucao,
      "cobranca": temCobrancaExtra,
      "ciclista": 0
    }
    devolucoesAlugueis.push(devolucao);
    console.log("@@@@@@@@  DEVOLUÇÃO ALUGUEL @@@@@@", devolucoesAlugueis)

    const respostaTranca = await trancaStatusApi.trancarTranca(idTranca, idBicicleta);
    if(respostaTranca.status !== 200) {
      return reply.status(422).send("Não encontrado");
    }
    
    await enviarEmailApi.enviarEmail(ciclista.email, "Bicicletário System", "Devolução da bicicleta bem sucedida. " + JSON.stringify(aluguel))
    console.log("$$$$  ALUGUEL   $$$", aluguel);

    if(solicitouReparo === true) {
      await bicicletaStatusApi.bicicletaStatus(idBicicleta, "REPARO_SOLICITADO");
      return reply.status(200).send('Bicicleta foi devolvida e será reparada');
    }

    return reply.status(200).send('Bicicleta devolvida com sucesso '  + JSON.stringify(aluguel));
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

    const isValid= await validaCartaoDeCreditoApi.validaCartaoDeCredito(dadosAtualizados.nomeTitular, dadosAtualizados.numero, dadosAtualizados.validade, dadosAtualizados.cvv);
    if (isValid.status !== 200) {
      return reply.status(isValid.status).send(isValid.data + ". O cartão foi recusado. Entre com um cartão valido.");
    } 

    const resultadoEnvioEmail = await enviarEmailApi.enviarEmail(ciclista.email, "Bicicletário System", "Cartão atualizado."  + JSON.stringify(ciclista));
    if (resultadoEnvioEmail.status !== 200) {
      return reply.status(resultadoEnvioEmail.status).send(resultadoEnvioEmail.data + ". Email não enviado.");
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

/*
const alterarStatusTranca = async (idTranca, acao) => {
  //CHAMAR O ENDPOINT DO JAO ///POST tranca/{idTranca}/status/{acao} ////////////acao = DESTRANCAR OU TRANCAR
  const message = {
    "id": 0,
    "bicicleta": 0,
    "numero": 1,
    "localizacao": "string",
    "anoDeFabricacao": "string",
    "modelo": "string",
    "status": "string"
  }

  return {status: 200, message};
}

const alterarStatusBicicleta = async (idBicicleta, acao) => {
  const message =
  {
    "id": idBicicleta,
      "marca": "string",
      "modelo": "string",
      "ano": "string",
      "numero": 0,
      "status": "string"
  }

  return { status: 200, message }
}

const realizarCobranca = async (valor, ciclistaId) => {
  //CHAMAR O ENDPOINT DA MARIANA
  const message =     {
        "id": "b46d0649-1a5c-4489-86d8-2a8434e9e4e4",
        "status": "PAGA",
        "horaSolicitacao": "2023-06-28T00:19:45.384Z",
        "horaFinalizacao": "2023-06-28T00:19:48.146Z",
        "valor": valor,
        "ciclista": ciclistaId
      };
  return {status: 200, message};
}

const incluirCobrancaNaFila = async (valor, ciclistaId) => {
  //CHAMAR ENDPOINT MARIANA /filaCobranca
  return {status: 200, message:"IGUAL DO REALIZAR COBRANCA"};
}
*/
function calcularDiferencaEValor(dataHoraRetirada, dataHoraDevolucao) {
  const diferenca = moment(dataHoraDevolucao).diff(moment(dataHoraRetirada), 'hours');
  console.log("#################diferenca#############3", diferenca);
  let valor = 0;

  if (diferenca > 2) {
    const horasExcedidas = diferenca - 2;
    const intervaloCobranca = 0.5; // Intervalo de 30 minutos
    const valorAdicional = 5; // Valor adicional por intervalo excedido

    valor = horasExcedidas * (valorAdicional / intervaloCobranca);
  }

  return valor;
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
