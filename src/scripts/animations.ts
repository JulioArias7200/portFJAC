import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPortfolioAnimations() {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 200px)', () => {
    // ==========================================
    // 1. HERO ENTRANCE TIMELINE
    // ==========================================
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .fromTo('.gsap-hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo('.gsap-hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.7')
      .fromTo('.gsap-hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6');

    // ==========================================
    // 2. ABOUT SECTION - KINETIC TEXT REVEAL
    // ==========================================
    gsap.utils.toArray<HTMLElement>('.gsap-about-reveal').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 60%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 35,
        duration: 1,
        ease: 'power2.out',
      });
    });

    // ==========================================
    // 3. WORK SECTION - TIMELINE PROGRESS DRAW
    // ==========================================
    const workLine = document.querySelector('.gsap-work-progress');
    const workContainer = document.querySelector('#work-container');

    if (workLine && workContainer) {
      gsap.fromTo(
        workLine,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: workContainer,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.6,
          },
        }
      );
    }

    const isMobile = window.innerWidth < 768;

    gsap.utils.toArray<HTMLElement>('.gsap-work-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        x: isMobile ? 0 : (index % 2 === 0 ? -40 : 40),
        y: isMobile ? 30 : 0,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // ==========================================
    // 4. EDUCATION SECTION - STAGGERED FADE-UP
    // ==========================================
    const eduCards = document.querySelectorAll('.gsap-edu-card');
    if (eduCards.length > 0) {
      gsap.from(eduCards, {
        scrollTrigger: {
          trigger: '#education',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      });
    }

    // ==========================================
    // 5. PROJECTS SECTION - 3D TILT & CARDS ENTRANCE
    // ==========================================
    const projectCards = document.querySelectorAll<HTMLElement>('.tilt-card');
    projectCards.forEach((card) => {
      // 3D tilt mouse listener in Vanilla JS
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });

    gsap.from('#projects .space-y-3', {
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    });

    // ==========================================
    // 6. HACKATHONS - COUNTERS ANIMATION & BENTO
    // ==========================================
    const hackathonCounters = document.querySelectorAll<HTMLElement>('.gsap-counter');
    if (hackathonCounters.length > 0) {
      ScrollTrigger.create({
        trigger: '#hackathons',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          hackathonCounters.forEach((counter) => {
            const target = Number(counter.getAttribute('data-target') || '0');
            const suffix = counter.getAttribute('data-suffix') || '';
            const obj = { val: 0 };

            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                counter.innerText = Math.floor(obj.val) + suffix;
              },
            });
          });
        },
      });
    }

    gsap.from('.gsap-bento-card', {
      scrollTrigger: {
        trigger: '#hackathons',
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
      scale: 0.95,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: 'back.out(1.2)',
    });

    // ==========================================
    // 7. CONTACT - MAGNETIC BUTTONS
    // ==========================================
    const magneticBtns = document.querySelectorAll<HTMLElement>('.magnetic-btn');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)',
        });
      });
    });

    // ==========================================
    // 8. BLOG SECTION - CARDS STAGGER
    // ==========================================
    gsap.from('.gsap-blog-card', {
      scrollTrigger: {
        trigger: '#blog',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    mm.revert();
  };
}
