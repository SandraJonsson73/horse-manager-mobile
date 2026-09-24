const API_BASE = 'http://192.168.168.110:5280/api';
export const API_ORIGIN = 'http://192.168.168.110:5280';

export const horses = {
  async getAll() {
    const response = await fetch(`${API_BASE}/horses`);
    if (!response.ok) throw new Error('Kunde inte hämta hästar');
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_BASE}/horses/${id}`);
    if (!response.ok) throw new Error('Kunde inte hämta häst');
    return response.json();
  },

  async create(data) {
    const response = await fetch(`${API_BASE}/horses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Kunde inte skapa häst');
    return response.json();
  },

  async update(id, data) {
    const response = await fetch(`${API_BASE}/horses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Kunde inte uppdatera häst');
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_BASE}/horses/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Kunde inte radera häst');
    return true;
  },

  async uploadImage(id, imageUri) {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });
    const response = await fetch(`${API_BASE}/horses/${id}/image`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (!response.ok) throw new Error('Kunde inte ladda upp bild');
    return response.json();
  },
};
