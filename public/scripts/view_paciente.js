"use strict";

import DaoPaciente from "/scripts/dao_paciente.js";

export default class ViewPaciente {
  constructor() {
    this.daoPaciente = new DaoPaciente();

    this.arrayPacientes = [];
    this.operacao = "Navegar";
    this.posAtual = -1;
    this.cpfAtual = null;

    this.btSalvar = document.getElementById("btSalvar");
    this.btCancelar = document.getElementById("btCancelar");

    this.divNavegacao = document.getElementById("divNavegacao");
    this.btPrimeiro = document.getElementById("btPrimeiro");
    this.btAnterior = document.getElementById("btAnterior");
    this.btProximo = document.getElementById("btProximo");
    this.btUltimo = document.getElementById("btUltimo");

    this.btIncluir = document.getElementById("btIncluir");
    this.btAlterar = document.getElementById("btAlterar");
    this.btExcluir = document.getElementById("btExcluir");
    this.btSair = document.getElementById("btSair");

    this.divMensagem = document.getElementById("divMensagem");
    this.inputCpf = document.getElementById("tfCpf");
    this.inputNome = document.getElementById("tfNome");
    this.inputCelular = document.getElementById("tfCelular");
    this.inputEmail = document.getElementById("tfEmail");
    this.inputEndereco = document.getElementById("tfEndereco");

    this.btSalvar.onclick = this.salvar;
    this.btSalvar.viewer = this;
    this.btCancelar.onclick = this.cancelar;
    this.btCancelar.viewer = this;
    this.btPrimeiro.onclick = this.primeiro;
    this.btPrimeiro.viewer = this;
    this.btAnterior.onclick = this.anterior;
    this.btAnterior.viewer = this;
    this.btProximo.onclick = this.proximo;
    this.btProximo.viewer = this;
    this.btUltimo.onclick = this.ultimo;
    this.btUltimo.viewer = this;
    this.btIncluir.onclick = this.incluir;
    this.btIncluir.viewer = this;
    this.btAlterar.onclick = this.alterar;
    this.btAlterar.viewer = this;
    this.btExcluir.onclick = this.excluir;
    this.btExcluir.viewer = this;
    this.btSair.onclick = this.sair;
    this.btSair.viewer = this;

    $(document).ready(function() {
      $("#tfCpf").mask("999.999.999-99");
      $("#tfCelular").mask("(99) 9999-9999?9");
    });
  }

  //-----------------------------------------------------------------------------------------//

  async init() {
    await this.daoPaciente.abrirDB();
    this.solicitarObjs();
  }

  //-----------------------------------------------------------------------------------------//

  solicitarObjs() {
    this.arrayPacientes = this.daoPaciente.obterPacientes();
    if (this.arrayPacientes.length > 0) {
      this.posAtual = 0;
    } else {
      this.posAtual = -1;
      this.cpfAtual = null;
    }
    this.atualizarInterface();
  }

  //-----------------------------------------------------------------------------------------//

  incluir() {
    // Não podemos fazer a associação do this ao ViewPaciente pois o this é o botão
    let viewer = this.viewer;
    if (viewer.operacao == "Navegar") {
      viewer.inabilitarBotoes();
      viewer.inputCpf.value = "";
      viewer.inputNome.value = "";
      viewer.inputCelular.value = "";
      viewer.inputEmail.value = "";
      viewer.inputEndereco.value = "";
      viewer.divMensagem.innerHTML = "<center>Incluindo...</center><hr/>";
      viewer.operacao = "Incluir";
    }
  }

  //-----------------------------------------------------------------------------------------//

  alterar() {
    let viewer = this.viewer;
    if (viewer.operacao == "Navegar") {
      viewer.inabilitarBotoes();
      viewer.divMensagem.innerHTML = "<center>Alterando...</center><hr/>";
      viewer.operacao = "Alterar";
    }
  }

  //-----------------------------------------------------------------------------------------//

  excluir() {
    let viewer = this.viewer;
    if (viewer.operacao == "Navegar") {
      viewer.inabilitarBotoes();
      viewer.divMensagem.innerHTML = "<center>Confirmar Exclusão?</center><hr/>";
      viewer.operacao = "Excluir";
      viewer.btSalvar.textContent = "Excluir";
    }
  }

  //-----------------------------------------------------------------------------------------//

  salvar() {
    let viewer = this.viewer;
    let commit = false;
    if (viewer.operacao == "Incluir") {
      commit = viewer.daoPaciente.incluir(
        viewer.inputCpf.value,
        viewer.inputNome.value,
        viewer.inputCelular.value,
        this.inputEmail.value,
        this.inputEndereco.value
      );
    } else if (this.operacao == "Alterar") {
      commit = this.daoPaciente.alterar(
        this.cpfAtual,
        this.inputCpf.value,
        this.inputNome.value,
        this.inputCelular.value,
        this.inputEmail.value,
        this.inputEndereco.value
      );
    } else if (this.operacao == "Excluir") {
      commit = this.daoPaciente.excluir(this.cpfAtual);
    }
    if (commit) this.solicitarObjs();
  }

  //-----------------------------------------------------------------------------------------//

  primeiro() {
    let viewer = this.viewer;
    this.posAtual = 0;
    this.atualizarInterface();
  }

  //-----------------------------------------------------------------------------------------//

  anterior() {
    let viewer = this.viewer;
    this.posAtual--;
    this.atualizarInterface();
  }

  //-----------------------------------------------------------------------------------------//

  proximo() {
    let viewer = this.viewer;
    this.posAtual++;
    this.atualizarInterface();
  }

  //-----------------------------------------------------------------------------------------//

  ultimo() {
    let viewer = this.viewer;
    this.posAtual = this.arrayPacientes.length - 1;
    this.atualizarInterface();
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    let viewer = this.viewer;
    this.atualizarInterface();
  }

  //-----------------------------------------------------------------------------------------//

  sair() {
    history.back();
  }

  //-----------------------------------------------------------------------------------------//

  restaurarFuncoes() {
    this.divNavegacao.hidden = false;

    this.btIncluir.disabled = false;
    this.btAlterar.disabled = false;
    this.btExcluir.disabled = false;
    this.inputCpf.disabled = true;
    this.inputNome.disabled = true;
    this.inputCelular.disabled = true;
    this.inputEmail.disabled = true;
    this.inputEndereco.disabled = true;

    this.btAlterar.hidden = false;
    this.btIncluir.hidden = false;
    this.btExcluir.hidden = false;
    this.btPrimeiro.hidden = false;
    this.btAnterior.hidden = false;
    this.btProximo.hidden = false;
    this.btUltimo.hidden = false;

    this.btCancelar.hidden = true;
    this.btSalvar.hidden = true;
    this.operacao = "Navegar";
  }

  //-----------------------------------------------------------------------------------------//

  inabilitarBotoes() {
    this.divNavegacao.hidden = true;

    this.btAlterar.disabled = true;
    this.btIncluir.disabled = true;
    this.btExcluir.disabled = true;
    this.btPrimeiro.disabled = true;
    this.btAnterior.disabled = true;
    this.btProximo.disabled = true;
    this.btUltimo.disabled = true;

    this.btAlterar.hidden = true;
    this.btIncluir.hidden = true;
    this.btExcluir.hidden = true;

    this.btPrimeiro.hidden = true;
    this.btAnterior.hidden = true;
    this.btProximo.hidden = true;
    this.btUltimo.hidden = true;

    this.btCancelar.hidden = false;
    this.btSalvar.hidden = false;
    this.inputCpf.disabled = false;
    this.inputNome.disabled = false;
    this.inputCelular.disabled = false;
    this.inputEmail.disabled = false;
    this.inputEndereco.disabled = false;
  }

  //-----------------------------------------------------------------------------------------//
  atualizarInterface() {
    var mostrarDivNavegacao = false;

    this.restaurarFuncoes();
    if (this.posAtual > 0) {
      this.btPrimeiro.disabled = false;
      this.btAnterior.disabled = false;
      mostrarDivNavegacao = true;
    } else {
      this.btPrimeiro.disabled = true;
      this.btAnterior.disabled = true;
    }
    if (this.posAtual < this.arrayPacientes.length - 1) {
      this.btProximo.disabled = false;
      this.btUltimo.disabled = false;
      mostrarDivNavegacao = true;
    } else {
      this.btProximo.disabled = true;
      this.btUltimo.disabled = true;
    }

    if (this.posAtual > -1) {
      this.cpfAtual = this.arrayPacientes[this.posAtual].cpf;
      this.inputCpf.value = this.arrayPacientes[this.posAtual].cpf;
      this.inputNome.value = this.arrayPacientes[this.posAtual].nome;
      this.inputCelular.value = this.arrayPacientes[this.posAtual].celular;
      this.inputEmail.value = this.arrayPacientes[this.posAtual].email;
      this.inputEndereco.value = this.arrayPacientes[this.posAtual].endereco;
      this.btAlterar.disabled = false;
      this.btExcluir.disabled = false;
    } else {
      this.inputCpf.value = "";
      this.inputNome.value = "";
      this.inputCelular.value = "";
      this.inputEmail.value = "";
      this.inputEndereco.value = "";
      this.btAlterar.disabled = true;
      this.btExcluir.disabled = true;
    }
    this.divMensagem.innerHTML =
      "<p><center>Cadastro de Pacientes</center></p><hr/>";
    if (!mostrarDivNavegacao) this.divNavegacao.hidden = true;
    this.btSalvar.textContent = "Salvar";
  }

  //-----------------------------------------------------------------------------------------//
}
