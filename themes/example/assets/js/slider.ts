import Glide from '@glidejs/glide';

new Glide('.glide', {
  type: 'slider',
  animationDuration: 400,
  rewind: false,
  gap: 30,
  perView: 6,
  breakpoints: {
    1200: { perView: 5 },
    1024: { perView: 4, },
    600: { perView: 3, },
  }
}).mount();
