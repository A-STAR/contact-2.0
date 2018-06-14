
export const menuConfig = {

  // Компоненты:
  menuItemHome: {
    text: 'sidebar.nav.menu.HOME',
    link: '/app/home',
    icon: 'co-m-home',
    docs: '',
  },

  // Администрирование:
  administration: {
    text: 'sidebar.nav.menu.ADMIN_PANEL',
    link: '/app/admin',
    icon: '',
    docs: 'admin',
  },
  roles: {
    text: 'sidebar.nav.menu.ROLES_AND_PERMISSIONS',
    link: '/app/admin/roles',
    icon: 'co-m-roles',
    docs: 'role_permit',
  },
  users: {
    text: 'sidebar.nav.menu.USERS',
    link: '/app/admin/users',
    icon: 'co-m-users',
    docs: 'users',
  },
  actionLog: {
    text: 'sidebar.nav.menu.ACTIONS_LOG',
    link: '/app/admin/action-log',
    icon: 'co-m-action-log',
    docs: 'action_log',
  },
  constants: {
    text: 'sidebar.nav.menu.CONSTANTS',
    link: '/app/admin/constants',
    icon: 'co-m-constants',
    docs: 'const_value',
  },
  dictionary: {
    text: 'sidebar.nav.menu.DICTIONARIES',
    link: '/app/admin/dictionaries',
    icon: 'co-m-dictionaries',
    docs: 'dict',
  },
  clients: {
    text: 'sidebar.nav.menu.PORTFOLIOS_CONTRACTORS',
    link: '/app/admin/contractors',
    icon: 'co-m-portfolios',
    docs: 'bank_portfolio',
  },
  structure: {
    text: 'sidebar.nav.menu.DEPARTMENTS',
    link: '/app/admin/organizations',
    icon: 'co-m-org-structure',
    docs: 'department',
  },

  // Утилиты:
  utilities: {
    text: 'sidebar.nav.menu.UTILITIES',
    link: '/app/utilities',
    icon: '',
    docs: 'utils',
  },
  loadTemplates: {
    text: 'sidebar.nav.menu.UPLOAD_TEMPLATES',
    link: '/app/utilities/upload-templates',
    icon: 'co-m-load-templates',
    docs: null,
  },
  currencyRates: {
    text: 'sidebar.nav.menu.CURRENCIES',
    link: '/app/utilities/currencies',
    icon: 'co-m-currencies',
    docs: 'cur_exchange',
  },
  dataLoad: {
    text: 'sidebar.nav.menu.DATA_UPLOAD',
    link: '/app/utilities/data-upload',
    icon: 'co-m-data-upload',
    docs: 'load_data',
  },
  attributes: {
    text: 'sidebar.nav.menu.ARBITRARY_VALUES',
    link: '/app/utilities/arbitrary-values',
    icon: 'co-m-attributes',
    docs: null,
  },
  contacts: {
    text: 'sidebar.nav.menu.CONTACT_TREES',
    link: '/app/utilities/contact-properties',
    icon: 'co-m-contact-tree',
    docs: 'contact_tree_set',
  },
  messages: {
    text: 'sidebar.nav.menu.MESSAGE_SCENARIOS',
    link: '/app/utilities/message-templates',
    icon: 'co-m-message-scenarios',
    docs: 'debt_msg',
  },
  schedule: {
    text: 'sidebar.nav.menu.SCHEDULE',
    link: '/app/utilities/schedule',
    icon: 'co-m-schedule',
    docs: 'schedule',
  },
  callCampaign: {
    text: 'sidebar.nav.menu.CAMPAIGNS',
    link: '/app/utilities/campaigns',
    icon: 'co-m-call-campaigns',
    docs: 'campaign',
  },
  formulas: {
    text: 'sidebar.nav.menu.FORMULAS',
    link: '/app/utilities/formulas',
    icon: 'co-m-formulae',
    docs: 'formula',
  },
  courts: {
    text: 'sidebar.nav.menu.COURTS',
    link: '/app/utilities/courts',
    icon: 'co-m-courts',
    docs: null,
  },
  letters: {
    text: 'sidebar.nav.menu.LETTERS',
    link: '/app/utilities/letters',
    icon: 'co-mail',
    docs: 'letter_designer',
  },

  // Рабочие места:
  workplaces: {
    text: 'sidebar.nav.menu.WORKPLACES',
    link: '/app/workplaces',
    icon: '',
    docs: 'workplaces',
  },
  debtList: {
    text: 'sidebar.nav.menu.DEBT_LIST',
    link: '/app/workplaces/debts',
    icon: 'co-m-debt-list',
    docs: null,
  },
  tasks: {
    text: 'sidebar.nav.menu.TASKS',
    link: '/app/workplaces/tasks',
    icon: 'co-m-tasks',
    docs: 'work_task',
    permission: [
      'WORK_TASK_TAB_ALL',
      'WORK_TASK_TAB_NEW',
      'WORK_TASK_TAB_PROBLEM',
      'WORK_TASK_TAB_SEARCH_INFORMATION',
      'WORK_TASK_TAB_TOCONTRACTOR',
      'WORK_TASK_TAB_PREPARE_VISITS',
      'WORK_TASK_TAB_CLOSE'
    ]
  },
  debts: {
    text: 'sidebar.nav.menu.DEBTS',
    link: '/app/workplaces/debt-processing',
    icon: 'co-m-debt-processing',
    docs: 'ring_up',
    permission: [
      'DEBT_PROCESSING_TAB_ALL',
      'DEBT_PROCESSING_TAB_CALL_BACK',
      'DEBT_PROCESSING_TAB_CURRENT_JOB',
      'DEBT_PROCESSING_TAB_VISITS',
      'DEBT_PROCESSING_TAB_PROMISE_PAY',
      'DEBT_PROCESSING_TAB_PART_PAY',
      'DEBT_PROCESSING_TAB_PROBLEM',
      'DEBT_PROCESSING_TAB_RETURN'
    ]
  },
  contactProtocol: {
    text: 'sidebar.nav.menu.CONTACT_LOG',
    link: '/app/workplaces/contact-log',
    icon: 'co-m-contact-log',
    docs: 'contact_log',
    permission: [
      'CONTACT_LOG_TAB_PROMISE',
      'CONTACT_LOG_TAB_CONTACT',
      'CONTACT_LOG_TAB_SMS',
      'CONTACT_LOG_TAB_EMAIL'
    ]
  },
  callcenter: {
    text: 'sidebar.nav.menu.CALL_CENTER',
    link: '/app/workplaces/call-center',
    icon: 'co-m-call-center',
    docs: 'call_center',
  },
  payments: {
    text: 'sidebar.nav.menu.PAYMENTS',
    link: '/app/workplaces/payments',
    icon: 'co-m-payments',
    docs: 'payments',
  },
  courts2: {
    text: 'sidebar.nav.menu.COURTS_2',
    link: '/app/workplaces/courts',
    icon: 'co-m-courts',
    docs: null,
  },
  outgoingInformation: {
    text: 'sidebar.nav.menu.OUTGOING_INFORMATION',
    link: '/app/workplaces/outgoing-information',
    icon: 'co-m-communication-out',
    docs: 'info_debt',
    permission: [
      'INFO_DEBT_DEBTOR_TAB',
      'INFO_DEBT_GUARANTOR_TAB',
      'INFO_DEBT_PLEDGOR_TAB'
    ]
  },
  searchGroups: {
    text: 'sidebar.nav.menu.SEARCH_GROUPS',
    link: '/app/workplaces/search-groups',
    icon: 'co-search-groups',
    docs: null,
  },
  mail: {
    text: 'sidebar.nav.menu.MAIL',
    link: '/app/workplaces/mail',
    icon: 'co-m-mail',
    docs: null,
  },
  incomingCall: {
    text: 'sidebar.nav.menu.INCOMING_CALL',
    link: '/app/workplaces/incoming-call',
    icon: 'co-m-call-incoming',
    docs: 'inner_call',
  },
  debtCard: {
    text: null,
    link: '/app/workplaces/debtor',
    icon: null,
    docs: 'debt_card',
  },

  // Отчеты
  reports: {
    text: 'sidebar.nav.menu.REPORTS',
    link: '/app/reports',
    icon: '',
    docs: 'reports',
  },
  anyReports: {
    text: 'sidebar.nav.menu.REPORTS',
    link: '/app/reports',
    icon: 'co-m-action-log',
    docs: 'reports',
  },

  // Справка
  help: {
    text: 'sidebar.nav.menu.HELP',
    link: '/app/help',
    icon: 'co-m-help',
    docs: null,
  }
};
