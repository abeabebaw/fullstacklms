const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const apiService = {
  // Auth headers
  getAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  },

  // User APIs
  async getUserData(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/data`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Get user data failed:', error);
      return { success: false, error: 'Failed to fetch user data' };
    }
  },

  async getUserEnrolledCourses(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/enrolled-courses`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Get enrolled courses failed:', error);
      return { success: false, error: 'Failed to fetch enrolled courses' };
    }
  },

  // Course APIs
  async getAllCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course/all`);
      return await response.json();
    } catch (error) {
      console.error('Get all courses failed:', error);
      return { success: false, error: 'Failed to fetch courses' };
    }
  },

  async getCourseById(courseId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course/${courseId}`, {
        headers: token ? this.getAuthHeaders(token) : {}
      });
      return await response.json();
    } catch (error) {
      console.error('Get course by ID failed:', error);
      return { success: false, error: 'Failed to fetch course' };
    }
  },

  async purchaseCourse(courseId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course/purchase`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ courseId })
      });
      return await response.json();
    } catch (error) {
      console.error('Purchase course failed:', error);
      return { success: false, error: 'Failed to purchase course' };
    }
  },

  async verifyPayment(tx_ref, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course/verify-payment?tx_ref=${tx_ref}`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Verify payment failed:', error);
      return { success: false, error: 'Failed to verify payment' };
    }
  },

  async rateCourse(courseId, rating, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course/${courseId}/rate`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ rating })
      });
      return await response.json();
    } catch (error) {
      console.error('Rate course failed:', error);
      return { success: false, error: 'Failed to rate course' };
    }
  },

  async getCourseProgress(courseId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course/${courseId}/progress`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Get course progress failed:', error);
      return { success: false, error: 'Failed to get progress' };
    }
  },

  async resetProgress(courseId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course/${courseId}/progress/reset`, {
        method: 'POST',
        headers: this.getAuthHeaders(token)
      });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok) {
        const text = await response.text();
        return { success: false, status: response.status, error: text };
      }
      if (contentType.includes('application/json')) return await response.json();
      const text = await response.text();
      return { success: false, error: 'Non-JSON response', body: text };
    } catch (error) {
      console.error('Reset progress failed:', error);
      return { success: false, error: error.message || 'Failed to reset progress' };
    }
  },

  async completeLecture(courseId, lectureId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course/${courseId}/lecture/${lectureId}/complete`, {
        method: 'POST',
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Complete lecture failed:', error);
      return { success: false, error: 'Failed to mark lecture complete' };
    }
  },

  // Certificate APIs
  async submitQuizResult(courseId, score, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certificate/generate`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ courseId, score })
      });
      return await response.json();
    } catch (error) {
      console.error('Submit quiz result failed:', error);
      return { success: false, error: 'Failed to submit quiz result' };
    }
  },

  async getCertificate(certificateId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certificate/${certificateId}`, {
        headers: token ? this.getAuthHeaders(token) : {}
      });
      return await response.json();
    } catch (error) {
      console.error('Get certificate failed:', error);
      return { success: false, error: 'Failed to fetch certificate' };
    }
  },
  async getCertificatePdf(certificateId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certificate/${certificateId}/pdf`, {
        headers: token ? this.getAuthHeaders(token) : {}
      });
      if (!response.ok) {
        const text = await response.text();
        return { success: false, status: response.status, error: text };
      }
      const blob = await response.blob();
      return { success: true, blob };
    } catch (error) {
      console.error('Get certificate PDF failed:', error);
      return { success: false, error: 'Failed to fetch certificate PDF' };
    }
  },
  async getMyCertificates(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certificate/my`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Get my certificates failed:', error);
      return { success: false, error: 'Failed to fetch certificates' };
    }
  },

  // Educator APIs
  async updateToEducator(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/educator/update-role`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Update to educator failed:', error);
      return { success: false, error: 'Failed to update role' };
    }
  },

  // Educator request APIs (student)
  async submitEducatorRequest(formData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/educator/request`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error('Submit educator request failed:', error);
      return { success: false, error: 'Failed to submit educator request' };
    }
  },

  async checkEducatorDuplicate({ email, phone }, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/educator/request/check`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ email, phone })
      });
      return await response.json();
    } catch (error) {
      console.error('Check educator duplicate failed:', error);
      return { success: false, error: 'Failed to check duplicates' };
    }
  },

  async getMyEducatorRequests(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/educator/request/my`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Get my educator requests failed:', error);
      return { success: false, error: 'Failed to fetch requests' };
    }
  },

  // Admin endpoints for educator requests
  async adminListEducatorRequests(query = {}, token) {
    try {
      const qs = new URLSearchParams(query).toString();
      const response = await fetch(`${API_BASE_URL}/api/admin/educator-requests?${qs}`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Admin list educator requests failed:', error);
      return { success: false, error: 'Failed to fetch requests' };
    }
  },

  async adminProcessEducatorRequest(requestId, action, adminNote, token) {
    try {
      const url = `${API_BASE_URL}/api/admin/educator-requests/${requestId}/${action}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ adminNote })
      });
      return await response.json();
    } catch (error) {
      console.error('Admin process educator request failed:', error);
      return { success: false, error: 'Failed to process request' };
    }
  },

  // Quiz APIs
  async createQuiz(payload, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/create`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(payload)
      });

      // If server responded with non-JSON (HTML 404 page or similar), read text and return a helpful error
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok) {
        const text = await response.text();
        console.error('Create quiz server error:', response.status, text);
        return { success: false, status: response.status, error: text || `Server responded with status ${response.status}` };
      }

      if (contentType.includes('application/json')) {
        return await response.json();
      } else {
        const text = await response.text();
        console.warn('Create quiz: non-json response', text);
        return { success: false, error: 'Non-JSON response from server', body: text };
      }
    } catch (error) {
      console.error('Create quiz failed:', error);
      return { success: false, error: error.message || 'Failed to create quiz' };
    }
  },

  async getQuizzesByCourse(courseId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/course/${courseId}`, {
        headers: token ? this.getAuthHeaders(token) : {}
      });
      return await response.json();
    } catch (error) {
      console.error('Get quizzes failed:', error);
      return { success: false, error: 'Failed to get quizzes' };
    }
  },

  async getQuizById(quizId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}`, {
        headers: token ? this.getAuthHeaders(token) : {}
      });
      return await response.json();
    } catch (error) {
      console.error('Get quiz failed:', error);
      return { success: false, error: 'Failed to get quiz' };
    }
  },

  async submitQuiz(quizId, answers, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ answers })
      });
      return await response.json();
    } catch (error) {
      console.error('Submit quiz failed:', error);
      return { success: false, error: 'Failed to submit quiz' };
    }
  },

  async checkQuizAnswer(quizId, questionId, selectedOptionId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}/check`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ questionId, selectedOptionId })
      });
      return await response.json();
    } catch (error) {
      console.error('Check quiz answer failed:', error);
      return { success: false, error: 'Failed to check answer' };
    }
  },

  async getMyQuizResults(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/my/results`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Get my quiz results failed:', error);
      return { success: false, error: 'Failed to get quiz results' };
    }
  },

  async getMyQuizzes(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/my`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Get my quizzes failed:', error);
      return { success: false, error: 'Failed to get my quizzes' };
    }
  },

  // Admin APIs
  async adminListUsers(query = {}, token) {
    try {
      const qs = new URLSearchParams(query).toString();
      const response = await fetch(`${API_BASE_URL}/api/admin/users?${qs}`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Admin list users failed:', error);
      return { success: false, error: 'Failed to fetch users' };
    }
  },

  async adminUpdateUserRole(userId, role, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ role })
      });
      return await response.json();
    } catch (error) {
      console.error('Admin update user role failed:', error);
      return { success: false, error: 'Failed to update user role' };
    }
  },

  async adminDeleteUser(userId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Admin delete user failed:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  },

  async adminListCourses(query = {}, token) {
    try {
      const qs = new URLSearchParams(query).toString();
      const response = await fetch(`${API_BASE_URL}/api/admin/courses?${qs}`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Admin list courses failed:', error);
      return { success: false, error: 'Failed to fetch courses' };
    }
  },

  async adminUpdateCourse(courseId, payload, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      console.error('Admin update course failed:', error);
      return { success: false, error: 'Failed to update course' };
    }
  },

  async adminDeleteCourse(courseId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Admin delete course failed:', error);
      return { success: false, error: 'Failed to delete course' };
    }
  },

  async adminReportsOverview(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/reports/overview`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Admin reports failed:', error);
      return { success: false, error: 'Failed to fetch reports' };
    }
  },

  async updateQuiz(quizId, payload, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      console.error('Update quiz failed:', error);
      return { success: false, error: 'Failed to update quiz' };
    }
  },

  async deleteQuiz(quizId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Delete quiz failed:', error);
      return { success: false, error: 'Failed to delete quiz' };
    }
  },

  async addCourse(courseData, image, lectureFiles = [], token) {
    try {
      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      if (image) {
        formData.append('image', image);
      }

      // append any lecture files (each as 'lectureFiles')
      if (Array.isArray(lectureFiles) && lectureFiles.length > 0) {
        lectureFiles.forEach((file) => {
          formData.append('lectureFiles', file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/educator/add-course`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error('Add course failed:', error);
      return { success: false, error: 'Failed to add course' };
    }
  },

  async getEducatorCourses(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/educator/courses`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Get educator courses failed:', error);
      return { success: false, error: 'Failed to fetch educator courses' };
    }
  },

  async getEducatorDashboardData(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/educator/dashboard`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Get dashboard data failed:', error);
      return { success: false, error: 'Failed to fetch dashboard data' };
    }
  },

  async getEnrolledStudentsData(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/educator/enrolled-students`, {
        headers: this.getAuthHeaders(token)
      });
      return await response.json();
    } catch (error) {
      console.error('Get enrolled students failed:', error);
      return { success: false, error: 'Failed to fetch enrolled students' };
    }
  }
  ,

  async updateEducatorCourse(courseId, courseData, image, lectureFiles = [], token) {
    try {
      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      if (image) {
        formData.append('image', image);
      }
      if (Array.isArray(lectureFiles) && lectureFiles.length > 0) {
        lectureFiles.forEach((file) => {
          formData.append('lectureFiles', file);
        });
      }
      const response = await fetch(`${API_BASE_URL}/api/educator/course/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error('Update educator course failed:', error);
      return { success: false, error: 'Failed to update course' };
    }
  }
};