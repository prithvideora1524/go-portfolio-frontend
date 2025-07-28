const API_BASE_URL = 'http://localhost:8080/api/v1';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
       credentials: 'include', 
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Profile/About
  getProfile() {
    return this.request('/profile/');
  }

  updateProfile(data) {
    return this.request('/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Skills
  getSkills() {
    return this.request('/skills/');
  }

  createSkill(data) {
    return this.request('/skills/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateSkill(id, data) {
    return this.request(`/skills/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  deleteSkill(id) {
    return this.request(`/skills/${id}/`, {
      method: 'DELETE',
    });
  }

  // Experiences
  getExperiences() {
    return this.request('/experiences/');
  }

  createExperience(data) {
    return this.request('/experiences/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateExperience(id, data) {
    console.log("id", id);
    return this.request(`/experiences/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  deleteExperience(id) {
    return this.request(`/experiences/${id}/`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
