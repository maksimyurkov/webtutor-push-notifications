/**
 * Проверяет наличие доступа WebTutor к сервисам Google
 *
 * @returns {object}
 */
function run() {
  try {
    var response = HttpRequest(
      'https://fcm.googleapis.com/fcm/send',
      'get',
      '',
      'Ignore-Errors: 1\n'
    );
    var statusCode = response.RespCode;
    if (statusCode === 405) {
      return {
        success: true,
      };
    } else {
      throw Error();
    }
  } catch (error) {
    return {
      success: false,
      message: 'Firebase',
    };
  }
}
