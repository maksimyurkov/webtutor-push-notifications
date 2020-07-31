/**
 * Определяет тип JavaScript объекта
 *
 * @param obj какой-то объект JavaScript
 * @returns {string} строка с типом объекта или строка undefined (тип не удалось определить)
 */
function run(obj) {
  function isObject(obj) {
    try {
      obj.HasProperty();
    } catch (err) {
      if (StrContains(err.message, 'Wrong number of arguments', true))
        return true;
    }
  }

  function isArray(obj) {
    try {
      obj.splice();
    } catch (err) {
      if (StrContains(err.message, 'Wrong number of arguments', true))
        return true;
    }
  }

  function isString(obj) {
    try {
      obj.substr();
    } catch (err) {
      if (StrContains(err.message, 'Wrong number of arguments', true))
        return true;
    }
  }

  function isInteger(obj) {
    try {
      Int(obj);
      return true;
    } catch (err) {
      return false;
    }
  }

  function isBoolean(obj) {
    try {
      if (obj === true || obj === false) return true;
    } catch (err) {
      return false;
    }
  }

  if (isObject(obj)) return 'object';
  if (isArray(obj)) return 'array';
  if (isString(obj)) return 'string';
  if (isInteger(obj)) return 'integer';
  if (isBoolean(obj)) return 'boolean';
  return 'undefined';
}
