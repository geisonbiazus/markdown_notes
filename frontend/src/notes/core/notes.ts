export interface Note {
  id: string;
  title: string;
  body: string;
}

export const saveNote = async (note: Note): Promise<void> => {
  console.log(note);
};
