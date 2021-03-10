export abstract class Event<TName, TPayload> {
  constructor(public name: TName, public payload: TPayload) {}
}
