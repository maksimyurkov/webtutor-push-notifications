/**
 * Преобразует Date() в строку формата datetime SQL
 *
 * @param {date} dateObj
 * @returns {string} SQL datetime string
 */
function run(dateObj) {
  return StrReplace(
    StrReplace(StrXmlDate(dateObj), 'T', ' '),
    '+00:00',
    '.000'
  );
}
