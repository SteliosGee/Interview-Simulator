from flask import Flask, request, jsonify
from flask_cors import CORS
from ollama import chat
from ollama import ChatResponse
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the prompt
with open('prompt.txt', 'r') as file:
    prompt_content = file.read()

@app.route('/api/start-chat', methods=['POST'])
def start_chat():
    # Initialize conversation
    conversation_history = [{
        'role': 'system',
        'content': prompt_content
    }]
    
    # Add initial greeting
    conversation_history.append({
        'role': 'user',
        'content': 'Hi'
    })
    
    # Generate initial response
    response = chat(model='llama3.2:1b', messages=conversation_history)
    bot_message = {
        'role': 'assistant',
        'content': response['message']['content']
    }
    conversation_history.append(bot_message)
    
    return jsonify({
        'message': bot_message['content'],
        'conversation_id': '123'  # In a real app, generate unique IDs
    })

@app.route('/api/chat', methods=['POST'])
def process_chat():
    data = request.json
    conversation_history = data.get('conversation_history', [])
    user_message = data.get('message', '')
    question_count = data.get('question_count', 0)
    
    # Add user message
    conversation_history.append({
        'role': 'user',
        'content': user_message
    })
    
    # Generate response
    response = chat(model='llama3.2:1b', messages=conversation_history)
    bot_message = {
        'role': 'assistant',
        'content': response['message']['content']
    }
    conversation_history.append(bot_message)
    
    # Update question count
    question_count += 1
    
    # Check if we need performance rating
    rating_needed = question_count >= 3
    rating_message = None
    
    if rating_needed:
        # Request rating with specific format guidance for easier parsing
        # Fix the string concatenation issue by using proper concatenation or format string
        conversation_history.append({
            'role': 'user',
            'content': 'Please rate my performance now. Include a clear percentage score like this: "Your score is X%" ' + 
                      'Also mention percentage score for technical skills, communication skills, and overall satisfaction'
        })
        
        rating_response = chat(model='llama3.2:1b', messages=conversation_history)
        rating_message = {
            'role': 'assistant',
            'content': rating_response['message']['content']
        }
        conversation_history.append(rating_message)
        question_count = 0  # Reset counter
    
    return jsonify({
        'message': bot_message['content'],
        'rating': rating_message['content'] if rating_message else None,
        'conversation_history': conversation_history,
        'question_count': question_count
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)