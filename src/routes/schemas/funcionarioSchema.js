const funcionarioSchema = {
    type: 'object',
    required: [
        'id',
        'matricula',
        'senha',
        'confirmacaoSenha',
        'email',
        'nome',
        'idade',
        'funcao',
        'cpf'],
    properties: {
        id: {type: 'string'},
        matricula: {type: 'string'},
        senha: {type: 'string'},
        confirmacaoSenha: {type: 'string'},
        email: {type: 'string'},
        nome: {type: 'string'},
        idade: {type: 'number'},
        funcao: {type: 'string'},
        cpf: {type: 'string'}
    }
};

module.exports = {funcionarioSchema}