/**
 * Получает текущую конфигурацию webtutor-push-notifications (без серверного ключа)
 *
 * @returns {object}
 */
function run() {
  var config = ArrayOptFirstElem(
    XQuery('sql: SELECT * FROM webtutor_push_notifications_config')
  );

  return {
    success: true,
    config: {
      apiKey: '' + config.apiKey,
      authDomain: '' + config.authDomain,
      databaseURL: '' + config.databaseURL,
      projectId: '' + config.projectId,
      storageBucket: '' + config.storageBucket,
      messagingSenderId: '' + config.messagingSenderId,
      appId: '' + config.appId,
    },
  };
}
