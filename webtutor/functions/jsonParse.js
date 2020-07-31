/**
 * Преобразует строку JSON в объект
 *
 * @param {string} json
 * @returns {object}
 */
function run(json) {
  return tools.read_object(json, 'json');
}
