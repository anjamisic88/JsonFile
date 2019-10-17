const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config.js')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});
app.use(cors());

const getCustomers = (request, response) => {
  pool.query('SELECT * FROM customers', (error, results) => {
    if (error) {
      throw error
    }
    response.setHeader("Content-Type", "application/json");
    response.status(200).json(results.rows)
  })
}

const addCustomer = (request, response) => {
  const { id, name, email } = request.body

  pool.query('INSERT INTO customers (id, name, email) VALUES ($1, $2, $3)', [id, name, email], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Customer added.' })
  })
}

app
  .route('/customers')
  // GET endpoint
  .get(getCustomers)
  // POST endpoint
  .post(addCustomer)

// Start server
app.listen(process.env.PORT || 3009, () => {
  console.log(`Server listening`)
})