document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('phones-modal');
  const closeModalBtn = document.getElementById('close-modal');

  openModalBtn.addEventListener('click', function () {
    modal.style.display = 'flex';
  });

  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  function isElementPartiallyInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // Проверяем, пересекается ли элемент с viewport
    const vertInView = (rect.top <= windowHeight) && (rect.top + rect.height >= 0);
    const horInView = (rect.left <= windowWidth) && (rect.left + rect.width >= 0);

    return vertInView && horInView;
  }

  const serviceItems = document.querySelectorAll(".service-item");
  const animatedItems = {};

  function startAnimationsSequentially(items) {
    items.forEach((item, index) => {
      if (!animatedItems[index]) {
        animatedItems[index] = true;

        setTimeout(() => {
          const fill = item.querySelector(".fill");
          const bulb = item.querySelector(".bulb");

          fill.style.width = "100%";
          setTimeout(() => {
            bulb.style.backgroundColor = "#50df9f";
            bulb.style.boxShadow = "0 0 10px 3px #50df9f";
          }, 2000);
        }, index * 500);
      }
    });
  }

  window.addEventListener("scroll", function () {
    const thirdBlock = document.querySelector(".third-block");
    if (isElementPartiallyInViewport(thirdBlock)) {
      const itemsInThirdBlock = thirdBlock.querySelectorAll(".service-item");
      startAnimationsSequentially(itemsInThirdBlock);
    }
  });

  const thirdBlock = document.querySelector(".third-block");
  if (isElementPartiallyInViewport(thirdBlock)) {
    const itemsInThirdBlock = thirdBlock.querySelectorAll(".service-item");
    startAnimationsSequentially(itemsInThirdBlock);
  }
});