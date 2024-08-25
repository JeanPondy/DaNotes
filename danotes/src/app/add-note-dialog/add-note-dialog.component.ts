import { Component, Output, EventEmitter } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service';  // Korrigiere den Pfad, falls nötig

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-note-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-note-dialog.component.html',
  styleUrl: './add-note-dialog.component.scss'
})
export class AddNoteDialogComponent {
  @Output() addDialogClosed: EventEmitter<boolean> = new EventEmitter();
  title = "";
  description = "";

  constructor(private noteService: NoteListService){}

  closeDialog() {
    this.title = "";
    this.description = "";
    this.addDialogClosed.emit(false);
  }
  addNote(colId: "notes" | "trash") { // Anpassen der Methode
    let note: Note = {
      type: "note",
      title: this.title,
      content: this.description,
      marked: false,
    };
    
    // Übergabe des colId-Parameters an die Service-Methode
    this.noteService.addNote(note, colId); 

    this.addDialogClosed.emit(false);

    // beachte das closeDialog() zum Schluss kommt, denn es leert die Variablen
    this.closeDialog();
  }

}