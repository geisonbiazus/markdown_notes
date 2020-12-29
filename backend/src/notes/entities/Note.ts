export interface NoteParams {
  id?: string;
  title?: string;
  body?: string;
  html?: string;
  userId?: string;
}

export class Note {
  public id: string;
  public title: string;
  public body: string;
  public html: string;
  public userId: string;

  constructor({ id = '', title = '', body = '', html = '', userId = '' }: NoteParams) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.html = html;
    this.userId = userId;
  }
}
