import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubNotes: () => void;
  unsubTrash: () => void;

  firestore: Firestore = inject(Firestore);

  constructor() { 
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
  }

 /*  async deleteNote(colId: string, docId: string) {
    if (docId) {
      try {
        await deleteDoc(this.getSingleDocRef(colId, docId));
        console.log('Document successfully deleted');
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    } else {
      console.error('No document ID provided for deletion');
    }
  } */
  
  async deleteNote(colId: string, docId: string){
   await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
     (err) => {console.log(err)}
  );
}


  async updateNote(note: Note) {
    if(note.id){
    try {
      await updateDoc(this.getSingleDocRef(this.getColIdFromNote(note), note.id), this.getCleanJson(note));
      console.log('Document successfully updated');
    } catch (err) {
      console.error('Error updating document: ', err);
    }
  }
  }

  getCleanJson(note: Note) {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getColIdFromNote(note: Note) {
    return note.type === 'note' ? 'Notes' : 'Trash';
  }

  async addNote(item: Note) {
    try {
      const docRef = await addDoc(this.getNotesRef(), item);
      console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    };
  }

  getNotesRef() {
    return collection(this.firestore, 'Notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'Trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(this.firestore, colId, docId);
  }
}
