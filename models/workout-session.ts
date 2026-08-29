import { WorkoutSet } from "./set";

export type WorkoutSession = {
  id: string;
  date: string;
  exercises: ExerciseEntry[];
}

export type ExerciseEntry = {
  id: string;
  date: string;
  exercises: WorkoutSet[];
}