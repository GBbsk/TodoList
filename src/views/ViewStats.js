export class ViewStats {
    constructor(
        selectorTaskConcluidas, selectorPorcentagemConcluidas,
        selectorEstatisticasTrabalho, selectorEstatisticasPessoal, 
        selectorEstatisticasUrgente) {

        this.tasksConcluidas = document.querySelector(selectorTaskConcluidas);
        this.porcentagemDeTaskConcluidas = document.querySelector(selectorPorcentagemConcluidas);

        this.estatisticasTrabalho = document.querySelector(selectorEstatisticasTrabalho);
        this.estatisticasPessoal = document.querySelector(selectorEstatisticasPessoal);
        this.estatisticasUrgente = document.querySelector(selectorEstatisticasUrgente);
    }

    atualizarStats(porcentagem, tarefasConcluidas, totalTarefas) { 
        this.porcentagemDeTaskConcluidas.textContent = `${porcentagem}%`;
        this.tasksConcluidas.textContent = `${tarefasConcluidas}/${totalTarefas}`;
    };

    atualizarStatsCategorias(contagem) {
        this.estatisticasTrabalho.textContent = contagem.trabalho;
        this.estatisticasPessoal.textContent = contagem.pessoal;
        this.estatisticasUrgente.textContent = contagem.urgente;
    };


}