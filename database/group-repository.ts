import type { SQLiteDatabase } from "expo-sqlite";
import type { ExerciseGroup } from "@/models/exercise-group";

export async function getAllGroups(db:SQLiteDatabase): Promise<ExerciseGroup[]> {
  return await db.getAllAsync<ExerciseGroup>(
    `
    SELECT id, name
    FROM exercise_groups
    ORDER BY name
    `
  );
}

export async function createGroup(db:SQLiteDatabase, id:string, name:string): Promise<void> {
  await db.runAsync(
    `
    INSERT INTO exercise_groups (id, name)
    VALUES (?,?)
    `,
    id,
    name
  );
}

export async function duplicateGroup(
  db:SQLiteDatabase, 
  sourceGroupId:string, 
  newGroupId:string, 
  newGroupName:string): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
      INSERT INTO exercise_groups (id, name)
      VALUES (?, ?)
      `,
      newGroupId,
      newGroupName
    );

    await db.runAsync(
      `
      INSERT INTO group_exercises (
        group_id,
        exercise_id,
        position
      )
      SELECT
        ?,
        exercise_id,
        position
      FROM group_exercises
      WHERE group_id = ?
      `,
      newGroupId,
      sourceGroupId
    );
  });
}

export async function renameGroup(db:SQLiteDatabase, groupId:string, name:string):Promise<void> {
  await db.runAsync(
    `
    UPDATE exercise_groups
    SET name = ?
    WHERE id = ?
    `,
    name,
    groupId
  );
}

export async function deleteGroup(db:SQLiteDatabase, groupId:string):Promise<void> {
  await db.runAsync(
    `
    DELETE FROM exercise_groups
    WHERE id = ?
    `,
    groupId
  );
}