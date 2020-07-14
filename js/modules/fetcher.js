// variável global para armazenar a taxa SELIC 
class DataFetcher {
    async fetchSELIC() {
        try {
            const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar os dados da SELIC: (${response.status}) ${response.statusText}`);
            }
            
            const data = await response.json();
            const selic = data[0].valor;
            
            SELIC = parseFloat(selic) / 100;

            return SELIC
            
	    } catch (error) {
	        console.error('Erro na requisição SELIC:', error);
	        throw error;
	    }
    }

    async fetchIPCA() {
        try {
            const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json');
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar os dados do IPCA: (${response.status}) ${response.statusText}`);
            }
            
            const data = await response.json();
            let ipca = 0;

            for (let i = 0; i < data.length; i++) {
                ipca += parseFloat(data[i].valor);
            }
            
            IPCA = parseFloat(ipca);

            return IPCA
            
	    } catch (error) {
	        console.error('Erro na requisição IPCA:', error);
	        throw error;
	    }
    }

}

// Crie uma instância da classe
const dataFetcherInstance = new DataFetcher();

// Atribua a instância a uma variável global
window.dataFetcher = dataFetcherInstance;
