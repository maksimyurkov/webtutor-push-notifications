/**
 * Получает очередь уведомлений
 *
 * @returns {object}
 */
function run() {
  return {
    success: true,
    queue: XQuery(
      'sql: SELECT * FROM webtutor_push_notifications_queue ORDER BY created DESC'
    ),
  };
}
