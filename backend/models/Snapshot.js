const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  imageName: {
    type: String,
    default: 'Untitled',
  },
  imagePreview: {
    type: String, // base64 data URL thumbnail
    required: true,
  },
  threshold: {
    type: Number,
    required: true,
  },
  totalNodes: {
    type: Number,
    default: 0,
  },
  leafNodes: {
    type: Number,
    default: 0,
  },
  maxDepth: {
    type: Number,
    default: 0,
  },
  compressionRatio: {
    type: Number,
    default: 1,
  },
  processingTime: {
    type: Number,
    default: 0,
  },
  originalDimensions: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Snapshot', snapshotSchema);
