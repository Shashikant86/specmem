/* SpecMem Documentation - Extra JavaScript */

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add copy feedback animation
  document.querySelectorAll('.md-clipboard').forEach(button => {
    button.addEventListener('click', function() {
      const originalTitle = this.getAttribute('title');
      this.setAttribute('title', 'Copied!');
      setTimeout(() => {
        this.setAttribute('title', originalTitle);
      }, 2000);
    });
  });

  // Animate feature cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
});

// Version selector enhancement
document.addEventListener('DOMContentLoaded', function() {
  const versionSelector = document.querySelector('.md-version');
  if (versionSelector) {
    versionSelector.addEventListener('change', function() {
      window.location.href = this.value;
    });
  }
});
