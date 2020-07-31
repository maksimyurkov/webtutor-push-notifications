/**
 * Добавляет уведомления в очередь.
 *
 * @param {Request} Request
 * @returns {object}
 */
function run(Request) {
  try {
    var functions = OpenCodeLib('../functions/import.js').run([
      'jsonParse',
      'send',
    ]);

    var messages = functions.jsonParse.run(Request.Body);
    functions.send.run(messages);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
