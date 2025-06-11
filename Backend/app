from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

career_info = {
    "Software Engineer": {
        "description": "Design, develop, and maintain software applications.",
        "roadmap": [
            "Learn programming languages (Python, Java, C++)",
            "Master data structures and algorithms",
            "Build real-world projects",
            "Explore system design and cloud computing"
        ]
    },
    "Graphic Designer": {
        "description": "Create visual content using design tools and creativity.",
        "roadmap": [
            "Learn tools like Photoshop, Illustrator",
            "Study color theory and typography",
            "Build a creative portfolio",
            "Understand branding and UX/UI"
        ]
    },
    "Marketing Specialist": {
        "description": "Promote products and services using digital and traditional strategies.",
        "roadmap": [
            "Understand SEO, SEM, content marketing",
            "Learn about analytics and consumer behavior",
            "Run mock campaigns",
            "Master social media platforms"
        ]
    },
    "Nurse": {
        "description": "Provide healthcare support and patient care.",
        "roadmap": [
            "Complete nursing degree",
            "Develop communication and clinical skills",
            "Practice in real-world settings",
            "Specialize in areas like pediatrics or ICU"
        ]
    }
}

def recommend_careers(interests, strengths):
    interests = [i.lower() for i in interests]
    strengths = [s.lower() for s in strengths]
    recommendations = []

    if ('coding' in interests or 'technology' in interests) and ('problem solving' in strengths or 'logic' in strengths):
        recommendations.append("Software Engineer")
    if ('creativity' in interests or 'design' in interests):
        recommendations.append("Graphic Designer")
    if ('business' in interests or 'management' in interests) and ('communication' in strengths or 'strategic thinking' in strengths):
        recommendations.append("Marketing Specialist")
    if ('healthcare' in interests or 'medicine' in interests) and ('empathy' in strengths):
        recommendations.append("Nurse")

    return recommendations

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    interests = data.get('interests', [])
    strengths = data.get('strengths', [])
    recs = recommend_careers(interests, strengths)
    
    detailed_recs = []
    for rec in recs:
        detailed_recs.append({
            "career": rec,
            "description": career_info[rec]["description"],
            "roadmap": career_info[rec]["roadmap"]
        })

    return jsonify({'recommendations': detailed_recs})

if __name__ == '__main__':
    app.run(debug=True)
