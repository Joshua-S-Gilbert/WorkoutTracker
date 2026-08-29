import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { exercises } from '@/data/exercises';
import type { WorkoutSet } from '@/models/set';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loadData, saveData } from '@/services/storage-service';

const initialSets: WorkoutSet[] = [
  {
    id: '1',
    weight:'20',
    reps:'10',
  },
  {
    id: '2',
    weight:'20',
    reps:'10',
  },
  {
    id: '3',
    weight:'20',
    reps:'10',
  },
]


export default function ExerciseScreen() {
  const { id } = useLocalSearchParams();
  const exercise = exercises.find((exercise) => exercise.id === id);
  const [sets, setSets] = useState<WorkoutSet[]>(initialSets);
  const totalworkload = sets.reduce((total, set) => {
    const weight = Number(set.weight) || 0;
    const reps = Number(set.reps) || 0;
    return total + weight * reps;
  }, 0)
  const [hasLoaded, setHasLoaded] = useState(false);

  const storageKey = `sets:${id}`;
  useEffect(() => {
    async function loadSets() {
      const savedSets = await loadData<WorkoutSet[]>(storageKey);
      if (savedSets !== null) {
        setSets(savedSets);
      }
      setHasLoaded(true);
    }
    loadSets();
  }, [storageKey]);

  useEffect(() => {
    if (!hasLoaded){
      return;
    }
    async function saveSets() {
      await saveData(storageKey,sets);
    }

    saveSets();
  }, [sets,storageKey,hasLoaded]);

  async function saveWorkout() {
    const storageKey = `exercise-history:${id}`
  }

  function addSet() {
    const previousSet = sets[sets.length -1];
    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      weight: previousSet?.weight ?? '0',
      reps: previousSet?.reps ?? '0',
    };
    
    setSets([...sets, newSet]);
  }

  function updateSet(id: string, field: 'weight' | 'reps', value:string) {
    setSets(
      sets.map((set) =>
        set.id === id ? {
          ...set,
          [field]: value,
        } : set
      )
    );
  }

  function deleteSet(id:string){
    setSets(sets.filter((set) => set.id !== id));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{exercise?.name ?? 'Exercise Not Found'}</Text>
        <Text style={styles.workload}>Total Workload: {totalworkload}</Text>
        {sets.map((set, index) => (
          <View key={set.id} style={styles.setRow}>
            <Text style={styles.text}>set {index+1}</Text>

            <TextInput style={styles.input}
            value={set.weight}
            onFocus={() => updateSet(set.id, 'weight', '')}
            onChangeText={(value) => updateSet(set.id, 'weight', value)}
            keyboardType="decimal-pad"/>
            
            <TextInput style={styles.input}
            value={set.reps}
            onFocus={() => updateSet(set.id, 'reps', '')}
            onChangeText={(value) => updateSet(set.id, 'reps', value)}
            keyboardType="decimal-pad"/>

            <Text style={styles.text}>{set.weight} kg</Text>
            <Text style={styles.text}>{set.reps} reps</Text>
            <Pressable onPress={() => deleteSet(set.id)}>
              <Text style={styles.deleteText}>x</Text>
            </Pressable>
          </View>
        ))}
        <Pressable style={styles.addButton} onPress={addSet}>
          <Text style={styles.addButtonText}>+ Add Set</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  title: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'darkgrey',
  },

  text: {
    color: 'darkgrey',
    fontSize: 18,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },

  addButton: {
    marginTop: 20,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
  },

  addButtonText: {
    color: 'darkgrey',
    fontSize: 18,
    fontWeight: 'bold',
  },

  input: {
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 10,

    color: 'darkgrey',
    backgroundColor: '#1f1f1f',

    borderRadius: 8,
    fontSize: 18,
    textAlign: 'center',
  },

  deleteText: {
    color: 'darkgrey',
    fontSize: 24,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  workload: {
    color: 'darkgrey',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 12,
  },
});