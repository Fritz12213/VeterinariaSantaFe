/* ==========================================
   Veterinaria Santa Fe - Lógica Interactiva JS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MENÚ MÓVIL (HAMBURGUESA) ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace de navegación
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    // --- 2. HEADER CAMBIO AL HACER SCROLL & SECCIÓN ACTIVA ---
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Sticky header transition
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Detectar sección activa en scroll
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset para el header fijo
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });


    // --- 3. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER) ---
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Dejar de observar una vez que se revela para mejor rendimiento
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback para navegadores antiguos
        revealElements.forEach(el => el.classList.add('active'));
    }


    // --- 4. VALIDACIÓN DE FORMULARIO DE CITA ---
    const form = document.getElementById('appointment-form');
    if (form) {
        const submitBtn = document.getElementById('submit-btn');
        const successAlert = document.getElementById('success-alert');

        // Elementos de entrada y sus contenedores de error
        const inputs = {
            name: {
                el: document.getElementById('client-name'),
                error: document.getElementById('error-name'),
                validate: val => val.trim().length >= 3
            },
            phone: {
                el: document.getElementById('client-phone'),
                error: document.getElementById('error-phone'),
                validate: val => {
                    const phoneReg = /^[0-9\s\-+()]{7,18}$/;
                    return phoneReg.test(val.trim());
                }
            },
            email: {
                el: document.getElementById('client-email'),
                error: document.getElementById('error-email'),
                validate: val => {
                    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailReg.test(val.trim());
                }
            },
            petName: {
                el: document.getElementById('pet-name'),
                error: document.getElementById('error-pet'),
                validate: val => val.trim().length >= 1
            },
            petType: {
                el: document.getElementById('pet-type'),
                error: document.getElementById('error-type'),
                validate: val => val !== ''
            },
            service: {
                el: document.getElementById('service-select'),
                error: document.getElementById('error-service'),
                validate: val => val !== ''
            }
        };

        // Función para validar un campo específico
        function validateField(field) {
            const inputObj = inputs[field];
            const isValid = inputObj.validate(inputObj.el.value);
            const group = inputObj.el.closest('.form-group');

            if (isValid) {
                group.classList.remove('has-error');
            } else {
                group.classList.add('has-error');
            }
            return isValid;
        }

        // Agregar oyentes en inputs para validación interactiva
        Object.keys(inputs).forEach(field => {
            const inputObj = inputs[field];
            
            // Validar al salir del foco (blur)
            inputObj.el.addEventListener('blur', () => {
                validateField(field);
            });

            // Limpiar error mientras escribe/cambia
            inputObj.el.addEventListener('input', () => {
                const group = inputObj.el.closest('.form-group');
                if (inputObj.validate(inputObj.el.value)) {
                    group.classList.remove('has-error');
                }
            });
        });

        // Manejar envío del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validar todos los campos antes de enviar
            let isFormValid = true;
            Object.keys(inputs).forEach(field => {
                const isValid = validateField(field);
                if (!isValid) isFormValid = false;
            });

            if (isFormValid) {
                // Activar estado de carga (spinner)
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');

                // Simular envío de datos a un servidor (API ficticia)
                setTimeout(() => {
                    // Desactivar estado de carga
                    submitBtn.classList.remove('loading');
                    
                    // Mostrar mensaje de éxito con animación suave
                    successAlert.style.display = 'flex';
                    successAlert.style.animation = 'slideDown 0.4s ease forwards';

                    // Limpiar el formulario
                    form.reset();
                    
                    // Habilitar botón después de unos segundos
                    setTimeout(() => {
                        submitBtn.disabled = false;
                    }, 1000);

                    // Ocultar alerta de éxito automáticamente tras 8 segundos
                    setTimeout(() => {
                        successAlert.style.animation = 'fadeAway 0.5s ease forwards';
                        setTimeout(() => {
                            successAlert.style.display = 'none';
                            successAlert.style.style = ''; // Limpiar estilos de animación
                        }, 500);
                    }, 8000);

                }, 1800); // 1.8 segundos de retraso ficticio de red
            } else {
                // Hacer scroll suave hacia el primer error
                const firstError = document.querySelector('.form-group.has-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
});

// Estilos de animación adicionales para la alerta inyectada dinámicamente
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeAway {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
}
`;
document.head.appendChild(styleSheet);
