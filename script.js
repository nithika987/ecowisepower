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
