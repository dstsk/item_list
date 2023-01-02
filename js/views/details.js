class Details {
  #list = document.querySelector('.list') // --- список элементов
  #currentListItems // ------------------------- отрисованные элементы списка на данный момент
  #detailsBlocks // ---------------------------- выпадающие блоки
  #product // ---------------------------------- контейнер для хранения объекта продукта

  // Создание разметки элемента списка
  generateDetailsMarkup(product) {
    this.#product = product
    return `
      <div class="list__item-details details" style="top: 0px" tabindex="0">
        <div class=" details__inner">
          <p class="details__title">${this.#product.title}</p>
          <p class="details__description">
            ${this.#product.description}
          </p>
          <img
            class="details__img"
            src="${this.#product.image}"
            alt=""
          />

          <div class="details__table">
            <ul class="details__table-box">
              <li>
                <span class="details__table-name">Brand</span>
                <span class="details__table-value">${this.#product.brand}</span>
              </li>
              <li>
                <span class="details__table-name">Rating</span>
                <span class="details__table-value">${
                  this.#product.rating
                }</span>
              </li>
              <li>
                <span class="details__table-name">Price</span>
                <span class="details__table-value">$ ${
                  this.#product.price
                }</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `
  }

  // Позиционирование и регулировка выпадающих блоков
  update() {
    this.#controlOfDetailsBlockPosition()
    this.#allowInteractionWithDetailsBlockContent()
  }

  // Скрыть выпадающие блоки
  hide() {
    this.#detailsBlocks = [...document.querySelectorAll('.details')]
    this.#detailsBlocks.forEach(block => block.classList.add('hidden'))
  }

  // Показать выпадающие блоки
  show() {
    this.#detailsBlocks = [...document.querySelectorAll('.details')]
    this.#detailsBlocks.forEach(block => block.classList.remove('hidden'))
  }

  // Управление расположением выпадающего блока в зависимости от позиции элемента в списке
  #controlOfDetailsBlockPosition() {
    // Нижняя, верхняя координаты и высота списка
    const bottomOfList = this.#list.getBoundingClientRect().bottom
    const topOfList = this.#list.getBoundingClientRect().top
    const heightOfList = this.#list.getBoundingClientRect().height

    // Элементы списка на текущий момент
    this.#currentListItems = [...document.querySelectorAll('.list__item')]

    this.#currentListItems.forEach(item => {
      const detailsBlock = item.querySelector('.details')
      // Сбрасываем позиционирование выпадающего блока на 0
      detailsBlock.style.top = `0`

      // Нижняя, верхняя координаты и высотавыпадающего блока
      const bottomOfDetailsBlock = detailsBlock.getBoundingClientRect().bottom
      const topOfDetailsBlock = detailsBlock.getBoundingClientRect().top
      const heightOfDetailsBlock = detailsBlock.getBoundingClientRect().height

      // Если нижняя часть "details" выходит за нижнюю границу списка
      // и высота "details" меньше высоты списка,
      // то позиционируем данные блоки по нижней границе списка
      if (
        bottomOfList < bottomOfDetailsBlock &&
        heightOfList > heightOfDetailsBlock
      ) {
        detailsBlock.style.top = `${bottomOfList - bottomOfDetailsBlock}px`
      }

      // Если Если нижняя часть "details" выходит за нижнюю границу списка
      // И высота "details" больше высоты списка,
      // то позиционируем данные блоки по верхней границе списка
      if (
        bottomOfList < bottomOfDetailsBlock &&
        heightOfList < heightOfDetailsBlock
      ) {
        detailsBlock.style.top = `${topOfList - topOfDetailsBlock}px`
      }
    })
  }

  // Обеспечение возможности взаимодействия с содержимым выпадающего блока
  #allowInteractionWithDetailsBlockContent() {
    this.#detailsBlocks = [...document.querySelectorAll('.details')]

    this.#detailsBlocks.forEach(block => {
      const listItem = block.parentElement // элемент списка
      const image = block.querySelector('img') // изображение в выпадающем блоке

      // Отключаем возможность перетаскивания элемента,
      // когда над блоком "details" находится курсор
      block.addEventListener('mouseover', function () {
        listItem.setAttribute('draggable', 'false')
        image.setAttribute('draggable', 'false')
      })
      // Возвращаем обратно
      block.addEventListener('mouseout', function () {
        listItem.setAttribute('draggable', 'true')
        image.setAttribute('draggable', 'true')
      })
    })
  }
}

export default new Details()
