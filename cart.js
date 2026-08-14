// Cart state
let cart = JSON.parse(localStorage.getItem('quotes') || '[]');

// DOM Elements
const cartContent = document.getElementById('cart-content');
const cartEmpty = document.getElementById('cart-empty');
const cartCheckout = document.getElementById('cart-checkout');
const summaryCount = document.getElementById('summary-count');
const quoteForm = document.getElementById('quote-form');
const submitBtn = document.getElementById('submit-btn');

// Render cart
function renderCart() {
  if (cart.length === 0) {
    cartContent.style.display = 'none';
    cartCheckout.style.display = 'none';
    cartEmpty.style.display = 'block';
    updateCartBadge();
    
    // Re-observe empty state animation
    if (window.animationObserver) {
      const emptyEl = document.getElementById('cart-empty');
      if (emptyEl) {
        window.animationObserver.observe(emptyEl);
      }
    }
    return;
  }

  cartEmpty.style.display = 'none';
  cartContent.style.display = 'flex';
  cartCheckout.style.display = 'grid';

  cartContent.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item animate-on-scroll" data-id="${item.id}">
      <div class="cart-item__image">
        <img src="${item.image}" alt="${item.nombre}" />
      </div>
      <div class="cart-item__info">
        <h3 class="cart-item__name">${item.nombre}</h3>
        <p class="cart-item__unit">Venta por: ${item.unidad}</p>
        ${item.linea === 'premium' ? '<span class="cart-item__badge">Premium</span>' : ''}
      </div>
      <div class="cart-item__actions">
        <div class="cart-item__quantity">
          <button type="button" class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
          <span class="quantity-display">${item.quantity || 1}</span>
          <button type="button" class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <button type="button" class="cart-item__remove" onclick="removeItem(${item.id})">
          Eliminar
        </button>
      </div>
    </div>
  `
    )
    .join('');

  updateSummary();
  updateCartBadge();
  
  // Re-observe elements for animation
  if (window.animationObserver) {
    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
      window.animationObserver.observe(el);
    });
  }
}

// Update quantity
function updateQuantity(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity = (item.quantity || 1) + delta;

  if (item.quantity < 1) {
    removeItem(productId);
    return;
  }

  saveCart();
  renderCart();
}

// Remove item
function removeItem(productId) {
  cart = cart.filter((i) => i.id !== productId);
  saveCart();
  renderCart();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('quotes', JSON.stringify(cart));
}

// Update summary
function updateSummary() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  summaryCount.textContent = totalItems;
}

// Update cart badge
function updateCartBadge() {
  const badge = document.querySelector('.cart-badge__count');
  if (badge) {
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Handle form submission
if (quoteForm) {
  quoteForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(quoteForm);
    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      telefono: formData.get('telefono'),
      empresa: formData.get('empresa'),
      mensaje: formData.get('mensaje'),
      productos: cart.map((item) => ({
        nombre: item.nombre,
        cantidad: item.quantity || 1,
        unidad: item.unidad,
        linea: item.linea
      }))
    };

    // Build email body
    const emailBody = `
NUEVA SOLICITUD DE COTIZACIÓN - SOMOS FRUIT
==========================================

DATOS DEL CLIENTE
-----------------
Nombre: ${data.nombre}
Email: ${data.email}
Teléfono: ${data.telefono}
Empresa: ${data.empresa}

Mensaje:
${data.mensaje}

PRODUCTOS SOLICITADOS
---------------------
${data.productos.map((p, i) => `${i + 1}. ${p.nombre} (${p.linea})
   Cantidad: ${p.cantidad} ${p.unidad}`).join('\n\n')}

==========================================
Fecha de solicitud: ${new Date().toLocaleString('es-MX')}
    `.trim();

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      // Option 1: Using Formspree (recommended)
      // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
      // Get one free at https://formspree.io/
      
      const FORMSPREE_ENDPOINT = 'YOUR_FORM_ID'; // Change this!
      
      if (FORMSPREE_ENDPOINT === 'YOUR_FORM_ID') {
        // Fallback: Open default email client with pre-filled data
        sendViaEmailClient(data, emailBody);
        return;
      }

      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          empresa: data.empresa,
          mensaje: data.mensaje,
          productos: JSON.stringify(data.productos, null, 2),
          message: emailBody
        })
      });

      if (response.ok) {
        // Clear cart
        cart = [];
        saveCart();

        // Show success modal
        showSuccessModal();
      } else {
        throw new Error('Error al enviar');
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Fallback to email client
      const retry = confirm('Hubo un error al enviar la cotización directamente. ¿Deseas abrir tu cliente de correo para enviarla manualmente?');
      if (retry) {
        sendViaEmailClient(data, emailBody);
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Solicitar cotización";
      }
    }
  });
}

// Send via email client (fallback)
function sendViaEmailClient(data, emailBody) {
  const subject = encodeURIComponent(`Cotización - ${data.empresa}`);
  const body = encodeURIComponent(emailBody);
  const mailto = `mailto:vcorea@somosfruit.net?subject=${subject}&body=${body}`;
  
  window.location.href = mailto;
  
  // Clear cart after opening email client
  setTimeout(() => {
    cart = [];
    saveCart();
    showSuccessModal();
  }, 1000);
}

// Show success modal
function showSuccessModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal__content">
      <div class="modal__icon">✓</div>
      <h2 class="modal__title">¡Cotización enviada!</h2>
      <p class="modal__text">
        Hemos recibido tu solicitud de cotización. Nuestro equipo la revisará y te contactará pronto con los precios y disponibilidad.
        <br><br>
        <strong>Te responderemos a:</strong> ${quoteForm.querySelector('[name="email"]').value}
      </p>
      <div class="modal__actions">
        <a href="index.html" class="btn btn--primary btn--lg btn--full">
          Volver al inicio
        </a>
        <a href="productos.html" class="btn btn--outline btn--lg btn--full">
          Ver más productos
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  setTimeout(() => {
    modal.classList.add('is-open');
  }, 100);
}

// Initial render
if (cartContent) {
  renderCart();
}

// Export functions to global scope
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
