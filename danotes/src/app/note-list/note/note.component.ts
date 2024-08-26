import { Component, Input } from '@angular/core';
import { Note } from '../../interfaces/note.interface';
import { NoteListService } from '../../firebase-services/note-list.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  @Input() note!:Note;
  edit = false;
  hovered = false;
  
  constructor(private noteService: NoteListService){}

  changeMarkedStatus(){
    this.note.marked = !this.note.marked;
    this.saveNote();
  }

  deleteHovered(){
    if(!this.edit){
      this.hovered = false;
    }
  }



  openEdit(){
    this.edit = true;
  }

  closeEdit(){
    this.edit = false;
    this.saveNote();
  }

  moveToTrash(){
    if (this.note.id) {
      try {
          this.note.type = 'trash';  // Setzt den Notiztyp auf "trash"
          const docId = this.note.id;  // Speichert die ID der Notiz, Verwendung von 'const' da 'docId' nicht geändert wird
          delete this.note.id;  // Entfernt die ID von der Notiz
          this.noteService.addNote(this.note, "Trash");  // Fügt die Notiz dem Papierkorb hinzu
          this.noteService.deleteNote("Notes", docId);  // Löscht die Notiz aus dem ursprünglichen Speicherort
          console.log(`Document with ID ${docId} successfully moved to Trash`); 
      } catch (error) {
          console.error("An error occurred while moving the note to trash:", error);
        
      }
  }
  
  }


  moveToNotes() {
    if (this.note.id) {  // Überprüft, ob 'this.note' existiert und eine 'id' hat
        try {
            this.note.type = 'note';  // Setzt den Notiztyp auf "note"
            const docId = this.note.id;  // Speichert die ID der Notiz
            delete this.note.id;  // Entfernt die ID von der Notiz
            this.noteService.addNote(this.note, "Notes");  // Fügt die Notiz den normalen Notizen hinzu
            this.noteService.deleteNote("Trash", docId);  // Löscht die Notiz aus dem Papierkorb
            console.log(`Document with ID ${docId} successfully moved to Notes`);
        } catch (error) {
            console.error("An error occurred while moving the note to Notes:", error);
        }
    } else {
        console.warn("No note selected or note ID is missing.");  // Warnung, wenn keine ID vorhanden ist
    }
}

  deleteNote(){
    if (this.note.id) {
      try {
        const docId = this.note.id;  // Speichert die ID der Notiz
        this.noteService.deleteNote("Trash", docId);  // Löscht die Notiz aus dem ursprünglichen Speicherort
        console.log(`Document with ID ${docId} successfully deleted`); 
    } catch (error) {
        console.error("An error occurred while deleting the note:", error);  
    }
} else {
    console.warn("No note selected or note ID is missing."); 
  }

  }

  saveNote(){
    this.noteService.updateNote(this.note);
  }
}
