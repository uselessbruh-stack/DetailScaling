/**
 * Variance and color analysis utilities for quadtree subdivision.
 * Computes per-region RGB variance and average color from raw ImageData.
 */

/**
 * Calculate color variance and average color for a rectangular region.
 * Uses the mathematical identity: Var(X) = E[X²] - E[X]²
 *
 * @param {Uint8ClampedArray} data - Raw pixel data (RGBA, 4 bytes per pixel)
 * @param {number} imgWidth - Full image width (for row stride calculation)
 * @param {number} x - Region left edge
 * @param {number} y - Region top edge
 * @param {number} w - Region width
 * @param {number} h - Region height
 * @returns {{ variance: number, avgColor: { r: number, g: number, b: number } }}
 */
export function calculateRegionStats(data, imgWidth, x, y, w, h) {
  let sumR = 0, sumG = 0, sumB = 0;
  let sumR2 = 0, sumG2 = 0, sumB2 = 0;
  let count = 0;

  const xEnd = x + w;
  const yEnd = y + h;

  for (let py = y; py < yEnd; py++) {
    const rowOffset = py * imgWidth * 4;
    for (let px = x; px < xEnd; px++) {
      const idx = rowOffset + px * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      sumR += r;
      sumG += g;
      sumB += b;
      sumR2 += r * r;
      sumG2 += g * g;
      sumB2 += b * b;
      count++;
    }
  }

  if (count === 0) {
    return { variance: 0, avgColor: { r: 0, g: 0, b: 0 } };
  }

  const avgR = sumR / count;
  const avgG = sumG / count;
  const avgB = sumB / count;

  const varR = (sumR2 / count) - (avgR * avgR);
  const varG = (sumG2 / count) - (avgG * avgG);
  const varB = (sumB2 / count) - (avgB * avgB);

  // Combined variance: sum of channel variances
  const variance = varR + varG + varB;

  return {
    variance,
    avgColor: {
      r: Math.round(avgR),
      g: Math.round(avgG),
      b: Math.round(avgB),
    },
  };
}

/**
 * Calculate just the average color for a region (faster path when variance not needed).
 */
export function calculateAverageColor(data, imgWidth, x, y, w, h) {
  let sumR = 0, sumG = 0, sumB = 0;
  let count = 0;

  const xEnd = x + w;
  const yEnd = y + h;

  for (let py = y; py < yEnd; py++) {
    const rowOffset = py * imgWidth * 4;
    for (let px = x; px < xEnd; px++) {
      const idx = rowOffset + px * 4;
      sumR += data[idx];
      sumG += data[idx + 1];
      sumB += data[idx + 2];
      count++;
    }
  }

  if (count === 0) return { r: 0, g: 0, b: 0 };

  return {
    r: Math.round(sumR / count),
    g: Math.round(sumG / count),
    b: Math.round(sumB / count),
  };
}
