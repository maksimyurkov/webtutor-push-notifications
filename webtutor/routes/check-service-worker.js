/**
 * Проверяет наличие файла firebase-messaging-sw.js и в случае отсутствия создает его
 *
 * @returns {object}
 */
function run() {
  try {
    var config = ArrayOptFirstElem(
      XQuery('sql: SELECT * FROM webtutor_push_notifications_config')
    );

    var fileTemplate =
      '\
importScripts("/node_modules/@maksimyurkov/webtutor-push-notifications/node_modules/firebase/firebase-app.js");\
importScripts("/node_modules/@maksimyurkov/webtutor-push-notifications/node_modules/firebase/firebase-messaging.js");\
\
firebase.initializeApp({\
  apiKey: "' +
      config.apiKey +
      '",\
  authDomain: "' +
      config.authDomain +
      '",\
  databaseURL: "' +
      config.databaseURL +
      '",\
  projectId: "' +
      config.projectId +
      '",\
  storageBucket: "' +
      config.storageBucket +
      '",\
  messagingSenderId: "' +
      config.messagingSenderId +
      '",\
  appId: "' +
      config.appId +
      '"\
});\
\
const messaging = firebase.messaging();\
\
// регистрируем свой обработчик уведомлений\
messaging.setBackgroundMessageHandler(function(payload) {\
\
  // Сохраняем data для получения пареметров в обработчике клика\
  payload.data.data = JSON.parse(JSON.stringify(payload.data));\
\
  // Показываем уведомление\
  return self.registration.showNotification(payload.data.title, payload.data);\
});\
\
// Свой обработчик клика по уведомлению\
self.addEventListener("notificationclick", function(event) {\
  // Извлекаем адрес перехода из параметров уведомления \
  const target = event.notification.data.click_action || "/";\
  event.notification.close();\
\
  // Этот код должен проверять список открытых вкладок и переключатся на открытую вкладку с ссылкой если такая есть, иначе открывает новую вкладку\
  event.waitUntil(clients.matchAll({\
    type: "window",\
    includeUncontrolled: true\
  }).then(function(clientList) {\
    // clientList почему-то всегда пуст!?\
    for (var i = 0; i < clientList.length; i++) {\
      var client = clientList[i];\
      if (client.url === target && "focus" in client) {\
        return client.focus();\
      }\
    }\
\
    // Открываем новое окно\
    return clients.openWindow(target);\
  }));\
});';

    PutFileData(
      UrlToFilePath('x-local://wt/web/firebase-messaging-sw.js'),
      fileTemplate
    );

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Service Worker',
    };
  }
}
