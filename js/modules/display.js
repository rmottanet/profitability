class Display {
	// display Taxas
	static displayRatesInfo(elementId, label, value, errorMessage) {
		const element = document.getElementById(elementId);
		
		if (errorMessage) {
			element.innerHTML = `Erro na requisição para ${label}: ${errorMessage}`;
		} else {
			element.innerHTML = `<div class="${label.toLowerCase()}">${value}</div><div class="rate-label">${label}</div>`;
		}
	}

    // display Results
    static displayResults(result, operation) {
        const resultElement = document.getElementById('result');
        const errorElement = document.getElementById('error');

        resultElement.innerHTML = '';
        errorElement.innerHTML = '';

        if (result.error) {
            errorElement.innerHTML = result.error;
        } else {
            if (operation === 'prop') {
                resultElement.innerHTML = result.prop;
            } else {
                resultElement.innerHTML = `Líquido: ${result.liquid}`;

                if ('tribute' in result) {
                    resultElement.innerHTML += `<br>IR: ${result.tribute}`;
                }
            }
        }
    }
}
