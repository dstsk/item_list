import * as model from './model.js'
import list from './views/list.js'

const init = async () => {
  try {
    // Отрисовываем прелоадер
    list.renderPreloader()

    // Получаем массив с объектами
    const products = await model.loadProducts()

    // Отрисовываем список
    list.render(products)

    // Передаём массив с объектами в List
    list.setProducts(products)

    // Запоминаем первоначальное количество элементов
    list.setInitialOrderOfItems(products)

    // Добавляем обработчики элементам хедера
    list.addHandlersToHeader()
  } catch (error) {
    console.error('💥', error)
    list.renderError(error.message)
  }
}

// Запуск приложения
init()
