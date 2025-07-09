document.addEventListener('DOMContentLoaded', async () => {
  // Step 1: Load dynamic sections
  const includes = document.querySelectorAll('.include');

  for (const el of includes) {
    const src = el.getAttribute('data-src');
    try {
      const res = await fetch(src);
      const html = await res.text();
      el.innerHTML = html;

      // ✅ Force reflow to ensure layout updates
      el.style.display = 'none';
      el.offsetHeight;
      el.style.display = '';

      // ✅ Add fade-in animation class to all sections
      el.querySelectorAll('section').forEach(sec => {
        sec.classList.add('fade-in');
      });

    } catch (err) {
      console.error(`Error loading ${src}`, err);
    }
  }

  // Step 2: Map nav links to sections
  const navLinks = document.querySelectorAll('nav a');
  const sectionMap = {};
  navLinks.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    sectionMap[id] = link;
  });

  // Step 3: Observe visibility to activate nav links
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id && sectionMap[id]) {
            navLinks.forEach(link => link.classList.remove('active'));
            sectionMap[id].classList.add('active');
          }
        }
      });
    },
    {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0.3
    }
  );

  // Step 4: Observe all sections once rendered
  setTimeout(() => {
    document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
  }, 300);

  // Step 5: Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const mobileNavLinks = navMenu.querySelectorAll('a');

  menuToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
  
   // ✅ Step 6: Carousel logic for Projects
  const carousel = document.getElementById('carouselSlide');
  if (carousel) {
    const totalSlides = carousel.children.length;
    let currentSlide = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentSlide * 20}%)`;
    };
    setTimeout(() => {
      updateCarousel(); // 🔥 delay initial render so image is visible
    }, 300);
    document.getElementById('nextBtn')?.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
      triggerPopEffect();
    });

    document.getElementById('prevBtn')?.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
      triggerPopEffect();
    });
    function triggerPopEffect() {
      const allProjects = carousel.querySelectorAll('.project');
      const current = allProjects[currentSlide];
      if (current) {
        current.classList.remove('pop'); // reset animation
        void current.offsetWidth; // force reflow
        current.classList.add('pop');
      }
}

  }
});

// Optional: keep this for solar calculator logic
window.calculateSolar = function (event) {
  event.preventDefault();

  const roofArea = parseFloat(document.getElementById('roofArea').value);
  const sanctionedLoad = parseFloat(document.getElementById('sanctionedLoad').value);
  const monthlyConsumption = parseFloat(document.getElementById('monthlyConsumption').value);

  if (isNaN(roofArea) || isNaN(sanctionedLoad) || isNaN(monthlyConsumption)) {
    alert("Please fill in all fields.");
    return;
  }

  const capFromRoof = roofArea / 80;
  const capFromLoad = 0.85 * sanctionedLoad;
  const capFromConsumption = monthlyConsumption / 30 / 4;
  const capacity = Math.min(capFromRoof, capFromLoad, capFromConsumption);

  const generation = capacity * 1460;
  const savings = generation * 7.5;
  const carbonOffset = capacity * 1.2;
  const treesPlanted = capacity * 45;

  document.getElementById('capacity').textContent = capacity.toFixed(2);
  document.getElementById('generation').textContent = Math.round(generation);
  document.getElementById('savings').textContent = Math.round(savings).toLocaleString("en-IN");
  document.getElementById('carbon').textContent = carbonOffset.toFixed(1);
  document.getElementById('trees').textContent = Math.round(treesPlanted);

  document.getElementById('results').style.display = "block";
};


