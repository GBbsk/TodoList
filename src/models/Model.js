import { Validators } from '../utils/validators.js';

export class TimerModel {
  constructor(tempoFoco = 25, tempoPausa = 5) {
    this.minutosFoco = tempoFoco;
    this.minutosPausa = tempoPausa;
    
    this.modoAtual = 'foco'; // Pode ser 'foco' ou 'pausa'
    this.tempoRestante = this.minutosFoco * 60; 
    
    // Controle do relógio interno
    this.estaRodando = false;
    this.idIntervalo = null;

    this.storageKey = 'tasks';
  }

  // Atualiza as preferências do usuário LOGICA DO CUSTOM
  configurarTempo(novoFoco, novaPausa) {
    this.minutosFoco = novoFoco;
    this.minutosPausa = novaPausa;
    this.reiniciar(); // Aplica o novo tempo imediatamente
  }

  // O "coração" que faz o tempo passar
  iniciar(callbackTick, callbackFim) {
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
  }

  parar() {
    this.estaRodando = false;
    clearInterval(this.idIntervalo);
  }

  alternarModo() {
    if (this.modoAtual === 'foco') {
      this.modoAtual = 'pausa';
      this.tempoRestante = this.minutosPausa * 60;
    } else {
      this.modoAtual = 'foco';
      this.tempoRestante = this.minutosFoco * 60;
    }
  }

  reiniciar() {
    this.parar();
    
    if (this.modoAtual === 'foco') {
      this.tempoRestante = this.minutosFoco * 60;
    } else {
      this.tempoRestante = this.minutosPausa * 60;
    }
  }

  getAll() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  // Adiciona uma única tarefa ao banco
  addTask(task) {
    if (!task || !task.id || !task.nome) {
      throw new Error('Tarefa inválida: faltam propriedades obrigatórias');
    }
    const tasks = this.getAll();
    tasks.push(task);
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  // Atualiza o banco de dados completo (para atualizações em massa)
  updateDatabase(tasks) {
    if (!Array.isArray(tasks)) {
      throw new Error('updateDatabase requer um array de tarefas');
    }
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  // Método legado mantido para compatibilidade
  saveDatabase(task) {
    this.addTask(task);
  }

  delete(id) {
    const tasks = this.getAll().filter(i => i.id !== id);
    this.updateDatabase(tasks);
  }

  // Para ADICIONAR uma tarefa individual
  addTask(task) {
    if (!task || !task.id || !task.nome) {
        throw new Error('Tarefa inválida');
    }
    const tasks = this.getAll();
    tasks.push(task);
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  // Para ATUALIZAR o banco inteiro (útil quando atualiza status, edita, etc)
  updateDatabase(tasks) {
    if (!Array.isArray(tasks)) {
        throw new Error('Deve ser um array de tarefas');
    }
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }
};