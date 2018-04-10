export class Transitions<T> {
  fromStates: T[];
  toStates: T[];

  constructor(public fsm: FSM<T>) { }

  to(...states: T[]): void {
    this.toStates = states;
    this.fsm.addTransitions(this);
  }

  toAny(states: any): void {
    const toStates: T[] = [];
    for (const s in states) {
      if (states.hasOwnProperty(s)) {
        toStates.push((<T>states[s]));
      }
    }
    this.toStates = toStates;
    this.fsm.addTransitions(this);
  }
}

export class TransitionFunction<T> {
  constructor(public fsm: FSM<T>, public from: T, public to: T) { }
}


export class FSM<T> {

  currentState: T;
  private _startState: T;
  private _onCallbacks: { [key: string]: ((from: T, event?: any) => void)[] } = {};
  private _transitionFunctions: TransitionFunction<T>[] = [];

  constructor(startState: T) {
    this.currentState = startState;
    this._startState = startState;
  }

  addTransitions(trns: Transitions<T>): void {
    trns.fromStates.forEach(from => {
      trns.toStates.forEach(to => {
        if (!this._canGo(from, to)) {
          this._transitionFunctions.push(new TransitionFunction<T>(this, from, to));
        }
      });
    });
  }

  on(state: T, callback: (from?: T, event?: any) => any): FSM<T> {
    const key = state.toString();
    if (!this._onCallbacks[key]) {
      this._onCallbacks[key] = [];
    }
    this._onCallbacks[key].push(callback);
    return this;
  }

  reset(): void {
    this.currentState = this._startState;
  }

  is(state: T): boolean {
    return this.currentState === state;
  }

  from(...states: T[]): Transitions<T> {
    const _transition = new Transitions<T>(this);
    _transition.fromStates = states;
    return _transition;
  }

  go(state: T, event?: any): void {
    if (this.canGo(state)) {
      this._transitionTo(state, event);
    }
  }

  canGo(state: T): boolean {
    return this._canGo(this.currentState, state);
  }

  private _canGo(from: T, to: T): boolean {
    return from === to || this._validTransition(from, to);
  }

  private _validTransition(from: T, to: T): boolean {
    return this._transitionFunctions.some(tf => {
       return (tf.from === from && tf.to === to);
    });
  }

  private _transitionTo(state: T, event?: any): void {

    if (!this._onCallbacks[state.toString()]) {
       this._onCallbacks[state.toString()] = [];
    }

    const old = this.currentState;
    this.currentState = state;
    this._onCallbacks[this.currentState.toString()].forEach(cb => {
       cb.call(this, old, event);
    });
  }
}


