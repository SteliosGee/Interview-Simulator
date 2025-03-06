import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { LineChart } from 'react-native-chart-kit';

export default function ProfilePage() {
  const { colors } = useTheme();

  const stats = {
    totalInterviews: 15,
    passedInterviews: 10,
    failedInterviews: 5,
    averageScore: 78,
    softSkills: {
      'Communication': 80,
      'Problem Solving': 85,
      'Teamwork and Collaboration': 75,
      'Adaptability': 70,
      'Emotional Intelligence': 65
    },
    hardSkills: {
      'JavaScript': 85,
      'React': 80,
      'Node.js': 75,
      'SQL': 70,
      'System Design': 65
    },
    achievements: ['Quick Thinker', 'Code Master', 'Algorithm Ace'],
    performanceHistory: [65, 70, 72, 78, 76, 80, 78]
  };

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) => `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Profile Overview</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalInterviews}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total Interviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: 'green' }]}>{stats.passedInterviews}</Text>
            <Text style={[styles.statLabel, { color: 'green' }]}>Passed Interviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: 'red' }]}>{stats.failedInterviews}</Text>
            <Text style={[styles.statLabel, { color: 'red' }]}>Failed Interviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.averageScore}%</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Average Score</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Performance History</Text>
        <LineChart
          data={{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [{
              data: stats.performanceHistory
            }]
          }}
          width={300}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Soft Skills</Text>
        {Object.entries(stats.softSkills).map(([skill, level]) => (
          <View key={skill} style={styles.skillItem}>
            <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
            <View style={styles.progressContainer}>
              <ProgressBar progress={level / 100} />
              <Text style={[styles.skillLevel, { color: colors.textMuted }]}>{level}%</Text>
            </View>
          </View>
        ))}
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Hard Skills</Text>
        {Object.entries(stats.hardSkills).map(([skill, level]) => (
          <View key={skill} style={styles.skillItem}>
            <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
            <View style={styles.progressContainer}>
              <ProgressBar progress={level / 100}/>
              <Text style={[styles.skillLevel, { color: colors.textMuted }]}>{level}%</Text>
            </View>
          </View>
        ))}
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Achievements</Text>
        <View style={styles.badgeContainer}>
          {stats.achievements.map((badge, index) => (
            <View key={index} style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.onPrimary }]}>{badge}</Text>
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
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 14 },
  chart: { marginVertical: 8, borderRadius: 16 },
  skillItem: { marginBottom: 10 },
  skillText: { fontSize: 16, marginBottom: 5 },
  progressContainer: { flexDirection: 'row', alignItems: 'center' },
  skillLevel: { marginLeft: 10, fontSize: 14 },
  badgeContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  badge: { margin: 5, padding: 5, borderRadius: 5 },
  badgeText: { fontSize: 14 },
});

