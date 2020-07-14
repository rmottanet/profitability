// Variáveis globais para armazenar as taxas
let SELIC;
let IPCA;

// On Load
// ==================
window.onload = async function () {
    try {
        const selicPromise = window.dataFetcher.fetchSELIC();
        const ipcaPromise = window.dataFetcher.fetchIPCA();

        const selicValue = await selicPromise.catch(error => {
            console.error(`Erro ao obter SELIC: ${error.message}`);
            Display.displayRatesInfo('selicRate', 'SELIC', null, `Erro ao obter SELIC: ${error.message}`);
            return null;
        });

        const ipcaValue = await ipcaPromise.catch(error => {
            console.error(`Erro ao obter IPCA: ${error.message}`);
            Display.displayRatesInfo('ipcaRate', 'IPCA', null, `Erro ao obter IPCA: ${error.message}`);
            return null;
        });

        Display.displayRatesInfo('selicRate', 'SELIC', selicValue, selicValue ? null : 'Erro ao obter SELIC.');
        Display.displayRatesInfo('ipcaRate', 'IPCA', ipcaValue, ipcaValue ? null : 'Erro ao obter IPCA.');
    } catch (error) {
        console.error(error);
    }
};


// Main
// ==================
async function calculateProfit() {
    try {
        // Obtenha valores dos inputs
        const rate = parseFloat(document.getElementById('rate').value);
        const term = parseInt(document.getElementById('term').value);
        const operation = document.querySelector('input[name="operation"]:checked').value;

        // Valide as entradas
        if (isNaN(rate) || (isNaN(term) && operation !== 'prop') || rate <= 0 || term < 0) {
            const errorResult = { error: 'Por favor, insira números válidos maiores que zero.' };
            Display.displayResults(errorResult);
            return;
        }

        // Execute a operação selecionada
        let result;

        switch (operation) {
            case 'pre':
                result = window.Calculus.pre(rate, term);
                break;
            case 'pos':
                result = window.Calculus.pos(rate, term);
                break;
            case 'ipca':
                result = window.Calculus.ipcapos(rate, term);
                break;
            case 'prop':
                result = window.Calculus.prop(rate);
                break;
            default:
                Display.displayResults(result);
                return;
        }

        // Exiba os resultados
        Display.displayResults(result);
    } catch (error) {
        console.error(error);
        const errorResult = { error: 'Erro ao calcular a taxa líquida.' };
        Display.displayResults(errorResult);
    }
}


