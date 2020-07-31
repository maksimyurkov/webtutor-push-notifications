/**
 * Удаляет таблицы webtutor-push-notifications
 *
 * @returns {object}
 */
function run() {
  try {
    ArrayOptFirstElem(
      XQuery(
        'sql:\
DROP TABLE webtutor_push_notifications_config;\
DROP TABLE webtutor_push_notifications_instances;\
DROP TABLE webtutor_push_notifications_queue;\
DROP TABLE webtutor_push_notifications_keys;'
      )
    );

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
