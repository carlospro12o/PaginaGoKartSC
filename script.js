/* ============================================================
   KARTING ZONE - SCRIPT.JS
   Interactividad: menú móvil, scroll reveal,
   contadores animados, formulario, navbar shrink
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. MENÚ MÓVIL - Toggle hamburguesa
  // ============================================================
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show-menu');
      navToggle.classList.toggle('active');
      // Bloquear scroll del body cuando el menú está abierto
      document.body.style.overflow =
        navMenu.classList.contains('show-menu') ? 'hidden' : '';
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================================
  // 2. NAVBAR SHRINK - Cambia estilo al hacer scroll
  // ============================================================
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Agregar/quitar clase cuando hay scroll
    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  });

  // ============================================================
  // 3. ACTIVE LINK DESTACADO - Resalta sección visible
  // ============================================================
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.pageYOffset >= sectionTop &&
          window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);

  // ============================================================
  // 4. SCROLL REVEAL - IntersectionObserver para animaciones
  //    Los elementos con clase .reveal aparecen con fade-in
  //    cuando entran en el viewport.
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          // Dejar de observar una vez visible para mejor rendimiento
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ============================================================
  // 5. CONTADORES ANIMADOS - Números incrementales
  //    Cuenta desde 0 hasta el valor en data-target cuando
  //    la sección info entra en el viewport.
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat__num');

  if (statNumbers.length > 0) {
    let countersStarted = false;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          startCounters();
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(document.querySelector('.info__stats'));

    function startCounters() {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (isNaN(target)) return;

        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // ~60fps
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            stat.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = target;
          }
        };

        updateCounter();
      });
    }
  }

  // ============================================================
  // 6. FORMULARIO DE RESERVAS - Envío por correo electrónico
  //    Toma los datos del formulario y abre el cliente de correo
  //    con los datos pre-llenados para enviar al destinatario.
  // ============================================================
  const reservasForm = document.getElementById('reservas-form');
  const formMsg = document.getElementById('form-msg');
  const EMAIL_DESTINO = 'gokart.sc.lc@gmail.com';

  if (reservasForm) {
    reservasForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const fecha = document.getElementById('fecha').value;
      const tipo = document.getElementById('tipo-reserva').value;
      const mensaje = document.getElementById('mensaje').value.trim();

      if (!nombre || !email || !telefono || !fecha || !tipo) {
        formMsg.textContent = 'Por favor completa todos los campos.';
        formMsg.className = 'form__msg form__msg--error';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMsg.textContent = 'Ingresa un correo electrónico válido.';
        formMsg.className = 'form__msg form__msg--error';
        return;
      }

      const asunto = encodeURIComponent('Nueva Reserva Karting Zone');
      const cuerpo =
        `🏁 Nueva Reserva Karting Zone 🏁\n\n` +
        `Nombre: ${nombre}\n` +
        `Email: ${email}\n` +
        `Teléfono: ${telefono}\n` +
        `Fecha: ${fecha}\n` +
        `Tipo: ${tipo}\n` +
        (mensaje ? `Mensaje: ${mensaje}` : '');

      formMsg.textContent = '✅ Abriendo cliente de correo...';
      formMsg.className = 'form__msg form__msg--success';

      setTimeout(() => {
        window.location.href = `mailto:${EMAIL_DESTINO}?subject=${asunto}&body=${encodeURIComponent(cuerpo)}`;
        reservasForm.reset();
        setTimeout(() => {
          formMsg.textContent = '';
          formMsg.className = 'form__msg';
        }, 3000);
      }, 800);
    });
  }

  // ============================================================
  // 7. CIERRE DE MENÚ CON TECLA ESC
  // ============================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
      navMenu.classList.remove('show-menu');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ============================================================
  // 8. EFECTO PARALLAX SUTIL EN HERO (opcional)
  //    Mueve el overlay del hero ligeramente con el scroll
  // ============================================================
  const heroOverlay = document.querySelector('.hero__overlay');
  if (heroOverlay) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYVelocity || window.scrollY;
      const offset = scrollY * 0.4;
      heroOverlay.style.transform = `translateY(${offset}px)`;
    });
  }

});
