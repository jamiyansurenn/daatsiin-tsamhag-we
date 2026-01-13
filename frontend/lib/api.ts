import axios from 'axios';

// Get API URL with fallback
const getApiUrl = () => {
  // In browser, check for client-side env var first
  if (typeof window !== 'undefined') {
    const clientUrl = (window as any).__NEXT_PUBLIC_API_URL__ || process.env.NEXT_PUBLIC_API_URL;
    if (clientUrl) {
      return clientUrl.replace(/\/$/, '');
    }
  }
  
  // Server-side or fallback
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  // Remove trailing slash if present
  return url.replace(/\/$/, '');
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Log API URL in development (for debugging)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.log('API Base URL:', getApiUrl());
}

// Add response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging (server-side only)
    if (typeof window === 'undefined') {
      console.error('API Error:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        status: error.response?.status,
        message: error.message,
      });
    }
    
    // Always return a resolved promise with error data
    // This prevents unhandled promise rejections
    return Promise.resolve({
      data: null,
      error: error.message || 'Network error',
      status: error.response?.status || 500,
    });
  }
);

export default api;

// Helper function to safely extract data from API response
function safeGetData(response: any) {
  if (response && response.data && !response.error) {
    return response.data;
  }
  return null;
}

// Public API functions with error handling
// Returns: { data, error, status }
// - data: null if error or not found
// - error: error message if API error occurred
// - status: HTTP status code
export const getCompanyInfo = async () => {
  try {
    const response: any = await api.get('/company-info/public');
    
    // Check if response has error (from interceptor)
    if (response.error) {
      return { 
        data: null, 
        error: response.error,
        status: response.status || 500 
      };
    }
    
    const data = safeGetData(response);
    return { data };
  } catch (error: any) {
    return { 
      data: null, 
      error: error.message || 'Network error',
      status: 500 
    };
  }
};

export const getServices = async () => {
  try {
    const response = await api.get('/services/public');
    return { data: safeGetData(response) || [] };
  } catch (error: any) {
    return { data: [] };
  }
};

export const getServiceBySlug = async (slug: string) => {
  try {
    const response: any = await api.get(`/services/public/${slug}`);
    
    if (response.error) {
      return { 
        data: null, 
        error: response.error,
        status: response.status || 500 
      };
    }
    
    const data = safeGetData(response);
    
    if (response.status === 404) {
      return { data: null };
    }
    
    return { data };
  } catch (error: any) {
    return { 
      data: null, 
      error: error.message || 'Network error',
      status: 500 
    };
  }
};

export const getProjects = async (featured?: boolean) => {
  try {
    const response = await api.get('/projects/public', { params: { featured } });
    return { data: safeGetData(response) || [] };
  } catch (error: any) {
    return { data: [] };
  }
};

export const getProjectBySlug = async (slug: string) => {
  try {
    const response: any = await api.get(`/projects/public/${slug}`);
    
    if (response.error) {
      return { 
        data: null, 
        error: response.error,
        status: response.status || 500 
      };
    }
    
    const data = safeGetData(response);
    
    if (response.status === 404) {
      return { data: null };
    }
    
    return { data };
  } catch (error: any) {
    return { 
      data: null, 
      error: error.message || 'Network error',
      status: 500 
    };
  }
};

export const getNews = async (featured?: boolean, limit?: number) => {
  try {
    const response = await api.get('/news/public', { params: { featured, limit } });
    return { data: safeGetData(response) || [] };
  } catch (error: any) {
    return { data: [] };
  }
};

export const getNewsBySlug = async (slug: string) => {
  try {
    const response: any = await api.get(`/news/public/${slug}`);
    
    // Check if response has error (from interceptor)
    if (response.error) {
      return { 
        data: null, 
        error: response.error,
        status: response.status || 500 
      };
    }
    
    const data = safeGetData(response);
    
    // 404 means resource not found (not an API error)
    if (response.status === 404) {
      return { data: null }; // No error field = resource not found
    }
    
    return { data };
  } catch (error: any) {
    return { 
      data: null, 
      error: error.message || 'Network error',
      status: 500 
    };
  }
};

export const getTeamMembers = async () => {
  try {
    const response = await api.get('/team-members/public');
    return { data: safeGetData(response) || [] };
  } catch (error: any) {
    return { data: [] };
  }
};

export const getPartners = async () => {
  try {
    const response = await api.get('/partners/public');
    return { data: safeGetData(response) || [] };
  } catch (error: any) {
    return { data: [] };
  }
};

export const createContactMessage = async (data: any) => {
  try {
    const response = await api.post('/contact', data);
    return { data: safeGetData(response) };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};
