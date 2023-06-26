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

const bodyCiclistaSemCampoNASCIMENTO = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista D",
    nascimento: "",
    cpf: "87942565301",
    passaporte: {
      numero: "string",
      validade: "2023-06-11",
      pais: "TX"
    },
    nacionalidade: "string",
    email: "ciclistad@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
      nomeTitular: "ciclista D",
      numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
      validade: "2023-06-11",
      cvv: "455"
    },
    ativo: false,
}

const bodyCiclistaSemCampoNOME = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TX"
    },
    nacionalidade: "string",
    email: "ciclistad@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
        nomeTitular: "ciclista D",
        numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
        validade: "2023-06-11",
        cvv: "455"
    },
    ativo: false,
}

const bodyCiclistaSemCampoNACIONALIDADE = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista E",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
      numero: "string",
      validade: "2023-06-11",
      pais: "TX"
    },
    nacionalidade: "",
    email: "ciclistae@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
      nomeTitular: "ciclista D",
      numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
      validade: "2023-06-11",
      cvv: "455"
    },
    ativo: false,
}

const bodyCiclistaSemCampoSENHA = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista E",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TX"
    },
    nacionalidade: "nacionalidade",
    email: "ciclistae@example.com",
    urlFotoDocumento: "string",
    senha: "",
    confirmarSenha: "string",
    meioDePagamento: {
        nomeTitular: "ciclista D",
        numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
        validade: "2023-06-11",
        cvv: "455"
    },
    ativo: false,
}

const bodyCiclistaSemCampoCONFIRMARSENHA = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista E",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
        numero: "string",
        validade: "2023-06-11",
        pais: "TX"
    },
    nacionalidade: "nacionalidade",
    email: "ciclistae@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "",
    meioDePagamento: {
        nomeTitular: "ciclista D",
        numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
        validade: "2023-06-11",
        cvv: "455"
    },
    ativo: false,
}

const bodyCiclistaSemCampoMEIODEPAGAMENTOSemTudo = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista E",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
      numero: "string",
      validade: "2023-06-11",
      pais: "TX"
    },
    nacionalidade: "nacionalidade",
    email: "ciclistae@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
      nomeTitular: "",
      numero: "",
      validade: "",
      cvv: ""
    },
    ativo: false,
}

const bodyCiclistaSemCampoMEIODEPAGAMENTOSemNome = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista E",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
      numero: "string",
      validade: "2023-06-11",
      pais: "TX"
    },
    nacionalidade: "nacionalidade",
    email: "ciclistae@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
      nomeTitular: "",
      numero: "1234567812345678",
      validade: "2023-06-11",
      cvv: "689"
    },
    ativo: false,
}

const bodyCiclistaSemCampoMEIODEPAGAMENTOSemNumero = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista E",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
      numero: "string",
      validade: "2023-06-11",
      pais: "TX"
    },
    nacionalidade: "nacionalidade",
    email: "ciclistae@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
      nomeTitular: "Nome",
      numero: "",
      validade: "2023-06-11",
      cvv: "678"
    },
    ativo: false,
}

const bodyCiclistaSemCampoMEIODEPAGAMENTOSemValidade = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista E",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
      numero: "string",
      validade: "2023-06-11",
      pais: "TX"
    },
    nacionalidade: "nacionalidade",
    email: "ciclistae@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
      nomeTitular: "Nome",
      numero: "1234567812345678",
      validade: "",
      cvv: "111"
    },
    ativo: false,
}

const bodyCiclistaSemCampoMEIODEPAGAMENTOSemCVV = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista E",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
      numero: "string",
      validade: "2023-06-11",
      pais: "TX"
    },
    nacionalidade: "nacionalidade",
    email: "ciclistae@example.com",
    urlFotoDocumento: "string",
    senha: "string",
    confirmarSenha: "string",
    meioDePagamento: {
      nomeTitular: "Nome",
      numero: "1234567812345678",
      validade: "2023-06-11",
      cvv: ""
    },
    ativo: false,
}

const bodyCiclistaUnmatchingPasswords = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista E",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
      numero: "string",
      validade: "2023-06-11",
      pais: "TX"
    },
    nacionalidade: "nacionalidade",
    email: "ciclistae@example.com",
    urlFotoDocumento: "string",
    senha: "senha",
    confirmarSenha: "outrasenha",
    meioDePagamento: {
      nomeTitular: "ciclista D",
      numero: "984602367621417541873846007875805616119812247741040998629140438970271356",
      validade: "2023-06-11",
      cvv: "455"
    },
    ativo: false,
}

const bodyCiclistaBrazilianWithCPF = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista F",
    nascimento: "2023-06-11",
    cpf: "87942565301",
    passaporte: {
      numero: "string",
      validade: "2023-06-11",
      pais: "TX"
    },
    nacionalidade: "BR",
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

const bodyCiclistaNonBrazilianWithPassport = {
    id: '0c4e5a5d-7b33-4d9a-9a8b-54c78b7a31a8',
    nome: "Ciclista F",
    nascimento: "2023-06-11",
    cpf: "",
    passaporte: {
      numero: "ABC123",
      validade: "2023-06-11",
      pais: "US"
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

module.exports = {
    bodyCiclista,
    bodyCiclistaSemEmail,
    bodyCiclistaFormatoEmailErrado,
    bodyCiclistaInvalidPassaport,
    bodyCiclistaEmailJaEmUso,
    bodyCartaoInvalido,
    bodyCiclistaSemCampoNASCIMENTO,
    bodyCiclistaSemCampoNOME,
    bodyCiclistaSemCampoNACIONALIDADE,
    bodyCiclistaSemCampoSENHA,
    bodyCiclistaSemCampoCONFIRMARSENHA,
    bodyCiclistaSemCampoMEIODEPAGAMENTOSemTudo,
    bodyCiclistaSemCampoMEIODEPAGAMENTOSemNome,
    bodyCiclistaSemCampoMEIODEPAGAMENTOSemNumero,
    bodyCiclistaSemCampoMEIODEPAGAMENTOSemValidade,
    bodyCiclistaSemCampoMEIODEPAGAMENTOSemCVV,
    bodyCiclistaUnmatchingPasswords,
    bodyCiclistaBrazilianWithCPF,
    bodyCiclistaNonBrazilianWithPassport
}