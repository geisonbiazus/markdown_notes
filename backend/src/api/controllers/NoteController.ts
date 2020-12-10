import bind from 'bind-decorator';
import { Request, Response } from 'express';
import { Note, NoteInteractor, SaveNoteRequest } from '../../notes';
import { InteractorResponse } from '../../utils/interactor';
import { resolveHttpStatus } from '../helpers';

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

  private sendSaveNoteResponse(res: Response, response: InteractorResponse<Note>): void {
    const { status, validationErrors, data } = response;

    if (status === 'success') {
      res.status(200);
      res.json(data);
    } else {
      res.status(422);
      res.json(validationErrors);
    }
  }

  @bind
  public async getNote(req: Request, res: Response): Promise<void> {
    const response = await this.noteInteractor.getNote(req.params.id);
    const { status, type, data } = response;

    if (status == 'success') {
      res.status(200);
      res.json(data);
    } else {
      res.status(404);
      res.json({ type });
    }
  }

  @bind
  public async getNotes(_req: Request, res: Response): Promise<void> {
    const response = await this.noteInteractor.getNotes();

    res.status(200);
    res.json(response.data);
  }

  @bind
  public async removeNote(req: Request, res: Response): Promise<void> {
    const response = await this.noteInteractor.removeNote(req.params.id);
    const { status, type } = response;

    if (status == 'success') {
      res.status(200);
      res.json();
    } else {
      res.status(404);
      res.json({ type });
    }
  }
}
