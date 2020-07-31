/**
 * Проверяет работает ли WebTutor по протоколу HTTPS
 *
 * @param {Request} Request
 * @returns {object}
 */
function run(Request) {
  try {
    var isHTTPS = StrContains(Request.Url, 'https://', true);
    var success = false;
    if (isHTTPS) success = true;
    return {
      success: success,
    };
  } catch (error) {
    return {
      success: false,
      message: 'HTTPS',
    };
  }
}
