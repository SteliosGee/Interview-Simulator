import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Button } from '../components/Button';

export default function PreInterviewPage({ navigation }) {
  const { colors } = useTheme();
  const [selectedDevField, setSelectedDevField] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedInterviewType, setSelectedInterviewType] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const devFields = ['Frontend', 'Backend', 'Fullstack', 'Mobile'];  
  const difficulties = ['Junior', 'Mid-Level', 'Senior', 'Expert'];
  const interviewTypes = ['Technical', 'Behavioral', 'Technical & Behavioral'];
  const languages = ['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'Swift', 'Kotlin', 'C++', 'PHP', 'Go', 'Rust', 'TypeScript'];

    const handleSelectDevField = (devField) => {
        setSelectedDevField(devField);
    };

  const handleSelectDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };
  
  const handleSelectInterviewType = (interviewType) => {
    setSelectedInterviewType(interviewType);
  };

    const handleSelectLanguages = (language) => {
        if (selectedLanguages.includes(language)) {
        setSelectedLanguages(selectedLanguages.filter((lang) => lang !== language));
        } else {
        setSelectedLanguages([...selectedLanguages, language]);
        }
    };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Pre-Interview Setup</Text>
      <View style={styles.filterContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Choose Developer Field:</Text>
        <View style={styles.optionsContainer}>
          {devFields.map((devField) => (
            <TouchableOpacity
              key={devField}
              style={[
                styles.option,
                {
                  backgroundColor: selectedDevField === devField ? colors.primary : colors.card,
                },
              ]}
              onPress={() => handleSelectDevField(devField)}
            >
              <Text
                style={{
                  color: selectedDevField === devField ? colors.onPrimary : colors.text,
                }}
              >
                {devField}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Choose Difficulty:</Text>
        <View style={styles.optionsContainer}>
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.option,
                {
                  backgroundColor: selectedDifficulty === difficulty ? colors.primary : colors.card,
                },
              ]}
              onPress={() => handleSelectDifficulty(difficulty)}
            >
              <Text
                style={{
                  color: selectedDifficulty === difficulty ? colors.onPrimary : colors.text,
                }}
              >
                {difficulty}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.label, { color: colors.text }]}>Choose Interview Type:</Text>
        <View style={styles.optionsContainer}>
          {interviewTypes.map((interviewType) => (
            <TouchableOpacity
              key={interviewType}
                style={[
                    styles.option,
                    {
                    backgroundColor: selectedInterviewType === interviewType ? colors.primary : colors.card,
                    },
                ]}
                onPress={() => handleSelectInterviewType(interviewType)}
            >
                <Text
                    style={{
                    color: selectedInterviewType === interviewType ? colors.onPrimary : colors.text,
                    }}
                >
                    {interviewType}
                </Text>
            </TouchableOpacity>
            ))}

        </View>
      {selectedInterviewType !== "Behavioral" && selectedInterviewType !== null && (
        <>
          <Text style={[styles.label, { color: colors.text }]}>Choose Programming Languages:</Text>
          <View style={styles.optionsContainer}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language}
                style={[
                  styles.option,
                  {
                    backgroundColor: selectedLanguages.includes(language) ? colors.primary : colors.card,
                  },
                ]}
                onPress={() => handleSelectLanguages(language)}
              >
                <Text
                  style={{
                    color: selectedLanguages.includes(language) ? colors.onPrimary : colors.text,
                  }}
                >
                  {language}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
</View>
      <Button
        title="Start Simulation"
        onPress={() => {
          if (!selectedDifficulty) {
            alert('Please select a difficulty level before starting.');
            return;
          }
          if (!selectedDevField) {
            alert('Please select a developer field.');
            return;
          }
          if (!selectedInterviewType) {
            alert('Please select an interview type.');
            return;
          }
          if ((selectedInterviewType === "Technical" || selectedInterviewType === "Technical & Behavioral") && selectedLanguages.length === 0) {
            alert('Please select at least one programming language.');
            return;
          }
          navigation.navigate('Interview', {
            devField: selectedDevField,
            difficulty: selectedDifficulty,
            interviewType: selectedInterviewType,
            languages: selectedLanguages,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  option: {
    padding: 15,
    borderRadius: 10,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});
