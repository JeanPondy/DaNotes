import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { collectionData,Firestore, collection, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  
items$;
  firestore: Firestore = inject(Firestore);

  constructor() { 
    this.items$ = collectionData(this.getNotesRef());
  }
 


  /* Datenbank abrufen */

   //const itemCollection = collection(this.firestore, 'items');

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
