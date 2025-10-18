import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const AI_SERVICE_URL = 'http://localhost:5001';

export const api = {
  // Product APIs
  createProduct: (productData: any) => 
    axios.post(`${API_BASE_URL}/products`, productData),
  
  getAllProducts: () => 
    axios.get(`${API_BASE_URL}/products`),
  
  getProductById: (id: string) => 
    axios.get(`${API_BASE_URL}/products/${id}`),
  
  // Report APIs
  generateReport: (productId: string) => 
    axios.get(`${API_BASE_URL}/reports/generate/${productId}`, {
      responseType: 'blob'
    }),
  
  // AI Service APIs
  generateQuestions: (productInfo: any) => 
    axios.post(`${AI_SERVICE_URL}/generate-questions`, productInfo),
  
  calculateTransparencyScore: (productData: any) => 
    axios.post(`${AI_SERVICE_URL}/transparency-score`, productData),
};
