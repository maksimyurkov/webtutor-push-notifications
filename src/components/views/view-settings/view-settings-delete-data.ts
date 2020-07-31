export interface DeleteItem {
  text: string;
  description: string;
  status: string;
  route: string;
  icon: string;
  errorMessage: string;
}

export const data: Array<DeleteItem> = [
  {
    text: 'Шаблоны',
    description: 'Удаление шаблонов в WebTutor',
    status: 'loading',
    route: '/delete/templates',
    icon:
      '<g id="icon"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/></g>',
    errorMessage:
      'Не удалось удалить шаблоны с кодом webtutor-push-notifications-* в "Элементы шаблонов" и "Шаблоны документов". Сделайте это вручную.',
  },
  {
    text: 'Таблицы',
    description: 'Удаление таблиц в MS SQL',
    status: 'loading',
    route: '/delete/tables',
    icon:
      '<g id="icon" width="44" height="44" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z"/><ellipse cx="12" cy="6" rx="8" ry="3"></ellipse><path d="M4 6v6a8 3 0 0 0 16 0v-6" /><path d="M4 12v6a8 3 0 0 0 16 0v-6" /></g>',
    errorMessage:
      'Не удалось удалить таблицы webtutor-push-notifications-* в MS SQL. Сделайте это вручную.',
  },
  {
    text: 'Агент',
    description: 'Удаление агентов в WebTutor',
    status: 'loading',
    route: '/delete/agents',
    icon:
      '<g id="icon"><g><rect fill="none" height="24" width="24" x="0"/></g><g><g><g><path d="M21,10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-0.1c-2.73,2.71-2.73,7.08,0,9.79s7.15,2.71,9.88,0 C18.32,15.65,19,14.08,19,12.1h2c0,1.98-0.88,4.55-2.64,6.29c-3.51,3.48-9.21,3.48-12.72,0c-3.5-3.47-3.53-9.11-0.02-12.58 s9.14-3.47,12.65,0L21,3V10.12z M12.5,8v4.25l3.5,2.08l-0.72,1.21L11,13V8H12.5z"/></g></g></g></g>',
    errorMessage:
      'Не удалось удалить агенты webtutor-push-notifications-*. Сделайте это вручную.',
  },
  {
    text: 'Service Worker',
    description: 'Удаление /firebase-sw.js в WebTutor ',
    status: 'loading',
    route: '/delete/service-worker',
    icon:
      '<g id="icon"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/></g>',
    errorMessage:
      'Не удалось удалить файл /wt/web/firebase-sw.js. Сделайте это вручную.',
  },
];
