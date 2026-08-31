import { WorkoutSet } from "./set";

export type ExerciseHistoryEntry = {
  id: string;
  date: string;
  sets: WorkoutSet[];
}