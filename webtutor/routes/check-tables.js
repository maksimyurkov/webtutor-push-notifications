/**
 * Проверяет наличие таблиц webtutor-push-notifications в SQL и в случае отсутствия создает их
 *
 * @returns {object}
 */
function run() {
  try {
    // instances
    ArrayOptFirstElem(
      XQuery(
        'sql:\
      CREATE TABLE webtutor_push_notifications_instances (\
      "id" varchar(36),\
      "created" datetime,\
      "instanceId" varchar(255),\
      "userId" bigint,\
      "fullname" varchar(150),\
      "browser" varchar(150),\
      "device" varchar(150),\
      "type" varchar(50),\
      "manufacturer" varchar(150),\
      "os" varchar(150)\
    );'
      )
    );
    // queue
    ArrayOptFirstElem(
      XQuery(
        'sql:\
      CREATE TABLE webtutor_push_notifications_queue (\
      "id" varchar(36),\
      "status" varchar(7),\
      "created" datetime,\
      "updated" datetime,\
      "instanceId" varchar(255),\
      "userId" bigint,\
      "name" varchar(255),\
      "fullname" varchar(150),\
      "browser" varchar(150),\
      "device" varchar(150),\
      "type" varchar(50),\
      "manufacturer" varchar(150),\
      "os" varchar(150),\
      "notification" varchar(3000)\
    );'
      )
    );
    // keys
    ArrayOptFirstElem(
      XQuery(
        'sql:\
      CREATE TABLE webtutor_push_notifications_keys (\
      "id" varchar(36),\
      "name" varchar(100),\
      "key" varchar(255),\
    );'
      )
    );

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Таблицы',
    };
  }
}
