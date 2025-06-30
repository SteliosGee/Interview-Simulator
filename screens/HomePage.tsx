import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function HomePage({ navigation }) {
  const { colors } = useTheme();

  const features = [
    { title: 'AI-Powered Interviews', description: 'Experience realistic interviews with our advanced AI', icon: 'brain' },
    { title: 'Diverse Question Bank', description: 'Practice with a wide range of questions', icon: 'book-open' },
    { title: 'Personalized Feedback', description: 'Receive detailed feedback on your performance', icon: 'file-signature' },
    { title: 'Progress Tracking', description: 'Monitor your improvement over time', icon: 'chart-line' },
  ];

  const testimonials = [
    { name: 'Alex Chen', role: 'Frontend Developer', content: 'This simulator helped me ace my React interview!', avatar: 'https://i.pravatar.cc/100?img=1' },
    { name: 'Samantha Lee', role: 'Full Stack Engineer', content: 'It\'s like having a personal interview coach.', avatar: 'https://i.pravatar.cc/100?img=2' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.hero}>
        <Image source={require('../assets/hero.jpg')} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        <Text style={styles.title}>Developer Interview Simulator</Text>
        <Text style={styles.subtitle}>
          Practice your interview skills with our AI-powered simulator
        </Text>
        <View style={styles.heroButton}>
          <Button title="Start Simulation" onPress={() => navigation.navigate('Interview')} />
        </View>
      </View>


      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
        {features.map((feature, index) => (
          <Card key={index} style={styles.card}>
            <View style={styles.featureHeader}>
            <Icon name={feature.icon} size={24} color={colors.primary} style={styles.featureIcon} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>{feature.title}</Text>
            </View>
            <Text style={[styles.cardDescription, { color: colors.textMuted }]}>{feature.description}</Text>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>What Our Users Say</Text>
        {testimonials.map((testimonial, index) => (
          <Card key={index} style={styles.card}>
            <View style={styles.testimonialHeader}>
              <Image source={{ uri: testimonial.avatar }} style={styles.avatar} />
              <View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{testimonial.name}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{testimonial.role}</Text>
              </View>
            </View>
            <Text style={[styles.cardDescription, { color: colors.text }]}>"{testimonial.content}"</Text>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>FAQ</Text>
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>How does the AI work?</Text>
          <Text style={[styles.cardDescription, { color: colors.textMuted }]}>Our AI generates responses based on your answers and provides feedback on your performance.</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Can I practice with a friend?</Text>
          <Text style={[styles.cardDescription, { color: colors.textMuted }]}>Yes, you can invite friends to join your practice sessions and give each other feedback.</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>How do I track my progress?</Text>
          <Text style={[styles.cardDescription, { color: colors.textMuted }]}>You can view detailed analytics on your performance and improvement over time in your profile dashboard.</Text>
        </Card>
      </View>

      <View style={styles.cta}>
        <Text style={[styles.ctaText, { color: colors.text }]}>Ready to ace your next interview?</Text>
        <Button title="Start Free Trial" onPress={() => navigation.navigate('Interview')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    position: 'relative',
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.5,
    zIndex: -1,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for contrast
    zIndex: -1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    marginTop: 20,
  },

  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { marginBottom: 15, padding: 15 },
  featureHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureIcon: { width: 24, height: 24, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 14 },
  cardDescription: { fontSize: 14 },
  testimonialHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  cta: { alignItems: 'center', padding: 20 },
  ctaText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
});

