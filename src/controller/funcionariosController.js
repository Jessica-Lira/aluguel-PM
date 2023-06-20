const { v4: uuidv4 } = require('uuid');
const { v1: uuidv1 } = require('uuid');
const { funcionarios } = require('../data.js');

//Não precisa
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
  
      //Verificando Email
      const resultadoVerificacaoEmail = await verificarEmail(novoFuncionario.email);
      if (!resultadoVerificacaoEmail.success) {
        return reply.status(resultadoVerificacaoEmail.status).send(resultadoVerificacaoEmail.message);
      }

      //Verificando campos obrigatórios
      const camposObrigatorios = ['email', 'nome', 'senha', 'confirmacaoSenha'];
      const resultadoVerificacaoCamposObrigatorios = await verificarCamposObrigatorios(novoFuncionario, camposObrigatorios);
      if (!resultadoVerificacaoCamposObrigatorios.success) {
        return reply.status(resultadoVerificacaoCamposObrigatorios.status).send(resultadoVerificacaoCamposObrigatorios.message);
      }

      //Verificando campos de senha
      const resultadoVerificacaoSenha = await verificarConfirmacaoSenha(novoFuncionario);
      if (!resultadoVerificacaoSenha.success) {
        return reply.status(resultadoVerificacaoSenha.status).send(resultadoVerificacaoSenha.message);
      }

      funcionarios.push(novoFuncionario)
      reply.status(200).send('Dados Cadastrados')
  
      return reply.send(novoFuncionario)
    } catch (error) {
      //console.error(error)
      reply.status(500).send('Erro ao criar funcionario')
    }
  }

const getFuncionarioById = async (request, reply) => {
    try {
        const id = request.params.id
        const funcionario = funcionarios.find(c => c.id === id)

        const dadosFuncionario = {
          matricula: funcionario.matricula,
          senha: funcionario.senha,
          confirmacaoSenha: funcionario.confirmacaoSenha,
          email: funcionario.confirmacaoSenha,
          nome: funcionario.nome,
          idade: funcionario.idade,
          funcao: funcionario.funcao,
          cpf: funcionario.cpf
        }

        if (!funcionario){
        return reply.status(404).send('Funcionario não encontrado')
        }

        return reply.status(200).send(dadosFuncionario)

    } catch (error) {
        //console.error(error)
        reply.status(422).send('Erro ao obter funcionario')
    }
}

const atualizarFuncionario = async (request, reply) => {
    try {
      const id = request.params.id
      const dadosAtualizados = request.body
      const funcionario = funcionarios.find(c => c.id === id)
  
      if (!funcionario) {
        return reply.status(404).send('Funcionario não encontrado')
      }

      //Verificando Email
      const resultadoVerificacaoEmail = await verificarEmail(dadosAtualizados.email);
      if (!resultadoVerificacaoEmail.success) {
        return reply.status(resultadoVerificacaoEmail.status).send(resultadoVerificacaoEmail.message);
      }
         
      //Verificando campos de senha
      const resultadoVerificacaoSenha = await verificarConfirmacaoSenha(dadosAtualizados);
      if (!resultadoVerificacaoSenha.success) {
        return reply.status(resultadoVerificacaoSenha.status).send(resultadoVerificacaoSenha.message);
      }
      
      const funcionarioAtualizado = { ...funcionario, ...dadosAtualizados }
      funcionarios[funcionarios.indexOf(funcionario)] = { ...funcionario, ...dadosAtualizados }
  
      return reply.send(funcionarioAtualizado)
      return reply.status(200).send("Dados Atualizados")

    } catch (error) {
      //console.error(error)
      reply.status(500).send('Erro ao obter funcionario')
    }
  }

const removerFuncionario = async(request, reply) => {
    try{
    const id = request.params.id
    //console.log("ID a ser removido: "+id)
    const funcionario = funcionarios.find(c => c.id === id)

    if (!funcionario) {
    return reply.status(404).send('Funcionario não encontrado')
    }

    //Remover apenas um elemento a partir do indice
    funcionarios.splice(funcionarios.indexOf(funcionario),1)

    return reply.status(200).send("Funcionario removido")
    
    } catch (error) {
        //console.error(error)
        reply.status(500).send('Erro ao obter funcionario')
  }
}

/*************** EMAIL ***************/

const verificarEmail = async (email) => {
  if (!email) {
    return ({
      success: false,
      status: 422,
      message: 'E-mail não fornecido',
    });
  }

  const EmailValido = validarFormatoEmail(email);
  if (!EmailValido) {
    return {
      success: false,
      status: 422,
      message: 'Dados inválidos. Formato de e-mail inválido',
    };
  }

  const emailEmUso = funcionarios.find((c) => c.email === email);
  if (emailEmUso) {
    return {
      success: false,
      status: 422,
      message: 'Dados inválidos. E-mail já está em uso por outro funcionário. Escolha um e-mail diferente.'
    };
  } else {
      return {success: true};
  }
};

const validarFormatoEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/*************** CAMPOS OBRIGATORIOS ***************/

const verificarCamposObrigatorios = (objeto, campos) => {
  for (const campo of campos) {
    if (!objeto[campo]) {
      return {
        success: false,
        status: 422,
        message: 'Dados inválidos. Insira todos os campos obrigatórios.'
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
      message: 'Dados inválidos. A senha e a confirmação de senha devem ser iguais.',
    };
  }
  return { success: true };
};


module.exports = {
    getFuncionarios,
    criarFuncionario,
    getFuncionarioById,
    atualizarFuncionario,
    removerFuncionario
  }
