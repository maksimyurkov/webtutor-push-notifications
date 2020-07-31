/**
 * Проверяет существует ли в каталоге объект с указанным кодом
 *
 * @param  {string} catalogName название каталога
 * @param  {string} code код объекта
 * @returns {boolean}
 */
function run(catalogName, code) {
  if (
    ArrayOptFirstElem(
      XQuery(
        'for $elem in ' +
          catalogName +
          ' where $elem/code="' +
          code +
          '" return $elem'
      )
    ) !== undefined
  ) {
    return true;
  }
  return false;
}
