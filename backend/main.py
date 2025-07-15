from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ==== OpenRouter Configuration ====
OPENROUTER_API_KEY = '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'  # <-- Replace this with your actual key
MODEL = 'meta-llama/llama-3-70b-instruct'  # Or any other model from OpenRouter

HEADERS = {
    'Authorization': f'Bearer {OPENROUTER_API_KEY}',
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:5000',  # Set this properly for production
    'X-Title': 'Interview Chatbot'
}

# ==== Helper Function ====
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
