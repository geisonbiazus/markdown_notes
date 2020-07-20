export class NoteInteractor {
  createNote(params: CreateNoteParams): Note {
    return params;
  }
}

export interface CreateNoteParams {
  id: string;
  title: string;
  body: string;
}

export interface Note {
  id: string;
  title: string;
  body: string;
}
