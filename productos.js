// Load products from JSON
let products = [];

// Fetch products from JSON file
fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    products = data.productos;
    applyUrlFilters();
    filterProducts();
  })
  .catch(error => {
    console.error('Error loading products:', error);
  });

// State
let filteredProducts = [];
let activeFilters = {
  search: "",
  categoria: [],
  linea: []
};

// DOM Elements
const productsGrid = document.getElementById("products-grid");
const productCount = document.getElementById("product-count");
const productsEmpty = document.getElementById("products-empty");
const searchInput = document.getElementById("search-input");
const clearFiltersBtn = document.getElementById("clear-filters");
const clearFiltersEmptyBtn = document.getElementById("clear-filters-empty");
const toggleFiltersBtn = document.getElementById("toggle-filters");
const sidebar = document.getElementById("sidebar");
const closeSidebarBtn = document.getElementById("close-sidebar");

// Create overlay for mobile
const overlay = document.createElement("div");
overlay.className = "products-sidebar-overlay";
document.body.appendChild(overlay);

// Render products
function renderProducts() {
  if (filteredProducts.length === 0) {
    productsGrid.style.display = "none";
    productsEmpty.style.display = "block";
    productCount.textContent = "0";
    return;
  }

  productsGrid.style.display = "grid";
  productsEmpty.style.display = "none";
  productCount.textContent = filteredProducts.length;

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
    <article class="product-card animate-on-scroll">
      <div class="product-card__image">
        <img src="${product.image}" alt="${product.nombre}" loading="lazy" decoding="async" />
        ${product.linea === "premium" ? '<span class="product-card__badge">Premium</span>' : ""}
        ${product.categoria === "microgreens" ? '<span class="product-card__badge">MICROGREEN</span>' : ""}
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${product.nombre}</h3>
        <p class="product-card__unit">Venta por: ${product.unidad}</p>
      </div>
    </article>
  `
    )
    .join("");

  // Re-observe elements for animation
  if (window.animationObserver) {
    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
      window.animationObserver.observe(el);
    });
  }
}

// Filter products
function foldText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filterProducts() {
  filteredProducts = products.filter((product) => {
    // Search filter
    if (activeFilters.search) {
      const searchFolded = foldText(activeFilters.search);
      if (!foldText(product.nombre).includes(searchFolded)) {
        return false;
      }
    }

    // Category filter
    if (activeFilters.categoria.length > 0) {
      if (!activeFilters.categoria.includes(product.categoria)) {
        return false;
      }
    }

    // Line filter
    if (activeFilters.linea.length > 0) {
      if (!activeFilters.linea.includes(product.linea)) {
        return false;
      }
    }

    return true;
  });

  renderProducts();
}

function applyUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  const linea = params.get("linea");
  const q = params.get("q");

  if (categoria) {
    activeFilters.categoria = [categoria];
    document.querySelectorAll('[data-filter="categoria"]').forEach((checkbox) => {
      checkbox.checked = checkbox.value === categoria;
    });
  }

  if (linea) {
    activeFilters.linea = [linea];
    document.querySelectorAll('[data-filter="linea"]').forEach((checkbox) => {
      checkbox.checked = checkbox.value === linea;
    });
  }

  if (q) {
    activeFilters.search = q;
    searchInput.value = q;
  }
}

// Handle search
searchInput.addEventListener("input", (e) => {
  activeFilters.search = e.target.value;
  filterProducts();
});

// Handle checkbox filters
document.querySelectorAll('[data-filter]').forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    const filterType = e.target.dataset.filter;
    const value = e.target.value;

    if (e.target.checked) {
      activeFilters[filterType].push(value);
    } else {
      activeFilters[filterType] = activeFilters[filterType].filter((v) => v !== value);
    }

    filterProducts();
  });
});

// Clear filters
function clearFilters() {
  activeFilters = {
    search: "",
    categoria: [],
    linea: []
  };

  searchInput.value = "";
  document.querySelectorAll('[data-filter]').forEach((checkbox) => {
    checkbox.checked = false;
  });

  filterProducts();
}

clearFiltersBtn.addEventListener("click", clearFilters);
clearFiltersEmptyBtn.addEventListener("click", clearFilters);

// Mobile sidebar toggle
toggleFiltersBtn.addEventListener("click", () => {
  sidebar.classList.add("is-open");
  overlay.classList.add("is-visible");
  document.body.style.overflow = "hidden";
});

closeSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("is-open");
  overlay.classList.remove("is-visible");
  document.body.style.overflow = "";
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("is-open");
  overlay.classList.remove("is-visible");
  document.body.style.overflow = "";
});
