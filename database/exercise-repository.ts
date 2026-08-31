import type { SQLiteDatabase } from "expo-sqlite";
import type { Exercise } from "@/models/exercise";

export type ExerciseRow = {
  id: string;
  name: string;
  aliases: string;
  muscle_groups: string | null;
  equipment: string | null;
};

function exerciseRowToExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    aliases: JSON.parse(row.aliases),
    muscleGroups: row.muscle_groups ? JSON.parse(row.muscle_groups) : undefined,
    equipment: row.equipment ? JSON.parse(row.equipment) : undefined,
  };
}

export async function getExercisesForGroup(
  db: SQLiteDatabase,
  groupId:string
): Promise<Exercise[]> {
  const rows = await db.getAllAsync<ExerciseRow>(
    `
    SELECT
      exercises.id,
      exercises.name,
      exercises.aliases,
      exercises.muscle_groups,
      exercises.equipment
    FROM exercises
    JOIN group_exercises
      ON group_exercises.exercise_id = exercises.id
    WHERE group_exercises.group_id = ?
    ORDER BY group_exercises.position
    `,
    groupId
  );
  return rows.map(exerciseRowToExercise);
}

export async function getAllExercises(db:SQLiteDatabase): Promise<Exercise[]> {
  const rows = await db.getAllAsync<ExerciseRow>(
    `
    SELECT
      id,
      name,
      aliases,
      muscle_groups,
      equipment
    FROM exercises
    ORDER BY name
    `
  );
  return rows.map(exerciseRowToExercise);
}