import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../components/ThemeProvider";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfilePage() {
  const { colors } = useTheme();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    passedInterviews: 0,
    failedInterviews: 0,
    averageScore: 0,
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
    achievements: ["New User"],
    performanceHistory: [0],
  });

  // Load stats when profile page is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadStats = async () => {
        try {
          const storedStats = await AsyncStorage.getItem("interviewStats");
          if (storedStats) {
            const parsedStats = JSON.parse(storedStats);

            // Ensure all required properties exist with defaults
            const safeStats = {
              totalInterviews: parsedStats.totalInterviews || 0,
              passedInterviews: parsedStats.passedInterviews || 0,
              failedInterviews: parsedStats.failedInterviews || 0,
              averageScore: 0,
              softSkills: parsedStats.softSkills || {
                Communication: 0,
                "Problem Solving": 0,
                "Teamwork and Collaboration": 0,
                Adaptability: 0,
                "Emotional Intelligence": 0,
              },
              hardSkills: parsedStats.hardSkills || {
                JavaScript: 0,
                React: 0,
                "Node.js": 0,
                SQL: 0,
                "System Design": 0,
              },
              achievements: ["New User"],
              performanceHistory: parsedStats.performanceHistory || [0],
            };

            // Calculate average score
            let avgScore = 0;
            if (
              safeStats.performanceHistory &&
              safeStats.performanceHistory.length > 0
            ) {
              avgScore = Math.round(
                safeStats.performanceHistory.reduce((a, b) => a + b, 0) /
                  safeStats.performanceHistory.length
              );
            }
            safeStats.averageScore = avgScore;

            // Calculate achievements
            const achievements = ["New User"];
            if (safeStats.totalInterviews >= 5) {
              achievements.push("Regular Interviewer");
            }
            if (safeStats.totalInterviews >= 10) {
              achievements.push("Interview Pro");
            }
            if (safeStats.passedInterviews >= 5) {
              achievements.push("Success Streak");
            }
            if (avgScore >= 80) {
              achievements.push("High Performer");
            }
            if (avgScore >= 90) {
              achievements.push("Interview Master");
            }
            safeStats.achievements = achievements;

            setStats(safeStats);
          }
        } catch (error) {
          console.error("Error loading stats:", error);
        }
      };

      loadStats();
      return () => {}; // Cleanup function
    }, [])
  );

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) =>
      `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(
        colors.primary.slice(3, 5),
        16
      )}, ${parseInt(colors.primary.slice(5, 7), 16)}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Profile Overview
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.totalInterviews}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Total Interviews
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "green" }]}>
              {stats.passedInterviews}
            </Text>
            <Text style={[styles.statLabel, { color: "green" }]}>
              Passed Interviews
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "red" }]}>
              {stats.failedInterviews}
            </Text>
            <Text style={[styles.statLabel, { color: "red" }]}>
              Failed Interviews
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.averageScore}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Average Score
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Performance History
        </Text>
        <LineChart
          data={{
            labels: ["1", "2", "3", "4", "5", "6", "7"],
            datasets: [
              {
                data: stats.performanceHistory || [0],
              },
            ],
          }}
          width={300}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={true}
        />
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Soft Skills
        </Text>
        {stats.softSkills &&
          Object.entries(stats.softSkills).map(([skill, level]) => (
            <View key={skill} style={styles.skillItem}>
              <Text style={[styles.skillText, { color: colors.text }]}>
                {skill}
              </Text>
              <View style={styles.progressContainer}>
                <ProgressBar progress={level / 100} style={{ flex: 1 }} />
                <Text style={[styles.skillLevel, { color: colors.textMuted }]}>
                  {level}%
                </Text>
              </View>
            </View>
          ))}
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Hard Skills
        </Text>
        {stats.hardSkills &&
          Object.entries(stats.hardSkills).map(([skill, level]) => (
            <View key={skill} style={styles.skillItem}>
              <Text style={[styles.skillText, { color: colors.text }]}>
                {skill}
              </Text>
              <View style={styles.progressContainer}>
                <ProgressBar progress={level / 100} style={{ flex: 1 }} />
                <Text style={[styles.skillLevel, { color: colors.textMuted }]}>
                  {level}%
                </Text>
              </View>
            </View>
          ))}
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Achievements
        </Text>
        <View style={styles.badgeContainer}>
          {stats.achievements &&
            stats.achievements.map((badge, index) => (
              <View
                key={index}
                style={[styles.badge, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.badgeText, { color: colors.onPrimary }]}>
                  {badge}
                </Text>
              </View>
            ))}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { marginBottom: 20, padding: 15 },
  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  statsContainer: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "bold" },
  statLabel: { fontSize: 14 },
  chart: { marginVertical: 8, borderRadius: 16 },
  skillItem: { marginBottom: 10 },
  skillText: { fontSize: 16, marginBottom: 5 },
  progressContainer: { flexDirection: "row", alignItems: "center" },
  skillLevel: { marginLeft: 10, fontSize: 14 },
  badgeContainer: { flexDirection: "row", flexWrap: "wrap" },
  badge: { margin: 5, padding: 5, borderRadius: 5 },
  badgeText: { fontSize: 14 },
});
