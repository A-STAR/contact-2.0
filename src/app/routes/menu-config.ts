import { IMenuConfig } from './menu-config.interface';

export const menuConfig: IMenuConfig = {

  // Компоненты:
  menuItemHome: {
    text: 'sidebar.nav.menu.HOME',
    link: '/home',
    icon: 'icon-home'
  },
  menuItemWorkflow: {
    text: 'sidebar.nav.menu.WORKFLOW',
    link: '/workflow',
    icon: 'icon-graph'
  },

  // Администрирование:
  administration: {
    text: 'sidebar.nav.menu.ADMIN_PANEL',
    link: '/admin',
    icon: 'icon-speedometer'
  },
  roles: {
    text: 'sidebar.nav.menu.ROLES_AND_PERMISSIONS',
    link: '/admin/roles-and-permissions',
    icon: 'icon-user-following'
  },
  users: {
    text: 'sidebar.nav.menu.USERS',
    link: '/admin/users',
    icon: 'icon-people'
  },
  actionLog: {
    text: 'sidebar.nav.menu.ACTIONS_LOG',
    link: '/admin/action-log',
    icon: 'icon-doc'
  },
  constants: {
    text: 'sidebar.nav.menu.CONSTANTS',
    link: '/admin/constants',
    icon: 'icon-equalizer'
  },
  dictionary: {
    text: 'sidebar.nav.menu.DICTIONARIES',
    link: '/admin/dictionaries',
    icon: 'icon-book-open'
  },
  clients: {
    text: 'sidebar.nav.menu.PORTFOLIOS',
    link: '/admin/contractors',
    icon: 'icon-briefcase'
  },
  structure: {
    text: 'sidebar.nav.menu.DEPARTMENTS',
    link: '/admin/organizations',
    icon: 'icon-link'
  },

  // Утилиты:
  utilities: {
    text: 'sidebar.nav.menu.UTILITIES',
    link: '/utilities',
    icon: 'icon-settings'
  },
  loadTemplates: {
    text: 'sidebar.nav.menu.UPLOAD_TEMPLATES',
    link: '/utilities/upload-templates',
    icon: 'icon-docs'
  },
  dataLoad: {
    text: 'sidebar.nav.menu.DATA_UPLOAD',
    link: '/utilities/data-upload',
    icon: 'icon-cloud-upload'
  },
  attributes: {
    text: 'sidebar.nav.menu.ARBITRARY_VALUES',
    link: '/utilities/arbitrary-values',
    icon: 'icon-equalizer'
  },
  contacts: {
    text: 'sidebar.nav.menu.CONTACT_TREES',
    link: '/utilities/contact-trees',
    icon: 'icon-people'
  },
  messages: {
    text: 'sidebar.nav.menu.MESSAGE_SCENARIOS',
    link: '/utilities/message-templates',
    icon: 'icon-bubbles'
  },
  groups: {
    text: 'sidebar.nav.menu.GROUPS',
    link: '/utilities/groups',
    icon: 'icon-folder'
  },
  callCampaign: {
    text: 'sidebar.nav.menu.CAMPAIGNS',
    link: '/utilities/capmaigns',
    icon: 'icon-rocket'
  },
  schedule: {
    text: 'sidebar.nav.menu.SCHEDULE',
    link: '/utilities/schedule',
    icon: 'icon-calendar'
  },
  formulas: {
    text: 'sidebar.nav.menu.FORMULAS',
    link: '/utilities/formulas',
    icon: 'icon-note'
  },
  courts: {
    text: 'sidebar.nav.menu.COURTS',
    link: '/utilities/courts',
    icon: 'icon-badge'
  },

  // Рабочие места:
  workplaces: {
    text: 'sidebar.nav.menu.WORKPLACES',
    link: '/workplaces',
    icon: 'icon-earphones-alt'
  },
  debtList: {
    text: 'sidebar.nav.menu.DEBT_LIST',
    link: '/workplaces/debts',
    icon: 'icon-wallet'
  },
  tasks: {
    text: 'sidebar.nav.menu.TASKS',
    link: '/workplaces/tasks',
    icon: 'icon-action-redo'
  },
  debts: {
    text: 'sidebar.nav.menu.DEBTS',
    link: '/workplaces/debt-processing',
    icon: 'icon-fire'
  },
  contactProtocol: {
    text: 'sidebar.nav.menu.CONTACT_PROTOCOL',
    link: '/workplaces/contact-protocol',
    icon: 'icon-call-in'
  },
  callcenter: {
    text: 'sidebar.nav.menu.CALL_CENTER',
    link: '/workplaces/call-center',
    icon: 'icon-phone'
  },
  payments: {
    text: 'sidebar.nav.menu.PAYMENTS',
    link: '/workplaces/payments',
    icon: 'icon-wallet'
  },
  courts2: {
    text: 'sidebar.nav.menu.COURTS_2',
    link: '/workplaces/courts',
    icon: 'icon-badge'
  },
  outgoingInformation: {
    text: 'sidebar.nav.menu.OUTGOING_INFORMATION',
    link: '/workplaces/outgoing-information',
    icon: 'icon-share-alt'
  },
  searchGroups: {
    text: 'sidebar.nav.menu.SEARCH_GROUPS',
    link: '/workplaces/search-groups',
    icon: 'icon-eyeglass'
  },
  mail: {
    text: 'sidebar.nav.menu.MAIL',
    link: '/workplaces/mail',
    icon: 'icon-envelope-letter'
  },

  // Отчеты
  reports: {
    text: 'sidebar.nav.menu.REPORTS',
    link: '/reports',
    icon: 'icon-docs'
  },
  anyReports: {
    text: 'sidebar.nav.menu.ARBITRARY_REPORTS',
    link: '/reports/arbitrary',
    icon: 'icon-docs'
  },

  // Справка
  help: {
    text: 'sidebar.nav.menu.HELP',
    link: '/help',
    icon: 'icon-support'
  }
};
