const API_KEY = 'JFJ9CGH2SPLGY3JQ'
const form = document.getElementById("stockForm")
const input = document.getElementById("stockSymbol")
const watchlist = document.getElementById("watchlist")
const trackedSymbols = new Set()

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const symbol = input.value.toUpperCase().trim()
    if(symbol && !trackedSymbols.has(symbol)) {
        trackedSymbols.add(symbol)
        await fetchStock(symbol)
        input.value = ''
    }
})

async function fetchStock(symbol) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    try {
        const response = await fetch(url)
        const data = await response.json()
        const quote = data['Global Quote']
        if (quote && quote['05. price']) {
            const price = parseFloat(quote['05. price'])
            const changePercent = parseFloat(quote['10. change percent'])
            displayStock(symbol, price, changePercent)
        } else {
            alert('Symbol not found or API Limit exceeded.')
        }
    }catch(err) {
        console.log('Error fetching stock', err)
        alert('Something went wrong while fetching stock data.')
    }
}

function displayStock(symbol, price, changePercent) {

    let stockDiv = document.getElementById(symbol)

    if(stockDiv) {
        stockDiv.className = 'stock'
        stockDiv.classList.remove('loss')
        if(changePercent < 0) {
            stockDiv.classList.add('loss')
        }

        stockDiv.innerHTML = renderStockHtml(symbol, price, changePercent)
        return
    }


    stockDiv = document.createElement('div')
    stockDiv.id = symbol
    stockDiv.className = 'stock'
    if(changePercent < 0) {
        stockDiv.classList.add('loss')
    }

    stockDiv.innerHTML = renderStockHtml(symbol, price, changePercent)

    watchlist.append(stockDiv)
}

function renderStockHtml(symbol, price, changePercent) {
    return `<strong>${symbol}</strong><br>
            ₹${price.toFixed(2)} (${changePercent.toFixed(2)}%)`
} 

setInterval(()=> {
    trackedSymbols.forEach(symbol => {
        fetchStock(symbol)
    })
}, 30000)