'use strict'

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const cartController = require('../controllers/cartController');

router.get('/', productsController.getData, productsController.show);
router.get('/cart', cartController.show);

router.get('/:id', productsController.getData, productsController.showDetails);
router.post('/cart', cartController.add);
router.put('/cart', cartController.update);
router.delete('/cart',cartController.remove);
router.delete('/cart/all',cartController.clear);
module.exports = router;