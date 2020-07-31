/**
 * Удаляет агенты webtutor-push-notifications
 *
 * @returns {object}
 */
function run() {
  try {
    var handlerCode = 'webtutor-push-notifications-handler';
    var cleanerCode = 'webtutor-push-notifications-cleaner';

    var handler = ArrayOptFirstElem(
      XQuery(
        'for $elem in server_agents where $elem/code="' +
          handlerCode +
          '" return $elem/id'
      )
    );
    if (handler !== undefined) DeleteDoc(UrlFromDocID(Int(handler.id)));

    var cleaner = ArrayOptFirstElem(
      XQuery(
        'for $elem in server_agents where $elem/code="' +
          cleanerCode +
          '" return $elem/id'
      )
    );
    if (cleaner !== undefined) DeleteDoc(UrlFromDocID(Int(cleaner.id)));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
