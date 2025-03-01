let exchangeRates = {};
let currentData = {};


async function getAndCreateDataToChart() {
    const labels = Object.keys(currentData);
    const values = Object.values(currentData).map(item => item.valor);
    return {
        labels: labels,
        datasets: [{
            label: 'Valores actuales',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
}


async function renderGrafica() {
    const data = await getAndCreateDataToChart();
    const config = {
        type: "bar",
        data
    };
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    new Chart(myChart, config);
}


async function loadData() {
    try {
        const response = await fetch('https://mindicador.cl/api/');
        const data = await response.json();

        
        exchangeRates = {
            dolar: data.dolar.valor,
            euro: data.euro.valor,
            uf: data.uf.valor,
            dolar_intercambio: data.dolar_intercambio.valor,
            bitcoin: data.bitcoin.valor
        };

        
        currentData = {
            "Dólar observado": data.dolar,
            "Euro": data.euro,
            "Unidad de Fomento (UF)": data.uf,
            "Dólar acuerdo": data.dolar_intercambio,
            "Bitcoin": data.bitcoin
        };

        
        renderGrafica();
    } catch (error) {
        console.error('Error al cargar los datos de la API:', error);
    }
}


loadData();


document.getElementById('convertButton').addEventListener('click', () => {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;
    let result;

    if (amount && exchangeRates[currency]) {
        result = (amount / exchangeRates[currency]).toFixed(2);
        document.getElementById('result').innerText = `${result} ${currency.toUpperCase()}`;
    } else {
        document.getElementById('result').innerText = 'Por favor, ingresa una cantidad válida.';
    }
});