import { IMenuConfig } from './menu-config.interface';

export const menuConfig: IMenuConfig = {

  // Компоненты:
  menuItemHome: {
    text: 'sidebar.nav.menu.HOME',
    link: '/home',
    icon: 'co-home'
  },

  // Администрирование:
  administration: {
    text: 'sidebar.nav.menu.ADMIN_PANEL',
    link: '/admin',
    icon: 'icon-speedometer'
  },
  roles: {
    text: 'sidebar.nav.menu.ROLES_AND_PERMISSIONS',
    link: '/admin/roles',
    icon: 'co-roles'
  },
  users: {
    text: 'sidebar.nav.menu.USERS',
    link: '/admin/users',
    icon: 'co-users'
  },
  actionLog: {
    text: 'sidebar.nav.menu.ACTIONS_LOG',
    link: '/admin/action-log',
    icon: 'co-action-log'
  },
  constants: {
    text: 'sidebar.nav.menu.CONSTANTS',
    link: '/admin/constants',
    icon: 'co-constants'
  },
  dictionary: {
    text: 'sidebar.nav.menu.DICTIONARIES',
    link: '/admin/dictionaries',
    icon: 'co-dictionaries'
  },
  clients: {
    text: 'sidebar.nav.menu.PORTFOLIOS_CONTRACTORS',
    link: '/admin/contractors',
    icon: 'co-portfolios'
  },
  structure: {
    text: 'sidebar.nav.menu.DEPARTMENTS',
    link: '/admin/organizations',
    icon: 'co-org-structure'
  },

  // Утилиты:
  utilities: {
    text: 'sidebar.nav.menu.UTILITIES',
    link: '/utilities',
    icon: ''
  },
  loadTemplates: {
    text: 'sidebar.nav.menu.UPLOAD_TEMPLATES',
    link: '/utilities/upload-templates',
    icon: 'co-load-templates'
  },
  currencyRates: {
    text: 'sidebar.nav.menu.CURRENCIES',
    link: '/utilities/currencies',
    icon: 'co-currencies'
  },
  dataLoad: {
    text: 'sidebar.nav.menu.DATA_UPLOAD',
    link: '/utilities/data-upload',
    icon: 'co-data-upload'
  },
  attributes: {
    text: 'sidebar.nav.menu.ARBITRARY_VALUES',
    link: '/utilities/arbitrary-values',
    icon: 'icon-equalizer'
  },
  contacts: {
    text: 'sidebar.nav.menu.CONTACT_TREES',
    link: '/utilities/contact-properties',
    icon: 'co-contact-tree'
  },
  messages: {
    text: 'sidebar.nav.menu.MESSAGE_SCENARIOS',
    link: '/utilities/message-templates',
    icon: 'co-message-scenarios'
  },
  schedule: {
    text: 'sidebar.nav.menu.SCHEDULE',
    link: '/utilities/schedule',
    icon: 'co-schedule'
  },
  callCampaign: {
    text: 'sidebar.nav.menu.CAMPAIGNS',
    link: '/utilities/campaigns',
    icon: 'co-call-campaigns'
  },
  formulas: {
    text: 'sidebar.nav.menu.FORMULAS',
    link: '/utilities/formulas',
    icon: 'co-formulae'
  },
  courts: {
    text: 'sidebar.nav.menu.COURTS',
    link: '/utilities/courts',
    icon: 'co-legal'
  },

  // Рабочие места:
  workplaces: {
    text: 'sidebar.nav.menu.WORKPLACES',
    link: '/workplaces',
    icon: ''
  },
  debtList: {
    text: 'sidebar.nav.menu.DEBT_LIST',
    link: '/workplaces/debts',
    icon: 'co-debt-list'
  },
  tasks: {
    text: 'sidebar.nav.menu.TASKS',
    link: '/workplaces/tasks',
    icon: 'co-tasks'
  },
  debts: {
    text: 'sidebar.nav.menu.DEBTS',
    link: '/workplaces/debt-processing',
    icon: 'co-debt-processing'
  },
  contactProtocol: {
    text: 'sidebar.nav.menu.CONTACT_LOG',
    link: '/workplaces/contact-log',
    icon: 'co-contact-log'
  },
  callcenter: {
    text: 'sidebar.nav.menu.CALL_CENTER',
    link: '/workplaces/call-center',
    icon: 'co-call-center'
  },
  payments: {
    text: 'sidebar.nav.menu.PAYMENTS',
    link: '/workplaces/payments',
    icon: 'co-payments'
  },
  courts2: {
    text: 'sidebar.nav.menu.COURTS_2',
    link: '/workplaces/courts',
    icon: 'co-court'
  },
  outgoingInformation: {
    text: 'sidebar.nav.menu.OUTGOING_INFORMATION',
    link: '/workplaces/outgoing-information',
    icon: 'co-communication-out'
  },
  searchGroups: {
    text: 'sidebar.nav.menu.SEARCH_GROUPS',
    link: '/workplaces/search-groups',
    icon: 'co-search-groups'
  },
  mail: {
    text: 'sidebar.nav.menu.MAIL',
    link: '/workplaces/mail',
    icon: 'co-mail'
  },
  incomingCall: {
    text: 'sidebar.nav.menu.INCOMING_CALL',
    link: '/workplaces/incoming-call',
    icon: 'co-call-incoming'
  },

  // Отчеты
  reports: {
    text: 'sidebar.nav.menu.REPORTS',
    link: '/reports',
    icon: ''
  },
  anyReports: {
    text: 'sidebar.nav.menu.ARBITRARY_REPORTS',
    link: '/reports/arbitrary',
    icon: 'co-action-log'
  },

  // Справка
  help: {
    text: 'sidebar.nav.menu.HELP',
    link: '/help',
    icon: 'icon-support'
  }
};
