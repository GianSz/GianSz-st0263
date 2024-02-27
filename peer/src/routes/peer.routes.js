const express = require('express');
const router = express.Router();

const { downloadFile, uploadFile } = require('../controllers/fileTransfer.controller');

router.get('/download/:file', downloadFile);
router.post('/upload/', uploadFile);

module.exports = router;