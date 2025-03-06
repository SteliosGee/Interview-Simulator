import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import Icon from 'react-native-vector-icons/FontAwesome';

// Define API URL
const API_URL = 'http://localhost:5000/api';  // Change this to your Python server address

export default function InterviewPage() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);

  const startInterview = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/start-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      setConversationHistory([
        { role: 'system', content: 'AI Interview Assistant' }, // System role will be initialized on server
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: data.message }
      ]);
      
      setInterviewStarted(true);
      addMessage('assistant', data.message);
      setIsLoading(false);
    } catch (error) {
      console.error('Error starting interview:', error);
      setIsLoading(false);
    }
  };

  const addMessage = (role, content) => {
    setMessages(prevMessages => [...prevMessages, { role, content }]);
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userInput = input.trim();
      addMessage('user', userInput);
      setInput('');
      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversation_history: conversationHistory,
            message: userInput,
            question_count: questionCount
          })
        });
        
        const data = await response.json();
        
        // Add the bot's response
        addMessage('assistant', data.message);
        
        // If we have a rating, add it as well
        if (data.rating) {
          addMessage('assistant', data.rating);
          setCurrentQuestion(1); // Reset to question 1 after rating
        } else {
          setCurrentQuestion(prevQuestion => prevQuestion + 1);
        }
        
        // Update state with the new conversation history and question count
        setConversationHistory(data.conversation_history);
        setQuestionCount(data.question_count);
        setIsLoading(false);
      } catch (error) {
        console.error('Error sending message:', error);
        setIsLoading(false);
        addMessage('assistant', 'Sorry, there was an error communicating with the server.');
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!interviewStarted ? (
        <View style={styles.startContainer}>
          <Text style={[styles.startTitle, { color: colors.text }]}>Ready to begin your interview?</Text>
          <Text style={[styles.startSubtitle, { color: colors.textMuted }]}>Our AI interviewer will ask you a series of questions. Answer them to the best of your ability.</Text>
          <Button title={isLoading ? "Connecting..." : "Begin Interview"} onPress={startInterview} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: colors.text }]}>Question {currentQuestion}</Text>
          </View>
          <ScrollView style={styles.chatContainer}>
            {messages.map((message, index) => (
              <Card
                key={index}
                style={[
                  styles.message,
                  message.role === 'user' ? styles.userMessage : styles.botMessage,
                  { backgroundColor: message.role === 'user' ? colors.primary : colors.card }
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    { color: message.role === 'user' ? colors.onPrimary : colors.text }
                  ]}
                >
                  {message.content}
                </Text>
              </Card>
            ))}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textMuted }]}>AI is thinking...</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              value={input}
              onChangeText={setInput}
              placeholder="Type your response..."
              placeholderTextColor={colors.textMuted}
              multiline
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setInput('')} style={styles.micIcon}>
              <Icon name="microphone" size={24} color='white' />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSend} 
              style={[styles.sendIcon, { 
                backgroundColor: isLoading ? colors.textMuted : colors.primary 
              }]}
              disabled={isLoading}
            >
              <Icon name="send" size={24} color='white' />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  startContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  startTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  startSubtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  chatContainer: { flex: 1, padding: 10 },
  message: { 
    marginBottom: 10, 
    padding: 10, 
    borderRadius: 10, 
    maxWidth: '80%' 
  },
  userMessage: { 
    alignSelf: 'flex-end', 
  },
  botMessage: { 
    alignSelf: 'flex-start', 
  },
  messageText: { fontSize: 16 },
  loadingContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 },
  loadingText: { marginLeft: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  input: { flex: 1, marginRight: 10, padding: 10, borderRadius: 20, height: 50 },
  micIcon: { marginRight: 10, padding: 10, borderRadius: 20, backgroundColor: 'orange', width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { padding: 10, borderRadius: 20, backgroundColor: 'blue', width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
});