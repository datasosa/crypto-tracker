document.addEventListener('DOMContentLoaded', () => {
    const cryptoListContainer = document.getElementById('cryptoList');
    const searchInput = document.getElementById('searchInput');

    // ** New: API endpoint URL **
    const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

    /**
     * Renders the list of cryptocurrency cards on the page.
     * @param {Array} data - The array of cryptocurrency data.
     */
    function renderCryptoCards(data) {
        cryptoListContainer.innerHTML = ''; // Clear previous content
        if (data.length === 0) {
            cryptoListContainer.innerHTML = '<div class="loading">No cryptocurrencies found.</div>';
            return;
        }

        data.forEach(coin => {
            const priceChangeClass = coin.price_change_percentage_24h_in_currency >= 0 ? 'positive' : 'negative';
            const priceChangeArrow = coin.price_change_percentage_24h_in_currency >= 0 ? '▲' : '▼';

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
                        ${priceChangeArrow} ${Math.abs(coin.price_change_percentage_24h_in_currency).toFixed(2)}% (24h)
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
        cryptoListContainer.innerHTML = '<div class="loading">Loading cryptocurrency data...</div>'; // Show loading state

        try {
            const response = await fetch(API_URL);

            // Check if the response is successful (status code 200)
            if (!response.ok) {
                // Throw an error if the response is not OK (e.g., 404, 500)
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            
            // Store the fetched data for filtering (we need to make this global or accessible)
            window.allCryptoData = data; 
            
            renderCryptoCards(data); // Render all fetched data initially
            
        } catch (error) {
            console.error('Error fetching data:', error);
            cryptoListContainer.innerHTML = `<div class="loading error">Failed to load data. Please try again later. <br/> Error: ${error.message}</div>`;
        }
    }

    // --- Search functionality is now updated to filter live data ---
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Filter the globally stored data
        const filteredData = window.allCryptoData.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm) || coin.symbol.toLowerCase().includes(searchTerm)
        );
        
        renderCryptoCards(filteredData);
    });
    
    // Fetch data when the page loads
    fetchCryptoData();

    // ** Optional: Refresh data every 60 seconds to show live updates **
    setInterval(fetchCryptoData, 60000); // 60000 milliseconds = 1 minute
});
