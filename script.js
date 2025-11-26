// script.js (same logic, just cleaner comments)
document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('productsContainer');
  const filterBar = document.getElementById('filterBar');
  let allProducts = [];

  fetch('products.json')
    .then(response => {
      if (!response.ok) throw new Error('products.json not found or invalid');
      return response.json();
    })
    .then(products => {
      allProducts = products;

      const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
      
      // All button
      filterBar.innerHTML = `<button class="filter-btn active" data-category="all">All</button>`;
      
      // Category buttons
      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.category = cat;
        btn.textContent = cat;
        btn.addEventListener('click', () => filterProducts(cat));
        filterBar.appendChild(btn);
      });

      renderProducts(allProducts);
    })
    .catch(err => {
      console.error(err);
      productsContainer.innerHTML = `
        <p style="grid-column:1/-1; text-align:center; color:#d4a5a5; font-size:1.3rem; padding:2rem;">
          🧵 Unable to load products. Check your <code>products.json</code>.
        </p>
      `;
    });

  function renderProducts(list) {
    productsContainer.innerHTML = list.length ? '' : `
      <p style="grid-column:1/-1; text-align:center; color:#7a6f6f;">No items in this category.</p>
    `;
    
    list.forEach(p => {
      const fallback = 'https://via.placeholder.com/320x320/f8f3ed/d4a5a5?text=StichStory';
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img class="product-image" src="${p.image || fallback}" alt="${p.name}" onerror="this.src='${fallback}'">
        <div class="product-info">
          <span class="product-category">${p.category || 'Collection'}</span>
          <h3 class="product-name">${p.name}</h3>
          <p class="product-price">${p.price || '—'}</p>
          <a href="${p.meeshoUrl || '#'}" target="_blank" class="buy-btn">
            ${p.meeshoUrl ? 'Buy on Meesho' : 'Not Available'}
          </a>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  }

  function filterProducts(cat) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === (cat === 'all' ? 'all' : cat));
    });
    renderProducts(cat === 'all' ? allProducts : allProducts.filter(p => p.category === cat));
  }
});