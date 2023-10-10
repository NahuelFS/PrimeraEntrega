// carts.js
const express = require('express');
const router = express.Router();
const fs = require('fs');

let carrito = require('../data/carrito.json');

router.post('/', (req, res) => {
  const newCart = {
    id: Math.random().toString(36).substr(2, 9),
    products: [],
  };
  carrito.push(newCart);
  fs.writeFileSync('./data/carrito.json', JSON.stringify(carrito, null, 2));
  res.json(newCart);
});

router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const cart = carrito.find(item => item.id === cid);
  if (!cart) {
    res.status(404).json({ message: 'Carrito no encontrado' });
  } else {
    res.json(cart.products);
  }
});

router.post('/:cid/products/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cartIndex = carrito.findIndex(item => item.id === cid);

  if (cartIndex === -1) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  const productToAdd = { product: pid, quantity: parseInt(quantity, 10) || 1 };

  const cart = carrito[cartIndex];

  const existingProduct = cart.products.find(item => item.product === pid);
  if (existingProduct) {
    existingProduct.quantity += parseInt(quantity, 10) || 1;
  } else {
    cart.products.push(productToAdd);
  }

  fs.writeFileSync('./data/carrito.json', JSON.stringify(carrito, null, 2));
  res.json(cart.products);
});

module.exports = router;

