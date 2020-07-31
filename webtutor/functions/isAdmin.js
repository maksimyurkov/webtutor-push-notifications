/**
 * Проверяет обладает ли пользователь правами администратора
 *
 * @param {Request}
 * @returns {boolean}
 */
function run(Request) {
  try {
    if ('' + Request.Session.Env.curUser.last_data.access_role === 'admin')
      return true;
    return false;
  } catch (error) {
    return false;
  }
}
