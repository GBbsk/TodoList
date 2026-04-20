export class ViewTimer{
    constructor(
    selectorPomodoro, selectorShortBreak, 
    selectorLongBreak, selectorCustom, 
    selectorDisplay, selectorBtnStart, 
    selectorBtnStop, selectorBtnReset,
    selectorInputCustom, selectorBtnCustom, 
    selectorInputCustomPause){
        
    this.pomodoro = document.querySelector(selectorPomodoro)
    this.shortBreak = document.querySelector(selectorShortBreak)
    this.longBreak = document.querySelector(selectorLongBreak)

    this.custom = document.querySelector(selectorCustom)
    this.customInput = document.querySelector(selectorInputCustom)
    this.customSave = document.querySelector(selectorBtnCustom)
    this.customPause = document.querySelector(selectorInputCustomPause)

    this.displayTempo = document.querySelector(selectorDisplay);

    this.btnStart = document.querySelector(selectorBtnStart);
    this.btnStop = document.querySelector(selectorBtnStop);
    this.btnReset = document.querySelector(selectorBtnReset);
    }

    atualizarDisplay(segundosTotais){
        const minutos = Math.floor(segundosTotais / 60);
        const segundos = segundosTotais % 60;
        
        const formatoMin = String(minutos).padStart(2, '0')
        const formatoSeg = String(segundos).padStart(2, '0')

        this.displayTempo.textContent = `${formatoMin}:${formatoSeg}`
    };

    bindStart(handler) {
        this.btnStart.addEventListener('click', handler);
    };

    bindStop(handler) {
        this.btnStop.addEventListener('click', handler);
    };

    bindReset(handler) {
        this.btnReset.addEventListener('click', handler);
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
    const botoes = [
        this.pomodoro,
        this.shortBreak,
        this.longBreak,
        this.custom
    ];

    botoes.forEach((botaoSelecionado) => {
        if (botaoSelecionado) {
            botaoSelecionado.addEventListener('click', () => {
                
                botoes.forEach(btn => {
                    if (btn) btn.classList.remove("active");
                });

                botaoSelecionado.classList.add("active");
            });
        }});
    }

    obterValoresCustomizados() {
        return {
            foco: Number(this.customInput.value),
            pausa: Number(this.customPause.value)
        };
    };

}