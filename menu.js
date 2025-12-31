// menu.js - Contenedor del menú de navegación

function createNavigation() {
    return `
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="../index.html">
                        <img src="../img/2 (1).png" alt="RP Guitar" class="logo-img">
                    </a>
                </div>
                
                <ul class="nav-menu">
                    <li class="nav-item dropdown">
                        <a href="../accesorios/index.html" class="nav-link">Accesorios</a>
                        <ul class="dropdown-menu">
                            <li><a href="../accesorios/capos.html" class="dropdown-link">Capos</a></li>
                            <li><a href="../accesorios/straps.html" class="dropdown-link">Straps</a></li>
                            <li><a href="../accesorios/cuerdas.html" class="dropdown-link">Cuerdas</a></li>
                            <li><a href="../accesorios/vega-trem.html" class="dropdown-link">Vega Trem</a></li>
                            <li><a href="../accesorios/pedestales.html" class="dropdown-link">Pedestales</a></li>
                            <li><a href="../accesorios/fuentes-poder.html" class="dropdown-link">Fuentes de poder</a></li>
                        </ul>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a href="../marcas/index.html" class="nav-link">MARCAS</a>
                        <ul class="dropdown-menu">
                            <li><a href="../marcas/music-nomad.html" class="dropdown-link">Music Nomad</a></li>
                            <li><a href="../marcas/lollar-pickups.html" class="dropdown-link">Lollar Pickups</a></li>
                            <li><a href="../marcas/gruvegear.html" class="dropdown-link">Gruvegear</a></li>
                            <li><a href="../marcas/pig-hog.html" class="dropdown-link">Pig Hog</a></li>
                            <li><a href="../marcas/mgc.html" class="dropdown-link">MGC</a></li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a href="../amplificadores/index.html" class="nav-link">Amplificadores</a>
                    </li>
                    
                    <li class="nav-item">
                        <a href="../suhr/index.html" class="nav-link">Suhr</a>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a href="../guitarras/index.html" class="nav-link">Guitarras</a>
                        <ul class="dropdown-menu">
                            <li><a href="../guitarras/electricas.html" class="dropdown-link">Eléctricas</a></li>
                            <li><a href="../guitarras/electroacusticas.html" class="dropdown-link">Electroacústicas</a></li>
                        </ul>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a href="../pedales/index.html" class="nav-link">Pedales</a>
                        <ul class="dropdown-menu">
                            <li><a href="../pedales/nux.html" class="dropdown-link">Nux</a></li>
                            <li><a href="../pedales/amt.html" class="dropdown-link">AMT</a></li>
                            <li><a href="../pedales/suhr.html" class="dropdown-link">Suhr</a></li>
                            <li><a href="../pedales/rjm.html" class="dropdown-link">RJM</a></li>
                            <li><a href="../pedales/ehx.html" class="dropdown-link">EHX</a></li>
                            <li><a href="../pedales/ryra.html" class="dropdown-link">Ryra</a></li>
                            <li><a href="../pedales/dr-j.html" class="dropdown-link">DR J</a></li>
                            <li><a href="../pedales/walrus.html" class="dropdown-link">Walrus</a></li>
                            <li><a href="../pedales/vertex.html" class="dropdown-link">Vertex</a></li>
                            <li><a href="../pedales/maxon.html" class="dropdown-link">Maxon</a></li>
                            <li><a href="../pedales/mooer.html" class="dropdown-link">Mooer</a></li>
                            <li><a href="../pedales/nobels.html" class="dropdown-link">Nobels</a></li>
                            <li><a href="../pedales/browne.html" class="dropdown-link">Browne</a></li>
                            <li><a href="../pedales/pigtronix.html" class="dropdown-link">Pigtronix</a></li>
                            <li><a href="../pedales/tone-city.html" class="dropdown-link">Tone City</a></li>
                            <li><a href="../pedales/vemuram.html" class="dropdown-link">Vemuram</a></li>
                            <li><a href="../pedales/rock-ready.html" class="dropdown-link">Rock Ready</a></li>
                            <li><a href="../pedales/mgc-pedals.html" class="dropdown-link">MGC Pedals</a></li>
                            <li><a href="../pedales/origin-effects.html" class="dropdown-link">Origin Effects</a></li>
                            <li><a href="../pedales/barber-electronics.html" class="dropdown-link">Barber Electronics</a></li>
                        </ul>
                    </li>
                    
                    <li class="nav-item">
                        <a href="../bajos/index.html" class="nav-link">Bajos</a>
                    </li>
                    
                    <li class="nav-item">
                        <a href="../rp-music-school/index.html" class="nav-link">RP MUSIC SCHOOL</a>
                    </li>
                </ul>
                
                <!-- Hamburger menu para móviles -->
                <div class="hamburger">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
        </nav>
    `;
}

// Función para crear menú específico para index.html (rutas sin ../)
function createHomeNavigation() {
    return `
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="index.html">
                        <img src="img/2 (1).png" alt="RP Guitar" class="logo-img">
                    </a>
                </div>
                
                <ul class="nav-menu">
                    <li class="nav-item dropdown">
                        <a href="accesorios/index.html" class="nav-link">Accesorios</a>
                        <ul class="dropdown-menu">
                            <li><a href="accesorios/capos.html" class="dropdown-link">Capos</a></li>
                            <li><a href="accesorios/straps.html" class="dropdown-link">Straps</a></li>
                            <li><a href="accesorios/cuerdas.html" class="dropdown-link">Cuerdas</a></li>
                            <li><a href="accesorios/vega-trem.html" class="dropdown-link">Vega Trem</a></li>
                            <li><a href="accesorios/pedestales.html" class="dropdown-link">Pedestales</a></li>
                            <li><a href="accesorios/fuentes-poder.html" class="dropdown-link">Fuentes de poder</a></li>
                        </ul>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a href="marcas/index.html" class="nav-link">MARCAS</a>
                        <ul class="dropdown-menu">
                            <li><a href="marcas/music-nomad.html" class="dropdown-link">Music Nomad</a></li>
                            <li><a href="marcas/lollar-pickups.html" class="dropdown-link">Lollar Pickups</a></li>
                            <li><a href="marcas/gruvegear.html" class="dropdown-link">Gruvegear</a></li>
                            <li><a href="marcas/pig-hog.html" class="dropdown-link">Pig Hog</a></li>
                            <li><a href="marcas/mgc.html" class="dropdown-link">MGC</a></li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a href="amplificadores/index.html" class="nav-link">Amplificadores</a>
                    </li>
                    
                    <li class="nav-item">
                        <a href="suhr/index.html" class="nav-link">Suhr</a>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a href="guitarras/index.html" class="nav-link">Guitarras</a>
                        <ul class="dropdown-menu">
                            <li><a href="guitarras/electricas.html" class="dropdown-link">Eléctricas</a></li>
                            <li><a href="guitarras/electroacusticas.html" class="dropdown-link">Electroacústicas</a></li>
                        </ul>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a href="pedales/index.html" class="nav-link">Pedales</a>
                        <ul class="dropdown-menu">
                            <li><a href="pedales/nux.html" class="dropdown-link">Nux</a></li>
                            <li><a href="pedales/amt.html" class="dropdown-link">AMT</a></li>
                            <li><a href="pedales/suhr.html" class="dropdown-link">Suhr</a></li>
                            <li><a href="pedales/rjm.html" class="dropdown-link">RJM</a></li>
                            <li><a href="pedales/ehx.html" class="dropdown-link">EHX</a></li>
                            <li><a href="pedales/ryra.html" class="dropdown-link">Ryra</a></li>
                            <li><a href="pedales/dr-j.html" class="dropdown-link">DR J</a></li>
                            <li><a href="pedales/walrus.html" class="dropdown-link">Walrus</a></li>
                            <li><a href="pedales/vertex.html" class="dropdown-link">Vertex</a></li>
                            <li><a href="pedales/maxon.html" class="dropdown-link">Maxon</a></li>
                            <li><a href="pedales/mooer.html" class="dropdown-link">Mooer</a></li>
                            <li><a href="pedales/nobels.html" class="dropdown-link">Nobels</a></li>
                            <li><a href="pedales/browne.html" class="dropdown-link">Browne</a></li>
                            <li><a href="pedales/pigtronix.html" class="dropdown-link">Pigtronix</a></li>
                            <li><a href="pedales/tone-city.html" class="dropdown-link">Tone City</a></li>
                            <li><a href="pedales/vemuram.html" class="dropdown-link">Vemuram</a></li>
                            <li><a href="pedales/rock-ready.html" class="dropdown-link">Rock Ready</a></li>
                            <li><a href="pedales/mgc-pedals.html" class="dropdown-link">MGC Pedals</a></li>
                            <li><a href="pedales/origin-effects.html" class="dropdown-link">Origin Effects</a></li>
                            <li><a href="pedales/barber-electronics.html" class="dropdown-link">Barber Electronics</a></li>
                        </ul>
                    </li>
                    
                    <li class="nav-item">
                        <a href="bajos/index.html" class="nav-link">Bajos</a>
                    </li>
                    
                    <li class="nav-item">
                        <a href="rp-music-school/index.html" class="nav-link">RP MUSIC SCHOOL</a>
                    </li>
                </ul>
                
                <!-- Hamburger menu para móviles -->
                <div class="hamburger">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
        </nav>
    `;
}

// Función para inicializar el menú
function initializeMenu(isHomePage = false) {
    const navContainer = document.getElementById('nav-container');
    if (navContainer) {
        if (isHomePage) {
            navContainer.innerHTML = createHomeNavigation();
        } else {
            navContainer.innerHTML = createNavigation();
        }
        
        // Inicializar funcionalidad del menú
        initializeMenuFunctionality();
    }
}

// Función para inicializar la funcionalidad del menú (hamburguesa y dropdowns)
function initializeMenuFunctionality() {
    // Funcionalidad del menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Funcionalidad dropdown en móviles
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}