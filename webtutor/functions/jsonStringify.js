/**
 * Преобразует объект в строку формата JSON
 *
 * @param {object} obj
 * @returns {string}
 */
function run(obj) {
  // Загружаем необходимые функции
  var functions = OpenCodeLib('import.js').run(['typeOf']);
  var type = functions.typeOf.run(obj);
  if (type === 'array') return tools.array_to_text(obj, 'json');
  return tools.object_to_text(obj, 'json');
}
