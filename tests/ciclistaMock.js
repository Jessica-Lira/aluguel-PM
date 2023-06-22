'use strict'

const bodyCiclista = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a5',
    nome: 'Paulo',
    nascimento: '2023-06-11',
    cpf: '12345678955',
    passaporte: {
        numero: '123456789',
        validade: '2023-06-11',
        pais: 'TL'
    },
    nacionalidade: 'BR',
    email: 'paulo@email.com',
    urlFotoDocumento: 'string',
    senha: 'clientepaulo',
    confirmarSenha: 'clientepaulo',
    meioDePagamento: {
        nomeTitular: 'Paulo',
        numero: '1234512345123456',
        validade: '2023-06-11',
        cvv: '487'
    },
    ativo: false,
}

const bodyCiclistaSemEmail = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista B",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TX"
    },
    nacionalidade: "string",
    email: "",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
        nomeTitular: "ciclista B",
        numero: "984602367621417541873846007875805616119812247741040998629140438970271355",
        validade: "2023-06-11",
        cvv: "455"
    },
    ativo: false,
}

const bodyCiclistaFormatoEmailErrado = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista C",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TX"
    },
    nacionalidade: "string",
    email: "ciclistac.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
        nomeTitular: "ciclista C",
        numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
        validade: "2023-06-11",
        cvv: "455"
    },
    ativo: false,
}

const bodyCiclistaInvalidPassaport = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista F",
    nascimento: "2023-06-11",
    cpf: "",
    passaporte: {
        numero: "",
        validade: "",
        pais: ""
    },
    nacionalidade: "US",
    email: "ciclistaf@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
        nomeTitular: "ciclista E",
        numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
        validade: "2023-06-11",
        cvv: "455"
    },
    ativo: false,
}

const bodyCiclistaEmailJaEmUso = {
    id: "9",
    nome: "Paulo",
    nascimento: "2023-06-11",
    cpf: "12345678955",
    passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TL"
    },
    nacionalidade: "BR",
    email: "email@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
        nomeTitular: "string",
        numero: "1234512345123456",
        validade: "2023-06-11",
        cvv: "4857"
    },
    "ativo": false,
    "statusAluguel": false
}
const bodyCartaoInvalido = {
    id: "9",
    nome: "Paulo",
    nascimento: "2023-06-11",
    cpf: "12345678955",
    passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TL"
    },
    nacionalidade: "BR",
    email: "emaalibabail@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
        nomeTitular: "string",
        numero: "1234512345123456",
        validade: "2023-06-11",
        cvv: "666"
    },
    "ativo": false,
    "statusAluguel": false
}

module.exports = {
    bodyCiclista,
    bodyCiclistaSemEmail,
    bodyCiclistaFormatoEmailErrado,
    bodyCiclistaInvalidPassaport,
    bodyCiclistaEmailJaEmUso,
    bodyCartaoInvalido,

}