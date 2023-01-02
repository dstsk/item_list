// Создание массива с продуктами
const createProductsArray = function (data) {
  const { products } = data
  return products.map(p => {
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.images[0],
      rating: p.rating,
      brand: p.brand,
    }
  })
}

// Получение данных с сервера
export const loadProducts = async function () {
  try {
    const result = await fetch(`https://dummyjson.com/products?limit=100`)

    if (!result.ok)
      throw new Error(`Не удалось загрузить данные 😱 (${result.status})`)

    const data = await result.json()

    return createProductsArray(data)
  } catch (error) {
    console.error('💥', error)
    throw error
  }
}
