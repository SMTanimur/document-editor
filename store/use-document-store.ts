import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is installed for unique IDs
import { Document as DocType } from '@/types';

// Define the type for a single document
interface Document {
  id: string;
  title: string;
  initialContent: string; // Adjust type if needed (e.g., JSON, specific editor format)
}

// Define the state structure for the store
interface DocumentState {
  documents: Record<string, DocType>; // Using a Record (object map) for easy lookup by ID
  currentDocumentId: string | null;
  
  // Document operations
  addDocument: (title: string, initialContent: string) => string;
  updateDocument: (params: { id: string; title: string }) => void;
  removeDocument: (params: { id: string }) => void;
  setCurrentDocumentId: (id: string | null) => void;
}

// Create the Zustand store
const useDocumentStore = create<DocumentState>(set => ({
  documents: {},
  currentDocumentId: null,

  addDocument: (title, initialContent) => {
    const id = uuidv4();
    const newDocument: DocType = {
      _id: id,
      title,
      content: initialContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set(state => ({
      documents: {
        ...state.documents,
        [id]: newDocument,
      },
    }));
    
    return id;
  },

  updateDocument: ({ id, title }) => {
    set(state => {
      if (!state.documents[id]) {
        console.warn(`Document with ID "${id}" not found.`);
        return {};
      }
      
      return {
        documents: {
          ...state.documents,
          [id]: {
            ...state.documents[id],
            title,
            updatedAt: new Date(),
          },
        },
      };
    });
  },

  removeDocument: ({ id }) => {
    set(state => {
      const newDocuments = { ...state.documents };
      delete newDocuments[id];
      
      return {
        documents: newDocuments,
        // Reset current document if we're deleting the current one
        currentDocumentId: state.currentDocumentId === id ? null : state.currentDocumentId,
      };
    });
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
