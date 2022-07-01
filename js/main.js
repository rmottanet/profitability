// On Load get rate
// ==================
window.onload = async function () {
    try {
		
        const taxas = await dataFetcherInstance.fetchTaxas();

        Display.displayRatesInfo('selicRate', 'SELIC', taxas.selic, null);
        Display.displayRatesInfo('ipcaRate', 'IPCA', taxas.ipca, null);
        
    } catch (error) {
        console.error(error);
    }
};

// Main
// ==================
async function calculateProfit() {
    try {
        // get inputs
        const rate = parseFloat(document.getElementById('rate').value);
        const term = parseInt(document.getElementById('term').value);
        const operation = document.querySelector('input[name="operation"]:checked').value;

        // validation
        const rateRegex = /^\d{1,3}(\.\d{1,2})?$/;
        const termRegex = /^\d{1,4}$/;

        if (!rateRegex.test(rate) || (!termRegex.test(term.toString()) && operation !== 'prop') || rate <= 0 || term < 0) {
            const errorResult = { error: 'Por favor, insira números válidos.' };
            Display.displayResults(errorResult);
            return;
        }

        // url constructor
        const apiUrl = `https://profitability.deno.dev/api/${operation}?rate=${rate}${term ? `&term=${term}` : ''}`;

        const result = await dataFetcherInstance.fetchResult(apiUrl);

        Display.displayResults(result, operation);
        
    } catch (error) {
        console.error(error);
        const errorResult = { error: 'Erro ao calcular a taxa líquida.' };
        Display.displayResults(errorResult);
    }
}
