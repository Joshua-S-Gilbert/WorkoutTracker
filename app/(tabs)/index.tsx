import { Pressable, StyleSheet, Text, View, Modal, TextInput } from 'react-native';
import ExerciseCard from '@/components/exercise-card';
import type { Exercise } from '@/models/exercise';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { getExercisesForGroup } from '@/database/exercise-repository';
import type { ExerciseGroup } from '@/models/exercise-group';
import { getAllGroups, createGroup, duplicateGroup, renameGroup, deleteGroup } from '@/database/group-repository';



export default function HomeScreen() {
  const db = useSQLiteContext();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [groups, setGroups] = useState<ExerciseGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupAction, setGroupAction] = useState<'create' | 'duplicate' | 'rename'>('create');

  function openCreateGroup(){
    setGroupAction('create');
    setGroupName('');
    setModalVisible(true);
  }

  function openDuplicateGroup(){
    const selectedGroup = groups.find(
      (group) => group.id === selectedGroupId
    );

    if (!selectedGroup){
      return;
    }

    setGroupAction('duplicate');
    setGroupName(`${selectedGroup.name} Copy`);
    setModalVisible(true);
  }

  function openRenameGroup(){
    const selectedGroup = groups.find(
    (group) => group.id === selectedGroupId
    );
    if (!selectedGroup){
      return;
    }
    setGroupAction('rename');
    setGroupName(selectedGroup.name);
    setModalVisible(true);
  }

  async function handleDeleteGroup() {
    if (selectedGroupId === null){
      return;
    }
    await deleteGroup(db, selectedGroupId);
    const data = await getAllGroups(db);
    setGroups(data);
    if (data.length > 0){
      setSelectedGroupId(data[0].id);
    } else {
      setSelectedGroupId(null);
      setExercises([]);
    }
  }

  async function handleGroupSubmit() {
    const trimmedName = groupName.trim();
    if (trimmedName.length === 0){
      return;
    }
    if (groupAction === 'create'){
      const id = Date.now().toString();
      await createGroup(db,id,trimmedName);
      await refreshGroups();
      setSelectedGroupId(id);
    }
    if (groupAction === 'duplicate'){
      if (selectedGroupId === null){
        return;
      }
      const id = Date.now().toString();
      await duplicateGroup(
        db,
        selectedGroupId,
        id,
        trimmedName
      );
      await refreshGroups();
      setSelectedGroupId(id);
    }
    if (groupAction === 'rename'){
      if (selectedGroupId === null){
        return;
      }
      await renameGroup(
        db,
        selectedGroupId,
        trimmedName
      );
      await refreshGroups();
    }
    setModalVisible(false);
  }

  async function refreshGroups(){
    const data = await getAllGroups(db);
    setGroups(data);
    if (selectedGroupId === null && data.length > 0){
      setSelectedGroupId(data[0].id);
    }
  }

  useEffect(() => {
    async function loadExercises() {
      if (selectedGroupId === null){
        return;
      }

      const data = await getExercisesForGroup(db, selectedGroupId);
      setExercises(data);
    }

    loadExercises();
  }, [db, selectedGroupId]);

  useEffect(() => {
    refreshGroups();
  }, [db]);

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Workout Tracker</Text>
        <View style={styles.groupRow}>
          {groups.map((group) => (
            <Pressable 
              key={group.id} 
              onPress={() => setSelectedGroupId(group.id)}
              style={styles.groupButton}
            >
              <Text style={styles.text}>{group.name}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.groupActions}>
          <Pressable
            style={styles.groupActionButton}
            onPress={openCreateGroup}
          >
            <Text style={styles.text}>Create</Text>
          </Pressable>

          <Pressable
            style={styles.groupActionButton}
            onPress={openDuplicateGroup}
          >
            <Text style={styles.text}>Duplicate</Text>
          </Pressable>
          <Pressable
            style={styles.groupActionButton}
            onPress={openRenameGroup}
          >
            <Text style={styles.text}>Rename</Text>
          </Pressable>
          <Pressable
            style={styles.groupActionButton}
            onPress={handleDeleteGroup}
          >
            <Text style={styles.text}>Delete</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionTitle}>
          {groups.find((group) => group.id === selectedGroupId)?.name ?? ''}
        </Text>
        {exercises.map((exercise) => (
          <ExerciseCard 
            key={exercise.id}
            name={exercise.name}
            onPress={() => console.log(exercise.name)}
            />
        ))}
        <Modal
          visible={modalVisible}
          transparent
          animationType='fade'
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {groupAction === 'create' && 'Create Group'}
                {groupAction === 'duplicate' && 'Duplicate Group'}
                {groupAction === 'rename' && 'Rename Group'}
              </Text>
              <TextInput
                style={styles.modalInput}
                value={groupName}
                onChangeText={setGroupName}
                placeholder='Group Name'
                placeholderTextColor="#777"
                autoFocus
              />

              <View style={styles.modalActions}>
                <Pressable
                  style={styles.groupActionButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.text}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={styles.groupActionButton}
                  onPress={handleGroupSubmit}
                >
                  <Text style={styles.text}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
  },

  groupRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  groupButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
  },

  groupActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  groupActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  modalCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    color: 'darkgrey',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  modalInput: {
    color: 'darkgrey',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
});