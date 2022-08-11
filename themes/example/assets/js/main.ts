window.addEventListener('DOMContentLoaded', () => {
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

  const doublePanels = document.querySelectorAll('.dp');

  doublePanels !== null && doublePanels.forEach(function(el) {
    const container = el.querySelector('.dp-PanelContent_Left');
    const shape = el.querySelector('.dp-PanelContent_Shape');
    if (shape === null) return null;
    const containerHeight = Math.round(container.getClientRects()[0].height);
    const shapeHeight = Math.round(shape.getClientRects()[0].height);
    shape.style.transform = `scaleY(${ containerHeight / shapeHeight })`;
  });
});
