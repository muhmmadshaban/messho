document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('productsContainer');
  const filterBar = document.getElementById('filterBar');
  let allProducts = [];

  // Fetch and load products
  fetch('products.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load products.json');
      return response.json();
    })
    .then(products => {
      allProducts = products;

      // Get unique categories (in order of appearance)
      const categorySet = new Set();
      products.forEach(p => {
        if (p.category) categorySet.add(p.category);
      });
      const categories = Array.from(categorySet);

      // Create filter buttons
      filterBar.innerHTML = '';
      // Add 'All' button first
      const allBtn = document.createElement('button');
      allBtn.className = 'filter-btn active';
      allBtn.dataset.category = 'all';
      allBtn.textContent = 'All';
      allBtn.addEventListener('click', () => filterProducts('all'));
      filterBar.appendChild(allBtn);

      // Add category buttons
      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.category = cat;
        btn.textContent = cat;
        btn.addEventListener('click', () => filterProducts(cat));
        filterBar.appendChild(btn);
      });

      // Render all products initially
      renderProducts(allProducts);
    })
    .catch(err => {
      console.error('Error loading products:', err);
      productsContainer.innerHTML = `
        <p style="grid-column: 1 / -1; text-align: center; color: #e91e63; font-size: 1.2rem;">
          ❌ Failed to load products. Please check your <code>products.json</code> file.
        </p>
      `;
    });

  // Render product cards
  function renderProducts(productsToShow) {
    productsContainer.innerHTML = '';
    if (productsToShow.length === 0) {
      productsContainer.innerHTML = `
        <p style="grid-column: 1 / -1; text-align: center; color: #888;">
          No products found in this category.
        </p>
      `;
      return;
    }

    productsToShow.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      // Fallback image if load fails
      const fallbackImg = 'https://via.placeholder.com/260x260?text=No+Image';
      card.innerHTML = `
        <img class="product-image" 
             src="${product.image || fallbackImg}" 
             alt="${product.name}"
             onerror="this.src='${fallbackImg}'">
        <div class="product-info">
          <span class="product-category">${product.category || 'Uncategorized'}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">${product.price || 'Price not available'}</p>
          <a href="${product.meeshoUrl || '#'}" target="_blank" class="buy-btn">
            ${product.meeshoUrl ? 'Buy Now' : 'Unavailable'}
          </a>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  }

  // Filter logic
  function filterProducts(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });

    if (category === 'all') {
      renderProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === category);
      renderProducts(filtered);
    }
  }
});