/**
 * Проверяет наличие шаблонов webtutor-push-notifications и в случае отсутствия создает их
 *
 * @returns {object}
 */
function run() {
  try {
    var functions = OpenCodeLib('../functions/import.js').run([
      'checkObjectExistsByCode',
      'createNewDoc',
    ]);

    var code = 'webtutor-push-notifications-init';

    var customWebTemplateExists = functions.checkObjectExistsByCode.run(
      'custom_web_templates',
      code
    );
    if (!customWebTemplateExists) {
      functions.createNewDoc.run('custom_web_template', {
        code: code,
        name: 'Инициализация webtutor-push-notifications',
        url:
          '/node_modules/@maksimyurkov/webtutor-push-notifications/webtutor/components/templates/init/init.html',
      });
    }

    // Проверяем существование объекта в "Элементы шаблонов" и создаем в случае отсутствия
    var overrideWebTemplateExists = functions.checkObjectExistsByCode.run(
      'override_web_templates',
      code
    );
    if (!overrideWebTemplateExists) {
      var customWebTemplate = ArrayOptFirstElem(
        XQuery(
          'for $elem in custom_web_templates where $elem/code="' +
            code +
            '" return $elem'
        )
      );
      functions.createNewDoc.run('override_web_template', {
        code: code,
        mode_exception: 'default',
        zone: 'main',
        weight: 100,
        custom_web_template_id: customWebTemplate.id,
        custom_web_template_name: '' + customWebTemplate.name,
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Шаблоны',
    };
  }
}
