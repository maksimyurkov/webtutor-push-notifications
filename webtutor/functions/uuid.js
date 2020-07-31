/**
 * Формирует строку стандарта UUID
 *
 * @returns {string} UUID
 */
function run() {
  var TypeLib = new ActiveXObject('Scriptlet.TypeLib');
  return TypeLib.Guid.substr(1, 36);
}
