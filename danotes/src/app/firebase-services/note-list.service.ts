import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { collectionData,Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

unsubNotes;
unsubTrash;

  firestore: Firestore = inject(Firestore);

  constructor() { 
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
}
 
ngonDestroy(){
  this.unsubNotes
 this.unsubTrash();

}

subTrashList(){
 return onSnapshot(this.getTrashRef(),(list) => {
    this.trashNotes = [];
    list.forEach(element => {
      this.trashNotes.push(this.setNoteObject(element.data(), element.id));
    });
  });
}

subNotesList(){
 return onSnapshot(this.getNotesRef(),(list) => {
    this.normalNotes = [];
    list.forEach(element => {
      this.normalNotes.push(this.setNoteObject(element.data(), element.id));
    });
  });
}

setNoteObject(obj: any, id:string): Note {
  return {
    id: id || "",
    type: obj.type || "note",
    title: obj.title || "",
    content: obj.content || "",
    marked: obj.marked || false,
  }

}

ngOnDestroy(){}

  getNotesRef(){
    return collection(this.firestore, 'Notes');
  }

  getTrashRef(){
    return collection(this.firestore, 'Trash');
  }

   getSingleDocRef(colId:string, docId:string){
    return doc(collection(this.firestore, colId), docId);
   }
}
