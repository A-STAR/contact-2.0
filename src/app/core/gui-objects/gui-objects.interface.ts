export interface IGuiObject {
  id: number;
  name: string;
  children?: Array<IGuiObject>;
}

export interface IMenuItem {
  text: string;
  link: string;
  icon: string;
  children: Array<IMenuItem>;
};

export interface IGuiObjectsState {
  data: Array<IGuiObject>;
}
