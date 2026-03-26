const Request = require('../models/Request');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new request
// @route   POST /api/requests/create
// @access  Private
const createRequest = async (req, res) => {
  try {
    const { documentType } = req.body;
    
    // In actual app we might want to ensure file exists and was uploaded
    let filePath = '';
    if (req.file) {
      filePath = req.file.path.replace(/\\/g, '/'); // normalize path separators
    } else {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const request = new Request({
      requestId: `REQ-${uuidv4().substring(0, 8).toUpperCase()}`,
      user: req.user._id,
      documentType,
      filePath,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user requests
// @route   GET /api/requests/user
// @access  Private
const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id }).sort({ submissionDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all requests (Admin)
// @route   GET /api/requests/admin
// @access  Private/Admin
const getAdminRequests = async (req, res) => {
  try {
    const requests = await Request.find({}).populate('user', 'id name email role').sort({ submissionDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a request
// @route   PUT /api/requests/approve/:id
// @access  Private/Admin
const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (request) {
      request.status = 'Approved';
      request.remarks = req.body.remarks || 'Approved by authority.';
      request.decisionDate = Date.now();

      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a request
// @route   PUT /api/requests/reject/:id
// @access  Private/Admin
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (request) {
      request.status = 'Rejected';
      request.remarks = req.body.remarks || 'Rejected by authority.';
      request.decisionDate = Date.now();

      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request modification
// @route   PUT /api/requests/modify/:id
// @access  Private/Admin
const requestModification = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (request) {
      request.status = 'Modification Required';
      request.remarks = req.body.remarks || 'Please modify and resubmit.';
      request.decisionDate = Date.now();

      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getUserRequests,
  getAdminRequests,
  approveRequest,
  rejectRequest,
  requestModification,
};
