document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('phones-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const thirdBlock = document.querySelector(".third-block");
  // const serviceItems = document.querySelectorAll(".service-item");  // UNUSED ????
  
  const animatedItems = new Set();
  
  let scrollTimeout;
  const scrollHandler = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (isElementPartiallyInViewport(thirdBlock)) {
        const itemsInThirdBlock = Array.from(thirdBlock.querySelectorAll(".service-item:not(.animated)"));
        startAnimationsSequentially(itemsInThirdBlock);
      }
    }, 100);
  };

  openModalBtn.addEventListener('click', () => modal.style.display = 'flex');
  closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = Array.from(entry.target.querySelectorAll(".service-item:not(.animated)"));
          startAnimationsSequentially(items);
        }
      });
    }, {threshold: 0.1});
    
    if (thirdBlock) {
      observer.observe(thirdBlock);
    }
  } else {
    // Fallback for older browsers
    window.addEventListener("scroll", scrollHandler);
    
    if (thirdBlock && isElementPartiallyInViewport(thirdBlock)) {
      const itemsInThirdBlock = Array.from(thirdBlock.querySelectorAll(".service-item:not(.animated)"));
      startAnimationsSequentially(itemsInThirdBlock);
    }
  }

  const isElementPartiallyInViewport = (el) => {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    return (
      rect.top <= windowHeight && 
      rect.bottom >= 0 && 
      rect.left <= windowWidth && 
      rect.right >= 0
    );
  };

  const startAnimationsSequentially = (items) => {
    items.forEach((item, index) => {
      if (!animatedItems.has(item)) {
        animatedItems.add(item);
        item.classList.add('animated');
        
        setTimeout(() => {
          const fill = item.querySelector(".fill");
          const bulb = item.querySelector(".bulb");
          
          if (fill) {
            fill.style.width = "100%";
            
            setTimeout(() => {
              if (bulb) {
                bulb.style.backgroundColor = "#50df9f";
                bulb.style.boxShadow = "0 0 10px 3px #50df9f";
              }
            }, 2000);
          }
        }, index * 500);
      }
    });
  };

  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  });

  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});