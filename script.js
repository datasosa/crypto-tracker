document.addEventListener('DOMContentLoaded', () => {
    const cryptoListContainer = document.getElementById('cryptoList');
    const searchInput = document.getElementById('searchInput');

    // --- Placeholder data to simulate an API response ---
    const placeholderData = [
        {
            name: 'Bitcoin',
            symbol: 'btc',
            current_price: 65000.50,
            price_change_percentage_24h: 2.5,
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033479'
        },
        {
            name: 'Ethereum',
            symbol: 'eth',
            current_price: 3500.25,
            price_change_percentage_24h: -1.2,
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880'
        },
        {
            name: 'Solana',
            symbol: 'sol',
            current_price: 150.70,
            price_change_percentage_24h: 5.1,
            image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422'
        },
        {
            name: 'Ripple',
            symbol: 'xrp',
            current_price: 0.52,
            price_change_percentage_24h: -0.8,
            image: 'https://assets.coingecko.com/coins/images/447/large/xrp-symbol-white-128.png?1605779032'
        },
        {
            name: 'Cardano',
            symbol: 'ada',
            current_price: 0.45,
            price_change_percentage_24h: 3.2,
            image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860'
        },
        {
            name: 'Dogecoin',
            symbol: 'doge',
            current_price: 0.18,
            price_change_percentage_24h: 1.5,
            image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547034079'
        },
    ];

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
            const priceChangeClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
            const priceChangeArrow = coin.price_change_percentage_24h >= 0 ? '▲' : '▼';

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
                        ${priceChangeArrow} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}% (24h)
                    </div>
                </div>
            `;
            cryptoListContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // Initial render with placeholder data
    renderCryptoCards(placeholderData);

    // --- Add search functionality ---
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = placeholderData.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm) || coin.symbol.toLowerCase().includes(searchTerm)
        );
        renderCryptoCards(filteredData);
    });

    // You can add more functionality here, like a detail view on click.
});
