import { NoteInteractor } from "./NoteInteractor";
import { uuid } from "./utils";

describe("NoteInteractor", () => {
  it("initializes", () => {
    const noteInteractor = new NoteInteractor();
  });

  describe("createNote", () => {
    it("creates a new note", () => {
      const noteInteractor = new NoteInteractor();
      const noteId = uuid();

      const params = {
        id: noteId,
        title: "Title",
        body: "body",
      };

      const expectedNote = {
        id: noteId,
        title: "Title",
        body: "body",
      };

      expect(noteInteractor.createNote(params)).toEqual(expectedNote);
    });
  });
});
