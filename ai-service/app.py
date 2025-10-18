from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
try:
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    openai_available = True
except Exception as e:
    print(f"OpenAI initialization failed: {e}")
    openai_available = False

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "AI Service is running", "openai_status": openai_available})

@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    try:
        data = request.json
        product_info = data.get('product_info', '')
        previous_answers = data.get('previous_answers', [])
        
        if openai_available:
            try:
                prompt = f"""Generate 5 specific questions about this product to assess transparency.
                
Product: {product_info}

Return ONLY a valid JSON object in this exact format:
{{"questions": ["question1", "question2", "question3", "question4", "question5"]}}

Focus on: ingredients, manufacturing, certifications, sustainability, and health impacts."""

                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a product transparency expert. Always respond with valid JSON only."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=500
                )
                
                result = response.choices[0].message.content.strip()
                
                # Try to parse the result as JSON
                try:
                    questions_obj = json.loads(result)
                    questions = questions_obj.get('questions', [])
                except json.JSONDecodeError:
                    raise Exception("Invalid JSON from OpenAI")
                
                return jsonify({
                    "success": True,
                    "questions": questions
                })
                
            except Exception as openai_error:
                print(f"OpenAI Error: {openai_error}")
                return get_fallback_questions(product_info)
        else:
            return get_fallback_questions(product_info)
        
    except Exception as e:
        print(f"Error in generate_questions: {e}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

def get_fallback_questions(product_info):
    """Generate static questions as fallback"""
    questions = [
        "What are the main ingredients or materials used in this product?",
        "Where is this product manufactured and by whom?",
        "Does this product have any certifications (organic, fair trade, cruelty-free, etc.)?",
        "What is the environmental impact of producing this product?",
        "Are there any health or safety considerations consumers should know about?"
    ]
    
    return jsonify({
        "success": True,
        "questions": questions,
        "source": "fallback"
    })

@app.route('/transparency-score', methods=['POST'])
def calculate_score():
    try:
        data = request.json
        product_data = data.get('product_data', {})
        
        # Initialize scoring components
        scores = {
            'basic_info': 0,
            'description_quality': 0,
            'ingredient_transparency': 0,
            'certifications': 0,
            'manufacturing_info': 0
        }
        
        # Basic Information Score (30 points)
        if product_data.get('name'):
            scores['basic_info'] += 10
        if product_data.get('category'):
            scores['basic_info'] += 10
        if product_data.get('company_name'):
            scores['basic_info'] += 10
        
        # Description Quality (20 points)
        description = product_data.get('description', '')
        if len(description) > 50:
            scores['description_quality'] += 10
        if len(description) > 100:
            scores['description_quality'] += 5
        if len(description) > 200:
            scores['description_quality'] += 5
        
        # Ingredient/Material Transparency (20 points)
        # Check for ingredient-related keywords in description
        ingredient_keywords = ['ingredient', 'material', 'component', 'made of', 'contains']
        if any(keyword in description.lower() for keyword in ingredient_keywords):
            scores['ingredient_transparency'] += 20
        
        # Certifications (15 points)
        cert_keywords = ['organic', 'certified', 'fair trade', 'cruelty-free', 'sustainable', 'eco-friendly']
        if any(keyword in description.lower() for keyword in cert_keywords):
            scores['certifications'] += 15
        
        # Manufacturing Information (15 points)
        manufacturing_keywords = ['manufactured', 'produced', 'factory', 'made in', 'sourced from']
        if any(keyword in description.lower() for keyword in manufacturing_keywords):
            scores['manufacturing_info'] += 15
        
        total_score = sum(scores.values())
        
        # Generate recommendations
        recommendations = []
        if scores['ingredient_transparency'] < 15:
            recommendations.append("Add detailed ingredient or material information")
        if scores['certifications'] < 10:
            recommendations.append("Include any relevant certifications or standards")
        if scores['manufacturing_info'] < 10:
            recommendations.append("Provide manufacturing or sourcing information")
        if scores['description_quality'] < 15:
            recommendations.append("Expand product description with more details")
        
        return jsonify({
            "success": True,
            "score": min(total_score, 100),
            "breakdown": scores,
            "recommendations": recommendations,
            "grade": get_grade(total_score)
        })
        
    except Exception as e:
        print(f"Error in transparency_score: {e}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

def get_grade(score):
    """Convert score to letter grade"""
    if score >= 90:
        return "A - Excellent Transparency"
    elif score >= 80:
        return "B - Good Transparency"
    elif score >= 70:
        return "C - Moderate Transparency"
    elif score >= 60:
        return "D - Limited Transparency"
    else:
        return "F - Poor Transparency"

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    print(f"Starting AI Service on port {port}...")
    print(f"OpenAI Available: {openai_available}")
    app.run(debug=True, port=port, host='0.0.0.0')
