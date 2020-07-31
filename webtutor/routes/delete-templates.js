/**
 * Удаляет шаблоны webtutor-push-notifications
 *
 * @returns {object}
 */
function run() {
  try {
    var code = 'webtutor-push-notifications-init';

    var customWebTemplate = ArrayOptFirstElem(
      XQuery(
        'for $elem in custom_web_templates where $elem/code="' +
          code +
          '" return $elem/id'
      )
    );
    if (customWebTemplate !== undefined)
      DeleteDoc(UrlFromDocID(Int(customWebTemplate.id)));

    var overrideWebTemplate = ArrayOptFirstElem(
      XQuery(
        'for $elem in override_web_templates where $elem/code="' +
          code +
          '" return $elem/id'
      )
    );
    if (overrideWebTemplate !== undefined)
      DeleteDoc(UrlFromDocID(Int(overrideWebTemplate.id)));

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
