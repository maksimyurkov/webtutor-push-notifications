/**
 * Получает текущую конфигурацию webtutor-push-notifications и в случае отсутствия создает ее
 *
 * @returns {object}
 */
function run() {
  // Получаем данные из таблицы
  var config = ArrayOptFirstElem(
    XQuery('sql: SELECT * FROM webtutor_push_notifications_config')
  );
  if (config === undefined) {
    // Создаем таблицу если ее нет
    ArrayOptFirstElem(
      XQuery(
        'sql: \
      CREATE TABLE webtutor_push_notifications_config (\
        "apiKey" varchar(255),\
        "authDomain" varchar(255),\
        "databaseURL" varchar(255),\
        "projectId" varchar(255),\
        "storageBucket" varchar(255),\
        "messagingSenderId" varchar(255),\
        "appId" varchar(255),\
        "serverKey" varchar(255)\
    );'
      )
    );

    // Добавляем стандартную конфигурацию
    ArrayOptFirstElem(
      XQuery(
        "sql: \
        INSERT INTO webtutor_push_notifications_config(apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, serverKey)\
        VALUES ('', '', '', '', '', '', '', '');"
      )
    );
  }

  // Получаем данные из таблицы
  config = ArrayOptFirstElem(
    XQuery('sql: SELECT * FROM webtutor_push_notifications_config')
  );

  return {
    success: true,
    config: config,
  };
}
