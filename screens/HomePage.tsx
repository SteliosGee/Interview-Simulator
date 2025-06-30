import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import Icon from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

export default function HomePage({ navigation }) {
  const { colors } = useTheme();

  const features = [
    { 
      title: 'AI-Powered Interviews', 
      description: 'Experience realistic interviews with our advanced AI that adapts to your responses', 
      icon: 'brain',
      color: '#FF6B6B'
    },
    { 
      title: 'Diverse Question Bank', 
      description: 'Practice with hundreds of curated questions across multiple domains', 
      icon: 'book-open',
      color: '#4ECDC4'
    },
    { 
      title: 'Personalized Feedback', 
      description: 'Receive detailed insights and improvement suggestions after each session', 
      icon: 'chart-bar',
      color: '#45B7D1'
    },
    { 
      title: 'Progress Tracking', 
      description: 'Monitor your improvement with detailed analytics and performance metrics', 
      icon: 'trophy',
      color: '#96CEB4'
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image source={require('../assets/hero.jpg')} style={styles.heroImage} />
        <View style={[styles.heroOverlay, { backgroundColor: colors.primary + '20' }]} />
        <View style={styles.heroContent}>
          <Text style={styles.title}>Developer Interview Simulator</Text>
          <Text style={styles.subtitle}>
            Master your interview skills with AI-powered practice sessions
          </Text>
          <View style={styles.heroActions}>
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Interview')}
            >
              <Icon name="play" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>Start Interview</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.secondaryButton, { borderColor: colors.primary }]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>View Progress</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Key Features */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Why Choose Our Platform?</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Card key={index} style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <View style={[styles.featureIconContainer, { backgroundColor: feature.color + '20' }]}>
                <Icon name={feature.icon} size={28} color={feature.color} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: colors.textMuted }]}>{feature.description}</Text>
            </Card>
          ))}
        </View>
      </View>

      {/* Enhanced FAQ Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
        <View style={styles.faqGrid}>
          <Card style={[styles.faqCard, { backgroundColor: colors.card }]}>
            <View style={styles.faqHeader}>
              <Icon name="robot" size={20} color={colors.primary} />
              <Text style={[styles.faqTitle, { color: colors.text }]}>How does the AI work?</Text>
            </View>
            <Text style={[styles.faqDescription, { color: colors.textMuted }]}>
              Our AI uses advanced natural language processing to conduct realistic interviews, 
              adapting questions based on your responses and providing intelligent feedback.
            </Text>
          </Card>
          
          <Card style={[styles.faqCard, { backgroundColor: colors.card }]}>
            <View style={styles.faqHeader}>
              <Icon name="chart-line" size={20} color={colors.primary} />
              <Text style={[styles.faqTitle, { color: colors.text }]}>How do I track progress?</Text>
            </View>
            <Text style={[styles.faqDescription, { color: colors.textMuted }]}>
              View detailed analytics including performance metrics, skill assessments, 
              and improvement suggestions in your personalized dashboard.
            </Text>
          </Card>

          <Card style={[styles.faqCard, { backgroundColor: colors.card }]}>
            <View style={styles.faqHeader}>
              <Icon name="clock" size={20} color={colors.primary} />
              <Text style={[styles.faqTitle, { color: colors.text }]}>How long are sessions?</Text>
            </View>
            <Text style={[styles.faqDescription, { color: colors.textMuted }]}>
              Interview sessions typically last 15-30 minutes, perfectly timed to simulate 
              real interview scenarios without overwhelming you.
            </Text>
          </Card>
        </View>
      </View>

      {/* Call to Action */}
      <View style={[styles.ctaSection, { backgroundColor: colors.primary + '10' }]}>
        <View style={styles.ctaContent}>
          <Text style={[styles.ctaTitle, { color: colors.text }]}>Ready to ace your next interview?</Text>
          <Text style={[styles.ctaSubtitle, { color: colors.textMuted }]}>
            Join thousands of developers who have improved their interview skills
          </Text>
          <TouchableOpacity 
            style={[styles.ctaButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Interview')}
          >
            <Text style={styles.ctaButtonText}>Start Your Journey</Text>
            <Icon name="arrow-right" size={16} color="white" style={styles.ctaButtonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Hero Section
  hero: {
    position: 'relative',
    height: 600,
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
    opacity: 0.3,
    zIndex: -1,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 5,
  },

  // Sections
  section: { 
    padding: 25,
    paddingTop: 30,
  },
  sectionTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center',
  },

  // Features
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  featureCard: {
    width: width < 768 ? '100%' : '48%',
    minWidth: 280,
    padding: 25,
    borderRadius: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 24,
  },

  // FAQ
  faqGrid: {
    gap: 15,
  },
  faqCard: {
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  faqDescription: {
    fontSize: 16,
    lineHeight: 24,
  },

  // CTA Section
  ctaSection: {
    margin: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ctaButtonIcon: {
    marginLeft: 8,
  },
});

