#!/usr/bin/env python3
"""
Test script to verify the fixed response system is working correctly.
"""

import sys
import os

# Add the current directory to the path so we can import from main.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import check_fixed_responses

def test_fixed_response(message, expected_response=None):
    """Test a message and print the result"""
    result = check_fixed_responses(message)
    if result:
        status = "✅ FIXED RESPONSE" if expected_response is None or result == expected_response else "❌ WRONG RESPONSE"
        print(f"{status}: '{message}' -> '{result}'")
    else:
        status = "🔄 NO FIXED RESPONSE" if expected_response is None else "❌ EXPECTED FIXED RESPONSE"
        print(f"{status}: '{message}' -> Will be processed by AI")
    return result

def run_tests():
    """Run all tests"""
    print("🧪 Testing Fixed Response System\n")
    
    print("🎯 Questions that should get fixed responses:")
    test_fixed_response("what color are the apples?", "That's not relevant to the interview, please respond accordingly.")
    test_fixed_response("What color are apples?", "That's not relevant to the interview, please respond accordingly.")
    test_fixed_response("what's the weather like?")
    test_fixed_response("how are you?")
    test_fixed_response("tell me a joke")
    test_fixed_response("what's your favorite food?")
    test_fixed_response("do you like pizza?")
    test_fixed_response("what's your favorite movie?")
    test_fixed_response("what time is it?")
    test_fixed_response("can you sing?")
    
    print("\n📝 Interview-related questions (should NOT get fixed responses):")
    test_fixed_response("What is JavaScript?")
    test_fixed_response("Can you explain React hooks?")
    test_fixed_response("Tell me about your programming experience")
    test_fixed_response("How do you handle asynchronous operations?")
    test_fixed_response("What's your favorite programming language?")
    
    print("\n🔍 Pattern-based questions:")
    test_fixed_response("what color do you like?")
    test_fixed_response("tell me about the weather")
    test_fixed_response("what's your favorite music?")
    
    print("\n✅ Fixed response testing complete!")

if __name__ == "__main__":
    run_tests()
