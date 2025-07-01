document.addEventListener('DOMContentLoaded', () => {
    const cryptoListContainer = document.getElementById('cryptoList');
    const searchInput = document.getElementById('searchInput');

    // ** Correct API endpoint URL from CoinGecko **
    const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    
    // Global variable to hold all fetched data for filtering
    let allCryptoData = [];

    /**
     * Renders the list of cryptocurrency cards on the page.
     * @param {Array} data - The array of cryptocurrency data.
     */
    function renderCryptoCards(data) {
        cryptoListContainer.innerHTML = ''; // Clear previous content
        if (!data || data.length === 0) {
            cryptoListContainer.innerHTML = '<div class="loading">No cryptocurrencies found.</div>';
            return;
        }

        data.forEach(coin => {
            // ** CORRECTED PROPERTY NAME HERE **
            const priceChange = coin.price_change_percentage_24h;
            const priceChangeClass = priceChange >= 0 ? 'positive' : 'negative';
            const priceChangeArrow = priceChange >= 0 ? '▲' : '▼';

            const cardHTML = `
                <div class="crypto-card">
                    <div class="card-header">
                        <img src="${coin.image}" alt="${coin.name} icon" class="crypto-icon">
                        <div>
                            <div class="crypto-name">${coin.name}</div>
                            <div class="crypto-symbol">${coin.symbol.toUpperCase()}</div>
                        </div>
                    </div>
                    <div class="crypto-price">$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div class="price-change ${priceChangeClass}">
                        ${priceChangeArrow} ${Math.abs(priceChange).toFixed(2)}% (24h)
                    </div>
                </div>
            `;
            cryptoListContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    /**
     * Fetches cryptocurrency data from the CoinGecko API.
     */
    async function fetchCryptoData() {
        // Show loading state, but only if the list is currently empty
        if (allCryptoData.length === 0) {
            cryptoListContainer.innerHTML = '<div class="loading">Loading cryptocurrency data...</div>';
        }

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            
            // Store the fetched data globally for filtering
            allCryptoData = data; 
            
            renderCryptoCards(allCryptoData); // Render all fetched data initially
            
        } catch (error) {
            console.error('Error fetching data:', error);
            cryptoListContainer.innerHTML = `<div class="loading error">Failed to load data. Please try again later. <br/> Error: ${error.message}</div>`;
        }
    }

    // --- Search functionality updated to filter the global data ---
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Filter the globally stored data, not re-fetching the API
        const filteredData = allCryptoData.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm) || coin.symbol.toLowerCase().includes(searchTerm)
        );
        
        renderCryptoCards(filteredData);
    });
    
    // Fetch data when the page loads
    fetchCryptoData();

    // Refresh data every 60 seconds for live updates
    // The CoinGecko free API has rate limits, so 60 seconds is a safe interval.
    setInterval(fetchCryptoData, 60000); // 60000 milliseconds = 1 minute
});
