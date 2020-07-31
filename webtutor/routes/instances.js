/**
 * Получает массив с данными всех девайсов пользователей
 *
 * @returns {object}
 */
function run() {
  return {
    success: true,
    instances: XQuery(
      'sql: SELECT * FROM webtutor_push_notifications_instances'
    ),
  };
}
