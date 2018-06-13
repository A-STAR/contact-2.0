import { Observable } from 'rxjs/Observable';

export interface IGuiObject {
  id: number;
  name: string;
  children?: Array<IGuiObject>;
}

export interface IMenuItem {
  text: string;
  link: string;
  icon: string;
  docs: string;
  children: Array<IMenuItem>;
  isActive?: boolean;
  permission?: Observable<boolean>;
}

export interface IGuiObjectsState {
  data: Array<IGuiObject>;
  selectedObject: IGuiObject;
}
