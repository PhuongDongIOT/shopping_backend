const express = require('express')
const app = express()
const port = 4000

app.get('/api', (req, res) => {
  res.json([{
    orderId: "1234567",
    customerName: "23456789",
    totalAmount: 34567890,
    status: "hoho"
  }])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})