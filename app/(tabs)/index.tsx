import { StyleSheet, Text, View } from 'react-native';
import ExerciseCard from '@/components/exercise-card';
import type { Exercise } from '@/models/exercise';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { exercises } from '@/data/exercises';

export default function HomeScreen() {

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Workout Tracker</Text>
        <Text style={styles.sectionTitle}>Chest</Text>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            name={exercise.name}
            onPress={() => 
              router.push({
                pathname: `/exercise/[id]`,
                params: {id: exercise.id},
              })
            }
          />
        ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  title: {
    marginTop:10,
    marginBottom:12,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'darkgrey'
  },

  sectionTitle:  {
    color: 'darkgrey',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },

  text: {
    color:'darkgrey'
  }
});