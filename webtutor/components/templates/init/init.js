async function loadScripts() {
  await addScript({
    src: '/node_modules/firebase/firebase-app.js',
    type: 'text/javascript',
    async: true,
  });
  await addScript({
    src: '/node_modules/firebase/firebase-messaging.js',
    type: 'text/javascript',
    async: true,
  });
  await addScript({
    src: '/node_modules/detect.js/detect.min.js',
    type: 'text/javascript',
    async: true,
  });
}

async function api(route, body) {
  try {
    const options = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache, no-store',
        Origin: window.location.origin,
      },
    };
    if (body) {
      options.method = 'POST';
      options.body = body;
    }
    const response = await fetch(
      `/node_modules/@maksimyurkov/webtutor-push-notifications/webtutor/api.html?route=${route}`,
      options
    );
    if (response.status === 200) {
      const json = await response.json();
      return json;
    }
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

async function addNotificationHandler() {
  window.firebase.messaging().onMessage(async function (payload) {
    console.log('Сообщение получено', payload);
    // Регистрируем фейковый ServiceWorker для отображения уведомлений на мобильных устройствах
    window.navigator.serviceWorker.register('firebase-messaging-sw.js');
    try {
      const registration = await navigator.serviceWorker.ready;
      payload.data.data = JSON.parse(JSON.stringify(payload.data));
      registration.showNotification(payload.data.title, payload.data);
    } catch (error) {
      console.error('Не удалось зарегистрировать Service Worker', error);
    }
  });
}

async function onTokenRefresh() {
  window.firebase.messaging().onTokenRefresh(async function () {
    try {
      const newToken = await window.messaging.getToken();
      await updateInstance(newToken);
    } catch (error) {
      console.error('Не удалось получить обновленный токен', error);
    }
  });
}

async function forceUpdateNeeded() {
  let updated = window.localStorage.getItem(
    'webtutor-push-notifications-updated'
  );
  if (updated === null) return true;
  updated = new Date(updated);
  const currentDate = new Date();
  const dayDiff =
    Math.abs(currentDate.getTime() - updated.getTime()) / 86400000;
  if (dayDiff > 1) return true;
  return false;
}

async function updateInstance(currentToken) {
  try {
    // Получаем значение последнего используемого токена
    const oldToken = window.localStorage.getItem(
      'webtutor-push-notifications-token'
    );
    // Проверяем требуется ли принудительное обновление (принудительное обновление делается раз в день и требуется на случай удаления данных из таблицы webtutor-push-notifications-instances)
    const needForcedUpdate = await forceUpdateNeeded();
    // Если значения старого и нового токен совпадают обновление не требуется
    if (oldToken === currentToken && !needForcedUpdate) return;
    // Обновляем токен на сервере
    const ua = window.detect.parse(window.navigator.userAgent);
    const response = await api(
      `/instances/update`,
      JSON.stringify({
        instanceId: currentToken,
        oldInstanceId: oldToken,
        browser: ua.browser.name || '',
        device: ua.device.name || '',
        type: ua.device.type || '',
        manufacturer: ua.device.manufacturer || '',
        os: ua.os.name || '',
      })
    );
    if (response.success) {
      // Сохраняем новый токен в localStorage
      window.localStorage.setItem(
        'webtutor-push-notifications-token',
        currentToken
      );
      window.localStorage.setItem(
        'webtutor-push-notifications-updated',
        new Date()
      );
    }
  } catch (error) {
    console.warn('Не удалось обновить id устройства на сервере', error);
  }
}

async function initWebTutorPushNotifications() {
  // Загружаем необходимые скрипты
  await loadScripts();
  // Получаем конфигурацию firebase
  const response = await api('/config/public');
  if (!response.success) return;
  const firebaseConfig = response.config;
  // Инициализируем проект firebase
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  // Запрашиваем разрешение на получение уведомлений
  if (Notification.permission === 'default') {
    try {
      await messaging.requestPermission();
    } catch (error) {
      console.warn('В разрешении отказано', error);
      return;
    }
  }
  // Добавляем обработчик принимающий и отображающий уведомление на активной странице
  await addNotificationHandler();
  // Добавляем обработчик обновления токена
  await onTokenRefresh();
  // Получаем текущий токен устройства
  let currentToken;
  try {
    currentToken = await messaging.getToken();
    if (currentToken) {
    } else {
      console.warn('Не удалось получить токен');
      return;
    }
  } catch (error) {
    console.warn('При получении токена произошла ошибка.', error);
    return;
  }
  // Обновляем текущий токен
  await updateInstance(currentToken);
}

initWebTutorPushNotifications();
