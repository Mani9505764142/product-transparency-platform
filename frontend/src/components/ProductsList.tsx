import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import './ProductsList.css';

interface Product {
  id: number;
  name: string;
  category: string;
  company_name: string;
  description: string;
  created_at: string;
}

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch products directly from Supabase (automatically filtered by RLS)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const calculateQuickScore = (product: Product): number => {
    let score = 30; // Base score
    
    if (product.description && product.description.length > 50) score += 20;
    if (product.description && product.description.length > 100) score += 15;
    
    const keywords = ['organic', 'certified', 'sustainable', 'eco-friendly', 'natural'];
    if (keywords.some(kw => product.description?.toLowerCase().includes(kw))) score += 20;
    
    return Math.min(score, 100);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#48bb78';
    if (score >= 60) return '#f6ad55';
    return '#f56565';
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      // Delete directly from Supabase (RLS will ensure user can only delete their own)
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error deleting product');
    }
  };

  const downloadReport = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/generate/${id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transparency-report-${id}.pdf`;
      a.click();
    } catch (err) {
      alert('Error downloading report');
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="products-list-container">
      <div className="products-header">
        <h1>All Products</h1>
        <a href="/" className="btn-primary">Add New Product</a>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>No products found. Add your first product!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => {
            const score = calculateQuickScore(product);
            const scoreColor = getScoreColor(score);
            
            return (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <span className="category-badge">{product.category}</span>
                </div>
                
                <div className="transparency-score" style={{ borderColor: scoreColor }}>
                  <div className="score-value" style={{ color: scoreColor }}>
                    {score}
                  </div>
                  <div className="score-label">Transparency Score</div>
                </div>
                
                <div className="product-body">
                  <p className="company">{product.company_name}</p>
                  <p className="description">{product.description}</p>
                  <p className="date">Added: {new Date(product.created_at).toLocaleDateString()}</p>
                </div>

                <div className="product-actions">
                  <button 
                    onClick={() => downloadReport(product.id)}
                    className="btn-download"
                  >
                    📄 Download Report
                  </button>
                  <button 
                    onClick={() => window.location.href = `/edit/${product.id}`}
                    className="btn-edit"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="btn-delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
