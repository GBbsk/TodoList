export class DataTime{
    constructor(){
    }
    
    exibirData(){
        const agora = new Date()
        
        const dataFormatada = agora.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        const dataFinal = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
        
        return dataFinal
    };
};