from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from config import OPENROUTER_API_KEY

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ==== OpenRouter Configuration ====
MODEL = 'meta-llama/llama-3-70b-instruct'

HEADERS = {
    'Authorization': f'Bearer {OPENROUTER_API_KEY}',
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:5000',
    'X-Title': 'Interview Chatbot'
}

# ==== Configuration ====
# Add more fixed responses here as needed
FIXED_RESPONSES = {
    # Exact matches (case-insensitive)
    "exact_matches": {
        "what color are the apples?": "That's not relevant to the interview, please respond accordingly.",
        "what color are apples?": "That's not relevant to the interview, please respond accordingly.",
        "what color is an apple?": "That's not relevant to the interview, please respond accordingly.",
        "what's the weather like?": "That's not relevant to the interview, please respond accordingly.",
        "how's the weather?": "That's not relevant to the interview, please respond accordingly.",
        "is it raining?": "That's not relevant to the interview, please respond accordingly.",
        "how are you?": "That's not relevant to the interview, please respond accordingly.",
        "how are you doing?": "That's not relevant to the interview, please respond accordingly.",
        "what's your name?": "That's not relevant to the interview, please respond accordingly.",
        "who are you?": "That's not relevant to the interview, please respond accordingly.",
        "what's your favorite food?": "That's not relevant to the interview, please respond accordingly.",
        "do you like pizza?": "That's not relevant to the interview, please respond accordingly.",
        "what do you eat?": "That's not relevant to the interview, please respond accordingly.",
        "tell me a joke": "That's not relevant to the interview, please respond accordingly.",
        "what's your favorite movie?": "That's not relevant to the interview, please respond accordingly.",
        "do you watch tv?": "That's not relevant to the interview, please respond accordingly.",
        "what's up?": "That's not relevant to the interview, please respond accordingly.",
        "what are you doing?": "That's not relevant to the interview, please respond accordingly.",
        "where are you from?": "That's not relevant to the interview, please respond accordingly.",
        "what time is it?": "That's not relevant to the interview, please respond accordingly.",
        "what day is it?": "That's not relevant to the interview, please respond accordingly.",
        "can you sing?": "That's not relevant to the interview, please respond accordingly.",
    },
    
    # Pattern matches for short questions (avoid false positives with technical terms)
    "pattern_matches": {
        "color": "That's not relevant to the interview, please respond accordingly.",
        "weather": "That's not relevant to the interview, please respond accordingly.",
        "favorite": "That's not relevant to the interview, please respond accordingly.",
        "joke": "That's not relevant to the interview, please respond accordingly.",
        "movie": "That's not relevant to the interview, please respond accordingly.",
        "food": "That's not relevant to the interview, please respond accordingly.",
        "music": "That's not relevant to the interview, please respond accordingly.",
        "sport": "That's not relevant to the interview, please respond accordingly.",
        "game": "That's not relevant to the interview, please respond accordingly.",
        "personal": "That's not relevant to the interview, please respond accordingly.",
    },
    
    # Technical terms that should NOT trigger pattern matches (whitelist)
    "technical_whitelist": [
        'programming', 'code', 'coding', 'software', 'development', 'technical', 'computer', 
        'javascript', 'python', 'react', 'node', 'html', 'css', 'database', 'sql', 'api',
        'framework', 'library', 'algorithm', 'function', 'method', 'class', 'object',
        'variable', 'array', 'string', 'boolean', 'async', 'promise', 'callback'
    ]
}
# ==== Helper Functions ====
def check_fixed_responses(user_message):
    """
    Check if the user message matches any specific off-topic questions
    and return a fixed response if it does.
    Returns the fixed response string or None if no match found.
    """
    message_lower = user_message.lower().strip()
    
    # Check for exact matches first
    if message_lower in FIXED_RESPONSES["exact_matches"]:
        return FIXED_RESPONSES["exact_matches"][message_lower]
    
    # Check for pattern matches (only for short questions to avoid false positives)
    if len(message_lower.split()) <= 8:
        for pattern, response in FIXED_RESPONSES["pattern_matches"].items():
            if pattern in message_lower:
                # Make sure it doesn't contain technical terms (whitelist check)
                if not any(tech_word in message_lower for tech_word in FIXED_RESPONSES["technical_whitelist"]):
                    return response
    
    return None

def add_fixed_response(question, response):
    """
    Add a new fixed response to the exact matches.
    Useful for dynamically adding responses during testing.
    """
    FIXED_RESPONSES["exact_matches"][question.lower().strip()] = response

def openrouter_chat(messages):
    url = 'https://openrouter.ai/api/v1/chat/completions'
    payload = {
        'model': MODEL,
        'messages': messages
    }
    response = requests.post(url, headers=HEADERS, data=json.dumps(payload))
    response.raise_for_status()
    return response.json()['choices'][0]['message']['content']

# ==== Load System Prompt ====
with open('prompt.txt', 'r') as file:
    prompt_content = file.read()

# ==== API Endpoints ====

@app.route('/api/start-chat', methods=['POST'])
def start_chat():
    conversation_history = [
        {'role': 'system', 'content': prompt_content},
        {'role': 'user', 'content': 'Hi'}
    ]
    
    response_content = openrouter_chat(conversation_history)
    bot_message = {
        'role': 'assistant',
        'content': response_content
    }
    conversation_history.append(bot_message)

    return jsonify({
        'message': bot_message['content'],
        'conversation_id': '123'
    })

@app.route('/api/chat', methods=['POST'])
def process_chat():
    data = request.json
    conversation_history = data.get('conversation_history', [])
    user_message = data.get('message', '')
    question_count = data.get('question_count', 0)

    # Check for fixed responses first (before processing)
    fixed_response = check_fixed_responses(user_message)
    if fixed_response:
        # Return the fixed response without calling the AI or updating conversation history
        return jsonify({
            'message': fixed_response,
            'rating': None,
            'conversation_history': conversation_history,
            'question_count': question_count
        })

    conversation_history.append({
        'role': 'user',
        'content': user_message
    })
    question_count += 1

    if question_count >= 5:
        # End of interview — request final evaluation
        conversation_history.append({
            'role': 'user',
            'content': 'The interview is now over. Please provide your final feedback and scores based on our entire conversation. Use the format specified in your instructions.'
        })
        rating_content = openrouter_chat(conversation_history)
        rating_message = {
            'role': 'assistant',
            'content': rating_content
        }
        conversation_history.append(rating_message)

        return jsonify({
            'message': None,
            'rating': rating_message['content'],
            'conversation_history': conversation_history,
            'question_count': 0  # reset
        })

    # Regular response
    response_content = openrouter_chat(conversation_history)
    bot_message = {
        'role': 'assistant',
        'content': response_content
    }
    conversation_history.append(bot_message)

    return jsonify({
        'message': bot_message['content'],
        'rating': None,
        'conversation_history': conversation_history,
        'question_count': question_count
    })

# ==== Run Server ====
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
