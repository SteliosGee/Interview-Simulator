import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "../components/ThemeProvider";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define API URL
const API_URL = "http://localhost:5000/api"; // Change this to your Python server address

export default function InterviewPage({ navigation, route }) {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);

  const userProfilePic = "https://i.pravatar.cc/150?img=11"; // Placeholder user image
  const aiProfilePic = "https://i.pravatar.cc/150?img=12"; // Placeholder AI image

  const storeInterviewResults = async (
    passed,
    overallScore,
    technicalScore,
    communicationScore
  ) => {
    try {
      const existingDataJSON = await AsyncStorage.getItem("interviewStats");
      let stats = existingDataJSON
        ? JSON.parse(existingDataJSON)
        : {
            totalInterviews: 0,
            passedInterviews: 0,
            failedInterviews: 0,
            performanceHistory: [],
            softSkills: {
              Communication: 0,
              "Problem Solving": 0,
              "Teamwork and Collaboration": 0,
              Adaptability: 0,
              "Emotional Intelligence": 0,
            },
            hardSkills: {
              JavaScript: 0,
              React: 0,
              "Node.js": 0,
              SQL: 0,
              "System Design": 0,
            },
          };

      // Ensure required properties exist
      if (!stats.performanceHistory) stats.performanceHistory = [];
      if (!stats.softSkills) {
        stats.softSkills = {
          Communication: 0,
          "Problem Solving": 0,
          "Teamwork and Collaboration": 0,
          Adaptability: 0,
          "Emotional Intelligence": 0,
        };
      }
      if (!stats.hardSkills) {
        stats.hardSkills = {
          JavaScript: 0,
          React: 0,
          "Node.js": 0,
          SQL: 0,
          "System Design": 0,
        };
      }

      stats.totalInterviews += 1;
      if (passed) {
        stats.passedInterviews += 1;
      } else {
        stats.failedInterviews += 1;
      }

      // Store overall score in performance history
      stats.performanceHistory.push(overallScore);
      if (stats.performanceHistory.length > 10) {
        stats.performanceHistory.shift();
      }

      const interviewType = route.params?.interviewType || "Technical";
      const devField = route.params?.devField || "Frontend";

      // Update softSkills using the communication score
      if (
        interviewType === "Behavioral" ||
        interviewType === "Technical & Behavioral"
      ) {
        stats.softSkills["Communication"] = Math.min(
          100,
          Math.round(
            (stats.softSkills["Communication"] + communicationScore) / 2
          )
        );
        stats.softSkills["Problem Solving"] = Math.min(
          100,
          Math.round(
            (stats.softSkills["Problem Solving"] + overallScore * 0.4) / 2
          )
        );
        stats.softSkills["Teamwork and Collaboration"] = Math.min(
          100,
          Math.round(
            (stats.softSkills["Teamwork and Collaboration"] +
              communicationScore * 0.5) /
              2
          )
        );
        stats.softSkills["Adaptability"] = Math.min(
          100,
          Math.round(
            (stats.softSkills["Adaptability"] + communicationScore * 0.4) / 2
          )
        );
        stats.softSkills["Emotional Intelligence"] = Math.min(
          100,
          Math.round(
            (stats.softSkills["Emotional Intelligence"] +
              communicationScore * 0.4) /
              2
          )
        );
      }

      // Update hardSkills using the technical score
      if (
        interviewType === "Technical" ||
        interviewType === "Technical & Behavioral"
      ) {
        if (devField === "Frontend") {
          stats.hardSkills["JavaScript"] = Math.min(
            100,
            Math.round(
              (stats.hardSkills["JavaScript"] + technicalScore * 0.5) / 2
            )
          );
          stats.hardSkills["React"] = Math.min(
            100,
            Math.round((stats.hardSkills["React"] + technicalScore * 0.5) / 2)
          );
        } else if (devField === "Backend") {
          stats.hardSkills["Node.js"] = Math.min(
            100,
            Math.round((stats.hardSkills["Node.js"] + technicalScore * 0.5) / 2)
          );
          stats.hardSkills["SQL"] = Math.min(
            100,
            Math.round((stats.hardSkills["SQL"] + technicalScore * 0.5) / 2)
          );
        } else if (devField === "Fullstack") {
          stats.hardSkills["JavaScript"] = Math.min(
            100,
            Math.round(
              (stats.hardSkills["JavaScript"] + technicalScore * 0.4) / 2
            )
          );
          stats.hardSkills["React"] = Math.min(
            100,
            Math.round((stats.hardSkills["React"] + technicalScore * 0.3) / 2)
          );
          stats.hardSkills["Node.js"] = Math.min(
            100,
            Math.round((stats.hardSkills["Node.js"] + technicalScore * 0.3) / 2)
          );
          stats.hardSkills["SQL"] = Math.min(
            100,
            Math.round((stats.hardSkills["SQL"] + technicalScore * 0.3) / 2)
          );
        }
        stats.hardSkills["System Design"] = Math.min(
          100,
          Math.round(
            (stats.hardSkills["System Design"] + technicalScore * 0.3) / 2
          )
        );
      }

      // Store the updated statistics
      await AsyncStorage.setItem("interviewStats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error storing interview results:", error);
    }
  };

  // Add this function to extract scores from the response
  const extractScores = (responseText) => {
    // Default scores in case we can't parse them
    let scores = {
      technical: 60,
      communication: 70,
      overall: 70,
    };

    try {
      // Extract overall score
      const overallMatch = responseText.match(
        /Your score is (\d+)%|Overall (?:Score|Satisfaction):\s*(\d+)%/i
      );
      if (overallMatch) {
        scores.overall = parseInt(overallMatch[1] || overallMatch[2], 10);
      }

      // Extract technical score
      const technicalMatch = responseText.match(/Technical Skills:\s*(\d+)%/i);
      if (technicalMatch) {
        scores.technical = parseInt(technicalMatch[1], 10);
      }

      // Extract communication score
      const communicationMatch = responseText.match(
        /Communication Skills:\s*(\d+)%/i
      );
      if (communicationMatch) {
        scores.communication = parseInt(communicationMatch[1], 10);
      }
    } catch (error) {
      console.error("Error parsing scores:", error);
    }

    return scores;
  };

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/start-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setConversationHistory([
        { role: "system", content: "AI Interview Assistant" },
        { role: "user", content: "Hi" },
        { role: "assistant", content: data.message },
      ]);
      setInterviewStarted(true);
      addMessage("assistant", data.message, aiProfilePic);
      setIsLoading(false);
    } catch (error) {
      console.error("Error starting interview:", error);
      setIsLoading(false);
    }
  };

  const addMessage = (role, content, profilePicture) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role, content, profilePicture },
    ]);
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userInput = input.trim();
      addMessage("user", userInput, userProfilePic);
      setInput("");
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversation_history: conversationHistory,
            message: userInput,
            question_count: questionCount,
          }),
        });
        const data = await response.json();
        addMessage("assistant", data.message, aiProfilePic);
        if (data.rating) {
          addMessage("assistant", data.rating, aiProfilePic);
          setCurrentQuestion(1);

          // Extract scores from the rating text
          const scores = extractScores(data.rating);
          const passed = scores.overall >= 70;

          await storeInterviewResults(
            passed,
            scores.overall,
            scores.technical,
            scores.communication
          );
        } else {
          setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        }
        setConversationHistory(data.conversation_history);
        setQuestionCount(data.question_count);
        setIsLoading(false);
      } catch (error) {
        console.error("Error sending message:", error);
        setIsLoading(false);
        addMessage(
          "assistant",
          "Sorry, there was an error communicating with the server.",
          aiProfilePic
        );
      }
    }
  };

  const endInterview = async () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!interviewStarted ? (
        <View style={styles.startContainer}>
          <Text style={[styles.startTitle, { color: colors.text }]}>
            Ready to begin your interview?
          </Text>
          <Text style={[styles.startSubtitle, { color: colors.textMuted }]}>
            Our AI interviewer will ask you a series of questions. Answer them
            to the best of your ability.
          </Text>
          <Button
            title={isLoading ? "Connecting..." : "Begin Interview"}
            onPress={startInterview}
          />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: colors.text }]}>
              Question {currentQuestion}
            </Text>
          </View>
          <ScrollView style={styles.chatContainer}>
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  message.role === "user"
                    ? styles.userContainer
                    : styles.botContainer,
                ]}
              >
                {message.role === "assistant" && (
                  <Image
                    source={{ uri: message.profilePicture }}
                    style={styles.profileImage}
                  />
                )}
                <Card
                  style={[
                    styles.message,
                    message.role === "user"
                      ? styles.userMessage
                      : styles.botMessage,
                    {
                      backgroundColor:
                        message.role === "user" ? colors.primary : colors.card,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color:
                          message.role === "user"
                            ? colors.onPrimary
                            : colors.text,
                      },
                    ]}
                  >
                    {message.content}
                  </Text>
                </Card>
                {message.role === "user" && (
                  <Image
                    source={{ uri: message.profilePicture }}
                    style={styles.profileImage}
                  />
                )}
              </View>
            ))}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                  AI is thinking...
                </Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.card, color: colors.text },
              ]}
              value={input}
              onChangeText={setInput}
              placeholder="Type your response..."
              placeholderTextColor={colors.textMuted}
              multiline
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setInput("")}
              style={styles.micIcon}
            >
              <Icon name="microphone" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSend}
              style={[
                styles.sendIcon,
                {
                  backgroundColor: isLoading
                    ? colors.textMuted
                    : colors.primary,
                },
              ]}
              disabled={isLoading}
            >
              <Icon name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {messages.length > 0 &&
            messages[messages.length - 1].content.includes("%") && (
              <View style={{ margin: 10 }}>
                <Button
                  title="End Interview & View Profile"
                  onPress={endInterview}
                />
              </View>
            )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  startContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  startTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  startSubtitle: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  headerText: { fontSize: 18, fontWeight: "bold" },
  chatContainer: { flex: 1, padding: 10 },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  botMessage: {
    alignSelf: "flex-start",
  },
  messageText: { fontSize: 16 },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  loadingText: { marginLeft: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 20,
    height: 50,
  },
  micIcon: {
    marginRight: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "orange",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "blue",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  messageContainer: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 10,
  },

  userContainer: {
    alignSelf: "flex-end",

    flexDirection: "row",
  },

  botContainer: {
    alignSelf: "flex-start",
  },
});
