// Contact form handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get hCaptcha response
    const hcaptchaResponse = hcaptcha.getResponse();
    
    if (!hcaptchaResponse) {
      showError('Por favor completa el captcha');
      return;
    }

    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const data = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      telefono: formData.get('telefono'),
      empresa: formData.get('empresa'),
      mensaje: formData.get('mensaje'),
      'h-captcha-response': hcaptchaResponse
    };

    try {
      // Option 1: Using Formspree
      const FORMSPREE_ENDPOINT = 'YOUR_FORM_ID'; // Change this!
      
      if (FORMSPREE_ENDPOINT === 'YOUR_FORM_ID') {
        // Fallback: mailto
        sendViaEmail(data);
        return;
      }

      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showSuccess();
        contactForm.reset();
        hcaptcha.reset();
      } else {
        throw new Error('Error al enviar');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

function sendViaEmail(data) {
  const subject = encodeURIComponent(`Contacto desde web - ${data.nombre}`);
  const body = encodeURIComponent(`
Nombre: ${data.nombre}
Email: ${data.email}
Teléfono: ${data.telefono}
Empresa: ${data.empresa}

Mensaje:
${data.mensaje}
  `.trim());
  
  window.location.href = `mailto:vcorea@somosfruit.net?subject=${subject}&body=${body}`;
  
  setTimeout(() => {
    showSuccess();
    contactForm.reset();
  }, 1000);
}

function showSuccess() {
  // Remove any existing messages
  const existingSuccess = document.querySelector('.form-success');
  const existingError = document.querySelector('.form-error');
  if (existingSuccess) existingSuccess.remove();
  if (existingError) existingError.remove();

  // Create success message
  const successDiv = document.createElement('div');
  successDiv.className = 'form-success show';
  successDiv.innerHTML = `
    <div class="form-success__icon">✓</div>
    <h3 class="form-success__title">¡Mensaje enviado!</h3>
    <p class="form-success__text">Gracias por contactarnos. Te responderemos pronto.</p>
  `;
  
  contactForm.insertBefore(successDiv, contactForm.firstChild);
  
  // Re-enable button
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = false;
  submitBtn.innerHTML = 'Enviar <span class="btn__arrow" aria-hidden="true">→</span>';
  
  // Scroll to success message
  successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(message) {
  // Remove any existing messages
  const existingSuccess = document.querySelector('.form-success');
  const existingError = document.querySelector('.form-error');
  if (existingSuccess) existingSuccess.remove();
  if (existingError) existingError.remove();

  // Create error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error show';
  errorDiv.textContent = message;
  
  contactForm.insertBefore(errorDiv, contactForm.firstChild);
  
  // Scroll to error message
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
