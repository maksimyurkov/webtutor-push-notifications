/**
 * Добавляет/Обновляет данные девайса пользователя
 *
 * @param {Request} Request
 * @returns {object}
 */
function run(Request) {
  var functions = OpenCodeLib('../functions/import.js').run([
    'jsonParse',
    'uuid',
    'sqlDateTimeFormat',
  ]);

  var options = functions.jsonParse.run(Request.Body);
  var userId = Request.Session.Env.curUserID;
  var fullname = Request.Session.Env.curUser.fullname;
  var instanceId = options.instanceId;
  var oldInstanceId = options.oldInstanceId;
  var datetime = functions.sqlDateTimeFormat.run(Date());

  // В очереди уведомлений обновляем значение поля instanceId на новое
  if (oldInstanceId) {
    ArrayOptFirstElem(
      XQuery(
        "sql: UPDATE webtutor_push_notifications_queue\
      SET instanceId='" +
          instanceId +
          "', updated='" +
          datetime +
          "'\
      WHERE instanceId='" +
          oldInstanceId +
          "';"
      )
    );
  }

  // Удаляем строки с предыдущим и текущим значением instanceId и добавляем новую
  ArrayOptFirstElem(
    XQuery(
      "sql: \
DELETE FROM webtutor_push_notifications_instances WHERE instanceId IN ('" +
        instanceId +
        "','" +
        oldInstanceId +
        "');\
\
INSERT INTO webtutor_push_notifications_instances(id,created,instanceId,userId,fullname,browser,device,type,manufacturer,os)\
VALUES (\
'" +
        functions.uuid.run() +
        "',\
'" +
        datetime +
        "',\
'" +
        options.instanceId +
        "',\
" +
        userId +
        ",\
'" +
        fullname +
        "',\
'" +
        options.browser +
        "',\
'" +
        options.device +
        "',\
'" +
        options.type +
        "',\
'" +
        options.manufacturer +
        "',\
'" +
        options.os +
        "');"
    )
  );

  return {
    success: true,
  };
}
