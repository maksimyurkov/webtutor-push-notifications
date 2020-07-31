/**
 * Загружает функции указанные в параметре и размещает их в обычном объекте
 *
 * @param  {array} functionNames названия функций
 * @param  {boolean} noCache не использовать кэш
 * @returns {object} объект с функциями
 */
function run(functionNames, noCache) {
  // Если devMode = false - то файлы подгружаются из кэша WebTutor
  var devMode = true;
  var cacheDisabler = '';
  if (devMode || noCache) cacheDisabler = '?' + Random(1, 1000000);
  var functions = {};
  var name;
  for (name in functionNames) {
    functions[name] = OpenCodeLib(name + '.js' + cacheDisabler);
  }
  return functions;
}
