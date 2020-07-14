class Tribute {
	aliquot(term) {
		const taxRanges = {
		
		0: { upperBound: 180, taxRate: 0.225 },
	    1: { upperBound: 360, taxRate: 0.20 },
	    2: { upperBound: 720, taxRate: 0.175 },
	    3: { upperBound: Infinity, taxRate: 0.15 },
	    
		};
	
		try {
		
			const { taxRate, upperBound } = Object.values(taxRanges).find(
				({ upperBound }) => term <= upperBound
			);
	
			return taxRate;
	
		} catch (err) {
			throw new Error(`Erro: ${err.message}`);
		}	
	}
}


class Calculus {

	constructor() {
		this.tributeInstance = new Tribute();
	}
  
	prop(rate) {
		
		try {
			
			if (SELIC === undefined || SELIC === null) {
	            throw new Error('A taxa SELIC não está definida.');
	        }
	        
			const IR = 0;
			const profit = parseFloat(rate) * SELIC;
			return { profit, IR, error: null };
			
		} catch (err) {
			return { profit: null, IR: null, error: err.message };
		}	
	}
    
	pre(rate, term) {
		
		try {
			
			const IR = this.tributeInstance.aliquot(term);
			const profit = parseFloat(rate) * (1 - IR);
			return { profit, IR, error: null };
			
		} catch (err) {
			return { profit: null, IR: null, error: err.message };
		}
	}
    
	pos(rate, term) {
		
		try {
			
			if (SELIC === undefined || SELIC === null) {
	            throw new Error('A taxa SELIC não está definida.');
	        }
	        
			const IR = this.tributeInstance.aliquot(term);
			const profit = parseFloat(rate) * SELIC * (1 - IR);
			return { profit, IR, error: null };
			
		} catch (err) {
			return { profit: null, IR: null, error: err.message };
		}
	}

	ipcapos(rate, term) {
		
		try {
			
			if (IPCA === undefined || IPCA === null) {
	            throw new Error('A taxa IPCA não está definida.');
	        }
	        
			const IR = this.tributeInstance.aliquot(term);
			const profit = (parseFloat(rate) + IPCA) * (1 - IR);
			return { profit, IR, error: null };
			
		} catch (err) {
			return { profit: null, IR: null, error: err.message };
		}
	}

}

// Crie uma instância da classe
const calculusInstance = new Calculus();

// Atribua a instância a uma variável global
window.Calculus = calculusInstance
