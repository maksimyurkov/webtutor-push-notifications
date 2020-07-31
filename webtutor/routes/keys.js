/**
 * Получает массив секретных ключей
 *
 * @returns {object}
 */
function run() {
  return {
    success: true,
    keys: XQuery('sql: SELECT * FROM webtutor_push_notifications_keys'),
  };
}
