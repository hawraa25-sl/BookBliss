const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
const customerId = req.session?.user?.customer_id;
// insert
// insert address
// yemken ykoun el address already mawjoud
// so first, do a select and check if it is already there
// maybe you can delete it and insert and new one
});

module.exports = router;