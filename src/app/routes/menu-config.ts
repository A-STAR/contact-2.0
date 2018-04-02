import { IMenuConfig } from './menu-config.interface';

export const menuConfig: IMenuConfig = {

  // Компоненты:
  menuItemHome: {
    text: 'sidebar.nav.menu.HOME',
    link: '/app/home',
    icon: 'co-m-home'
  },

  // Администрирование:
  administration: {
    text: 'sidebar.nav.menu.ADMIN_PANEL',
    link: '/app/admin',
    icon: ''
  },
  roles: {
    text: 'sidebar.nav.menu.ROLES_AND_PERMISSIONS',
    link: '/app/admin/roles',
    icon: 'co-m-roles'
  },
  users: {
    text: 'sidebar.nav.menu.USERS',
    link: '/app/admin/users',
    icon: 'co-m-users'
  },
  actionLog: {
    text: 'sidebar.nav.menu.ACTIONS_LOG',
    link: '/app/admin/action-log',
    icon: 'co-m-action-log'
  },
  constants: {
    text: 'sidebar.nav.menu.CONSTANTS',
    link: '/app/admin/constants',
    icon: 'co-m-constants'
  },
  dictionary: {
    text: 'sidebar.nav.menu.DICTIONARIES',
    link: '/app/admin/dictionaries',
    icon: 'co-m-dictionaries'
  },
  clients: {
    text: 'sidebar.nav.menu.PORTFOLIOS_CONTRACTORS',
    link: '/app/admin/contractors',
    icon: 'co-m-portfolios'
  },
  structure: {
    text: 'sidebar.nav.menu.DEPARTMENTS',
    link: '/app/admin/organizations',
    icon: 'co-m-org-structure'
  },

  // Утилиты:
  utilities: {
    text: 'sidebar.nav.menu.UTILITIES',
    link: '/app/utilities',
    icon: ''
  },
  loadTemplates: {
    text: 'sidebar.nav.menu.UPLOAD_TEMPLATES',
    link: '/app/utilities/upload-templates',
    icon: 'co-m-load-templates'
  },
  currencyRates: {
    text: 'sidebar.nav.menu.CURRENCIES',
    link: '/app/utilities/currencies',
    icon: 'co-m-currencies'
  },
  dataLoad: {
    text: 'sidebar.nav.menu.DATA_UPLOAD',
    link: '/app/utilities/data-upload',
    icon: 'co-m-data-upload'
  },
  attributes: {
    text: 'sidebar.nav.menu.ARBITRARY_VALUES',
    link: '/app/utilities/arbitrary-values',
    icon: 'co-m-attributes'
  },
  contacts: {
    text: 'sidebar.nav.menu.CONTACT_TREES',
    link: '/app/utilities/contact-properties',
    icon: 'co-m-contact-tree'
  },
  messages: {
    text: 'sidebar.nav.menu.MESSAGE_SCENARIOS',
    link: '/app/utilities/message-templates',
    icon: 'co-m-message-scenarios'
  },
  schedule: {
    text: 'sidebar.nav.menu.SCHEDULE',
    link: '/app/utilities/schedule',
    icon: 'co-m-schedule'
  },
  callCampaign: {
    text: 'sidebar.nav.menu.CAMPAIGNS',
    link: '/app/utilities/campaigns',
    icon: 'co-m-call-campaigns'
  },
  formulas: {
    text: 'sidebar.nav.menu.FORMULAS',
    link: '/app/utilities/formulas',
    icon: 'co-m-formulae'
  },
  courts: {
    text: 'sidebar.nav.menu.COURTS',
    link: '/app/utilities/courts',
    icon: 'co-m-courts'
  },
  letters: {
    text: 'sidebar.nav.menu.LETTERS',
    link: '/app/utilities/letters',
    icon: 'co-mail'
  },

  // Рабочие места:
  workplaces: {
    text: 'sidebar.nav.menu.WORKPLACES',
    link: '/app/workplaces',
    icon: ''
  },
  debtList: {
    text: 'sidebar.nav.menu.DEBT_LIST',
    link: '/app/workplaces/debts',
    icon: 'co-m-debt-list'
  },
  tasks: {
    text: 'sidebar.nav.menu.TASKS',
    link: '/app/workplaces/tasks',
    icon: 'co-m-tasks'
  },
  debts: {
    text: 'sidebar.nav.menu.DEBTS',
    link: '/app/workplaces/debt-processing',
    icon: 'co-m-debt-processing'
  },
  contactProtocol: {
    text: 'sidebar.nav.menu.CONTACT_LOG',
    link: '/app/workplaces/contact-log',
    icon: 'co-m-contact-log'
  },
  callcenter: {
    text: 'sidebar.nav.menu.CALL_CENTER',
    link: '/app/workplaces/call-center',
    icon: 'co-m-call-center'
  },
  payments: {
    text: 'sidebar.nav.menu.PAYMENTS',
    link: '/app/workplaces/payments',
    icon: 'co-m-payments'
  },
  courts2: {
    text: 'sidebar.nav.menu.COURTS_2',
    link: '/app/workplaces/courts',
    icon: 'co-m-courts'
  },
  outgoingInformation: {
    text: 'sidebar.nav.menu.OUTGOING_INFORMATION',
    link: '/app/workplaces/outgoing-information',
    icon: 'co-m-communication-out'
  },
  searchGroups: {
    text: 'sidebar.nav.menu.SEARCH_GROUPS',
    link: '/app/workplaces/search-groups',
    icon: 'co-search-groups'
  },
  mail: {
    text: 'sidebar.nav.menu.MAIL',
    link: '/app/workplaces/mail',
    icon: 'co-m-mail'
  },
  incomingCall: {
    text: 'sidebar.nav.menu.INCOMING_CALL',
    link: '/app/workplaces/incoming-call',
    icon: 'co-m-call-incoming'
  },

  // Отчеты
  reports: {
    text: 'sidebar.nav.menu.REPORTS',
    link: '/app/reports',
    icon: ''
  },
  anyReports: {
    text: 'sidebar.nav.menu.REPORTS',
    link: '/app/reports',
    icon: 'co-m-action-log'
  },

  // Справка
  help: {
    text: 'sidebar.nav.menu.HELP',
    link: '/app/help',
    icon: 'co-m-help'
  }
};
