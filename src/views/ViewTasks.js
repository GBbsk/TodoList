export class ViewTasks {
  constructor(
    selectorInputTarefas, SelectorBtnAddTarefas, 
    selectorExibirTarefas,
    selectorDeleteTarefas, selectorDataTime,
    selectorTagTrabalho, selectorTagPessoal,
    selectorTagUrgente, selectorAreaVazia,
    selectorBtnEditTask, selectorModalDeleteTarefas,
    selectorBtnTodas, selectorBtnPendentes, 
    selectorBtnFeitas, selectorModalEdit
  ) {

    this.categoriaSelecionada = "Trabalho";

    this.inputTarefas = document.querySelector(selectorInputTarefas);
    this.btnAddTarefas = document.querySelector(SelectorBtnAddTarefas);
    this.exibirTarefasNoCard = document.querySelector(selectorExibirTarefas);
    this.deletarTarefas = document.querySelector(selectorDeleteTarefas);

    this.btnEdit = document.querySelector(selectorBtnEditTask);

    this.filtroTodas = document.querySelector(selectorBtnTodas);
    this.filtroPendentes = document.querySelector(selectorBtnPendentes);
    this.filtroFeitas = document.querySelector(selectorBtnFeitas);

    this.modalDelete = document.querySelector(selectorModalDeleteTarefas);

    this.exibirDataDisplay = document.querySelector(selectorDataTime);

    this.selectTrabalho = document.querySelector(selectorTagTrabalho);
    this.selectPessoal = document.querySelector(selectorTagPessoal);
    this.selectUrgente = document.querySelector(selectorTagUrgente);

    // this.btnSave = document.querySelector(selectorBtnSalvarEdit);
    // this.select = document.querySelector(selectorFormSelect);
     
    this.modalEdit = document.querySelector( selectorModalEdit);



    this.areaVazia = document.querySelector(selectorAreaVazia);
  }


    exibirData(data){
        this.exibirDataDisplay.textContent = data
    }

    getValueInput(){
        return this.inputTarefas.value
    }

    bindSaveTask(handler){
        this.btnAddTarefas.addEventListener('click', handler)
    }

    bindEnterKey(handler){
        this.inputTarefas.addEventListener('keypress', (e) => {
                handler(e);
        });
    };

    bindDeleteTask(handler){
        this.onDeleteTask = handler;
    };
    
    bindEditTask(handler){
        this.onSaveEdit = handler;
    };

    bindCheckboxChange(handler) {
        this.onCheckboxChange = handler;
    };

    bindFiltro(handler) {
        const botoes = [this.filtroTodas, this.filtroPendentes, this.filtroFeitas];

        botoes.forEach((botao) => {
            botao.addEventListener("click", () => {
                botoes.forEach(btn => btn.classList.remove("active"));
                botao.classList.add("active");
                
                const textoBotao = botao.textContent.trim();
                handler(textoBotao); // Chama o handler com o filtro
            });
        });
    };

    // ===== Métodos auxiliares para exibirTarefas =====
    
    obterCoresTemplate() {
        return {
            "Urgente": "danger",
            "Trabalho": "primary",
            "Pessoal": "success"
        };
    };

    obterAtributosDoStatus(status) {
        return {
            checkedAttr: status ? "checked" : "",
            classeRisco: status ? "text-decoration-line-through text-muted" : ""
        };
    }

    criarHtmlDaTarefa(tarefaOBJ, checkedAttr, classeRisco, cores) {
        return `
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
    }

    configurarEventoCheckbox(novaTask, tarefaOBJ) {
        const checkbox = novaTask.querySelector(".checkbox-conclusao");
        const label = novaTask.querySelector("label");

        checkbox.addEventListener("change", (event) => {
            const isChecked = event.target.checked;
            
            if(isChecked) {
                label.classList.add("text-decoration-line-through", "text-muted");
            } else {
                label.classList.remove("text-decoration-line-through", "text-muted");
            }
            
            this.onCheckboxChange(tarefaOBJ.id, isChecked);
        });
    }

    configurarEventoEdit(novaTask, tarefaOBJ) {
        const btnEdit = novaTask.querySelector(".btn-edit");
        btnEdit.addEventListener("click", () => {
            this.editarTarefa(tarefaOBJ);
        });
    }

    configurarEventoDelete(novaTask, tarefaOBJ) {
        const btnDelete = novaTask.querySelector(".btn-delete");

        btnDelete.addEventListener("click", () => {
             const deletarTarefas = document.querySelector(".deleteTaskBtn");
                
            deletarTarefas.onclick = () => {
                this.onDeleteTask(novaTask, tarefaOBJ.id);
            };
        });
    }

    // ===== Função principal refatorada =====
    
    exibirTarefas(tarefaOBJ) {
        // Validação: verifica se tarefaOBJ e suas propriedades obrigatórias existem
        if (!tarefaOBJ || !tarefaOBJ.nome || tarefaOBJ.nome.trim() === "") {
            return; // Não exibe tarefas inválidas
        }
        
        const novaTask = document.createElement("li");
        novaTask.className = "list-group-item d-flex justify-content-between align-items-center";

        // Obter atributos e cores
        const { checkedAttr, classeRisco } = this.obterAtributosDoStatus(tarefaOBJ.status);
        const cores = this.obterCoresTemplate();

        // Criar HTML
        novaTask.innerHTML = this.criarHtmlDaTarefa(tarefaOBJ, checkedAttr, classeRisco, cores);

        // Configurar eventos
        this.configurarEventoCheckbox(novaTask, tarefaOBJ);
        this.configurarEventoEdit(novaTask, tarefaOBJ);
        this.configurarEventoDelete(novaTask, tarefaOBJ);

        // Adicionar ao DOM
        this.exibirTarefasNoCard.appendChild(novaTask);
    };

    editarTarefa(tarefaOBJ) {
        const modal = document.querySelector("#modalEdit");
        const editTask = modal.querySelector(".editTask");
        const select = modal.querySelector(".form-select");
        const btnSave = modal.querySelector(".saveEdit");

        // Popula imediatamente, sem esperar evento
        select.innerHTML = "";
        ["Trabalho", "Pessoal", "Urgente"].forEach(classe => {
            const option = document.createElement("option");
            option.value = classe;
            option.textContent = classe;
            option.selected = classe === tarefaOBJ.classe;
            select.appendChild(option);
        });

        editTask.value = tarefaOBJ.nome;

        btnSave.onclick = (event) => {
            if (event) event.preventDefault();
            const novoNome = editTask.value.trim();
            const novaClasse = select.value;

            if (novoNome === "") return;

            this.onSaveEdit(tarefaOBJ.id, novoNome, novaClasse);

            const btnFechar = modal.querySelector('[data-bs-dismiss="modal"]');
            if (btnFechar) btnFechar.click();
        };
    }
        
    selectorDeClasseDasTarefa(){
        const botoes = [
            this.selectTrabalho,
            this.selectPessoal,
            this.selectUrgente
        ];

        botoes.forEach((botaoClicado) => {

            botaoClicado.addEventListener("click", () => {
                botoes.forEach(btn => btn.classList.remove("active"));

                botaoClicado.classList.add("active");
                this.categoriaSelecionada = botaoClicado.textContent;
            });
            
        });
    };

    verificarEstadoDaLista() {
        const listaTarefas = this.exibirTarefasNoCard
        const areaVazia = this.areaVazia

        if (listaTarefas.children.length === 0) {
            areaVazia.classList.remove('d-none');
        } else {
            areaVazia.classList.add('d-none');
        }
    };
};