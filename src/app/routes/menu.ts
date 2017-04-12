
const Home = {
    text: 'Home',
    link: '/home',
    icon: 'icon-home'
};

const Tree = {
    text: 'Tree',
    link: '/tree',
    icon: 'icon-graph'
};

const Tables = {
    text: 'Tables',
    link: '/tables',
    icon: 'icon-grid',
    submenu: [
        {
            text: 'Ngx Datatable',
            link: '/tables/ngxdatatable'
        },
        // {
        //     text: 'Extended',
        //     link: '/tables/extended'
        // },
        // {
        //     text: 'Data-Tables',
        //     link: '/tables/datatable'
        // },
        // {
        //     text: 'Angular Grid',
        //     link: '/tables/aggrid'
        // }
    ]
};

export const menu = [
    Home,
    Tree,
    Tables,
];
