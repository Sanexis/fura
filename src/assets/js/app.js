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

  // Функция для проверки, что элемент находится в области видимости
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }

  // Получаем все блоки
  const serviceItems = document.querySelectorAll(".service-item");

  // Объект для отслеживания, какие анимации уже были запущены
  const animatedItems = {};

  // Функция для запуска анимации на каждом блоке с задержкой
  function startAnimationsSequentially(items) {
    items.forEach((item, index) => {
      // Проверяем, была ли анимация уже выполнена для этого элемента
      if (!animatedItems[index]) {
        animatedItems[index] = true;

        // Запускаем анимацию с задержкой, пропорциональной индексу элемента
        setTimeout(() => {
          const fill = item.querySelector(".fill");
          const bulb = item.querySelector(".bulb");

          fill.style.width = "100%";
          setTimeout(() => {
            bulb.style.backgroundColor = "#50df9f";
            bulb.style.boxShadow = "0 0 10px 3px #50df9f"; // Добавляем тень
          }, 2000);
        }, index * 500); // Задержка 500мс между анимациями (можно регулировать)
      }
    });
  }

  window.addEventListener("scroll", function () {
    // Проверяем, виден ли родительский блок (third-block)
    const thirdBlock = document.querySelector(".third-block");
    if (isElementInViewport(thirdBlock)) {
      // Запускаем последовательные анимации для всех элементов внутри third-block
      const itemsInThirdBlock = thirdBlock.querySelectorAll(".service-item");
      startAnimationsSequentially(itemsInThirdBlock);
    }
  });
});