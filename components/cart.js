/**
 * RP GUITAR CART COMPONENT
 * Sistema de carrito de compras reutilizable con integración de WhatsApp
 * Autor: RP GUITAR
 * Versión: 1.0.0
 */

class RPGuitarCart {
    constructor(options = {}) {
        // Configuración por defecto
        this.config = {
            whatsappNumber: '50258468795',
            storeName: 'RP GUITAR',
            currency: 'Q',
            storageKey: 'rpGuitarCart',
            ordersKey: 'rpGuitarOrders',
            ...options
        };

        // Estado del carrito
        this.cart = JSON.parse(localStorage.getItem(this.config.storageKey)) || [];
        
        // Elementos del DOM
        this.elements = {};
        
        // Inicializar el carrito
        this.init();
    }

    // Inicializar el carrito
    init() {
        this.createCartHTML();
        this.bindEvents();
        this.updateCartCount();
        this.setupResponsiveFeatures();
    }

    // Configurar características responsive
    setupResponsiveFeatures() {
        // Detectar dispositivo táctil
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Agregar clase al body para estilos específicos
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
        }

        // Manejar cambios de orientación en móviles
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.adjustModalForOrientation();
            }, 100);
        });

        // Manejar resize de ventana
        window.addEventListener('resize', () => {
            this.adjustModalForOrientation();
        });
    }

    // Ajustar modal según orientación y tamaño
    adjustModalForOrientation() {
        const checkoutModal = document.getElementById('checkoutModal');
        const cartModal = document.getElementById('cartModal');
        
        if (checkoutModal && checkoutModal.style.display === 'block') {
            this.optimizeModalForDevice(checkoutModal);
        }
        
        if (cartModal && cartModal.style.display === 'block') {
            this.optimizeModalForDevice(cartModal);
        }
    }

    // Optimizar modal para el dispositivo actual
    optimizeModalForDevice(modal) {
        const content = modal.querySelector('.checkout-content, .cart-content');
        if (!content) return;

        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        
        // Ajustes para pantallas muy pequeñas
        if (screenWidth <= 480 || screenHeight <= 600) {
            content.style.height = '100vh';
            content.style.margin = '0';
            content.style.borderRadius = '0';
        } else {
            content.style.height = 'auto';
            content.style.margin = screenWidth <= 768 ? '1% auto' : '2% auto';
            content.style.borderRadius = screenWidth <= 768 ? '10px' : '15px';
        }
    }

    // Crear HTML del carrito
    createCartHTML() {
        // Crear icono del carrito
        const cartIcon = document.createElement('div');
        cartIcon.className = 'cart-icon';
        cartIcon.id = 'cartIcon';
        cartIcon.innerHTML = `
            🛒
            <div class="cart-count" id="cartCount" style="display: none;">0</div>
        `;

        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.id = 'cartNotification';
        notification.textContent = '✓ Producto agregado al carrito';

        // Crear modal del carrito
        const cartModal = document.createElement('div');
        cartModal.id = 'cartModal';
        cartModal.className = 'cart-modal';
        cartModal.innerHTML = `
            <div class="cart-content">
                <div class="cart-header">
                    <h2>🛒 Carrito de Compras</h2>
                    <span class="close" id="closeCart">&times;</span>
                </div>
                <div class="cart-body" id="cartBody">
                    <div class="cart-empty" id="cartEmpty">
                        <div class="cart-empty-icon">🛒</div>
                        <h3>Tu carrito está vacío</h3>
                        <p>¡Agrega algunos productos increíbles!</p>
                    </div>
                </div>
                <div class="cart-footer" id="cartFooter" style="display: none;">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span id="cartTotal">${this.config.currency}0</span>
                    </div>
                    <div class="cart-actions">
                        <button class="btn-clear-cart" id="clearCart">Vaciar Carrito</button>
                        <button class="btn-checkout" id="checkoutBtn">Confirmar Compra</button>
                    </div>
                </div>
            </div>
        `;

        // Crear modal de confirmación
        const checkoutModal = document.createElement('div');
        checkoutModal.id = 'checkoutModal';
        checkoutModal.className = 'checkout-modal';
        checkoutModal.innerHTML = `
            <div class="checkout-content">
                <div class="checkout-header">
                    <h2>📋 Confirmar Pedido</h2>
                </div>
                <div class="checkout-body">
                    <div class="checkout-summary" id="checkoutSummary">
                        <!-- Resumen del carrito se insertará aquí -->
                    </div>
                    
                    <form class="checkout-form" id="checkoutForm">
                        <div class="form-group half-width">
                            <label for="customerName">Nombre Completo *</label>
                            <input type="text" id="customerName" required placeholder="Ej: Juan Pérez" autocomplete="name">
                        </div>
                        
                        <div class="form-group half-width">
                            <label for="customerPhone">Teléfono *</label>
                            <input type="tel" id="customerPhone" required placeholder="Ej: 5555-5555" autocomplete="tel">
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="customerEmail">Email (opcional)</label>
                            <input type="email" id="customerEmail" placeholder="ejemplo@correo.com" autocomplete="email">
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="customerAddress">Dirección de Entrega (opcional)</label>
                            <textarea id="customerAddress" rows="3" placeholder="Dirección completa para entrega" autocomplete="street-address"></textarea>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="customerNotes">Notas Adicionales (opcional)</label>
                            <textarea id="customerNotes" rows="2" placeholder="Comentarios o instrucciones especiales"></textarea>
                        </div>
                    </form>
                    
                    <div class="loading-spinner" id="loadingSpinner"></div>
                    
                    <div class="checkout-actions">
                        <button type="button" class="btn-cancel" id="cancelCheckout">Cancelar</button>
                        <button type="button" class="btn-send" id="confirmOrder">Enviar Pedido</button>
                    </div>
                </div>
            </div>
        `;

        // Agregar elementos al DOM
        document.body.appendChild(cartIcon);
        document.body.appendChild(notification);
        document.body.appendChild(cartModal);
        document.body.appendChild(checkoutModal);

        // Guardar referencias
        this.elements = {
            cartIcon: document.getElementById('cartIcon'),
            cartCount: document.getElementById('cartCount'),
            cartModal: document.getElementById('cartModal'),
            cartBody: document.getElementById('cartBody'),
            cartEmpty: document.getElementById('cartEmpty'),
            cartFooter: document.getElementById('cartFooter'),
            cartTotal: document.getElementById('cartTotal'),
            notification: document.getElementById('cartNotification'),
            checkoutModal: document.getElementById('checkoutModal')
        };
    }

    // Vincular eventos
    bindEvents() {
        // Eventos del carrito
        this.elements.cartIcon.addEventListener('click', () => this.openCartModal());
        document.getElementById('closeCart').addEventListener('click', () => this.closeCartModal());
        document.getElementById('clearCart').addEventListener('click', () => this.clearCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.processCheckout());

        // Eventos del checkout
        document.getElementById('cancelCheckout').addEventListener('click', () => this.closeCheckoutModal());
        document.getElementById('confirmOrder').addEventListener('click', () => this.sendOrderViaWhatsApp());

        // Cerrar modales al hacer click fuera
        window.addEventListener('click', (event) => {
            if (event.target === this.elements.cartModal) {
                this.closeCartModal();
            }
            if (event.target === this.elements.checkoutModal) {
                this.closeCheckoutModal();
            }
        });

        // Delegación de eventos para botones "Comprar Ahora"
        document.addEventListener('click', (event) => {
            if (event.target.matches('.btn-contact, .btn-add-cart, [data-cart-add]')) {
                event.preventDefault();
                this.handleAddToCart(event);
            }
        });
    }

    // Manejar agregar al carrito
    handleAddToCart(event) {
        const button = event.target;
        let productData = null;

        // Si tiene atributos data-cart-*
        if (button.hasAttribute('data-cart-add')) {
            productData = {
                name: button.getAttribute('data-cart-name'),
                brand: button.getAttribute('data-cart-brand'),
                price: button.getAttribute('data-cart-price'),
                image: button.getAttribute('data-cart-image'),
                specs: button.getAttribute('data-cart-specs') || ''
            };
        } else {
            // Buscar en la tarjeta padre
            const productCard = button.closest('.guitar-card, .product-card, [data-product]');
            if (productCard) {
                productData = {
                    name: productCard.dataset.name,
                    brand: productCard.dataset.brand,
                    price: productCard.dataset.price,
                    image: productCard.dataset.image,
                    specs: productCard.dataset.specs || ''
                };
            } else {
                // Intentar desde modal activo
                const modalName = document.getElementById('modalGuitarName');
                const modalBrand = document.getElementById('modalBrand');
                const modalPrice = document.getElementById('modalPrice');
                const modalImage = document.getElementById('modalImage');

                if (modalName && modalBrand && modalPrice && modalImage) {
                    const modalSpecs = Array.from(document.querySelectorAll('#modalSpecs li')).map(li => li.textContent);
                    productData = {
                        name: modalName.textContent,
                        brand: modalBrand.textContent,
                        price: modalPrice.textContent,
                        image: modalImage.src,
                        specs: modalSpecs.join(' | ')
                    };
                }
            }
        }

        if (productData && productData.name) {
            this.addToCart(productData);
        } else {
            console.warn('No se pudo encontrar información del producto');
        }
    }

    // Agregar producto al carrito
    addToCart(productData) {
        // Verificar si el producto ya está en el carrito
        const existingItem = this.cart.find(item => item.name === productData.name);
        
        if (existingItem) {
            this.showNotification('⚠️ Este producto ya está en tu carrito');
            return;
        }

        // Agregar nuevo producto
        this.cart.push({
            id: Date.now(),
            name: productData.name,
            brand: productData.brand,
            price: productData.price,
            image: productData.image,
            specs: productData.specs
        });

        // Guardar en localStorage
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.cart));
        
        // Actualizar UI
        this.updateCartCount();
        this.showNotification('✓ Producto agregado al carrito');
    }

    // Remover producto del carrito
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.cart));
        this.updateCartCount();
        this.renderCartItems();
        this.showNotification('🗑️ Producto eliminado del carrito');
    }

    // Vaciar carrito
    clearCart() {
        this.cart = [];
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.cart));
        this.updateCartCount();
        this.renderCartItems();
        this.showNotification('🗑️ Carrito vaciado');
    }

    // Actualizar contador del carrito
    updateCartCount() {
        const count = this.cart.length;
        this.elements.cartCount.textContent = count;
        this.elements.cartCount.style.display = count > 0 ? 'flex' : 'none';
    }

    // Mostrar notificación
    showNotification(message) {
        this.elements.notification.textContent = message;
        this.elements.notification.classList.add('show');
        setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, 3000);
    }

    // Renderizar items del carrito
    renderCartItems() {
        if (this.cart.length === 0) {
            this.elements.cartEmpty.style.display = 'block';
            this.elements.cartFooter.style.display = 'none';
            return;
        }

        this.elements.cartEmpty.style.display = 'none';
        this.elements.cartFooter.style.display = 'block';

        // Calcular total
        let total = 0;
        let totalText = 'Consultar precios';
        let hasNumericPrices = false;

        const cartItemsHTML = this.cart.map(item => {
            const priceMatch = item.price.match(/Q([\d,]+)/);
            if (priceMatch) {
                const numericPrice = parseInt(priceMatch[1].replace(',', ''));
                total += numericPrice;
                hasNumericPrices = true;
            }

            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-brand">${item.brand}</div>
                        <div class="cart-item-price">${item.price}</div>
                    </div>
                    <button class="cart-item-remove" onclick="rpCart.removeFromCart(${item.id})" title="Eliminar">
                        ×
                    </button>
                </div>
            `;
        }).join('');

        this.elements.cartBody.innerHTML = cartItemsHTML;

        // Mostrar total
        if (hasNumericPrices) {
            totalText = `${this.config.currency}${total.toLocaleString()}`;
        }
        this.elements.cartTotal.textContent = totalText;
    }

    // Abrir modal del carrito
    openCartModal() {
        this.renderCartItems();
        this.elements.cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Cerrar modal del carrito
    closeCartModal() {
        this.elements.cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Procesar checkout
    processCheckout() {
        if (this.cart.length === 0) return;
        this.showCheckoutModal();
    }

    // Mostrar modal de confirmación
    showCheckoutModal() {
        const checkoutSummary = document.getElementById('checkoutSummary');
        
        // Generar resumen del carrito
        let summaryHTML = '<h4>📦 Resumen del Pedido:</h4><ul>';
        let total = 0;
        let hasNumericPrices = false;

        this.cart.forEach(item => {
            const priceMatch = item.price.match(/Q([\d,]+)/);
            if (priceMatch) {
                total += parseInt(priceMatch[1].replace(',', ''));
                hasNumericPrices = true;
            }
            summaryHTML += `<li><strong>${item.name}</strong> - ${item.brand} - ${item.price}</li>`;
        });

        summaryHTML += '</ul>';
        if (hasNumericPrices) {
            summaryHTML += `<p><strong>💵 Total: ${this.config.currency}${total.toLocaleString()}</strong></p>`;
        } else {
            summaryHTML += `<p><strong>💵 Total: Consultar precios</strong></p>`;
        }

        checkoutSummary.innerHTML = summaryHTML;
        this.elements.checkoutModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Optimizar para el dispositivo actual
        setTimeout(() => {
            this.optimizeModalForDevice(this.elements.checkoutModal);
        }, 50);

        // Focus en el primer campo en desktop
        if (window.innerWidth > 768) {
            setTimeout(() => {
                const firstInput = document.getElementById('customerName');
                if (firstInput) firstInput.focus();
            }, 300);
        }
    }

    // Cerrar modal de confirmación
    closeCheckoutModal() {
        this.elements.checkoutModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('checkoutForm').reset();
    }

    // Enviar pedido por WhatsApp
    async sendOrderViaWhatsApp() {
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const address = document.getElementById('customerAddress').value.trim();
        const notes = document.getElementById('customerNotes').value.trim();

        if (!name || !phone) {
            alert('Por favor complete los campos obligatorios (Nombre y Teléfono)');
            return;
        }

        // Mostrar spinner de carga
        const loadingSpinner = document.getElementById('loadingSpinner');
        const confirmBtn = document.getElementById('confirmOrder');
        
        loadingSpinner.style.display = 'block';
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Preparando mensaje...';

        // Crear mensaje detallado
        let message = ` *NUEVO PEDIDO ${this.config.storeName}*\n\n`;
        message += ` *DATOS DEL CLIENTE:*\n`;
        message += ` Nombre: ${name}\n`;
        message += ` Teléfono: ${phone}\n`;
        if (email) message += ` Email: ${email}\n`;
        if (address) message += `Dirección: ${address}\n`;
        message += `\nFecha: ${new Date().toLocaleDateString()}\n`;
        message += `Hora: ${new Date().toLocaleTimeString()}\n\n`;
        
        message += `*PRODUCTOS SOLICITADOS:*\n`;

        let total = 0;
        let hasNumericPrices = false;
        
        this.cart.forEach((item, index) => {
            message += `\n${index + 1}. *${item.name}*\n`;
            message += `   Marca: ${item.brand}\n`;
            message += `   Precio: ${item.price}\n`;
            if (item.specs) message += `   Especificaciones: ${item.specs}\n`;
            
            const priceMatch = item.price.match(/Q([\d,]+)/);
            if (priceMatch) {
                total += parseInt(priceMatch[1].replace(',', ''));
                hasNumericPrices = true;
            }
        });

        if (hasNumericPrices) {
            message += `\n*TOTAL ESTIMADO: ${this.config.currency}${total.toLocaleString()}*\n`;
        } else {
            message += `\n*TOTAL: Consultar precios*\n`;
        }

        if (notes) {
            message += `\n *NOTAS ADICIONALES:*\n${notes}\n`;
        }

        message += `\n✨ ¡Gracias por elegir ${this.config.storeName}! 🎵`;
        message += `\n\n_Mensaje enviado desde el sitio web_`;

        try {
            // Simular delay para mostrar loading
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Usar WhatsApp Web directamente
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${this.config.whatsappNumber}?text=${encodedMessage}`;

            // Abrir WhatsApp
            window.open(whatsappURL, '_blank');

            // Guardar pedido en localStorage para historial
            const orderHistory = JSON.parse(localStorage.getItem(this.config.ordersKey)) || [];
            orderHistory.push({
                id: Date.now(),
                date: new Date().toISOString(),
                customer: { name, phone, email, address },
                items: [...this.cart],
                total: hasNumericPrices ? total : 'Consultar',
                notes,
                status: 'enviado'
            });
            localStorage.setItem(this.config.ordersKey, JSON.stringify(orderHistory));

            // Limpiar carrito y cerrar modales
            this.clearCart();
            this.closeCartModal();
            this.closeCheckoutModal();
            
            this.showNotification(' Pedido enviado por WhatsApp exitosamente');

        } catch (error) {
            console.error('Error enviando pedido:', error);
            this.showNotification(' Error al enviar. Intente nuevamente.');
            
        } finally {
            // Restaurar botón
            loadingSpinner.style.display = 'none';
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Enviar Pedido';
        }
    }

    // Método público para agregar productos programáticamente
    addProduct(productData) {
        this.addToCart(productData);
    }

    // Método público para obtener el carrito
    getCart() {
        return [...this.cart];
    }

    // Método público para obtener el total
    getTotal() {
        let total = 0;
        let hasNumericPrices = false;
        
        this.cart.forEach(item => {
            const priceMatch = item.price.match(/Q([\d,]+)/);
            if (priceMatch) {
                total += parseInt(priceMatch[1].replace(',', ''));
                hasNumericPrices = true;
            }
        });

        return hasNumericPrices ? total : null;
    }
}

// Función de inicialización global
function initRPGuitarCart(options = {}) {
    // Verificar si ya existe una instancia
    if (window.rpCart) {
        console.warn('RP Guitar Cart ya está inicializado');
        return window.rpCart;
    }

    // Crear nueva instancia
    window.rpCart = new RPGuitarCart(options);
    return window.rpCart;
}

// Exportar para uso con módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RPGuitarCart, initRPGuitarCart };
}