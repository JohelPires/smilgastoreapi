const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort({ price: 1, name: -1 })
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query
  const queryObj = {}

  if (featured) {
    queryObj.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObj.company = company
  }
  if (name) {
    queryObj.name = { $regex: name, $options: 'i' }
  }
  let result = Product.find(queryObj)
  // sort query
  if (sort) {
    const sortQuery = sort.split(',')
    const sortObj = {}
    sortQuery.map((e) => {
      if (e[0] === '-') {
        const k = e.slice(1)
        sortObj[k] = -1
      } else {
        sortObj[e] = 1
      }
    })
    console.log(sortObj)
    result = result.sort(sortObj)
  } else {
    result = result.sort({ createdAt: -1 })
  }
  const products = await result

  res.status(200).json({ products, nbHits: products.length })
}

module.exports = { getAllProductsStatic, getAllProducts }
