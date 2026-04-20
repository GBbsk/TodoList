import { TimerModel } from '../models/Model.js';
import { ViewTasks } from '../views/ViewTasks.js';
import { DataTime } from "../services/dataTimeService.js"
import { IDTASK } from "../utils/generatorID.js";
import { ViewTimer } from "../views/viewtimer.js";
import { ViewStats } from '../views/ViewStats.js';


export class TimerController {
  constructor(timerModel, viewTasks, dataTime, idTask, viewTimer, viewStats) {
    this.model = timerModel;
    this.viewtasks = viewTasks;
    this.dataTime = dataTime;
    this.gerarIdTask = idTask;
    this.viewtimer = viewTimer;
    this.viewstats = viewStats;

    this.viewtimer.atualizarDisplay(this.model.tempoRestante);
    
    this.viewtimer.bindStart(this.lidarComStartTimer.bind(this));
    this.viewtimer.bindStop(this.lidarComStopTimer.bind(this));
    this.viewtimer.bindReset(this.lidarComResetTimer.bind(this));
    this.viewtimer.bindSalvarCustom(this.lidarComSalvarCustomTimer.bind(this));
    this.viewtimer.bindMudarModo(this.lidarComTrocaDeModoTimer.bind(this));

  }

    iniciar(){
        const data = this.dataTime.exibirData()
        this.viewtasks.exibirData(data)
        
        this.viewtasks.selectorDeClasseDasTarefa()
        this.viewtimer.adicionarERemoverStyle();
    };

    verificarEnter(e){
        if(e.key === "Enter"){
            e.preventDefault();
            this.adicionarTarefas();
        }
    };



    lidarComStartTimer() {
        this.model.iniciar(
            (tempo) => this.viewtimer.atualizarDisplay(tempo), 
            () => this.lidarComFimDoTempo()
        );
    };

    lidarComStopTimer() {
        this.model.parar();
    };

    lidarComResetTimer() {
        this.model.reiniciar();
        this.viewtimer.atualizarDisplay(this.model.tempoRestante);
    };

    
    lidarComTrocaDeModoTimer(modo) {
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
            this.viewtimer.atualizarDisplay(this.model.tempoRestante);
        };
        
        lidarComSalvarCustomTimer() {
        const tempos = this.viewtimer.obterValoresCustomizados();

        if (isNaN(tempos.foco) || isNaN(tempos.pausa)) {
            console.log("Valores inválidos!");
            return; 
        }

        this.model.parar();
        this.model.configurarTempo(tempos.foco, tempos.pausa);
        this.viewtimer.atualizarDisplay(this.model.tempoRestante);
        }

        lidarComFimDoTempoTimer() {
            console.log("O tempo acabou! Tocar som aqui.");
            // Aqui você poderia chamar um this.view.tocarAlarme() no futuro
            this.model.alternarModo(); // Já prepara para o próximo ciclo
            this.viewtimer.atualizarDisplay(this.model.tempoRestante);
    };
}