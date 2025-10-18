import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';

interface ProductData {
  name: string;
  category: string;
  company_name: string;
  description: string;
}

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    category: '',
    company_name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData({
          name: data.data.name,
          category: data.data.category,
          company_name: data.data.company_name,
          description: data.data.description,
        });
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        navigate('/products');
      } else {
        alert('Failed to update product');
      }
    } catch (err) {
      alert('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  return (
    <div className="edit-product-container">
      <div className="edit-product-header">
        <h1>Edit Product</h1>
        <button onClick={() => navigate('/products')} className="btn-back">
          ← Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="company_name">Company Name *</label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-save"
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
