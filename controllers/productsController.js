const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .select({
      price: 1,
      name: 1,
    })
    .sort({ price: 1 })
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query
  // pagination logic
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

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
  // numeric filters:
  // query sintax: numericFilters=price>30,price<50,rating>4
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': '$eq',
    }
    const regex = /\b(<|>|<=|>=|=)\b/g
    let filters = numericFilters.replace(
      regex,
      (match) => `-${operatorMap[match]}-`
    )
    // console.log(numericFilters.split(','))
    console.log(filters)
    filters = filters.split(',').forEach((item) => {
      const [key, op, value] = item.split('-')
      // console.log(key, op, value)
      queryObj[key] = { [op]: value }
    })
  }
  console.log(queryObj)
  let result = Product.find(queryObj)

  // fields query
  if (fields) {
    const fieldsQuery = fields.split(',')
    const fieldsObj = {}
    fieldsQuery.map((e) => {
      fieldsObj[e] = 1
    })
    // console.log(fieldsObj)
    result = result.select(fieldsObj)
  }

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
    // console.log(sortObj)
    result = result.sort(sortObj)
  } else {
    result = result.sort({ createdAt: -1 })
  }

  result = result.limit(limit).skip(skip)

  const products = await result

  res
    .status(200)
    .json({ products, nbHits: products.length, page: Number(page) || 1 })
}

module.exports = { getAllProductsStatic, getAllProducts }
