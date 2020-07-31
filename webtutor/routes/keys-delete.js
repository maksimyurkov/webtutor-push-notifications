/**
 * Удаляет секретный ключ
 *
 * @param {Request} Request
 * @returns {object}
 */
function run(Request) {
  var functions = OpenCodeLib('../functions/import.js').run([
    'jsonParse',
    'uuid',
  ]);

  var id = functions.jsonParse.run(Request.Body).id;

  ArrayOptFirstElem(
    XQuery(
      "sql: DELETE FROM webtutor_push_notifications_keys WHERE id='" + id + "'"
    )
  );

  return {
    success: true,
  };
}
