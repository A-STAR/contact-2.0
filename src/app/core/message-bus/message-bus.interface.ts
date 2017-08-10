export interface IBusMessage<T, P> {
  key: string;
  type: T;
  payload: P;
}
