import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];

  unsubNotes: () => void;
  unsubTrash: () => void;
  unsubMarkedNotes: () => void;

  firestore: Firestore = inject(Firestore);

  constructor() { 
    this.unsubNotes = this.subNotesList("Notes");
    this.unsubTrash = this.subTrashList();
    this.unsubMarkedNotes = this.subMarkedNotesList("Notes");
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
  
  async deleteNote(colId: "Notes" | "Trash", docId: string){
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

  getCleanJson(note: Note) {//Hilfsfunktion
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getColIdFromNote(note: Note) {//Hilfsfunktion
    return note.type === 'note' ? 'Notes' : 'Trash';
  }
  

  async addNote(item: Note, colId: "Notes" | "Trash") {
    try {
      const docRef = await addDoc(this.getNotesRef(colId), item); // Übergabe des colId
      console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarkedNotes();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList(colId: "Notes" | "Trash") {
    const q = query(this.getNotesRef(colId), limit(100));
  
    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const noteData = change.doc.data();
        const noteId = change.doc.id;
        const note = this.setNoteObject(noteData, noteId);
  
        if (change.type === "added") {
          this.normalNotes.push(note);
          console.log("New note added: ", note);
        }
        if (change.type === "modified") {
          const index = this.normalNotes.findIndex(n => n.id === noteId);
          if (index !== -1) {
            this.normalNotes[index] = note;
            console.log("Note modified: ", note);
          }
        }
        if (change.type === "removed") {
          this.normalNotes = this.normalNotes.filter(n => n.id !== noteId);
          console.log("Note removed: ", note);
        }
      });
    });
  }

  subMarkedNotesList(colId: "Notes" | "Trash") {

    const q = query(this.getNotesRef(colId), where("marked", "==", true) ,limit(3));

    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = []; // Leeren des Arrays vor dem Hinzufügen neuer Notizen
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  /* ------------------------------------------------------------------------------- */
  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    };
  }

  getNotesRef(colId: "Notes" | "Trash") {
    return collection(this.firestore, colId); // Verwendung des colId-Parameters
  }

  getTrashRef() {
    return collection(this.firestore, 'Trash');
  }


  getSingleDocRef(colId: string, docId: string) {
    return doc(this.firestore, colId, docId);
  }
}



 


 

 

 

