import product from './product.js'
import details from './details.js'

class List {
  #list = document.querySelector('.list') //----------------------- список элементов
  #selectElement = document.querySelector('.amount__select') // --- select изменения количества элементов
  #resetBtn = document.querySelector('.reset-btn') // ------------- кнопка перезагрузки
  #sortBtns = [...document.querySelectorAll('.sort__btn')] // ----- кнопки сортировки

  #products = [] // --------------------------------------- массив объектов с сервера
  #currentListItems = [] // ------------------------------- отрисованные элементы списка на данный момент
  #initialOrderOfItems = [] // ---------------------------- первоначальный порядок элементов
  #currentOrderOfItems = [] // ---------------------------- текущий порядок элементов
  #initialAmountOfItems = +this.#selectElement.value // --- первоначальный порядок элементов
  #amountOfItems = this.#initialAmountOfItems // ---------- текущее количество элементов в списке

  // Отрисовка списка
  render(products) {
    this.#clear()
    products.forEach((p, index) => {
      if (index < this.#amountOfItems) product.render(p)
    })
    this.#addDragAndDropHandlers()
    details.update()
  }

  // Отрисовка прелоадера
  renderPreloader() {
    this.#clear()
    const markup = `
        <div class="spinner">
          <svg>
            <use href="img/preloader-icon.svg#icon-loader"></use>
          </svg>
        </div>
      `
    this.#list.insertAdjacentHTML('afterbegin', markup)
  }

  // Отрисовка ошибки
  renderError(message) {
    const markup = `<div class="error">${message}</div>`
    this.#clear()
    this.#list.insertAdjacentHTML('afterbegin', markup)
  }

  // Сеттер для массива объектов с сервера
  setProducts(products) {
    this.#products = products
  }

  // Запоминаем начальный порядок элементов в массиве
  setInitialOrderOfItems(products) {
    this.#initialOrderOfItems = Array.from(products.map(p => +p.id))
    this.#currentOrderOfItems = this.#initialOrderOfItems
  }

  // Добавление обработчиков на элементы хедера
  addHandlersToHeader() {
    this.#amountChangeHandler()
    this.#sortHandler()
    this.#resetHandler()
  }

  // Обработчик изменения количества элементов
  #amountChangeHandler() {
    this.#selectElement.addEventListener('change', e => {
      this.#changeAmountOfItems(e)
    })
  }

  // Обработчик сортировки
  #sortHandler() {
    this.#sortBtns.forEach(btn =>
      btn.addEventListener('click', event => this.#sortList(event))
    )
  }

  // Обработчик сброса
  #resetHandler() {
    this.#resetBtn.addEventListener('click', this.#reset.bind(this))
  }

  // Очистка списка
  #clear() {
    this.#list.innerHTML = ''
  }

  // Обновление информации о текущем порядке элементов в списке
  #changeCurrentOrderOfItems() {
    // Получаем информацию о текущем порядке элементов в списке
    this.#currentListItems = [...document.querySelectorAll('.list__item')]
    const order = this.#currentListItems.map(item => +item.dataset.id)

    // Фиксируем изменения в общем массиве
    this.#currentOrderOfItems = this.#currentOrderOfItems.map((el, i) =>
      order[i] ? (el = order[i]) : el
    )

    // Сортируем массив "products" согласно текущему порядку
    this.#products.sort(
      (a, b) =>
        this.#currentOrderOfItems.indexOf(a.id) -
        this.#currentOrderOfItems.indexOf(b.id)
    )
  }

  // Сброс списка к первоначальному состоянию
  #reset() {
    this.#amountOfItems = this.#initialAmountOfItems
    this.#selectElement.value = this.#amountOfItems
    this.#currentOrderOfItems = this.#initialOrderOfItems
    this.#products.sort((a, b) => (a.id < b.id ? -1 : 1))
    this.#resetSortBtns()
    this.render(this.#products)
    this.#changeCurrentOrderOfItems()
  }

  /**========================================================================
   **                               Drag & Drop
   *========================================================================**/
  // Добавление Drag&Drop обработчиков на элементы списка
  #addDragAndDropHandlers() {
    // Получаем элементы списка на текущий момент
    this.#currentListItems = [...document.querySelectorAll('.list__item')]

    // Управление состоянием во время поднятия / отпускания элемента
    this.#currentListItems.forEach(item => {
      // Поднимаем элемент
      item.addEventListener('dragstart', () => {
        // Добавляем класс "dragging" перетаскиваемому элементу
        item.classList.add('dragging')
        // Скрываем выпадающие блоки
        details.hide()
      })

      // Отпускаем элемент
      item.addEventListener('dragend', () => {
        // Убираем класс "dragging" с перетаскиваемого элемента
        item.classList.remove('dragging')
        // Возвращаем видимость выпадающим блокам
        details.show()
        // Корректируем положение выпадающих блоков "details"
        details.update()
        // Запоминаем текущий порядок элементов в списке
        this.#changeCurrentOrderOfItems()
      })
    })

    // Управление состоянием во время перетаскивания элемента
    this.#list.addEventListener('dragover', event => {
      event.preventDefault()

      // Получаем перетаскиваемый элемент, и элемент, перед которым находимся в данный момент
      const draggable = document.querySelector('.dragging')
      const nextItem = this.#getNextItem(this.#list, event.clientY)

      // Если впередилежащего элемента нет, то добавляем поднятый элемент в конец списка
      if (nextItem == null) {
        this.#list.appendChild(draggable)
        // Если есть, то добавляем поднятый элемент перед ним
      } else {
        this.#list.insertBefore(draggable, nextItem)
      }
    })
  }

  // Определение элемента, перед которым в данный момент находится перетаскиваемый
  #getNextItem(list, yCursorCoord) {
    // Получаем все элементы списка, кроме перетаскиваемого
    const nonDraggableItems = [
      ...list.querySelectorAll('.list__item:not(.dragging)'),
    ]

    // Пока элемент поднят, отслеживаем расстояние от курсора
    // до середин остальных элементов списка (dragSpace)
    return (
      nonDraggableItems
        .map(item => {
          const topOfItem = item.getBoundingClientRect().top
          const halfHeightOfItem = item.getBoundingClientRect().height / 2
          const dragSpace = yCursorCoord - (topOfItem + halfHeightOfItem)
          // Если курсор находится выше центра элемента, то отправляем этот элемент в массив
          if (dragSpace < 0) {
            return item
          }
          // Если курсор пересёк центр элемента, то отправляем в массив значение null
          else {
            return null
          }
        })
        // Первый не null в полученном массиве и будет искомым элементом
        .find(item => item !== null)
    )
  }

  /**========================================================================
   **                          Изменение количества
   *========================================================================**/
  #changeAmountOfItems(event) {
    // Получаем количество элементов, которое необходимо отрисовать
    this.#amountOfItems = +event.target.value

    // Отрисовываем список элементов в DOM
    this.render(this.#products)

    // Обнуляем состояния кнопок сортировки
    this.#resetSortBtns()
  }

  /**========================================================================
   **                               Сортировка
   *========================================================================**/
  // Проверка текущего состояния кнопок сортировки
  #isDescending(btn) {
    return btn.classList.contains('descending')
  }
  #isAscending(btn) {
    return btn.classList.contains('ascending')
  }

  // Обнуление состояния кнопок сортировки (для корректного отображения иконок)
  #resetSortBtns(clickedBtn) {
    this.#sortBtns.forEach(btn => {
      if (btn === clickedBtn) return
      btn.classList.remove('ascending', 'descending')
    })
  }

  // Сортировка массива "Products" по возрастанию указанного параметра
  #getSortedProducts(products, parameter) {
    return products.slice(0, this.#amountOfItems).sort((a, b) => {
      return a[parameter] < b[parameter] ? -1 : 1
    })
  }

  // Сортировка списка в DOM
  #sortList(event) {
    const clickedBtn = event.target
    const parameter = clickedBtn.dataset.parameter
    const sortedProducts = this.#getSortedProducts(this.#products, parameter)

    // Обнуляем состояния всех кнопок сортировки, кроме нажатой
    this.#resetSortBtns(clickedBtn)

    // Если отсортировано по убыванию (или кнопка нажата первый раз), то сортируем по возрастанию
    if (
      this.#isDescending(clickedBtn) ||
      (!this.#isDescending(clickedBtn) && !this.#isAscending(clickedBtn))
    ) {
      clickedBtn.classList.remove('descending')
      clickedBtn.classList.add('ascending')

      // Если отсортировано по возрастанию, то меняем состояние кнопок и переворачиваем массив
    } else if (this.#isAscending(clickedBtn)) {
      clickedBtn.classList.remove('ascending')
      clickedBtn.classList.add('descending')
      sortedProducts.reverse()
    }

    // Отрисовываем список элементов в DOM
    this.render(sortedProducts)

    // Запоминаем текущий порядок элементов в списке
    this.#changeCurrentOrderOfItems()
  }
}

export default new List()
