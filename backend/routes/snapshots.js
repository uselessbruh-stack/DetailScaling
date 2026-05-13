const express = require('express');
const router = express.Router();
const Snapshot = require('../models/Snapshot');

// POST /api/snapshot — Save a new snapshot
router.post('/snapshot', async (req, res) => {
  try {
    const snapshot = new Snapshot(req.body);
    const saved = await snapshot.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/snapshots — List all snapshots (newest first)
router.get('/snapshots', async (req, res) => {
  try {
    const snapshots = await Snapshot.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(snapshots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/snapshot/:id — Get a single snapshot
router.get('/snapshot/:id', async (req, res) => {
  try {
    const snapshot = await Snapshot.findById(req.params.id);
    if (!snapshot) return res.status(404).json({ error: 'Snapshot not found' });
    res.json(snapshot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/snapshot/:id — Delete a snapshot
router.delete('/snapshot/:id', async (req, res) => {
  try {
    const result = await Snapshot.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Snapshot not found' });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
