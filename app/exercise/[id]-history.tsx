import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { exercises } from '@/data/exercises';
import type { ExerciseHistoryEntry } from '@/models/exercise-history-entry';
import { loadData } from '@/services/storage-service';
import { HeaderTitle } from '@react-navigation/elements';

export default function ExercistHistoryScreen(){
  const { id } = useLocalSearchParams();

  const exercise = exercises.find((exercise) => exercise.id === id);

  const [history,setHistory] = useState<ExerciseHistoryEntry[]>([]);

  useEffect(() => {
    async function loadHistory() {
      const savedHistory = await loadData<ExerciseHistoryEntry[]>(`exercise-history:${id}`);
      if (savedHistory !== null) {
        setHistory(savedHistory);
      }
    }

    loadHistory();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {exercise?.name ?? 'Exercise'} History
        </Text>

        {history.map((entry) => {
          const workload = entry.sets.reduce((total,set) => {
            const weight = Number(set.weight) || 0;
            const reps = Number(set.reps) || 0;
            return total + weight * reps;
          },0);

          return (
            <View key={entry.id} style={styles.historyCard}>
              <Text style={styles.date}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>

              <Text style={styles.text}>
                Sets: {entry.sets.length}
              </Text>

              <Text style={styles.text}>
                Workload: {workload} kg
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },

  content: {
    paddingHorizontal:20,
    paddingBottom: 40,
  },

  title: {
    marginTop:10,
    marginBottom:20,
    fontSize:30,
    fontWeight:'bold',
    color:'darkgrey',
  },

  historyCard: {
    backgroundColor: '#1f1f1f',
    padding:16,
    borderRadius:10,
    marginBottom:12,
  },

  date: {
    color: 'darkgrey',
    fontSize:18,
    fontWeight:'bold',
    marginBottom:6,
  },

  text: {
    color: 'darkgrey',
    fontSize: 16,
  },
})