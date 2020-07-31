export async function api(route: RequestInfo, body?: BodyInit) {
  try {
    const options: RequestInit = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
    };
    options.headers = {
      Origin: window.location.origin,
    };
    if (
      navigator.userAgent.indexOf('MSIE') !== -1 ||
      navigator.appVersion.indexOf('Trident/') > -1
    ) {
      options.headers['Pragma'] = 'no-cache';
      options.headers['Cache-Control'] = 'no-cache, no-store';
    }
    if (body) {
      options.method = 'POST';
      options.body = body;
    }
    const response = await fetch(
      `${window.webtutorPushNotificationsApiUrl}?route=${route}`,
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

export function componentEvent(
  elem: Element,
  name: string,
  detail?: { [key: string]: string | number | boolean }
) {
  const options: CustomEventInit = {
    bubbles: true,
    composed: true,
  };
  if (detail) options.detail = detail;
  elem.dispatchEvent(new CustomEvent(name, options));
}

export function copy(instanceId: string, elem: Element) {
  const dummy = document.createElement('textarea');
  document.body.appendChild(dummy);
  dummy.value = instanceId;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
  componentEvent(elem, 'show-notification', {
    theme: 'contrast',
    text: `Скопировано`,
  });
}
