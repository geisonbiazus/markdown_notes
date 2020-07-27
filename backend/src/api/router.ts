import express from 'express';
import { NoteInteractor, InMemoryRepository, SaveNoteRequest } from '../notes';

export const router = express();

router.put('/notes/:id', async (req, res) => {
  const interactor = new NoteInteractor(new InMemoryRepository());
  const request = new SaveNoteRequest({ id: req.param('id') });
  const response = await interactor.saveNote(request);

  res.type('application/json');
  res.status(422);
  res.send({ status: 'validation_error', errors: response.errors });
});
