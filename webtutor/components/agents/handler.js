/**
 * Обрабатывает очередь и отправляет уведомления через Firebase Cloud Messaging HTTP protocol
 *
 * @returns {boolean}
 */
function run() {
  try {
    var functions = OpenCodeLib('../../functions/import.js').run([
      'jsonParse',
      'sqlDateTimeFormat',
    ]);

    var queue = XQuery(
      "sql: SELECT * FROM webtutor_push_notifications_queue WHERE status = 'waiting';"
    );
    var serverKey = ArrayOptFirstElem(
      XQuery('sql: SELECT * FROM webtutor_push_notifications_config')
    ).serverKey;

    var message;
    var status;
    var response;
    var statusCode;
    var responseBody;
    var currentDate = functions.sqlDateTimeFormat.run(Date());
    for (message in queue) {
      try {
        // Проверяем, что сообщение еще существует и не отправлено
        message = ArrayOptFirstElem(
          XQuery(
            "sql: SELECT * FROM webtutor_push_notifications_queue WHERE id = '" +
              message.id +
              "' AND status = 'waiting';"
          )
        );
        if (message === undefined)
          throw Error('Сообщение отправлено или удалено');
        response = HttpRequest(
          'https://fcm.googleapis.com//fcm/send',
          'post',
          UrlDecode(message.notification),
          'Content-Type: application/json\nAuthorization: key=' +
            serverKey +
            '\nIgnore-Errors: 1\n'
        );
        statusCode = response.RespCode;
        if (statusCode === 401)
          alert(
            'webtutor-push-notifications: Неверный серверный ключ Firebase'
          );
        if (statusCode === 200 || statusCode === 400) {
          if (statusCode === 200) {
            responseBody = functions.jsonParse.run(response.Body);
            responseBody.success === 1
              ? (status = 'success')
              : (status = 'error');
          }
          // Если при парсинге JSON возникла ошибка
          if (statusCode === 400) status = 'error';
          // Обновляем статус
          ArrayOptFirstElem(
            XQuery(
              "sql: UPDATE webtutor_push_notifications_queue SET status = '" +
                status +
                "', updated = '" +
                currentDate +
                "' WHERE id = '" +
                message.id +
                "';"
            )
          );
        }
      } catch (error) {}
    }
    return true;
  } catch (error) {
    alert('webtutor-push-notifications-handler Error: ' + error.message);
    return false;
  }
}
