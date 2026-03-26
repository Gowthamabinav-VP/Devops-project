const mongoose = require('mongoose');

const requestSchema = mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    documentType: {
      type: String,
      required: true,
      enum: ['Bonafide Certificate', 'Project Proposal', 'Leave Request', 'Other'],
    },
    filePath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Rejected', 'Modification Required'],
      default: 'Pending',
    },
    remarks: {
      type: String,
      default: '',
    },
    decisionDate: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'submissionDate', updatedAt: true },
  }
);

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
