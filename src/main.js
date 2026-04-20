import { TimerController } from './controllers/Controller.js';
import { TimerModel } from './models/Model.js';
import { ViewTasks } from './views/ViewTasks.js';
import { DataTime } from './services/dataTimeService.js'
import { ViewTimer } from './views/ViewTimer.js'
import { IDTASK } from './utils/generatorID.js'
import { ViewStats } from './views/ViewStats.js';
import { ControllerTask } from './controllers/ControllerTask.js';

document.addEventListener("DOMContentLoaded", function () {
        const appDataTime = new DataTime();
        
        const appModel = new TimerModel(25, 5);
    
        const appTimer = new ViewTimer(
        ".btnPomodoro", ".btn-ShortBreak",
        ".btn-LongBreak", ".btn-Custom",
        ".display-Tempo", ".btn-Start", 
        ".btn-Stop", ".btn-Reset",
        ".customDurationInput",".saveCustomDuration",
        ".customPauseInput",
        );

        const appStats = new ViewStats(
            ".attTarefasConcluidas", ".progress-circle",
            ".estatisticasTrabalho", ".estatisticasPessoal", 
            ".estatisticasUrgente"
        );

        const appIDTask = new IDTASK();

        const appView = new ViewTasks(
        ".inputTarefas", ".btnAddTarefas", 
        ".exibirTarefas", ".deleteTaskBtn", 
        ".dataTime", ".btnTrabalho", 
        ".btnPessoal", ".btnUrgente", 
        ".area-vazia", ".editTask",
        "#modalDelete", ".btnTodas", 
        ".btnPendentes", ".btnFeitas",
        "#modalEdit"
        );
    
        // 3. Instancia o Controller (Alma) - Conecta tudo
        const controller = new TimerController(appModel, appView, appDataTime, appIDTask, appTimer, appStats);

        const controllerTask = new ControllerTask(appModel, appView, appStats, appIDTask);
    
        controllerTask.iniciar()
        controller.iniciar()
    });
