window.addEventListener('load', () => {
  var menuBtn = document.querySelector(".hdr-NavigationTrigger");

  const escToExit = function(e) {
    if (e.keyCode === 27) {
      if ("true" === menuBtn.getAttribute("aria-pressed")) {
        menuBtn.querySelector('title').textContent = "Closed";
        menuBtn.setAttribute("aria-pressed", "false");
      }
    }
  };

  function clicked() {
    let btn = this,
        svg,
        svgTitles,
        svgTitle;

    const closeEvt = window.addEventListener('keyup', escToExit);

    requestAnimationFrame(function() {
      btn.setAttribute("aria-pressed", "false" === btn.getAttribute("aria-pressed"));
      svg = btn.getElementsByTagName("svg");
      if (svg) {
        svgTitles = svg[0].getElementsByTagName("title");
        if (svgTitles) {
          svgTitle = svgTitles[0];
          if ("false" === btn.getAttribute("aria-pressed")) {
            svgTitle.textContent = "Open";
          } else {
            svgTitle.textContent = "Close";
            removeEventListener('keyup', closeEvt);
          }
        }
      }
    });
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", clicked);
  }
})

window.addEventListener('load', () => {
  const doublePanels = document.querySelectorAll('.dp,.adp');

  doublePanels !== null && doublePanels.forEach(function(el) {
    const container = el.querySelector<HTMLElement | null>('.dp-PanelContent_Left, .adp-Panel_Left');
    if (container === null) return null;
    const absWidth = (window.innerWidth * 11) / 100;
    const containerHeight = Math.round(container.getClientRects()[0].height);
    const mobileOverlapHeight = getComputedStyle(document.documentElement)
      .getPropertyValue('--doublePanelMobileOverlap').replace('rem','');
    const skewAngle = window.innerWidth < 768 
      ? Math.atan(
        (16 * Number.parseFloat(mobileOverlapHeight)) /window.innerWidth
      )/(Math.PI / 180)
      : Math.atan(absWidth/containerHeight)/(Math.PI / 180)
    container.style.setProperty('--dpAngle', `-${ skewAngle }deg`);
    console.log({skewAngle});
  });
});
