import bind from 'bind-decorator';
import { Request, Response } from 'express';
import { NoteInteractor, SaveNoteRequest, SaveNoteResponse } from '../../notes';

export class NoteController {
  private noteInteractor: NoteInteractor;

  constructor(noteInteractor: NoteInteractor) {
    this.noteInteractor = noteInteractor;
  }

  @bind
  public async saveNote(req: Request, res: Response): Promise<void> {
    const request = this.buildSaveNoteRequest(req);
    const response = await this.noteInteractor.saveNote(request);
    this.sendSaveNoteResponse(res, response);
  }

  private buildSaveNoteRequest(req: Request): SaveNoteRequest {
    return {
      id: req.params.id,
      title: req.body.title,
      body: req.body.body,
    };
  }

  private sendSaveNoteResponse(res: Response, response: SaveNoteResponse): void {
    if (response.status === 'success') {
      res.status(200);
      res.json(response.note);
    } else if (response.status === 'validation_error') {
      res.status(422);
      res.json(response.validationErrors);
    } else {
      res.status(500);
      res.json();
    }
  }

  @bind
  public async getNote(req: Request, res: Response): Promise<void> {
    const note = await this.noteInteractor.getNote(req.params.id);

    if (note) {
      res.status(200);
      res.json(note);
    } else {
      res.status(404);
      res.json({ type: 'not_found' });
    }
  }

  @bind
  public async getNotes(_req: Request, res: Response): Promise<void> {
    const notes = await this.noteInteractor.getNotes();

    res.status(200);
    res.json(notes);
  }

  @bind
  public async removeNote(req: Request, res: Response): Promise<void> {
    if (await this.noteInteractor.removeNote(req.params.id)) {
      res.status(200);
      res.json();
    } else {
      res.status(404);
      res.json({ type: 'not_found' });
    }
  }
}
