import { Request, Response } from 'express';
import { NoteInteractor, SaveNoteRequest, InteractorResponse, Note } from '../../notes';
import { resolveHttpStatus } from '../helpers';

export class NoteController {
  private noteInteractor: NoteInteractor;

  constructor(noteInteractor: NoteInteractor) {
    this.noteInteractor = noteInteractor;
  }

  saveNote = async (req: Request, res: Response): Promise<void> => {
    const request = this.buildSaveNoteRequest(req);
    const response = await this.noteInteractor.saveNote(request);
    this.sendSaveNoteResponse(res, response);
  };

  private buildSaveNoteRequest(req: Request): SaveNoteRequest {
    return {
      id: req.params.id,
      title: req.body.title,
      body: req.body.body,
    };
  }

  private sendSaveNoteResponse(res: Response, response: InteractorResponse<Note>): void {
    const { status, validationErrors, data } = response;

    res.status(resolveHttpStatus(response));
    res.json({ status, errors: validationErrors, note: data });
  }

  getNote = async (req: Request, res: Response): Promise<void> => {
    const response = await this.noteInteractor.getNote(req.params.id);
    const { status, type, data } = response;

    res.status(resolveHttpStatus(response));
    res.json({ status, type, note: data });
  };

  getNotes = async (_req: Request, res: Response): Promise<void> => {
    const response = await this.noteInteractor.getNotes();
    const { status, data } = response;

    res.status(resolveHttpStatus(response));
    res.json({ status, notes: data });
  };

  removeNote = async (req: Request, res: Response): Promise<void> => {
    const response = await this.noteInteractor.removeNote(req.params.id);
    const { status, type } = response;

    res.status(resolveHttpStatus(response));
    res.json({ status, type });
  };
}
