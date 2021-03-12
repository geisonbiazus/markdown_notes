import { Note } from './entitites/Note';

export const NOTE_SAVED_EVENT = 'note_saved';
export type NoteSavedPayload = Note;

export const NOTE_REMOVED_EVENT = 'note_removed';
export type NoteRemovedPayload = Note;

export const NOTE_LOADED_FOR_SHOWING_EVENT = 'note_loaded_for_showing';
export type NoteLoadedForShowingPayload = Note;

export const NOTE_LOADED_FOR_EDITING_EVENT = 'note_loaded_for_editing';
export type NoteLoadedForEditingPayload = Note;
