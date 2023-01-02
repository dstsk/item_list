import details from './details.js'

class Product {
  #parentElement = document.querySelector('.list') // --- список элементов
  #product // ------------------------------------------- контейнер для хранения объекта продукта

  // Отрисовка элемента
  render(data) {
    this.#product = data
    const markup = this.#generateProductMarkup()
    this.#parentElement.insertAdjacentHTML('beforeend', markup)
  }

  // Создание разметки элемента списка
  #generateProductMarkup() {
    return `
      <li class="list__item item" data-id="${
        this.#product.id
      }" draggable="true">
        <img
            class="list__item-img"
            src="${this.#product.image}"
            alt=""
        />
        <div class="list__item-title">${this.#product.title}</div>
        <div class="list__item-price">$ ${this.#product.price}</div>
        <div class="list__item-draggable">
          <svg viewBox="0 0 15 10">
            <rect y="1" width="15" height="1"></rect>
            <rect y="5" width="15" height="1"></rect>
            <rect y="9" width="15" height="1"></rect>
          </svg>
        </div>
        ${details.generateDetailsMarkup(this.#product)}
      </li>
    `
  }
}

export default new Product()
