const { v4: uuidv4 } = require('uuid');
const { v1: uuidv1 } = require('uuid');
const { funcionarios } = require('../data.js');

const getFuncionarios = async (request, reply) => {
    try {
      return reply.status(200).send(funcionarios)
    } catch (error) {
      console.error(error)
      reply.status(500).send('Erro ao obter funcionarios')
    }
};

const criarFuncionario = async (request, reply) => {
    try {
      const novoFuncionario = request.body
  
      // Inserindo ID e Matricula ao criar Funcionario
      novoFuncionario.id = uuidv4();
      novoFuncionario.matricula = uuidv1();

      //Verificando campos obrigatórios
      const camposObrigatorios = ['email', 'nome', 'senha', 'confirmacaoSenha'];
      const resultadoVerificacaoCamposObrigatorios = await verificarCamposObrigatorios(novoFuncionario, camposObrigatorios);
      if (!resultadoVerificacaoCamposObrigatorios.success) {
        return reply.status(resultadoVerificacaoCamposObrigatorios.status).send(resultadoVerificacaoCamposObrigatorios);
      }
  
      //Verificando Email
      const resultadoVerificacaoEmail = await verificarEmail(novoFuncionario.email);
      if (!resultadoVerificacaoEmail.success) {
        //console.log("Verificando Email na criação de Funcionario")
        return reply.status(resultadoVerificacaoEmail.status).send(resultadoVerificacaoEmail);
      }

      //Verificando campos de senha
      const resultadoVerificacaoSenha = await verificarConfirmacaoSenha(novoFuncionario);
      if (!resultadoVerificacaoSenha.success) {
        return reply.status(resultadoVerificacaoSenha.status).send(resultadoVerificacaoSenha);
      }

      funcionarios.push(novoFuncionario)

      reply.status(200).send({
        codigo: "200",
        mensagem: "Dados Cadastrados."
      });
  
      return reply.send(novoFuncionario)
    } catch (error) {
      //console.error(error)
      reply.status(500).send('Erro ao criar funcionario')
    }
  }

const getFuncionarioById = async (request, reply) => {
    try {
        const id = request.params.id

        const resultadoVerificacaoID = await validarID(id);
        if (!resultadoVerificacaoID.success) {
          //console.log("Verificando ID valido no GET")
          return reply.status(resultadoVerificacaoID.status).send(resultadoVerificacaoID);
        } 

        const funcionario = funcionarios.find(f => f.id === id)
        //console.log("Funcionario: "+funcionario)
        const dadosFuncionario = getDadosFuncionario(funcionario)

        return reply.status(200).send({
          codigo: "200",
          mensagem: "Dados Recuperados."
        });

    } catch (error) {
        //console.error(error)
        reply.status(404).send({
          codigo: "404",
          mensagem: "Não encontrado. Funcionario não encontrado."
        });
    }
}

const atualizarFuncionario = async (request, reply) => {
    try {
      const id = request.params.id
      const dadosAtualizados = request.body
      const funcionario = funcionarios.find(f => f.id === id)

      //Verificando ID
      const resultadoVerificacaoID = await validarID(id);
      if (!resultadoVerificacaoID.success) {
        //console.log("Verificando ID valido no GET: "+validarID(id))
        return reply.status(resultadoVerificacaoID.status).send(resultadoVerificacaoID);
      } 

      if (!funcionario) {
        return reply.status(404).send({
          codigo: "404",
          mensagem: "Não encontrado. Funcionário não encontrado."
        });
      }

      //Verificando campos obrigatórios
      const camposObrigatorios = ['senha', 'confirmacaoSenha','nome','email'];
      const resultadoVerificacaoCamposObrigatorios = await verificarCamposObrigatorios(dadosAtualizados, camposObrigatorios);
      if (!resultadoVerificacaoCamposObrigatorios.success) {
        return reply.status(resultadoVerificacaoCamposObrigatorios.status).send(resultadoVerificacaoCamposObrigatorios);
      } 

      //Verificando Email
      const resultadoVerificacaoEmail = await verificarEmail(dadosAtualizados.email);
      if (!resultadoVerificacaoEmail.success) {
        return reply.status(resultadoVerificacaoEmail.status).send(resultadoVerificacaoEmail);
      }
         
      //Verificando campos de senha
      const resultadoVerificacaoSenha = await verificarConfirmacaoSenha(dadosAtualizados);
      if (!resultadoVerificacaoSenha.success) {
        return reply.status(resultadoVerificacaoSenha.status).send(resultadoVerificacaoSenha);
      }
      
      const funcionarioAtualizado = { ...funcionario, ...dadosAtualizados }
      funcionarios[funcionarios.indexOf(funcionario)] = { ...funcionario, ...dadosAtualizados }
  
      return reply.status(200).send({
        codigo: "200",
        mensagem: "Dados Atualizados."
      });

    } catch (error) {
      //console.error(error)
      reply.status(404).send({
        codigo: "404",
        mensagem: 'Não encontrado. Erro ao obter funcionario'
      });
    }
  };

  const removerFuncionario = async(request, reply) => {
    try {
    const id = request.params.id
    const funcionario = funcionarios.find(c => c.id === id)
    
    //Verificando campos ID
    const resultadoVerificacaoID = await validarID(id);
    if (!resultadoVerificacaoID.success) {
      return reply.status(resultadoVerificacaoID.status).send(resultadoVerificacaoID);
    } 

    if (!funcionario) {
      return reply.status(404).send({
        codigo: "404",
        mensagem: "Requisição não encontrada."
      });
    }

    //Remover apenas um elemento a partir do indice
    funcionarios.splice(funcionarios.indexOf(funcionario),1)
    return reply.status(200).send({
          codigo: "200",
          mensagem: "Funcionario removido."
        });
    
    } catch (error) {
      console.error(error);
      reply.status(404).send({
        codigo: "404",
        mensagem: "Requisição não encontrada."
      });
    }
}

/************ VALIDAR ID *************/

const validarID = async (id) => {
  if (id.length!=36) { 
    return ({
    success: false,
    status: 422,
    mensagem: 'Dados inválidos. ID invalido.',
    });
  } else {
    return {success: true};
  };
}

/*************** EMAIL ***************/

const verificarEmail = async (email) => {
  
/*     if (!email) {
    //console.log("verificar se tem email")
    return ({
      success: false,
      status: 422,
      mensagem: 'Dados inválidos. E-mail não fornecido',
    });
  } */

  const EmailValido = validarFormatoEmail(email);
  
  if (!EmailValido) {
    //console.log("validando formato Email")
    return {
      success: false,
      status: 422,
      mensagem: 'Dados inválidos. Formato de e-mail inválido',
    };
  }

  const emailEmUso = funcionarios.find((f) => f.email === email);
  if (emailEmUso) {
    //console.log("Verificando se Email esta em uso")
    return {
      success: false,
      status: 422,
      mensagem: 'Dados inválidos. E-mail já está em uso por outro funcionário. Escolha um e-mail diferente.'
    };
  } else {
      return {success: true};
  }
};

const validarFormatoEmail = (email) => {
  //console.log("Email Regex")
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/*************** CAMPOS OBRIGATORIOS ***************/

const verificarCamposObrigatorios = (objeto, campos) => {
  //console.log("Verificando campos obrigatórios")
  for (const campo of campos) {
    if (!objeto[campo]) {
      return {
        success: false,
        status: 422,
        mensagem: 'Dados inválidos. Insira todos os campos obrigatórios.'
      };
    }
  }
  return {success: true};
};

/*************** SENHA E CONFIRMAÇÃO SENHA ***************/

const verificarConfirmacaoSenha = (novoFuncionario) => {
  const { senha, confirmacaoSenha } = novoFuncionario;

  if (senha !== confirmacaoSenha) {
    return {
      success: false,
      status: 422,
      mensagem: 'Dados inválidos. A senha e a confirmação de senha devem ser iguais.',
    };
  }
  return { success: true };
};

/*************** BUSCA DE DADOS DE FUNCIONARIOS ***************/

const getDadosFuncionario = (funcionario) => {
  return {
    matricula: funcionario.matricula,
    senha: funcionario.senha,
    confirmacaoSenha: funcionario.confirmacaoSenha,
    email: funcionario.confirmacaoSenha,
    nome: funcionario.nome,
    idade: funcionario.idade,
    funcao: funcionario.funcao,
    cpf: funcionario.cpf
  };
};

module.exports = {
    getFuncionarios,
    criarFuncionario,
    getFuncionarioById,
    atualizarFuncionario,
    removerFuncionario
  }