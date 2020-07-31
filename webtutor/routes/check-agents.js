/**
 * Проверяет наличие агентов webtutor-push-notifications и в случае отсутствия создает их
 *
 * @returns {object}
 */
function run() {
  try {
    var functions = OpenCodeLib('../functions/import.js').run([
      'checkObjectExistsByCode',
      'createNewDoc',
    ]);
    var handlerCode = 'webtutor-push-notifications-handler';
    var cleanerCode = 'webtutor-push-notifications-cleaner';

    var handlerExists = functions.checkObjectExistsByCode.run(
      'server_agents',
      handlerCode
    );
    var cleanerExists = functions.checkObjectExistsByCode.run(
      'server_agents',
      cleanerCode
    );

    if (!handlerExists) {
      functions.createNewDoc.run('server_agent', {
        code: handlerCode,
        name: 'Обработка очереди webtutor-push-notifications',
        trigger_type: 'period',
        period: 5,
        start_time: '00:00',
        finish_time: '24:00',
        all_day: true,
        start_day: 1,
        start_week_day: 1,
        type: 'code',
        run_code:
          "OpenCodeLib('x-local://wt/web/node_modules/@maksimyurkov/webtutor-push-notifications/webtutor/components/agents/handler.js?'+ Random(1, 1000000)).run();",
        is_std: false,
        comment:
          'Агент каждые 5 минут отправляет push-уведомления находящиеся в таблице webtutor_push_notifications_queue.',
      });
    }

    if (!cleanerExists) {
      functions.createNewDoc.run('server_agent', {
        code: cleanerCode,
        name: 'Очистка таблиц webtutor-push-notifications',
        trigger_type: 'daily',
        period: 1,
        start_time: '20:00',
        finish_time: '24:00',
        all_day: true,
        start_day: 1,
        start_week_day: 1,
        type: 'code',
        run_code:
          "OpenCodeLib('x-local://wt/web/node_modules/@maksimyurkov/webtutor-push-notifications/webtutor/components/agents/cleaner.js?'+ Random(1, 1000000)).run();",
        is_std: false,
        comment:
          'Агент ежедневно удаляет устройства и уведомления уволенных сотрудников из таблицы webtutor_push_notifications_instances, удаляет отправленные уведомления которым более 7 дней из таблицы webtutor_push_notifications_queue.',
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Агент',
    };
  }
}
