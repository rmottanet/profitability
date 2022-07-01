class DataFetcher {
    async fetchTaxas() {
		
        try {
			
            const apiUrl = 'https://profitability.deno.dev/api/taxas';
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Erro na requisição à API: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async fetchResult(url) {
		
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
	}
}

const dataFetcherInstance = new DataFetcher();

window.dataFetcher = dataFetcherInstance;
