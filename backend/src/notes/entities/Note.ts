export interface NoteParams {
  id?: string;
  title?: string;
  body?: string;
  html?: string;
}

export class Note {
  public id: string;
  public title: string;
  public body: string;
  public html: string;

  constructor({ id = '', title = '', body = '', html = '' }: NoteParams) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.html = html;
  }
}
