export interface CheckItem {
  text: string;
  description: string;
  status: string;
  route: string;
  icon: string;
  errorMessage: string;
}

export const data: Array<CheckItem> = [
  {
    text: 'Шаблоны',
    description: 'Наличие шаблонов в WebTutor',
    status: 'loading',
    route: '/check/templates',
    icon:
      '<g id="icon"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/></g>',
    errorMessage:
      'Не удалось создать шаблоны в "Элементы шаблонов" и "Шаблоны документов"',
  },
  {
    text: 'Таблицы',
    description: 'Наличие таблиц в MS SQL',
    status: 'loading',
    route: '/check/tables',
    icon:
      '<g id="icon" width="44" height="44" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z"/><ellipse cx="12" cy="6" rx="8" ry="3"></ellipse><path d="M4 6v6a8 3 0 0 0 16 0v-6" /><path d="M4 12v6a8 3 0 0 0 16 0v-6" /></g>',
    errorMessage:
      'Не удалось создать таблицы в MS SQL. Удостоверьтесь, что есть все необходимые права доступа.',
  },
  {
    text: 'Firebase',
    description: 'Доступ к сервисам Firebase',
    status: 'loading',
    route: '/check/firebase',
    icon:
      '<g id="icon"><path d="M3.89 15.673L6.255.461A.542.542 0 0 1 7.27.289L9.813 5.06 3.89 15.673zm16.795 3.691L18.433 5.365a.543.543 0 0 0-.918-.295l-14.2 14.294 7.857 4.428a1.62 1.62 0 0 0 1.587 0l7.926-4.428zM14.3 7.148l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984 14.3 7.148z"/></g>',
    errorMessage:
      'Не удалось осуществить запрос к Firebase. Удостоверьтесь, что настройки вашей сети позволяют WebTutor осуществлять запросы к сервисам Google.',
  },
  {
    text: 'Агент',
    description: 'Наличие агентов в WebTutor',
    status: 'loading',
    route: '/check/agents',
    icon:
      '<g id="icon"><g><rect fill="none" height="24" width="24" x="0"/></g><g><g><g><path d="M21,10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-0.1c-2.73,2.71-2.73,7.08,0,9.79s7.15,2.71,9.88,0 C18.32,15.65,19,14.08,19,12.1h2c0,1.98-0.88,4.55-2.64,6.29c-3.51,3.48-9.21,3.48-12.72,0c-3.5-3.47-3.53-9.11-0.02-12.58 s9.14-3.47,12.65,0L21,3V10.12z M12.5,8v4.25l3.5,2.08l-0.72,1.21L11,13V8H12.5z"/></g></g></g></g>',
    errorMessage: 'Не удалось создать агенты необходимые для работы модуля.',
  },
  {
    text: 'HTTPS',
    description: 'Работа WebTutor по протоколу HTTPS',
    status: 'loading',
    route: '/check/https',
    icon:
      '<g id="icon"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></g>',
    errorMessage:
      'Портал работает не по протоколу HTTPS. Для корректной работы реализуйте передачу данных по HTTPS.',
  },
  {
    text: 'Service Worker',
    description: 'Наличие в WebTutor /firebase-sw.js',
    status: 'loading',
    route: '/check/service-worker',
    icon:
      '<g id="icon"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/></g>',
    errorMessage:
      'Не удалось создать файл /wt/web/firebase-sw.js. Удостоверьтесь, что есть все необходимые права доступа.',
  },
];
