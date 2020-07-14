class Display {
  // Método para exibir informações de taxas
  static displayRatesInfo(elementId, label, value, errorMessage) {
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

  // Método para exibir resultados
  static displayResults({ profit, IR, error: errorMessage }) {
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
}