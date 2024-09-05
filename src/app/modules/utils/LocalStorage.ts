export const localStorageItem = (() => {
  const get = (key: string | undefined) => {
    const item = key ? localStorage.getItem(key) : null;
    return item ? JSON.parse(item) : null;
  };

  const set = (key: string | undefined, value: any): void => {
    if (key) {
      const jsonData = JSON.stringify(value)
      localStorage.setItem(key, jsonData);
    }
  };

  const remove = (key: string | undefined): void => {
    key && localStorage.removeItem(key);
  };

  return { get, set, remove }
})();