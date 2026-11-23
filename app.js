/* ============================================
   NeuroScaan — 3D Animated Website JS
   Three.js | GSAP | Scroll Animations
   ============================================ */

// ==========================================
// 1. PRELOADER
// ==========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('loaded');
        initAnimations();
    }, 800);
});

// ==========================================
// 2. CUSTOM CURSOR
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effects
const interactives = document.querySelectorAll('a, button, input, textarea, .glass-card');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ==========================================
// 3. THREE.JS — 3D BRAIN NEURAL NETWORK
// ==========================================
let scene, camera, renderer, brainGroup, particleSystem;
let neuronNodes = [];
let synapseLines = [];
let clock;

function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    clock = new THREE.Clock();

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.0008);

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 500);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Brain neural network group
    brainGroup = new THREE.Group();
    scene.add(brainGroup);

    createBrainNetwork();
    createCosmicParticles();
    createFloatingRings();
    createDNAHelix();

    // Lights
    const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f5ff, 2, 1000);
    pointLight1.position.set(200, 200, 200);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 1000);
    pointLight2.position.set(-200, -100, 200);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xf472b6, 1, 800);
    pointLight3.position.set(0, -200, 100);
    scene.add(pointLight3);

    // Mouse interaction
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    animateThreeJS();
}

function createBrainNetwork() {
    // Create neuron nodes in a brain-like spherical shape
    const nodeCount = 300;
    const nodeMaterial = new THREE.MeshPhongMaterial({
        color: 0x00f5ff,
        emissive: 0x00f5ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const purpleNodeMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b5cf6,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    for (let i = 0; i < nodeCount; i++) {
        // Brain-shaped distribution
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = 150 + Math.random() * 60;

        // Flatten slightly for brain shape
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta) * 0.75;
        const z = r * Math.cos(phi) * 0.85;

        const size = 0.5 + Math.random() * 2;
        const geometry = new THREE.SphereGeometry(size, 8, 8);
        const material = Math.random() > 0.4 ? nodeMaterial.clone() : purpleNodeMaterial.clone();
        const node = new THREE.Mesh(geometry, material);
        node.position.set(x, y, z);
        node.userData = {
            originalPos: { x, y, z },
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.5,
            amplitude: 0.5 + Math.random() * 2
        };
        brainGroup.add(node);
        neuronNodes.push(node);
    }

    // Create synaptic connections
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < neuronNodes.length; i++) {
        for (let j = i + 1; j < neuronNodes.length; j++) {
            const dist = neuronNodes[i].position.distanceTo(neuronNodes[j].position);
            if (dist < 50 && Math.random() > 0.6) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    neuronNodes[i].position,
                    neuronNodes[j].position
                ]);
                const line = new THREE.Line(geometry, lineMaterial.clone());
                line.userData = {
                    nodeA: i,
                    nodeB: j,
                    pulsePhase: Math.random() * Math.PI * 2
                };
                brainGroup.add(line);
                synapseLines.push(line);
            }
        }
    }
}

function createCosmicParticles() {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 2000;

        // Cyan to purple gradient
        const t = Math.random();
        colors[i3] = t < 0.5 ? 0 : 0.55;
        colors[i3 + 1] = t < 0.5 ? 0.96 : 0.36;
        colors[i3 + 2] = t < 0.5 ? 1 : 0.96;

        sizes[i] = 0.5 + Math.random() * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function createFloatingRings() {
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
        blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < 5; i++) {
        const radius = 180 + i * 40;
        const geometry = new THREE.TorusGeometry(radius, 0.5, 16, 100);
        const ring = new THREE.Mesh(geometry, ringMaterial.clone());
        ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        ring.rotation.y = (Math.random() - 0.5) * 0.3;
        ring.userData = { rotSpeed: 0.001 + Math.random() * 0.002, axis: Math.random() > 0.5 ? 'x' : 'z' };
        brainGroup.add(ring);
    }
}

function createDNAHelix() {
    const helixMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const helixGroup = new THREE.Group();
    const helixRadius = 20;
    const helixLength = 400;
    const turns = 6;

    for (let i = 0; i < 120; i++) {
        const t = i / 120;
        const angle = t * Math.PI * 2 * turns;
        const y = (t - 0.5) * helixLength;

        // Strand 1
        const x1 = Math.cos(angle) * helixRadius;
        const z1 = Math.sin(angle) * helixRadius;
        const sphere1 = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 6, 6),
            helixMaterial.clone()
        );
        sphere1.position.set(x1, y, z1);
        helixGroup.add(sphere1);

        // Strand 2
        const x2 = Math.cos(angle + Math.PI) * helixRadius;
        const z2 = Math.sin(angle + Math.PI) * helixRadius;
        const sphere2 = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 6, 6),
            helixMaterial.clone()
        );
        sphere2.position.set(x2, y, z2);
        helixGroup.add(sphere2);

        // Connecting rungs
        if (i % 4 === 0) {
            const rungGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x1, y, z1),
                new THREE.Vector3(x2, y, z2)
            ]);
            const rung = new THREE.Line(rungGeometry, new THREE.LineBasicMaterial({
                color: 0x00f5ff,
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending
            }));
            helixGroup.add(rung);
        }
    }

    helixGroup.position.set(400, 0, -200);
    helixGroup.rotation.z = Math.PI / 6;
    scene.add(helixGroup);

    // Store for animation
    window.dnaHelix = helixGroup;
}

let targetRotX = 0, targetRotY = 0;

function onMouseMove(e) {
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.3;
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.3;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Resize particle canvas
    const pCanvas = document.getElementById('particle-canvas');
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}

function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);

    const time = clock.getElapsedTime();

    // Smooth brain rotation with mouse
    brainGroup.rotation.x += (targetRotX - brainGroup.rotation.x) * 0.02;
    brainGroup.rotation.y += (targetRotY - brainGroup.rotation.y) * 0.02;
    brainGroup.rotation.y += 0.001; // Auto rotate

    // Animate neuron nodes
    neuronNodes.forEach(node => {
        const { originalPos, phase, speed, amplitude } = node.userData;
        node.position.x = originalPos.x + Math.sin(time * speed + phase) * amplitude;
        node.position.y = originalPos.y + Math.cos(time * speed * 0.7 + phase) * amplitude;
        node.position.z = originalPos.z + Math.sin(time * speed * 0.5 + phase * 2) * amplitude;
        
        // Pulse opacity
        node.material.emissiveIntensity = 0.3 + Math.sin(time * 2 + phase) * 0.3;
    });

    // Animate synapse connections
    synapseLines.forEach(line => {
        const { nodeA, nodeB, pulsePhase } = line.userData;
        const a = neuronNodes[nodeA];
        const b = neuronNodes[nodeB];
        
        const positions = line.geometry.attributes.position;
        if (positions) {
            positions.setXYZ(0, a.position.x, a.position.y, a.position.z);
            positions.setXYZ(1, b.position.x, b.position.y, b.position.z);
            positions.needsUpdate = true;
        }
        
        // Pulse opacity
        line.material.opacity = 0.03 + Math.sin(time * 3 + pulsePhase) * 0.05;
    });

    // Rotate floating rings
    brainGroup.children.forEach(child => {
        if (child.userData.rotSpeed) {
            child.rotation[child.userData.axis] += child.userData.rotSpeed;
        }
    });

    // Rotate particle system slowly
    if (particleSystem) {
        particleSystem.rotation.y += 0.0002;
        particleSystem.rotation.x += 0.0001;
    }

    // DNA helix rotation
    if (window.dnaHelix) {
        window.dnaHelix.rotation.y += 0.005;
    }

    // Scroll-based camera movement
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    camera.position.z = 500 - scrollProgress * 200;
    camera.position.y = -scrollProgress * 100;

    renderer.render(scene, camera);
}

// ==========================================
// 4. 2D PARTICLE CANVAS (Floating Neurons)
// ==========================================
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 1 + Math.random() * 2,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            alpha: 0.1 + Math.random() * 0.3,
            color: Math.random() > 0.5 ? '0, 245, 255' : '139, 92, 246'
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[j].x - p.x;
                const dy = particles[j].y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 245, 255, ${0.05 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(drawParticles);
    }

    drawParticles();
}

// ==========================================
// 5. NAVIGATION
// ==========================================
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-links a');

// Scroll behavior
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link
    const sections = document.querySelectorAll('section');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Mobile toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});

// ==========================================
// 6. SCROLL ANIMATIONS (GSAP + Observer)
// ==========================================
function initAnimations() {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('[data-animate]');

    animatedElements.forEach(el => {
        const delay = parseFloat(el.dataset.delay) || 0;

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => {
                setTimeout(() => {
                    el.classList.add('animated');
                }, delay * 1000);
            }
        });
    });

    // Hero content entrance
    gsap.from('#hero .hero-badge', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.1
    });

    gsap.from('#hero h1 .line', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.4
    });

    gsap.from('.hero-actions', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.5
    });

    gsap.from('.hero-stats', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.6
    });

    // Timeline progress animation
    ScrollTrigger.create({
        trigger: '#how-it-works',
        start: 'top 60%',
        onEnter: () => {
            document.querySelector('.timeline-progress').style.width = '100%';
        }
    });

    // Parallax effects
    gsap.to('#hero .hero-content', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -100,
        opacity: 0
    });

    // Counter animations
    animateCounters();
}

// ==========================================
// 7. COUNTER ANIMATIONS
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => {
                const target = parseFloat(counter.dataset.target);
                const isDecimal = target % 1 !== 0;
                const duration = 2000;
                const start = performance.now();

                function updateCounter(timestamp) {
                    const elapsed = timestamp - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic

                    const current = eased * target;

                    if (isDecimal) {
                        counter.textContent = current.toFixed(1);
                    } else if (target >= 1000) {
                        counter.textContent = Math.floor(current).toLocaleString();
                    } else {
                        counter.textContent = Math.floor(current);
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
            },
            once: true
        });
    });

    // Hero stat counters
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    statNumbers.forEach(el => {
        const target = parseFloat(el.dataset.count);
        const isDecimal = target % 1 !== 0;

        setTimeout(() => {
            const duration = 2000;
            const start = performance.now();

            function update(timestamp) {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                if (isDecimal) {
                    el.textContent = current.toFixed(1);
                } else {
                    el.textContent = Math.floor(current);
                }

                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        }, 3600);
    });
}

// ==========================================
// 8. TESTIMONIAL CAROUSEL
// ==========================================
let currentSlide = 0;
const cards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const track = document.querySelector('.testimonial-track');
const totalSlides = cards.length;

function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

document.querySelector('.carousel-btn.next').addEventListener('click', () => {
    goToSlide((currentSlide + 1) % totalSlides);
});

document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
});

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
});

// Auto-advance
setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
}, 6000);

// ==========================================
// 9. FORM HANDLING
// ==========================================
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<span>✓ Request Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #34d399, #00f5ff)';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
            e.target.reset();
        }, 3000);
    }, 1500);
});

// ==========================================
// 10. SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==========================================
// 11. TILT EFFECT ON GLASS CARDS
// ==========================================
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ==========================================
// INIT
// ==========================================
initThreeJS();
initParticleCanvas();
