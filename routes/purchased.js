    const express = require('express');
    const purchasedController = require('../controller/purchased.js');
    const router = express.Router();

    router.post('/', purchasedController.setNewPurchased);
    router.get('/:username/:transportasi', purchasedController.getPurchased);
    router.patch('/', purchasedController.updatePurchasedStatus);

    module.exports = router;