// Footer centralizado para RP GUITAR
function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
        <div class="footer-container">
            <div class="footer-section">
                <h3>RP GUITAR</h3>
                <p>Tu tienda de confianza para guitarras, bajos, pedales y accesorios musicales.</p>
            </div>
            <div class="footer-section">
                <h4>Contacto</h4>
                <p>📍 Ciudad de Guatemala</p>
                <p>📞 Teléfono: <a href="tel:+50212345678">+502 1234-5678</a></p>
                <p>✉️ Email: <a href="mailto:info@rpguitar.com">info@rpguitar.com</a></p>
            </div>
            <div class="footer-section">
                <h4>Horarios</h4>
                <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                <p>Sábado: 9:00 AM - 2:00 PM</p>
                <p>Domingo: Cerrado</p>
            </div>
            <div class="footer-section">
                <h4>Síguenos</h4>
                <div class="social-links">
                    <a href="#" aria-label="Facebook">📘 Facebook</a>
                    <a href="#" aria-label="Instagram">📷 Instagram</a>
                    <a href="#" aria-label="WhatsApp">💬 WhatsApp</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 RP GUITAR. Todos los derechos reservados.</p>
        </div>
    `;
    
    return footer;
}

// Función para inicializar el footer
function initializeFooter() {
    const footer = createFooter();
    document.body.appendChild(footer);
}
