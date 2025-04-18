import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is installed for unique IDs

// Define the type for a single document
interface Document {
  id: string;
  title: string;
  initialContent: string; // Adjust type if needed (e.g., JSON, specific editor format)
}

// Define the state structure for the store
interface DocumentState {
  documents: Record<string, Document>; // Using a Record (object map) for easy lookup by ID
  currentDocumentId: string | null;
  addDocument: (title: string, initialContent: string) => void;
  setCurrentDocumentId: (id: string | null) => void;
}

// Create the Zustand store
const useDocumentStore = create<DocumentState>(set => ({
  documents: {},
  currentDocumentId: null,

  addDocument: (title, initialContent) => {
    const newDocument: Document = {
      id: uuidv4(), // Generate a unique ID
      title,
      initialContent,
    };
    set(state => ({
      documents: {
        ...state.documents,
        [newDocument.id]: newDocument,
      },
      // Optionally set the new document as the current one
      // currentDocumentId: newDocument.id
    }));
  },

  setCurrentDocumentId: id => {
    set(state => {
      // Ensure the ID exists in the documents before setting it
      if (id === null || state.documents[id]) {
        return { currentDocumentId: id };
      }
      // Optionally log a warning or handle the case where the ID doesn't exist
      console.warn(`Document with ID "${id}" not found.`);
      return {}; // Return empty object to not change state if ID is invalid
    });
  },
}));

export default useDocumentStore;
