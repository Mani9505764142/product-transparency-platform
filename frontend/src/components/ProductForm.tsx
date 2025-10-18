import React, { useState } from 'react';
import { api } from '../services/api';
import { supabase } from '../config/supabase';
import './ProductForm.css';

interface FormData {
  name: string;
  category: string;
  company_name: string;
  description: string;
}

interface Answers {
  [key: string]: string;
}

const ProductForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    company_name: '',
    description: '',
  });
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers({
      ...answers,
      [index]: value,
    });
  };

  const handleNextStep = async () => {
    if (step === 1) {
      setLoading(true);
      try {
        const response = await api.generateQuestions({
          product_info: `Product: ${formData.name}, Category: ${formData.category}, Company: ${formData.company_name}`,
          previous_answers: [],
        });
        console.log('AI Questions:', response.data);
        
        setAiQuestions([
          'What ingredients does this product contain?',
          'Is this product ethically sourced?',
          'Does it have any certifications?',
          'What is the manufacturing process?',
          'Are there any health or safety considerations?'
        ]);
      } catch (error) {
        console.error('Error generating questions:', error);
        setAiQuestions([
          'What ingredients does this product contain?',
          'Is this product ethically sourced?',
          'Does it have any certifications?'
        ]);
      } finally {
        setLoading(false);
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get current user from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in to submit a product');
        setLoading(false);
        return;
      }

      // Create product directly in Supabase (RLS will handle permissions)
      const { data: product, error: insertError } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          category: formData.category,
          company_name: formData.company_name,
          description: formData.description,
          user_id: user.id
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      const createdProductId = product.id;
      setProductId(createdProductId);
      console.log('Product created:', product);
      
      // Generate and download PDF report (backend handles this)
      try {
        const pdfResponse = await api.generateReport(createdProductId);
        const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transparency-report-${createdProductId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (pdfError) {
        console.error('Error generating PDF:', pdfError);
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error submitting product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!productId) return;
    
    setLoading(true);
    try {
      const pdfResponse = await api.generateReport(productId);
      const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transparency-report-${productId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-message">
        <h2>✅ Product Submitted Successfully!</h2>
        <p>Your product transparency report has been generated and downloaded.</p>
        <div className="success-buttons">
          <button onClick={handleDownloadPDF} className="btn-primary" disabled={loading}>
            {loading ? 'Downloading...' : '📄 Download Report Again'}
          </button>
          <button onClick={() => window.location.href = '/products'} className="btn-view-products">
            📋 View All Products
          </button>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            ➕ Submit Another Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      <h1>Product Transparency Form</h1>
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="form-step">
            <h2>Basic Product Information</h2>
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                placeholder="e.g., Skincare, Food, Electronics"
              />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
                placeholder="Enter company name"
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe your product"
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>AI-Generated Follow-up Questions</h2>
            {loading ? (
              <p>Loading questions...</p>
            ) : (
              aiQuestions.map((question, index) => (
                <div key={index} className="form-group">
                  <label>{question}</label>
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Review & Submit</h2>
            <div className="review-data">
              <p><strong>Product Name:</strong> {formData.name}</p>
              <p><strong>Category:</strong> {formData.category}</p>
              <p><strong>Company:</strong> {formData.company_name}</p>
              <p><strong>Description:</strong> {formData.description}</p>
              
              {Object.keys(answers).length > 0 && (
                <>
                  <h3>Additional Information</h3>
                  {aiQuestions.map((question, index) => (
                    answers[index] && (
                      <p key={index}>
                        <strong>{question}</strong><br />
                        {answers[index]}
                      </p>
                    )
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        <div className="form-buttons">
          {step > 1 && (
            <button type="button" onClick={handlePrevStep} className="btn-secondary">
              Previous
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={handleNextStep} className="btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Next'}
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit & Generate Report'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
