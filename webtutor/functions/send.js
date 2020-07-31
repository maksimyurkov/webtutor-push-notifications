/**
 * Добавляет переданные уведомления в очередь.
 *
 * @param {array} messages Массив уведомлений
 * @returns {object}
 */
function run(messages) {
  try {
    var functions = OpenCodeLib('import.js').run([
      'jsonStringify',
      'uuid',
      'sqlDateTimeFormat',
    ]);

    var message;
    var messageType;
    var datetime;
    var notification;
    var instancesIds;
    var usersIds;
    var instances;
    var sqlQuery;
    for (message in messages) {
      try {
        datetime = functions.sqlDateTimeFormat.run(Date());
        notification = message.notification;
        // Добавляем название уведомления если отсутствует
        if (!message.HasProperty('name')) message.SetProperty('name', '');
        // Добавляем свойство "to" в сообщение если отсутствует
        if (!notification.HasProperty('to')) notification.SetProperty('to', '');
        // Определяем тип уведомления
        messageType = message.HasProperty('instances') ? 'instances' : 'users';
        if (messageType === 'instances') {
          instancesIds = message.instances;
          // Получаем данные устройств
          instances = XQuery(
            "sql:SELECT * FROM webtutor_push_notifications_instances WHERE instanceId in ('" +
              instancesIds.join("','") +
              "');"
          );
        }
        if (messageType === 'users') {
          usersIds = message.users;
          // Получаем данные всех устройств пользователей
          instances = XQuery(
            'sql:SELECT * FROM webtutor_push_notifications_instances WHERE userId in (' +
              StrReplace(usersIds.join(','), '"', '') +
              ');'
          );
        }

        // Формируем строку для осуществления одного SQL запроса добавляющего все уведомления в очередь
        sqlQuery = 'sql: ';
        for (instance in instances) {
          notification.to = '' + instance.instanceId;
          sqlQuery +=
            '\
            INSERT INTO webtutor_push_notifications_queue ("id","status","created","updated","instanceId","userId","name","fullname","browser","device","type","manufacturer","os","notification")\
            VALUES (\
            \'' +
            functions.uuid.run() +
            "',\
            'waiting',\
            '" +
            datetime +
            "',\
            '" +
            datetime +
            "',\
            '" +
            instance.instanceId +
            "',\
            " +
            instance.userId +
            ",\
            '" +
            message.name +
            "',\
            '" +
            instance.fullname +
            "',\
            '" +
            instance.browser +
            "',\
            '" +
            instance.device +
            "',\
            '" +
            instance.type +
            "',\
            '" +
            instance.manufacturer +
            "',\
            '" +
            instance.os +
            "',\
            '" +
            UrlEncode(functions.jsonStringify.run(notification)) +
            "'\
            );";
        }
        ArrayOptFirstElem(XQuery(sqlQuery));
      } catch (error) {
        alert(
          'webtuto-push-notifications:send:notification-name:' + error.message
        );
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}
