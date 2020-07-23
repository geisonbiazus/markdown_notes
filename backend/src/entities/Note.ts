export interface NoteParams {
  id?: string;
  title?: string;
  body?: string;
}

export class Note {
  public id: string;
  public title: string;
  public body: string;

  constructor({ id = '', title = '', body = '' }: NoteParams) {
    this.id = id;
    this.title = title;
    this.body = body;
  }
}
