/**
 * Удаляет firebase-messaging-sw.js
 *
 * @returns {object}
 */
function run() {
  try {
    DeleteFile('x-local://wt/web/firebase-messaging-sw.js');
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
