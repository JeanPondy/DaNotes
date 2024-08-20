import { Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  private notes: Note[] = [];

  addNote(note: Note) {
    this.notes.push(note);
  }

  getNotes(): Note[] {
    return this.notes;
  }
}
