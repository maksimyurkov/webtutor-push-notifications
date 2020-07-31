/**
 * Добавляет уведомление в очередь
 *
 * @param {Request} Request
 * @returns {object}
 */
function run(Request) {
  var functions = OpenCodeLib('../functions/import.js').run(['jsonParse']);

  var options = functions.jsonParse.run(Request.Body);
  var userId = Request.Session.Env.curUserID;
  // Проверяем что переданный instanceId отсутствует в базе
  var instanceIdExists = ArrayOptFirstElem(
    XQuery(
      "sql: SELECT * FROM webtutor_push_notifications_instances WHERE instanceId = '" +
        options.instanceId +
        "'"
    )
  );

  if (instanceIdExists === undefined) {
    ArrayOptFirstElem(
      XQuery(
        "sql: \
INSERT INTO webtutor_push_notifications_instances(created,instanceId,userId,browser,device,type,manufacturer,os)\
VALUES ('" +
          Date() +
          "',\
'" +
          options.instanceId +
          "',\
'" +
          userId +
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
          "')"
      )
    );
  }

  return {
    success: true,
  };
}
