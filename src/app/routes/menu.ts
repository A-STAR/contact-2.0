
const Home = {
    text: 'Home',
    link: '/home',
    icon: 'icon-home'
};

const Grids = {
    text: 'Grids',
    link: '/grids',
    icon: 'icon-list'
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
    Grids,
    Tables,
];
