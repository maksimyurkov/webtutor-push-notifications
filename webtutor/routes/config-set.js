/**
 * Задает конфигурацию webtutor-push-notifications
 *
 * @param {Request} Request
 * @returns {object}
 */
function run(Request) {
  var functions = OpenCodeLib('../functions/import.js').run(['jsonParse']);

  var options = functions.jsonParse.run(Request.Body);

  ArrayOptFirstElem(
    XQuery(
      "sql: \
    UPDATE webtutor_push_notifications_config\
    SET apiKey='" +
        options.apiKey +
        "',authDomain='" +
        options.authDomain +
        "',databaseURL='" +
        options.databaseURL +
        "',projectId='" +
        options.projectId +
        "',storageBucket='" +
        options.storageBucket +
        "',messagingSenderId='" +
        options.messagingSenderId +
        "',appId='" +
        options.appId +
        "',serverKey='" +
        options.serverKey +
        "'"
    )
  );
  return {
    success: true,
  };
}
