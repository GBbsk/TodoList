import { TimerModel } from '../models/Model.js';
import { ViewTasks } from "../views/ViewTasks.js";
import { ViewStats } from "../views/ViewStats.js";
import { IDTASK } from "../utils/generatorID.js";


export class ControllerTask {
    constructor(model, viewtasks, viewstats, idTask) {
        this.model = model;
        this.viewtasks = viewtasks;
        this.viewstats = viewstats;
        this.gerarIdTask = idTask;

        this.viewtasks.bindSaveTask(this.adicionarTarefas.bind(this));
        this.viewtasks.bindEnterKey(this.verificarEnter.bind(this));
        this.viewtasks.bindDeleteTask(this.confirmarDeleteTask.bind(this));
        this.viewtasks.bindCheckboxChange(this.atualizarStatusTarefa.bind(this));
        this.viewtasks.bindEditTask(this.editarTarefa.bind(this));

        this.viewtasks.bindFiltro((filtroSelecionado) => {
            this.filtroDeEstadoDasTarefas(filtroSelecionado);
        });
    }

    iniciar() {
        this.listarTarefasDoBanco();
        this.viewtasks.selectorDeClasseDasTarefa();
    }

    verificarEnter(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            this.adicionarTarefas();
        }
    };

    confirmarDeleteTask(elemento, tarefaID) {
        this.removerTarefa(elemento, tarefaID);
    };

    listarTarefasDoBanco() {
        const tasks = this.model.getAll();

        tasks.forEach((tarefa) => {
            this.viewtasks.exibirTarefas(tarefa);
        });

        this.atualizarEstatisticas();
        this.viewtasks.verificarEstadoDaLista();
    };

    atualizarStatusTarefa(idDaTarefa, statusConclusao) {
        let tarefasSalvas = this.model.getAll();

        tarefasSalvas.forEach((tarefa) => {
            if (tarefa.id === idDaTarefa) {
                tarefa.status = statusConclusao;
            }
        });

        this.model.updateDatabase(tarefasSalvas);
        this.atualizarEstatisticas();
    };

    adicionarTarefas() {
        const conteudoTask = this.viewtasks.getValueInput();

        if (conteudoTask.trim() !== "") {
            const novaTarefaObj = { nome: conteudoTask, classe: this.viewtasks.categoriaSelecionada, status: false, id: this.gerarIdTask.ID() };
            this.viewtasks.exibirTarefas(novaTarefaObj);

            this.model.addTask(novaTarefaObj);

            this.viewtasks.inputTarefas.value = "";
            this.viewtasks.verificarEstadoDaLista();
            this.atualizarEstatisticas(novaTarefaObj);
        }
    };

    removerTarefa(elemento, tarefaID) {
        elemento.remove();

        let tarefasSalvas = this.model.getAll();
        tarefasSalvas = tarefasSalvas.filter((tarefa) => tarefa.id !== tarefaID);

        this.model.updateDatabase(tarefasSalvas);

        this.viewtasks.verificarEstadoDaLista();
        this.atualizarEstatisticas();
    };

    atualizarEstatisticas() {
        const bancoDeTarefas = this.model.getAll();

        const totalTarefas = bancoDeTarefas.length;
        const tarefasConcluidas = bancoDeTarefas.filter(t => t.status === true).length;

        let porcentagem = 0;
        if (totalTarefas > 0) {
            porcentagem = Math.round((tarefasConcluidas / totalTarefas) * 100);
        }

        const contagem = bancoDeTarefas.reduce((acumulador, tarefa) => {
            const categoria = tarefa.classe.toUpperCase();

            if (categoria === "TRABALHO") acumulador.trabalho += 1;
            else if (categoria === "URGENTE") acumulador.urgente += 1;
            else if (categoria === "PESSOAL") acumulador.pessoal += 1;

            return acumulador;
        }, { trabalho: 0, urgente: 0, pessoal: 0 });

        this.viewstats.atualizarStats(porcentagem, tarefasConcluidas, totalTarefas);
        this.viewstats.atualizarStatsCategorias(contagem);
    };

    editarTarefa(idDaTarefa, novoNome, novaClasse) {
        let tarefasSalvas = this.model.getAll();

        tarefasSalvas.forEach(tarefa => {
            if (tarefa.id === idDaTarefa) {
                tarefa.nome = novoNome;
                tarefa.classe = novaClasse;
            }
        });

        this.model.updateDatabase(tarefasSalvas);

        // Re-renderiza a lista
        this.viewtasks.exibirTarefasNoCard.innerHTML = "";
        this.listarTarefasDoBanco();
    };

    filtroDeEstadoDasTarefas(filtroSelecionado) {
        const banco = this.model.getAll();
        this.viewtasks.exibirTarefasNoCard.innerHTML = "";

        let tarefasFiltradas;

        if (filtroSelecionado === "TODAS") {
            tarefasFiltradas = banco;
        }
        else if (filtroSelecionado === "PENDENTES") {
            tarefasFiltradas = banco.filter(t => t.status === false);
        }
        else if (filtroSelecionado === "FEITAS") {
            tarefasFiltradas = banco.filter(t => t.status === true);
        }

        tarefasFiltradas.forEach(tarefa => {
            this.viewtasks.exibirTarefas(tarefa);
        });

        this.viewtasks.verificarEstadoDaLista();
    };

}