import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Linking, TouchableOpacity, Image, Platform } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Card } from '../components/Card';
// Conditionally import based on platform
import YoutubePlayer from 'react-native-youtube-iframe';
// You would need to install this for web
import YouTube from 'react-youtube';

export default function SettingsPage() {
  const { colors, toggleTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(false);

  const Section = ({ title, content }) => (
    <Card style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.sectionContent, { color: colors.textMuted }]}>{content}</Text>
    </Card>
  );

  const Article = ({ title, author, link, image }) => (
    <TouchableOpacity onPress={() => Linking.openURL(link)} style={styles.articleContainer}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.articleImage} />
        <View style={styles.articleTitleBackground}>
          <Text style={styles.articleTitle}>{title}</Text>
        </View>
      </View>
      <Text style={styles.articleAuthor}>{author}</Text>
    </TouchableOpacity>
  );

  const Video = ({ title, channel, videoId }) => {
    const { colors } = useTheme();
    
    // Check if we're running on web
    if (Platform.OS === 'web') {
      return (
        <View style={styles.videoContainer}>
          <YouTube
            videoId={videoId}
            opts={{
              height: '200',
              width: '100%',
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 0,
              },
            }}
          />
          <Text style={[styles.videoTitle, {color: colors.text}]}>{title}</Text>
          <Text style={[styles.videoChannel, {color: colors.text}]}>{channel}</Text>
        </View>
      );
    }
    
    // For mobile platforms
    return (
      <View style={styles.videoContainer}>
        <YoutubePlayer
          height={200}
          play={false}
          videoId={videoId}
        />
        <Text style={[styles.videoTitle, {color: colors.text}]}>{title}</Text>
        <Text style={[styles.videoChannel, {color: colors.text}]}>{channel}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Preferences</Text>
        <View style={styles.setting}>
          <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={(value) => {
              setDarkMode(value);
              toggleTheme();
            }}
          />
        </View>
        <View style={styles.setting}>
          <Text style={[styles.settingText, { color: colors.text }]}>Audio</Text>
          <Switch value={audioFeedback} onValueChange={setAudioFeedback} />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Tips</Text>
        <View style={styles.sectionsContainer}>
          <Section
            title="1. Technical Skills"
            content="• Review core concepts in your primary programming languages\n• Practice coding challenges on platforms like LeetCode or HackerRank\n• Understand data structures and algorithms\n• Be familiar with version control systems (e.g., Git)"
          />
          <Section
            title="2. Soft Skills"
            content="• Improve your communication skills\n• Practice explaining complex concepts simply\n• Develop your problem-solving approach\n• Work on your teamwork and collaboration abilities"
          />
          <Section
            title="3. Project Discussion"
            content="• Prepare to discuss your past projects in detail\n• Highlight challenges you've overcome\n• Explain your role and contributions clearly\n• Be ready to discuss your decision-making process"
          />
          <Section
            title="4. Company Research"
            content="• Research the company's products and services\n• Understand their tech stack and methodologies\n• Read about their culture and values\n• Prepare questions to ask your interviewers"
          />
          <Section
            title="5. Mock Interviews"
            content="• Practice with friends or mentors\n• Use online platforms for mock technical interviews\n• Record yourself and review your performance\n• Get feedback and work on improvement areas"
          />
          <Section
            title="6. Stay Updated"
            content="• Keep up with the latest trends in your field\n• Read tech blogs and news\n• Attend webinars or conferences if possible\n• Contribute to open-source projects"
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Useful Articles</Text>
        <View style={styles.articlesContainer}>
          <Article
            title="1. How to Improve Your Interview Skills"
            author="-by Michael Page"
            link="https://www.michaelpage.com/advice/career-advice/job-interview-tips/how-improve-your-interview-skills"
            image="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
          <Article
            title="2. Strategies of Effective Interviewing"
            author="-by Samuel G. Trull"
            link="https://hbr.org/1964/01/strategies-of-effective-interviewing"
            image="https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
          <Article
            title="3. Tips for a Successful Interview"
            author="-by University of North Georgia"
            link="https://ung.edu/career-services/online-career-resources/interview-well/tips-for-a-successful-interview.php"
            image="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
          <Article
            title="4. Interview and Job Search Tips for Software Engineers"
            author="-by Richard Anton"
            link="https://www.ranton.org/g/software_eng_job_searches"
            image="https://www.ranton.org/img/jobseeker.jpg"
          />
          <Article
            title="5. Success Strategies"
            author="-by Olga Pankrateva"
            link="https://www.careerist.com/insights/how-to-get-better-at-job-interviews-success-strategies"
            image="https://images.pexels.com/photos/5989935/pexels-photo-5989935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Useful Videos</Text>
        <View style={styles.articlesContainer}>
          <Video
            title="Cracking the Behavioral Interview"
            channel="KeepOnCoding"
            videoId="ld0cvWnrVsU"
          />
          <Video
            title="Top Interview Tips"
            channel="Indeed"
            videoId="HG68Ymazo18"
          />
          <Video
            title="How to NOT Fail a Technical Interview"
            channel="Fireship"
            videoId="1t1_a1BZ04o"
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingText: {
    fontSize: 16,
  },
  sectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  section: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 400,
    marginBottom: 15,
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
  },
  articlesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  articleContainer: {
    flexBasis: 300,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  imageWrapper: {
    position: 'relative',
  },
  articleImage: {
    width: '100%',
    height: 150,
  },
  articleTitleBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
  articleTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  articleAuthor: {
    padding: 10,
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
    backgroundColor: '#ff00ff1a',
  },
  videoContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  videoChannel: {
    fontSize: 12,
    color: '#333',
  },
});
