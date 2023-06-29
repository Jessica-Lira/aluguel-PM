function verificarStatus(statusAluguel) {

    return !(statusAluguel == false) 

};

function verificarAtivo(ativo) {
    
    return !(ativo == false)
};

  module.exports = {
    verificarStatus,
    verificarAtivo
};
