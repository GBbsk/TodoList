export class IDTASK{
    constructor(){
    }
    
    baseID(){
      const data = crypto.randomUUID();
      return data
    }
  
    ID(){
      return `task-${this.baseID()}`;
    }

  };