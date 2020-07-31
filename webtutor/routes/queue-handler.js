/**
 * Запускает агент обрабатывающий очередь уведомлений
 *
 * @returns {object}
 */
function run() {
  var agent = ArrayOptFirstElem(
    XQuery(
      'for $elem in server_agents where $elem/code="webtutor-push-notifications-handler" return $elem'
    )
  );
  if (agent !== undefined) {
    tools.start_agent(agent.id);
    return {
      success: true,
    };
  } else {
    return {
      success: false,
      message: 'Агент не найден',
    };
  }
}
