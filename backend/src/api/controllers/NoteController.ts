import { Request, Response } from 'express';
import { NoteInteractor, InMemoryRepository, SaveNoteRequest } from '../../notes';

export class NoteController {
  async saveNote(req: Request, res: Response) {
    const interactor = new NoteInteractor(new InMemoryRepository());
    const request = new SaveNoteRequest({
      id: req.param('id'),
      title: req.param('title'),
      body: req.param('body'),
    });
    const response = await interactor.saveNote(request);

    if (response.status === 'error') {
      res.status(422);
      res.json({ status: 'validation_error', errors: response.errors });
    } else {
      res.json({ status: 'success', note: response.data });
    }
  }
}
