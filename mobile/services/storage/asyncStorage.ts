import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`[AsyncStorage] Failed to read key: ${key}`, error);
    return defaultValue;
  }
}

export async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    const serialized = JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`[AsyncStorage] Failed to set key: ${key}`, error);
    return false;
  }
}

export async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[AsyncStorage] Failed to remove key: ${key}`, error);
    return false;
  }
}

export async function clearAll(): Promise<boolean> {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('[AsyncStorage] Failed to clear storage', error);
    return false;
  }
}
