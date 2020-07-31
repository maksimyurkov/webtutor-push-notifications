/**
 * Определяет является ли пользователь администратором
 *
 * @param {Request} Request
 * @returns {object}
 */
function run(Request) {
  var functions = OpenCodeLib('../functions/import.js').run(['isAdmin']);
  return {
    success: functions.isAdmin.run(Request),
  };
}
