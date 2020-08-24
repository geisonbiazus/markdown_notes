import { Request, Response } from 'express';
import { NoteInteractor, SaveNoteRequest, SaveNoteResponse } from '../../notes';

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

  private sendSaveNoteResponse(res: Response, response: SaveNoteResponse): void {
    if (response.status === 'error') {
      res.status(422);
      res.json({ status: 'validation_error', errors: response.errors });
    } else {
      res.json({ status: 'success', note: response.data });
    }
  }

  getNote = async (req: Request, res: Response): Promise<void> => {
    const response = await this.noteInteractor.getNote(req.params.id);

    if (response.status == 'error') {
      res.status(404);
      res.json({ status: 'error', type: 'not_found' });
    } else {
      res.json({ status: 'success', note: response.data });
    }
  };

  getNotes = async (req: Request, res: Response): Promise<void> => {
    const response = await this.noteInteractor.getNotes();

    res.json({ status: 'success', notes: response.data });
  };
}
