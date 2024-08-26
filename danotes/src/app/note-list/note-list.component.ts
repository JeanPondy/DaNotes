import { Component } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note/note.component';



@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NoteComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss'
})
export class NoteListComponent {
  noteList: Note[] = [];
  favFilter: "all" | "fav" = "all";
  status: "Notes" | "Trash" = "Notes";

  constructor(private noteService: NoteListService) {
  
  }

  getList(): Note[]{
   if (this.status == 'Notes'){
    if(this.favFilter == 'all'){
      return this.noteService.normalNotes; 
    } else {
      return this.noteService.normalMarkedNotes;
    } 
  }else {
      return this.noteService.trashNotes
    }
   
  }

  getListTrash(): Note[]{
    return this.noteService.trashNotes;
  }
 
  changeFavFilter(filter:"all" | "fav"){
    this.favFilter = filter;
  }

  changeTrashStatus(){
    if(this.status == "Trash"){
      this.status = "Notes";
    } else {
      this.status = "Trash";
      this.favFilter = "all";
    }
  }
}

