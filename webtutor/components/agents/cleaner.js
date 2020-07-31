/**
 * Подчищает используемые webtutor-push-notifications таблицы в MS SQL
 *
 * @returns {boolean}
 */
function run() {
  try {
    var dismissEmployees = XQuery(
      'for $elem in collaborators where $elem/is_dismiss=1 return $elem/id'
    );
    if (ArrayOptFirstElem(dismissEmployees) !== undefined) {
      var joinedEmployeesIds = ArrayExtractKeys(dismissEmployees, 'id').join(
        ','
      );
      // Удаляем устройства уволенных пользователей
      ArrayOptFirstElem(
        XQuery(
          'sql: DELETE FROM webtutor_push_notifications_instances WHERE userId IN (' +
            joinedEmployeesIds +
            ');'
        )
      );
      // Удаляем уведомления уволенных пользователей
      ArrayOptFirstElem(
        XQuery(
          'sql: DELETE FROM webtutor_push_notifications_queue WHERE userId IN (' +
            joinedEmployeesIds +
            ');'
        )
      );
    }
    // Удаляем уведомления которые старше 7 дней
    ArrayOptFirstElem(
      XQuery(
        'sql: DELETE FROM webtutor_push_notifications_queue WHERE created < DATEADD(day, -7, GETDATE());'
      )
    );
    return true;
  } catch (error) {
    alert('webtutor-push-notifications-cleaner Error: ' + error.message);
    return false;
  }
}
