require('dotenv').config()

const express = require('express')
const app = express()

const connectDB = require('./db/connect')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

const productsRouter = require('./routes/productsRoutes.js')

const PORT = process.env.PORT || 3003

// middleware
app.use(express.json())

// ===== Routes =====

app.get('/', (req, res) => {
  res.status(200).send('Store api')
})

app.use('/api/v1/products', productsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI)
    console.log('Connected to database...')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
