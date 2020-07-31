/**
 * Добавляет секретный ключ
 *
 * @param {Request} Request
 * @returns {object}
 */
function run(Request) {
  var functions = OpenCodeLib('../functions/import.js').run([
    'jsonParse',
    'uuid',
  ]);

  var name = functions.jsonParse.run(Request.Body).name;
  var key =
    '' +
    functions.uuid.run() +
    functions.uuid.run() +
    functions.uuid.run() +
    functions.uuid.run();

  ArrayOptFirstElem(
    XQuery(
      'sql: \
INSERT INTO webtutor_push_notifications_keys(id,name,"key")\
VALUES (\
\'' +
        functions.uuid.run() +
        "',\
'" +
        name +
        "',\
'" +
        key +
        "');"
    )
  );

  return {
    success: true,
  };
}
