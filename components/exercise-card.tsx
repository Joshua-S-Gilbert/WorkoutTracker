import { Text,Pressable,StyleSheet } from 'react-native';

type ExerciseProps = {
  name: string;
  onPress: () => void;
};

export default function ExerciseCard({ name, onPress }: ExerciseProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      >
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.chevron}>{'>'}</Text>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',

    paddingVertical: 16,
    paddingHorizontal:16,
    marginBottom:10,

    backgroundColor:'#1f1f1f',
    borderRadius:10,
  },

  name: {
    color: 'darkgrey',
    fontSize: 18,
  },

  chevron: {
    color:'darkgrey',
    fontSize:24,
  },

  pressed:{
    opacity:0.6,
  },
})