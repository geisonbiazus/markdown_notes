import bind from 'bind-decorator';
import { Request, Response } from 'express';
import { User } from '../../authentication';
import { Note } from '../../notes/entities/Note';
import { NotesFacade } from '../../notes/NotesFacade';
import { SaveNoteRequest, SaveNoteResponse } from '../../notes/useCases/SaveNoteUseCase';

interface NoteJSON {
  id: string;
  title: string;
  body: string;
  html: string;
}

export class NoteController {
  private notesFacade: NotesFacade;

  constructor(notesFacade: NotesFacade) {
    this.notesFacade = notesFacade;
  }

  @bind
  public async saveNote(req: Request, res: Response, user: User): Promise<void> {
    const request = this.buildSaveNoteRequest(req, user);
    const response = await this.notesFacade.saveNote(request);
    this.sendSaveNoteResponse(res, response);
  }

  private buildSaveNoteRequest(req: Request, user: User): SaveNoteRequest {
    return {
      id: req.params.id,
      title: req.body.title,
      body: req.body.body,
      userId: user.id,
    };
  }

  private sendSaveNoteResponse(res: Response, response: SaveNoteResponse): void {
    if (response.status === 'success') {
      res.status(200);
      res.json(this.noteJson(response.note));
    } else if (response.status === 'validation_error') {
      res.status(422);
      res.json(response.validationErrors);
    } else {
      res.status(500);
      res.json();
    }
  }

  @bind
  public async getNote(req: Request, res: Response, user: User): Promise<void> {
    const note = await this.notesFacade.getNote(user.id, req.params.id);

    if (note) {
      res.status(200);
      res.json(this.noteJson(note));
    } else {
      res.status(404);
      res.json({ type: 'not_found' });
    }
  }

  @bind
  public async getNotes(_req: Request, res: Response, user: User): Promise<void> {
    const notes = await this.notesFacade.getNotes(user.id);

    res.status(200);
    res.json(notes.map(this.noteJson));
  }

  @bind
  public async removeNote(req: Request, res: Response): Promise<void> {
    if (await this.notesFacade.removeNote(req.params.id)) {
      res.status(200);
      res.json();
    } else {
      res.status(404);
      res.json({ type: 'not_found' });
    }
  }

  private noteJson(note: Note): NoteJSON {
    return {
      id: note.id,
      title: note.title,
      body: note.body,
      html: note.html,
    };
  }
}
