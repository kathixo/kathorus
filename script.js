// quick selectors
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* Sticky header + active nav highlight */
(function headerBehavior(){
  const header = $('#siteHeader');
  const navLinks = $$('.nav a');
  const sections = ['#services','#beforeafter','#reviews','#contact'];

  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 30) header.classList.add('scrolled'); else header.classList.remove('scrolled');

    // highlight nav link by section in view
    navLinks.forEach(a => a.classList.remove('active'));
    for(let s of sections){
      const sec = document.querySelector(s);
      if(!sec) continue;
      const r = sec.getBoundingClientRect();
      if(r.top <= window.innerHeight * 0.5 && r.bottom >= 150){
        const link = document.querySelector('.nav a[href="${s}"]');
        if(link) link.classList.add('active');
      }
    }
  });
})();

/* Simple tilt effect for service cards based on mouse */
(function tiltCards(){
  const cards = $$('.service-card[data-tilt]');
  cards.forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * 6; // rotate X
      const ry = (x - 0.5) * -8; // rotate Y
      card.style.transform = 'perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)';
    });
    card.addEventListener('mouseleave', ()=> card.style.transform = '');
  });
})();

/* BEFORE / AFTER sliders (draggable + touch) */
(function beforeAfter(){
  $$('.ba-slider').forEach(slider=>{
    const afterWrap = slider.querySelector('.ba-after-wrapper');
    const handle = slider.querySelector('.ba-handle');

    const setPos = (clientX)=>{
      const rect = slider.getBoundingClientRect();
      let pos = clientX - rect.left;
      if(pos < 0) pos = 0;
      if(pos > rect.width) pos = rect.width;
      const pct = pos / rect.width * 100;
      afterWrap.style.width = pct + '%';
      handle.style.left = pct + '%';
    };

    // init
    afterWrap.style.width = '50%';
    handle.style.left = '50%';

    // mouse
    let dragging=false;
    handle.addEventListener('mousedown', ()=> dragging=true);
    window.addEventListener('mouseup', ()=> dragging=false);
    window.addEventListener('mousemove', e=> { if(dragging) setPos(e.clientX); });

    // click anywhere in slider
    slider.addEventListener('click', e=> setPos(e.clientX));

    // touch
    slider.addEventListener('touchmove', e=> setPos(e.touches[0].clientX));
  });
})();

/* Reviews carousel: autoplay + manual + swipe */
const reviews = document.querySelectorAll('.review');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let current = 0;

function showReview(index) {
  reviews.forEach((rev, i) => {
    rev.classList.remove('active');
    if(i === index) rev.classList.add('active');
  });
}

showReview(current);

prevBtn.addEventListener('click', () => {
  current = (current === 0) ? reviews.length - 1 : current - 1;
  showReview(current);
});

nextBtn.addEventListener('click', () => {
  current = (current === reviews.length - 1) ? 0 : current + 1;
  showReview(current);
});


/* Portfolio lightbox (gallery page). Also supports gallery items on index if any) */
(function lightbox(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;

  const lbImg = document.getElementById('lb-image');
  const close = document.getElementById('lb-close');
  const prevBtn = document.getElementById('lb-prev');
  const nextBtn = document.getElementById('lb-next');

  // Select all images inside gallery items
  const items = Array.from(document.querySelectorAll('.gallery-grid .gallery-item img'));
  if(!items.length) return;

  const imgs = items.map(i => i.src);
  let idx = 0;

  const openAt = i => {
    idx = i;
    lbImg.src = imgs[idx];
    lb.classList.add('active');
    lb.setAttribute('aria-hidden','false');
  };

  items.forEach((el, i) => el.addEventListener('click', ()=> openAt(i)));

  close.addEventListener('click', ()=> {
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden','true');
  });

  lb.addEventListener('click', e => {
    if(e.target === lb) {
      lb.classList.remove('active');
      lb.setAttribute('aria-hidden','true');
    }
  });

  prevBtn.addEventListener('click', ()=> {
    idx = (idx - 1 + imgs.length) % imgs.length;
    lbImg.src = imgs[idx];
  });

  nextBtn.addEventListener('click', ()=> {
    idx = (idx + 1) % imgs.length;
    lbImg.src = imgs[idx];
  });

  window.addEventListener('keydown', e=>{
    if(!lb.classList.contains('active')) return;
    if(e.key === 'Escape') close.click();
    if(e.key === 'ArrowLeft') prevBtn.click();
    if(e.key === 'ArrowRight') nextBtn.click();
  });
})();

/* Contact form simple validation and simulated submit */
const scrollElements = document.querySelectorAll('.scroll-animate');

const elementInView = (el, offset = 100) => {
  const elementTop = el.getBoundingClientRect().top;
  return elementTop <= (window.innerHeight - offset);
};

const displayScrollElement = (el) => {
  el.classList.add('active');
};

const handleScrollAnimation = () => {
  scrollElements.forEach(el => {
    if (elementInView(el, 100)) {
      displayScrollElement(el);
    }
  });
};

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);