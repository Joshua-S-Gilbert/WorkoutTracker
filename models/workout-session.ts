import { WorkoutSet } from "./set";

export type WorkoutDay = {
  id: string;
  date: string; // "2026-08-31"
}

export type ExerciseLog = {
  id: string;
  workoutDayId: string;
  exerciseId: string;
}

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