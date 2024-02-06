import { LocalStorageKeys } from './constants';

export const updateLocalStorageItem = (
  key: LocalStorageKeys,
  value: string,
) => {
  localStorage.setItem(key, value);
};

export const removeLocalStorageItem = (key: LocalStorageKeys) => {
  localStorage.removeItem(key);
};

export const createLocalStorageItem = (
  key: LocalStorageKeys,
  value: string,
) => {
  localStorage.setItem(key, value);
};

export const getLocalStorageItem = (key: LocalStorageKeys) => {
  return localStorage.getItem(key);
};

export const setLocalStorageItem = (key: LocalStorageKeys, value: string) => {
  updateLocalStorageItem(key, value);
};
