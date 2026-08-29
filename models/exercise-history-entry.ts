import { WorkoutSet } from "./set";

export type ExerciseHistoryEntry = {
  id: string;
  date: string;
  exercises: WorkoutSet[];
}