import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveData<T>(key: string, data: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function loadData<T>(key: string): Promise<T | null> {
  const data = await AsyncStorage.getItem(key);

  if (data === null) {
    return null;
  }

  return JSON.parse(data) as T;
}