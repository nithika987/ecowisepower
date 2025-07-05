document.addEventListener('DOMContentLoaded', async () => {
  // Step 1: Load dynamic sections
  const includes = document.querySelectorAll('.include');
  for (const el of includes) {
    const src = el.getAttribute('data-src');
    try {
      const res = await fetch(src);
      const html = await res.text();
      el.innerHTML = html;
    } catch (err) {
      console.error(`Error loading ${src}`, err);
    }
  }

  // Step 2: After sections are loaded, map IDs to nav links
  const navLinks = document.querySelectorAll('nav a');
  const sectionMap = {};
  navLinks.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    sectionMap[id] = link;
  });

  // Step 3: Observe section visibility to activate nav links
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
      rootMargin: '-30% 0px -60% 0px', // highlight when section is centered
      threshold: 0.3
    }
  );

  // Step 4: Start observing once sections are rendered
  setTimeout(() => {
    document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
  }, 300); // wait a bit for innerHTML to finish rendering
});

window.calculateSolar = function(event) {
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
