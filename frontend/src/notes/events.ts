import { Note } from './entities';

export const NOTE_SAVED_EVENT = 'note_saved';
export type NoteSavedPayload = Note;

export const NOTE_REMOVED_EVENT = 'note_removed';
export type NoteRemovedPayload = Note;
