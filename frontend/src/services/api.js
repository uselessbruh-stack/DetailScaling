/**
 * API service layer for backend communication.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

/**
 * Upload an image file.
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Save a compression snapshot.
 */
export async function saveSnapshot(snapshotData) {
  const response = await api.post('/snapshot', snapshotData);
  return response.data;
}

/**
 * Get all saved snapshots.
 */
export async function getSnapshots() {
  const response = await api.get('/snapshots');
  return response.data;
}

/**
 * Delete a snapshot by ID.
 */
export async function deleteSnapshot(id) {
  const response = await api.delete(`/snapshot/${id}`);
  return response.data;
}

/**
 * Get analytics data.
 */
export async function getAnalytics() {
  const response = await api.get('/analytics');
  return response.data;
}

export default api;
