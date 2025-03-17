document.addEventListener('DOMContentLoaded', function() {
    // Initialiser AOS (Animation on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Défiler vers le haut de la page au chargement
    window.scrollTo(0, 0);

    // Variables pour le défilement automatique
    let autoScrollInterval = null;
    let scrollSpeed = 1; // pixels par tick

    // Références aux éléments de l'interface
    const autoScrollBtn = document.getElementById('autoScrollBtn');
    const autoScrollBtnMobile = document.getElementById('autoScrollBtnMobile');
    const scrollSpeedSelect = document.getElementById('scrollSpeedSelect');
    const scrollSpeedSelectMobile = document.getElementById('scrollSpeedSelectMobile');

    // Régler la vitesse de défilement en fonction de la sélection
    function setScrollSpeed(speedValue) {
        switch(speedValue) {
            case 'lent':
                scrollSpeed = 0.5;
                break;
            case 'normal':
                scrollSpeed = 1;
                break;
            case 'rapide':
                scrollSpeed = 2;
                break;
            default:
                scrollSpeed = 1;
        }
    }

    // Fonction pour activer/désactiver le défilement automatique
    function toggleAutoScroll(btn) {
        if (btn.classList.contains('active')) {
            // Désactiver
            btn.classList.remove('active');
            stopAutoScroll();

            // Synchroniser l'autre bouton
            if (btn === autoScrollBtn && autoScrollBtnMobile) {
                autoScrollBtnMobile.classList.remove('active');
            } else if (btn === autoScrollBtnMobile && autoScrollBtn) {
                autoScrollBtn.classList.remove('active');
            }
        } else {
            // Activer
            btn.classList.add('active');
            startAutoScroll();

            // Synchroniser l'autre bouton
            if (btn === autoScrollBtn && autoScrollBtnMobile) {
                autoScrollBtnMobile.classList.add('active');
            } else if (btn === autoScrollBtnMobile && autoScrollBtn) {
                autoScrollBtn.classList.add('active');
            }
        }
    }

    // Fonction pour démarrer le défilement automatique
    function startAutoScroll() {
        // Arrêter tout intervalle existant
        stopAutoScroll();

        // Calculer la hauteur totale défilable
        const maxScrollHeight = document.body.scrollHeight - window.innerHeight;
        let scrollPos = window.pageYOffset;
        let scrollDirection = 1; // 1 = down, -1 = up

        // Démarrer l'intervalle de défilement
        autoScrollInterval = setInterval(function() {
            // Vérifier les limites et changer de direction si nécessaire
            if (scrollPos >= maxScrollHeight) {
                scrollDirection = -1; // Changer direction vers le haut
            } else if (scrollPos <= 0) {
                scrollDirection = 1; // Changer direction vers le bas
            }

            // Calculer la nouvelle position
            scrollPos += (scrollSpeed * scrollDirection);

            // Garantir que nous restons dans les limites
            scrollPos = Math.max(0, Math.min(scrollPos, maxScrollHeight));

            // Appliquer le défilement
            window.scrollTo(0, scrollPos);
        }, 20);
    }

    // Fonction pour arrêter le défilement automatique
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }

    // Ajouter les écouteurs d'événements
    if (autoScrollBtn) {
        autoScrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAutoScroll(this);
        });
    }

    if (autoScrollBtnMobile) {
        autoScrollBtnMobile.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAutoScroll(this);
        });
    }

    // Gérer les changements de vitesse
    if (scrollSpeedSelect) {
        scrollSpeedSelect.addEventListener('change', function(e) {
            e.stopPropagation();
            const newSpeed = this.value;
            setScrollSpeed(newSpeed);

            // Synchroniser avec le sélecteur mobile
            if (scrollSpeedSelectMobile) {
                scrollSpeedSelectMobile.value = newSpeed;
            }
        });
    }

    if (scrollSpeedSelectMobile) {
        scrollSpeedSelectMobile.addEventListener('change', function(e) {
            e.stopPropagation();
            const newSpeed = this.value;
            setScrollSpeed(newSpeed);

            // Synchroniser avec le sélecteur desktop
            if (scrollSpeedSelect) {
                scrollSpeedSelect.value = newSpeed;
            }
        });
    }

    // Empêcher la propagation du clic sur les sélecteurs
    document.querySelectorAll('#scrollSpeedSelect, #scrollSpeedSelectMobile').forEach(select => {
        select.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Smooth scrolling pour liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Arrêter le défilement auto s'il est actif
            if (autoScrollInterval) {
                stopAutoScroll();

                // Mettre à jour l'état des boutons
                if (autoScrollBtn) autoScrollBtn.classList.remove('active');
                if (autoScrollBtnMobile) autoScrollBtnMobile.classList.remove('active');
            }

            const href = this.getAttribute('href');

            // Si c'est le bouton "En savoir plus", rediriger vers la section VPH
            if (this.textContent.trim().includes("En savoir plus")) {
                const vphSection = document.querySelector('#vph');
                if (vphSection) {
                    vphSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                return;
            }

            // Pour les autres liens, suivre le href normalement
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            // Fermer le menu mobile si ouvert
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bootstrapInstance = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bootstrapInstance) bootstrapInstance.hide();
            }
        });
    });

    // Activer les tooltips Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});