export interface MenuItem {
    text: string;
    heading?: boolean;
    link?: string;
    icon?: string;
    alert?: string;
    submenu?: Array<any>;
}
