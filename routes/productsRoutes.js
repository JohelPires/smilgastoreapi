const router = require('express').Router()
const productsController = require('../controllers/productsController')

router.get('/', productsController.getAllProducts)
router.get('/static', productsController.getAllProductsStatic)

module.exports = router
