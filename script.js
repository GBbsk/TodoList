import {
  gerarIdTask,
} from "./generatorID.js"


class DataTime{
    constructor(selector){
        this.element = document.querySelector(selector)
    }
    
    iniciar(){
        this.exibirData();
    };
    
    exibirData(){
        const agora = new Date()
        
        const dataFormatada = agora.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        const dataFinal = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
        
        if(this.element) {
            this.element.textContent = dataFinal;
        }
    };
};

class GerenciadorTarefas {
    constructor(inputSelector, buttonSelector, listSelector, deleteSelector){
        this.input = document.querySelector(inputSelector);
        this.submitTarefas = document.querySelector(buttonSelector);
        this.exibirlistaDeTarefas = document.querySelector(listSelector);
        this.deletarTarefa =  document.querySelector(deleteSelector)

        this.iniciar()
        this.listarTarefasDoBanco()
    }

    iniciar(){
        this.submitTarefas.addEventListener("click", () => this.adicionarTarefas())
        this.input.addEventListener("keydown", (e) => this.verificarEnter(e))
        this.selectorDeClasseDasTarefa()
        this.filtroDeEstadoDasTarefas()
        this.atualizarEstatisticas()
        
    };

    verificarEnter(e){
        if(e.key === "Enter"){
            e.preventDefault();
            this.adicionarTarefas();
        }
    };

    exibirTarefas(tarefaOBJ){
        if(tarefaOBJ.nome.trim() !== ""){

            const novaTask = document.createElement("li")
            novaTask.className = "list-group-item d-flex justify-content-between align-items-center"

            

            const checkedAttr = tarefaOBJ.status ? "checked" : "";
            const classeRisco = tarefaOBJ.status ? "text-decoration-line-through text-muted" : "";
            
            const cores = {
            "Urgente": "danger",
            "Trabalho": "primary",
            "Pessoal": "success"
            };

            novaTask.innerHTML = `
            <div class="d-flex justify-content-between align-items-start w-100">
            <div>
            <input class="form-check-input me-1 checkbox-conclusao position-relative z-3" type="checkbox" id="${tarefaOBJ.id}"${checkedAttr} style="transform: scale(1.4);">
            <label class="form-check-label fw-bold ${classeRisco}" for="${tarefaOBJ.id}">${tarefaOBJ.nome}</label>
            <div class="d-flex align-items-center gap-1 mt-1 ms-2">
                <span class="bg-${cores[tarefaOBJ.classe]} rounded-circle d-inline-block" style="width:8px; height:8px;"></span>
                <small class="text-${cores[tarefaOBJ.classe]} fw-bold"> ${tarefaOBJ.classe.toUpperCase()}</small>
            </div>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary btn-edit" title="Editar" data-bs-toggle="modal" data-bs-target="#modalEdit">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete" title="Excluir" data-bs-toggle="modal" data-bs-target="#modalDelete">
                    <i class="bi bi-trash3"></i>
                </button>
                </div>
             </div>
            `;
            
            const btnDelete = novaTask.querySelector(".btn-delete")
            btnDelete.addEventListener("click", () => {
                const modalDelete = document.querySelector("#modalDelete");
                const confirmarDelete = modalDelete.querySelector(".deleteTaskBtn");
                    
                confirmarDelete.onclick = () => {
                    this.removerTarefa(novaTask, tarefaOBJ.id)
                };

            });

            const btnEdit = novaTask.querySelector(".btn-edit")
            btnEdit.addEventListener("click", () => {
                this.editarTarefa(tarefaOBJ)
            });

            const checkbox = novaTask.querySelector(".checkbox-conclusao");
            const label = novaTask.querySelector("label");

            checkbox.addEventListener("change", (event) => {
                const isChecked = event.target.checked;
                
                if(isChecked){
                    label.classList.add("text-decoration-line-through", "text-muted");
                } else {
                    label.classList.remove("text-decoration-line-through", "text-muted");
                }
                this.atualizarStatusTarefa(tarefaOBJ.id, isChecked);
            });
            
            this.exibirlistaDeTarefas.appendChild(novaTask); // exibe  
        }
    };

    removerTarefa(elemento, tarefaID){
        elemento.remove();

        let tarefasSalvas = JSON.parse(localStorage.getItem("minhasTarefas")) || [];
        tarefasSalvas = tarefasSalvas.filter((tarefa) => tarefa.id !== tarefaID);

        localStorage.setItem("minhasTarefas", JSON.stringify(tarefasSalvas));

        this.verificarEstadoDaLista();
        this.atualizarEstatisticas()
    };

    editarTarefa(tarefaOBJ){
        const editTask = document.querySelector(".editTask");
        const btnSave = document.querySelector(".saveEdit");

        // Logica do Select class
        const select = document.querySelector(".form-select")
        const dadosSelect = [
            "Trabalho",
            "Pessoal",
            "Urgente"
        ];

        const classeAtual = tarefaOBJ.classe

        select.innerHTML = ""

        dadosSelect.forEach(classe => {
            const option = document.createElement("option")
            option.value = classe
            option.textContent = classe

            if (classe === classeAtual) {
                option.selected = true
            }

            select.appendChild(option)
        })

        editTask.value = tarefaOBJ.nome;

        // logica do confirmar
        btnSave.onclick = (event) => {
            if(event) event.preventDefault(); 

            const banco = JSON.parse(localStorage.getItem("minhasTarefas")) || [];
            const novoNome = editTask.value.trim();
            const novaClasse = select.value;

            if(novoNome === "") return; 

            const index = banco.findIndex(tarefa => tarefa.id === tarefaOBJ.id);

            if(index !== -1){
                banco[index].nome = novoNome;
                banco[index].classe = novaClasse;
                localStorage.setItem("minhasTarefas", JSON.stringify(banco));

                this.exibirlistaDeTarefas.innerHTML = "";
                this.listarTarefasDoBanco();

                const btnFechar = document.querySelector('[data-bs-dismiss="modal"]');
                if(btnFechar) btnFechar.click();
            };
            
            this.atualizarEstatisticas()
        };

        editTask.onkeydown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault(); // Evita recarregar a página se estiver dentro de um <form>
                btnSave.click();    // Simula o clique no botão Confirmar
            }
        };
    };

    atualizarStatusTarefa(idDaTarefa, statusConclusao) {
        let tarefasSalvas = JSON.parse(localStorage.getItem("minhasTarefas")) || [];
            
        tarefasSalvas.forEach((tarefa) => {
            if(tarefa.id === idDaTarefa) {
                tarefa.status = statusConclusao; // Atualiza de false para true (ou vice-versa)
            }
        });

        localStorage.setItem("minhasTarefas", JSON.stringify(tarefasSalvas));
        this.atualizarEstatisticas();
    };

    listarTarefasDoBanco(){
        const salvarTarefas = JSON.parse(localStorage.getItem("minhasTarefas")) || [];
        
        salvarTarefas.forEach((tarefa) => {
            this.exibirTarefas(tarefa)
        })

        this.verificarEstadoDaLista()
    };

    adicionarTarefas(){
        const conteudoTask = this.input.value;

        if(conteudoTask.trim() !== ""){

            const novaTarefaObj = { nome: conteudoTask, classe: this.categoriaSelecionada, status: false, id: gerarIdTask() };
            this.exibirTarefas(novaTarefaObj);

            const salvarTarefas = JSON.parse(localStorage.getItem("minhasTarefas")) || [];
            salvarTarefas.push(novaTarefaObj);

            localStorage.setItem("minhasTarefas", JSON.stringify(salvarTarefas));
            this.input.value = "";

            this.verificarEstadoDaLista();
            this.atualizarEstatisticas();
        }
    };

    selectorDeClasseDasTarefa(){
        const botoes = [
            document.querySelector(".btnTrabalho"),
            document.querySelector(".btnPessoal"),
            document.querySelector(".btnUrgente")
        ];
        
        this.categoriaSelecionada = "Trabalho";

        botoes.forEach((botaoClicado) => {

            botaoClicado.addEventListener("click", () => {
                botoes.forEach(btn => btn.classList.remove("active"));

                botaoClicado.classList.add("active");
                this.categoriaSelecionada = botaoClicado.textContent;
            });
            
        });
    };

    filtroDeEstadoDasTarefas(){
        const botoes = [
            document.querySelector(".btnTodas"),
            document.querySelector(".btnPendentes"),
            document.querySelector(".btnFeitas")
        ];

        botoes.forEach((botao) => {

            botao.addEventListener("click", () => {

            botoes.forEach(btn => btn.classList.remove("active"));
            botao.classList.add("active");

            const banco = JSON.parse(localStorage.getItem("minhasTarefas")) || [];

            this.exibirlistaDeTarefas.innerHTML = "";

            const textoBotao = botao.textContent.trim();

            let tarefasFiltradas;

            if(textoBotao === "TODAS"){
                tarefasFiltradas = banco;
            } 
            else if(textoBotao === "PENDENTES"){
                tarefasFiltradas = banco.filter(t => t.status === false);
            } 
            else if(textoBotao === "FEITAS"){
                tarefasFiltradas = banco.filter(t => t.status === true);
            }

            tarefasFiltradas.forEach(tarefa => {
                this.exibirTarefas(tarefa);
            });

            this.verificarEstadoDaLista();
            });
        });
    };

    atualizarEstatisticas() {
        const bancoDeTarefas = JSON.parse(localStorage.getItem("minhasTarefas")) || [];

        // --- 1. Lógica do Progresso (Seu Header) ---
        const totalTarefas = bancoDeTarefas.length;
        const tarefasConcluidas = bancoDeTarefas.filter(t => t.status === true).length;
        
        let porcentagem = 0;
        if (totalTarefas > 0) {
            porcentagem = Math.round((tarefasConcluidas / totalTarefas) * 100);
        }

        // Seleciona os elementos exatos do seu HTML
        const circuloProgresso = document.querySelector(".progress-circle");
        const textoConcluidas = document.querySelector(".attTarefasConcluidas");

        // Atualiza a tela (Header)
        if (circuloProgresso && textoConcluidas) {
            circuloProgresso.textContent = `${porcentagem}%`;
            textoConcluidas.textContent = `${tarefasConcluidas}/${totalTarefas}`;
        }

        // --- 2. Lógica das Categorias (Card lateral que já tínhamos feito) ---
        const contagem = bancoDeTarefas.reduce((acumulador, tarefa) => {
            const categoria = tarefa.classe.toUpperCase(); 

            if (categoria === "TRABALHO") acumulador.trabalho += 1;
            else if (categoria === "URGENTE") acumulador.urgente += 1;
            else if (categoria === "PESSOAL") acumulador.pessoal += 1;

            return acumulador;
        }, { trabalho: 0, urgente: 0, pessoal: 0 });

        const statTrabalho = document.querySelector(".estatisticasTrabalho");
        const statPessoal = document.querySelector(".estatisticasPessoal");
        const statUrgente = document.querySelector(".estatisticasUrgente");

        // Atualiza a tela (Categorias)
        if (statTrabalho && statPessoal && statUrgente) {
            statTrabalho.textContent = contagem.trabalho;
            statPessoal.textContent = contagem.pessoal;
            statUrgente.textContent = contagem.urgente;
        }
    };

    verificarEstadoDaLista() {
        const listaTarefas = document.querySelector(".exibirTarefas");
        const areaVazia = document.querySelector(".area-vazia");

        if (listaTarefas.children.length === 0) {
            areaVazia.classList.remove('d-none');
        } else {
            areaVazia.classList.add('d-none');
        }
    };
};

class TimerModel {
  constructor(tempoFoco = 25, tempoPausa = 5) {
    this.minutosFoco = tempoFoco;
    this.minutosPausa = tempoPausa;
    
    this.modoAtual = 'foco'; // Pode ser 'foco' ou 'pausa'
    this.tempoRestante = this.minutosFoco * 60; 
    
    // Controle do relógio interno
    this.estaRodando = false;
    this.idIntervalo = null;
  }

    // Atualiza as preferências do usuário LOGICA DO CUSTOM
    configurarTempo(novoFoco, novaPausa) {
        this.minutosFoco = novoFoco;
        this.minutosPausa = novaPausa;
        this.reiniciar(); // Aplica o novo tempo imediatamente
    };

    // O "coração" que faz o tempo passar
    iniciar(callbackTick, callbackFim) {
        // Trava de segurança contra múltiplos cliques
        if (this.estaRodando) return;
        
        this.estaRodando = true;

        this.idIntervalo = setInterval(() => {
        this.tempoRestante--;

        // Avisa o Controller que 1 segundo passou e manda o tempo atual
        if (callbackTick) callbackTick(this.tempoRestante);

        // Verifica se o tempo acabou
        if (this.tempoRestante <= 0) {
            this.parar();
            
            // Avisa o Controller que o ciclo chegou a zero
            if (callbackFim) callbackFim();
        }
        }, 1000);
    };

    parar() {
        this.estaRodando = false;
        clearInterval(this.idIntervalo);
    };

    alternarModo() {
        if (this.modoAtual === 'foco') {
        this.modoAtual = 'pausa';
        this.tempoRestante = this.minutosPausa * 60;
        } else {
        this.modoAtual = 'foco';
        this.tempoRestante = this.minutosFoco * 60;
        }
    };

    reiniciar() {
        this.parar();
        
        if (this.modoAtual === 'foco') {
        this.tempoRestante = this.minutosFoco * 60;
        } else {
        this.tempoRestante = this.minutosPausa * 60;
        }
    };
};


class TimerView {
  constructor(selectorPomodoro, selectorShortBreak, selectorLongBreak, selectorCustom, 
    selectorDisplay, selectorBtnStart, selectorBtnStop, selectorBtnReset, selectorInputCustom, selectorBtnCustom, selectorInputCustomPause
  ) {
    // Capturando os elementos da tela (DOM)
    this.pomodoro = document.querySelector(selectorPomodoro)
    this.shortBreak = document.querySelector(selectorShortBreak)
    this.longBreak = document.querySelector(selectorLongBreak)
    this.custom = document.querySelector(selectorCustom)

    this.displayTempo = document.querySelector(selectorDisplay);

    this.btnStart = document.querySelector(selectorBtnStart);
    this.btnStop = document.querySelector(selectorBtnStop);
    this.btnReset = document.querySelector(selectorBtnReset);
    
    this.customInput = document.querySelector(selectorInputCustom)
    this.customPause = document.querySelector(selectorInputCustomPause)
    this.customSave = document.querySelector(selectorBtnCustom)
    
    this.adicionarERemoverStyle();
  }

  atualizarDisplay(segundosTotais){
    const minutos = Math.floor(segundosTotais / 60);
    const segundos = segundosTotais % 60;
    
    const formatoMin = String(minutos).padStart(2, '0')
    const formatoSeg = String(segundos).padStart(2, '0')

    this.displayTempo.textContent = `${formatoMin}:${formatoSeg}`
  }


    bindStart(handler) {
        this.btnStart.addEventListener('click', handler);
    }

    bindStop(handler) {
        this.btnStop.addEventListener('click', handler);
    }

    bindReset(handler) {
        this.btnReset.addEventListener('click', handler);
    }

    obterValoresCustomizados() {
        return {
            foco: Number(this.customInput.value),
            pausa: Number(this.customPause.value)
        };
    };

    bindSalvarCustom(handler) {
        this.customSave.addEventListener('click', handler);
    };

    bindMudarModo(handler) {
        this.pomodoro.addEventListener('click', () => handler('pomodoro'));
        this.shortBreak.addEventListener('click', () => handler('short'));
        this.longBreak.addEventListener('click', () => handler('long'));
        this.custom.addEventListener('click', () => handler('custom'))
    };

    adicionarERemoverStyle() {
    // Usamos o 'this' para pegar os botões que já foram salvos no constructor
    const botoes = [
        this.pomodoro,
        this.shortBreak,
        this.longBreak,
        this.custom
    ];

    botoes.forEach((botaoSelecionado) => {
        // Verifica se o botão realmente existe no HTML antes de adicionar o evento
        if (botaoSelecionado) {
            botaoSelecionado.addEventListener('click', () => {
                
                // 1. Remove a classe 'active' de todos os botões
                botoes.forEach(btn => {
                    if (btn) btn.classList.remove("active");
                });

                // 2. Adiciona a classe 'active' apenas no botão que foi clicado
                botaoSelecionado.classList.add("active");
            });
        }
    });
}

};

class TimerController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // 1. Estado Inicial:
    // Assim que a página carrega, mostramos o tempo que está no Model (ex: 25:00)
    this.view.atualizarDisplay(this.model.tempoRestante);

    // 2. Ligando os eventos (BINDS):
    // Estamos dizendo para a View: "Quando clicar, chame essa minha função aqui"
    // Usamos .bind(this) ou arrow functions para não perder a referência do 'this'
    
    this.view.bindStart(this.lidarComStart.bind(this));
    this.view.bindStop(this.lidarComStop.bind(this));
    this.view.bindReset(this.lidarComReset.bind(this));
    this.view.bindSalvarCustom(this.lidarComSalvarCustom.bind(this));
    
    // Liga os botões de Pomodoro, Curto e Longo
    this.view.bindMudarModo(this.lidarComTrocaDeModo.bind(this));
  }

  lidarComStart() {
    // Chama o iniciar do Model passando duas callbacks:
    // 1ª: O que fazer a cada tique (atualizar a tela)
    // 2ª: O que fazer quando o tempo acabar (tocar alarme/parar)
    this.model.iniciar(
      (tempo) => this.view.atualizarDisplay(tempo), 
      () => this.lidarComFimDoTempo()
    );
  }

  lidarComStop() {
    this.model.parar();
  }

  lidarComReset() {
    this.model.reiniciar();
    // Força a atualização da tela imediatamente após resetar
    this.view.atualizarDisplay(this.model.tempoRestante);
  }

  
  lidarComTrocaDeModo(modo) {
      // Define os tempos baseados no botão clicado
      // (Poderia vir de uma configuração, mas vamos simplificar aqui)
      let tempoFoco = 25;
      let tempoPausa = 5;
      
      if (modo === 'pomodoro') {
          tempoFoco = 25; 
          tempoPausa = 5;
        } else if (modo === 'short') { // Pausa Curta
            tempoFoco = 5; 
            tempoPausa = 5;
        } else if (modo === 'long') { // Pausa Longa
            tempoFoco = 15; 
            tempoPausa = 15; // Exemplo
        } else if (modo === 'custom'){
            return
        }
        
        this.model.parar();
        this.model.configurarTempo(tempoFoco, tempoPausa);
        this.view.atualizarDisplay(this.model.tempoRestante);
    };
    
    lidarComSalvarCustom() {
    const tempos = this.view.obterValoresCustomizados();

    if (isNaN(tempos.foco) || isNaN(tempos.pausa)) {
        console.log("Valores inválidos!");
        return; 
    }

    this.model.parar();
    this.model.configurarTempo(tempos.foco, tempos.pausa);
    this.view.atualizarDisplay(this.model.tempoRestante);
    }

    lidarComFimDoTempo() {
        console.log("O tempo acabou! Tocar som aqui.");
        // Aqui você poderia chamar um this.view.tocarAlarme() no futuro
    this.model.alternarModo(); // Já prepara para o próximo ciclo
    this.view.atualizarDisplay(this.model.tempoRestante);
  }
}
 

document.addEventListener("DOMContentLoaded", function () {
        const data = new DataTime(".dataTime");
        data.iniciar();

        new GerenciadorTarefas(".inputTarefas", ".btnAddTarefas", ".exibirTarefas", ".deleteTaskBtn");
        
        const appModel = new TimerModel(25, 5);
    
        // 2. Instancia a View (Corpo) - Passando os seus seletores
        const appView = new TimerView(
        ".btnPomodoro", 
        ".btn-ShortBreak", 
        ".btn-LongBreak", 
        ".btn-Custom",
        ".display-Tempo", 
        ".btn-Start", 
        ".btn-Stop", 
        ".btn-Reset",
        ".customDurationInput",
        ".saveCustomDuration",
        ".customPauseInput"
        );
    
        // 3. Instancia o Controller (Alma) - Conecta tudo
        const app = new TimerController(appModel, appView);
    });
