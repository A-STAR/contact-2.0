const Home = {
  text: 'Home',
  link: '/home',
  icon: 'icon-home'
};

const Tree = {
  text: 'Workflow',
  link: '/workflow',
  icon: 'icon-graph'
};

const QueryBuilder = {
  text: 'Query Builder',
  link: '/query-builder',
  icon: 'icon-list'
};

const Grid = {
  text: 'Grids',
  link: '/grid',
  icon: 'icon-grid',
  submenu: [
    {
      text: 'Large dataset',
      link: '/grid/large'
    },
    {
      text: 'Sortable',
      link: '/grid/sortable'
    },
    {
      text: 'Reorderable',
      link: '/grid/reorderable'
    },
    {
      text: 'Groupable',
      link: '/grid/groupable'
    },
  ]
};

export const menu = [
  Home,
  Tree,
  QueryBuilder,
  Grid,
];
