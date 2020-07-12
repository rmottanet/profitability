// Variáveis globais para armazenar as taxas
let SELIC;
let IPCA;

/**
 * Busca a taxa SELIC na API e retorna o valor.
 */
async function fetcherSELIC() {
    try {
        const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');
        if (!response.ok) {
            throw new Error('Falha na resposta da API.');
        }
      
		const data = await response.json();
		SELIC = parseFloat(data[0].valor) / 100;
		return SELIC;		

    } catch (error) {
        console.error('Erro na requisição SELIC:', error);
        throw error;
    }
}

/**
 * Busca a taxa IPCA acumulada em 12 meses na API e retorna o valor.
 */
async function fetcherIPCA() {
    try {
        const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json');
        if (!response.ok) {
            throw new Error('Falha na resposta da API');
        }
        
        const data = await response.json();
        let ipca = 0;
        
        for (var i = 0; i < data.length; i++) {
            ipca += parseFloat(data[i].valor);            
        }
        
        IPCA = parseFloat(ipca);
        return IPCA;

    } catch (error) {
        console.error('Erro na requisição IPCA:', error);
        throw error;
    }
}


// Funções de cálculo
// ==================

/**
 * Calcula alíquota do Impossto de renda.
 * 
 * @param {number} term - Período do contrato em dias.
 */
function tributo(term) {
	
	const tributeRanges = {
		
		0: { upperBound: 180, taxIR: 0.225 },
	    1: { upperBound: 360, taxIR: 0.20 },
	    2: { upperBound: 720, taxIR: 0.175 },
	    3: { upperBound: Infinity, taxIR: 0.15 },
	    
	};
	
	try {
		
		const { taxIR, upperBound } = Object.values(tributeRanges).find(
			({ upperBound }) => term <= upperBound
		);

		return taxIR;
	
	} catch (err) {
		throw new Error(`Erro: ${err.message}`);
	}	
}

/**
 * Calcula taxa proporcional em relação a SELIC.
 * 
 * @param {number} rate - Taxa bruta do contrato.
 */
function prop(rate) {
	
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

/**
 * Calcula rentabilidade líquida aproximada em contatos de CDB Pre fixado.
 * 
 * @param {number} rate - Taxa bruta do contrato.
 * @param {number} term - Período do contrato em dias. 
 */
function pre(rate, term) {
	
	try {
		
		const IR = tributo(term);
		const profit = parseFloat(rate) * (1 - IR);
		return { profit, IR, error: null };
		
	} catch (err) {
		return { profit: null, IR: null, error: err.message };
	}
}

/**
 * Calcula rentabilidade líquida aproximada em contatos de CDB Pós fixado.
 * 
 * @param {number} rate - Taxa bruta do contrato.
 * @param {number} term - Período do contrato em dias.
 */
function pos(rate, term) {
	
	try {
		
		if (SELIC === undefined || SELIC === null) {
            throw new Error('A taxa SELIC não está definida.');
        }
        		
		const IR = tributo(term);
		const profit = parseFloat(rate) * SELIC * (1 - IR);
		return { profit, IR, error: null };
		
	} catch (err) {
		return { profit: null, IR: null, error: err.message };
	}
}

/**
 * Calcula rentabilidade líquida aproximada em contatos de CDB Pós fixado.
 * 
 * @param {number} rate - Taxa bruta do contrato.
 * @param {number} term - Período do contrato em dias.
 */
function ipcapos(rate, term) {
	
	try {
		
		if (IPCA === undefined || IPCA === null) {
            throw new Error('A taxa IPCA não está definida.');
        }
        
		const IR = tributo(term);
		const profit = (parseFloat(rate) + IPCA) * (1 - IR);
		return { profit, IR, error: null };
		
	} catch (err) {
		return { profit: null, IR: null, error: err.message };
	}
}


// Funções de display
// ==================

// Display Taxas
function displayRatesInfo(elementId, label, value, errorMessage) {
    const element = document.getElementById(elementId);

    if (errorMessage) {
        element.innerHTML = `Erro na requisição para ${label}: ${errorMessage}`;
    } else {
        let formattedValue = value;
        // Adiciona formatação específica para SELIC
        if (label === 'SELIC') {
            formattedValue = (value * 100).toFixed(2) + '%';
        } else if (label === 'IPCA') {
            formattedValue = value.toFixed(2) + '%';
        }

        element.innerHTML = `${label}: ${formattedValue}`;
    }
}


// Display Results
function displayResults({ profit, IR, error: errorMessage }) {
    const resultElement = document.getElementById('result');
    const errorElement = document.getElementById('error');

    // Limpar conteúdo anterior
    resultElement.innerHTML = '';
    errorElement.innerHTML = '';

    if (errorMessage) {
        // Exibir erro
        errorElement.innerHTML = errorMessage;
    } else {
        // Exibir resultados
        resultElement.innerHTML = `Líquido: ${parseFloat(profit).toFixed(2)}%`;

        if (IR > 0) {
            resultElement.innerHTML += `<br>IR: ${(IR * 100).toFixed(2)}%`;
        }
    }
}

// Main
// ==================
function calculateProfit() {
    // Obter valores dos inputs
    const rate = parseFloat(document.getElementById('rate').value);
    const term = parseInt(document.getElementById('term').value);
    const operation = document.querySelector('input[name="operation"]:checked').value;

    // Validar entradas
    if (isNaN(rate) || (isNaN(term) && operation !== 'prop') || rate <= 0 || term < 0) {
        const errorResult = { error: 'Por favor, insira números válidos maiores que zero.' };
        displayResults(errorResult);
        return;
    }

    // Executar a operação selecionada
    let result;

    switch (operation) {
        case 'pre':
            result = pre(rate, term);
            break;
        case 'pos':
            result = pos(rate, term);
            break;
        case 'ipca':
            result = ipcapos(rate, term);
            break;
        case 'prop':
            result = prop(rate);
            break;
        default:
            displayResults(result);
            return;
    }

    displayResults(result);
}


// On Load
// ==================
window.onload = async function () {
    try {
        const selicPromise = fetcherSELIC();
        const ipcaPromise = fetcherIPCA();

        const selicValue = await selicPromise.catch(error => {
            console.error(`Erro ao obter SELIC: ${error.message}`);
            return null;
        });

        const ipcaValue = await ipcaPromise.catch(error => {
            console.error(`Erro ao obter IPCA: ${error.message}`);
            return null;
        });

        displayRatesInfo('selicRate', 'SELIC', selicValue, selicValue ? null : 'Erro ao obter SELIC.');
        displayRatesInfo('ipcaRate', 'IPCA', ipcaValue, ipcaValue ? null : 'Erro ao obter IPCA.');
    } catch (error) {
        console.error(error);
    }
};
