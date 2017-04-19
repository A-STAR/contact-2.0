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
      text: 'Sortable columns',
      link: '/grid/sortable'
    },
    // {
    //   text: 'Angular Grid',
    //   link: '/tables/aggrid'
    // }
  ]
};

export const menu = [
  Home,
  Tree,
  QueryBuilder,
  Grid,
];
