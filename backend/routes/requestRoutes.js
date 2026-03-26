const express = require('express');
const router = express.Router();
const {
  createRequest,
  getUserRequests,
  getAdminRequests,
  approveRequest,
  rejectRequest,
  requestModification,
} = require('../controllers/requestController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/create', protect, upload.single('file'), createRequest);
router.get('/user', protect, getUserRequests);
router.get('/admin', protect, admin, getAdminRequests);
router.put('/approve/:id', protect, admin, approveRequest);
router.put('/reject/:id', protect, admin, rejectRequest);
router.put('/modify/:id', protect, admin, requestModification);

module.exports = router;
