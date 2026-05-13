const express = require('express');
const router = express.Router();
const Snapshot = require('../models/Snapshot');

// GET /api/analytics — Aggregated analytics from stored snapshots
router.get('/analytics', async (req, res) => {
  try {
    const snapshots = await Snapshot.find().sort({ createdAt: -1 }).limit(200);

    if (snapshots.length === 0) {
      return res.json({
        totalSnapshots: 0,
        avgCompressionRatio: 0,
        avgProcessingTime: 0,
        thresholdDistribution: [],
        compressionOverTime: [],
      });
    }

    // Aggregate statistics
    const totalSnapshots = snapshots.length;
    const avgCompressionRatio = snapshots.reduce((s, snap) => s + (snap.compressionRatio || 0), 0) / totalSnapshots;
    const avgProcessingTime = snapshots.reduce((s, snap) => s + (snap.processingTime || 0), 0) / totalSnapshots;

    // Threshold distribution (bucket into ranges)
    const buckets = {};
    snapshots.forEach((snap) => {
      const bucket = Math.floor(snap.threshold / 500) * 500;
      buckets[bucket] = (buckets[bucket] || 0) + 1;
    });
    const thresholdDistribution = Object.entries(buckets)
      .map(([threshold, count]) => ({ threshold: Number(threshold), count }))
      .sort((a, b) => a.threshold - b.threshold);

    // Compression over time (latest 20)
    const compressionOverTime = snapshots.slice(0, 20).reverse().map((snap) => ({
      date: snap.createdAt,
      ratio: snap.compressionRatio,
      nodes: snap.totalNodes,
      threshold: snap.threshold,
    }));

    res.json({
      totalSnapshots,
      avgCompressionRatio: parseFloat(avgCompressionRatio.toFixed(1)),
      avgProcessingTime: parseFloat(avgProcessingTime.toFixed(1)),
      thresholdDistribution,
      compressionOverTime,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
