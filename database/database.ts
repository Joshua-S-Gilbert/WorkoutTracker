import { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      aliases TEXT NOT NULL DEFAULT '[]',
      muscle_groups TEXT,
      equipment TEXT
    );

    CREATE TABLE IF NOT EXISTS exercise_groups (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS group_exercises (
      group_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      position INTEGER NOT NULL,

      PRIMARY KEY (group_id, exercise_id),

      FOREIGN KEY (group_id)
        REFERENCES exercise_groups(id)
        ON DELETE CASCADE,

      FOREIGN KEY (exercise_id)
        REFERENCES exercises(id)
        ON DELETE CASCADE
    );
  `);

  try {
    await db.execAsync(`
      ALTER TABLE exercises
      ADD COLUMN aliases TEXT NOT NULL DEFAULT '[]';
    `);
  } catch {}

  try {
    await db.execAsync(`
      ALTER TABLE exercises
      ADD COLUMN muscle_groups TEXT;
    `);
  } catch {}

  try {
    await db.execAsync(`
      ALTER TABLE exercises
      ADD COLUMN equipment TEXT;
    `);
  } catch {}

  await db.runAsync(
    `INSERT OR IGNORE INTO exercise_groups (id, name) VALUES (?,?)`,
    'chest',
    'Chest'
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO exercises (id,name) VALUES (?,?)`,
    'bench-press',
    'Bench Press'
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO group_exercises (group_id, exercise_id, position) VALUES (?,?,?)`,
    'chest',
    'bench-press',
    0
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO exercises (id, name) VALUES (?, ?)`,
    'incline-dumbbell-press',
    'Incline Dumbbell Press'
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO exercises (id, name) VALUES (?, ?)`,
    'cable-fly',
    'Cable Fly'
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO group_exercises (group_id, exercise_id, position)
    VALUES (?, ?, ?)`,
    'chest',
    'incline-dumbbell-press',
    1
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO group_exercises (group_id, exercise_id, position)
    VALUES (?, ?, ?)`,
    'chest',
    'cable-fly',
    2
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO exercise_groups (id, name) VALUES (?,?)`,
    'legs',
    'Legs'
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO exercises (id,name) VALUES (?,?)`,
    'squat-rack',
    'Squat Rack'
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO group_exercises (group_id, exercise_id, position) VALUES (?,?,?)`,
    'legs',
    'squat-rack',
    0
  );
}