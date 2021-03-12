export interface Note {
  id: string;
  title: string;
  body: string;
  html: string;
}

export function newNote(params: Partial<Note> = {}): Note {
  return {
    id: '',
    title: '',
    body: '',
    html: '',
    ...params,
  };
}
