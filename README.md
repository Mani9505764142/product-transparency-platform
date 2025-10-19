# 🌐 Product Transparency Platform

A full-stack web application that enables companies to create transparent product reports with AI-powered questions, automated scoring, and PDF generation.

![Platform Demo](https://img.shields.io/badge/Status-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🔗 Live Demo

- **Frontend:** [https://product-transparency-platform-phi.vercel.app](https://product-transparency-platform-phi.vercel.app)
- **Backend API:** [https://product-transparency-platform.onrender.com](https://product-transparency-platform.onrender.com)
- **AI Service:** [https://product-transparency-platform-1.onrender.com](https://product-transparency-platform-1.onrender.com)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [AI Service Documentation](#-ai-service-documentation)
- [Sample Product Entry & Report](#-sample-product-entry--example-report)
- [Reflection (Bonus)](#-reflection-bonus)
- [API Documentation](#-api-documentation)
- [License](#-license)

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure login and registration with Supabase
- 📝 **Product Management** - Create, read, update, and delete products
- 🤖 **AI Question Generation** - OpenAI-powered smart questions based on product category and details
- 📊 **Transparency Scoring** - Automated scoring algorithm (0-100) with grade classification
- 📄 **PDF Report Generation** - Professional PDF reports with complete transparency analysis
- 🎨 **Modern UI/UX** - Clean, responsive design with gradient themes
- 🔍 **Multi-step Form** - Intuitive 3-step product creation process
- 📱 **Mobile Responsive** - Works seamlessly across all devices

### Technical Features
- Real-time data validation
- RESTful API architecture
- Secure database operations with Row Level Security
- Cross-origin resource sharing (CORS) enabled
- Error handling and user feedback
- Automated transparency scoring with detailed breakdown

## 🛠️ Tech Stack

### Frontend
- **React** (v18) with TypeScript - Component-based UI
- **Vite** - Fast build tool and dev server
- **CSS3** - Modern styling with gradients and animations
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Static type checking
- **PDFKit** - PDF document generation
- **CORS** - Cross-origin resource sharing

### AI Service
- **Python** (3.9+) - Programming language
- **Flask** - Lightweight web framework
- **OpenAI API** - GPT-4 for question generation
- **Flask-CORS** - CORS handling for Flask

### Database & Authentication
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Auth** - User authentication and authorization
- **Row Level Security** - Database-level access control

### Deployment & Hosting
- **Vercel** - Frontend hosting with automatic deployments
- **Render** - Backend and AI service hosting
- **GitHub** - Version control and CI/CD


## 🚀 Setup Instructions

### Prerequisites
- Node.js v18 or higher
- Python 3.9 or higher
- npm or yarn package manager
- Git for version control
- OpenAI API key
- Supabase account

### 1. Clone the Repository
git clone https://github.com/Mani9505764142/product-transparency-platform.git
cd product-transparency-platform


### 2. Frontend Setup

Navigate to frontend directory
cd frontend

Install dependencies
npm install

Create environment file
cp .env.example .env

Add your environment variables to .env:
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Start development server
npm run start

Frontend will run on `http://localhost:3000`

### 3. Backend Setup
Navigate to backend directory
cd backend

Install dependencies
npm install

Create environment file with your values:
echo "PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
AI_SERVICE_URL=https://product-transparency-platform-1.onrender.com" > .env

Start development server
npm run dev

**Backend will run on:** `http://localhost:5000`

---

### 4. AI Service Setup

Navigate to AI service directory
cd ai-service

Create virtual environment
python -m venv venv

Activate (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
venv\Scripts\activate

Install dependencies
pip install -r requirements.txt

Create environment file
echo "OPENAI_API_KEY=sk-proj-your-key-here
PORT=5001" > .env

Start Flask server
python app.py

**AI Service will run on:** `http://localhost:5001`

**Where to get keys:**
- OpenAI: https://platform.openai.com/api-keys
- Supabase URL & Keys: Project Settings → API
### 5. Database Setup

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details

2. **Run SQL to Create Tables**

Go to SQL Editor in Supabase and run:

-- Create products table
CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
category VARCHAR(100),
company_name VARCHAR(255),
description TEXT,
questions JSONB,
answers JSONB,
transparency_score INTEGER,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own products"
ON products FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
ON products FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
ON products FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
ON products FOR DELETE
USING (auth.uid() = user_id);

3. **Get Your API Keys**
   - Go to Project Settings → API
   - Copy the Project URL
   - Copy the `anon` public key
   - Copy the `service_role` secret key (for backend only)
## 🤖 AI Service Documentation

### Overview
The AI Service is a Python Flask application that uses OpenAI's GPT-4 model to generate intelligent, context-aware questions for product transparency assessment.

### Architecture
ai-service/
├── app.py # Main Flask application
├── requirements.txt # Python dependencies
└── .env # Environment variables

### API Endpoints

#### 1. Health Check
GET /
**Response:**
{
"message": "AI Service is running",
"openai_status": true
}
#### 2. Generate Questions
POST /generate-questions
Content-Type: application/json

**Request Body:**
{
"productName": "Samsung Galaxy S24 Ultra",
"category": "Electronics",
"description": "Flagship smartphone with advanced AI features"
}
**Response:**
{
"questions": [
"What ingredients does this product contain?",
"Is this product ethically sourced?",
"Does it have any certifications?"
]
}
undefined
### How AI Question Generation Works

1. **Input Processing**: The service receives product details (name, category, description)
2. **Prompt Engineering**: A carefully crafted prompt is sent to OpenAI GPT-4:
    Generate 3 transparency-focused questions for:
Product: {productName}
Category: {category}
Description: {description}

3. **AI Processing**: OpenAI generates contextually relevant questions
4. **Response Formatting**: Questions are parsed and returned as JSON array
5. **Error Handling**: Fallback to default questions if API fails

### OpenAI Integration

**Model Used:** `gpt-4` (can be configured to `gpt-3.5-turbo` for cost optimization)

**Parameters:**
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 200 (sufficient for 3 questions)
- **Top P**: 1.0 (full vocabulary consideration)

### Deployment Configuration

**Render Deployment:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python app.py`
- **Environment Variables**: 
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: 10000 (Render default)

### Security Considerations

- API key stored in environment variables (never in code)
- CORS configured for specific origins
- Rate limiting recommended for production
- Input validation for all requests
## 📦 Sample Product Entry & Example Report

### Sample Product Data

Here's an example of a complete product entry:

**Product Information:**
{
"name": "Samsung Galaxy S24 Ultra",
"category": "Electronics",
"company_name": "Samsung",
"description": "Flagship smartphone with advanced AI features, 200MP camera, and S Pen"
}

**AI-Generated Questions:**
1. What ingredients does this product contain?
2. Is this product ethically sourced?
3. Does it have any certifications?

**Sample Answers:**
{
"answers": [
"Glass (Gorilla Glass Victus 2), Aluminum frame (Armor Aluminum), AMOLED display components, Snapdragon 8 Gen 3 processor, lithium-ion battery, camera sensors (200MP + 50MP + 10MP + 12MP), S Pen stylus with Wacom technology",
"Yes. Samsung maintains conflict-free mineral sourcing, audited supply chains, and fair labor practices. Certified by RBA (Responsible Business Alliance) and follows EICC guidelines for ethical electronics manufacturing.",
"ISO 14001 (Environmental Management), RBA Code of Conduct, EPEAT Gold Rating, Energy Star certified, TCO Certified for sustainability, IP68 water/dust resistance certification"
]
}

### Example Transparency Report

**Generated Report Includes:**

1. **Product Information Section**
   - Product Name: Samsung Galaxy S24 Ultra
   - Category: Electronics
   - Company: Samsung
   - Description: Complete product description

2. **Transparency Analysis**
   - **Overall Score**: 85/100
   - **Grade**: B - Good Transparency

3. **Score Breakdown**
   - Basic Information: 30/30 ✓
   - Description Quality: 15/20
   - Ingredient Transparency: 15/20
   - Certifications: 10/15
   - Manufacturing Information: 15/15 ✓

4. **Key Findings**
   - Product information is complete and detailed
   - Manufacturing process transparency can be improved
   - Consider adding certification information
   - Health and safety standards documentation recommended

**PDF Report Download:** Available via "Download Report" button on product card

## 💭 Reflection (Bonus)

### How did you use AI tools in development?

AI tools played a crucial role throughout the development process:

**1. Code Generation & Debugging (GitHub Copilot & ChatGPT)**
- Generated boilerplate code for React components and Express routes
- Helped debug TypeScript type errors and React hooks issues
- Suggested optimizations for database queries and API endpoints

**2. Architecture Design (ChatGPT & Claude)**
- Discussed and refined the microservices architecture (Frontend, Backend, AI Service)
- Received guidance on separating concerns and implementing RESTful principles
- Got recommendations for security best practices (CORS, RLS, environment variables)

**3. AI Integration (OpenAI GPT-4)**
- Core feature: Dynamic question generation based on product context
- Experimented with different prompt engineering techniques to get relevant questions
- Learned to handle API rate limits and implement fallback mechanisms

**4. Problem Solving**
- Used AI to troubleshoot deployment issues on Vercel and Render
- Got help understanding Supabase Row Level Security policies
- Received suggestions for PDF generation using PDFKit library

**5. Documentation**
- AI assisted in writing clear API documentation
- Helped structure this README for maximum clarity
- Generated example code snippets for setup instructions

### What principles guided your architecture, design, and product transparency logic?

**1. Separation of Concerns**
- **Frontend**: Handles UI/UX, user interactions, and routing
- **Backend**: Manages business logic, database operations, and PDF generation
- **AI Service**: Dedicated microservice for OpenAI integration

*Rationale*: Each service has a single responsibility, making the system maintainable, scalable, and easier to debug. If AI service goes down, other features still work.

**2. User-Centric Design**
- Multi-step form reduces cognitive load during product creation
- Clear visual feedback with progress indicators and loading states
- Intuitive navigation with prominent CTAs

*Rationale*: Users should focus on providing transparency data, not struggling with the interface. The 3-step process mirrors natural thinking: basic info → questions → detailed answers.

**3. Data-Driven Transparency Scoring**
The scoring algorithm follows objective criteria:

// Scoring Logic

Basic Information (30 points): Name, category, company (mandatory fields)

Description Quality (20 points): Length and detail of description

Answer Completeness (50 points): Quality and thoroughness of answers

Each question: Up to 16-17 points

Evaluated on answer length and relevance

*Rationale*: Transparency is quantifiable. Longer, detailed answers indicate genuine commitment to openness. The weighted system prioritizes actual disclosure over basic metadata.

**4. AI-Augmented Intelligence**
- AI generates contextually relevant questions (not generic ones)
- Different product categories get different question types
- Human oversight: Users can see and understand AI-generated questions

*Rationale*: Generic questionnaires don't uncover real transparency issues. AI customization ensures questions match the product domain (electronics vs. food vs. clothing).

**5. Progressive Disclosure**
- Dashboard shows essential info (name, score, category)
- Full details available in PDF reports
- Edit functionality for iterative improvements

*Rationale*: Users get quick overview on main screen, detailed analysis on demand. This respects user time while maintaining depth.

**6. Security & Privacy**
- Row Level Security ensures users only see their products
- API keys never exposed in frontend code
- HTTPS everywhere in production

*Rationale*: Trust is fundamental to transparency platforms. Secure handling of business data is non-negotiable.

**7. Scalability & Performance**
- Stateless backend (can scale horizontally)
- CDN for frontend (Vercel edge network)
- Database indexing on frequently queried fields

*Rationale*: As more companies adopt transparency, the platform must handle growth without degradation.

**Design Philosophy**: "Transparency about transparency" - The platform itself is transparent in how it calculates scores, generates questions, and handles data. Users understand the process, not just the result.

## 📚 API Documentation

### Base URL
Production: https://product-transparency-platform.onrender.com
Development: http://localhost:3000


### Endpoints

#### Products

**Get All Products**
GET /api/products
Authorization: Bearer {token}
**Create Product**
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
"name": "Product Name",
"category": "Electronics",
"company_name": "Company Name",
"description": "Product description",
"questions": [...],
"answers": [...]
}
**Update Product**
PUT /api/products/:id
Authorization: Bearer {token}
Content-Type: application/json
**Delete Product**
DELETE /api/products/:id
Authorization: Bearer {token}
**Generate PDF Report**
GET /api/products/:id/pdf
Authorization: Bearer {token}
undefined
## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Suthari saimanikanta vivek**
- GitHub: [@Mani9505764142](https://github.com/Mani9505764142)
- Email: manikanta.suthari2002@gmail.com
- Location: Andhra Pradesh, India

- ## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API and AI capabilities
- **Supabase** for database and authentication infrastructure
- **Vercel** for seamless frontend deployment
- **Render** for backend and AI service hosting
- **React & TypeScript** communities for excellent documentation

---

**Made with ❤️ for Product Transparency | October 2025**

