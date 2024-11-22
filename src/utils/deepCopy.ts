function deepClone<T>(obj: T): T | null {
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj) as any;
  if (obj instanceof RegExp) return new RegExp(obj) as any;
  let newObj = Object.create(Object.getPrototypeOf(obj));
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let val = obj[key];
      newObj[key] = typeof val === 'object' ? deepClone(val) : val;
    }
  }
  return newObj;
}

export default deepClone;
