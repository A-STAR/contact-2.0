import { Observable } from 'rxjs/Observable';

export interface IGuiObject {
  id: number;
  name: string;
  children?: Array<IGuiObject>;
}

export interface IMenuItem {
  icon: string;
  text: string;
  link: string;
  docs: string;
  isActive?: boolean;
  children: Array<IMenuItem>;
  permission?: Observable<boolean>;
}

export interface IGuiObjectsState {
  data: Array<IGuiObject>;
  selectedObject: IGuiObject;
}
