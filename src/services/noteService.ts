import axios from "axios"
import { type Note} from '../types/note'
import type { NoteTag } from "../types/note";



export interface NewNoteContent {
    title: string;
    content: string;
    tag: NoteTag;
  }
  
  export interface PaginatedNotesResponse {
    notes: Note[];
    page: number;
    totalPages: number;
    totalResults: number;
  }


const BASE_URL = "https://notehub-public.goit.study/api";

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = ""
): Promise<PaginatedNotesResponse> => {
  try {
    const response = await axiosConfig.get<PaginatedNotesResponse>("/notes", {
      params: {
        page,
        ...(search !== "" && { search: search }),
        perPage,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching notes:", error.message);
    } else {
      console.error("Unexpected error fetching notes:", error);
    }
    throw error;
  }
};

export const createNote = async (content: NewNoteContent): Promise<Note> => {
  try {
    const response = await axiosConfig.post<Note>("/notes", content);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating note:", error.message);
    } else {
      console.error("Unexpected error creating note:", error);
    }
    throw error;
  }
};

export const deleteNote = async (id: number): Promise<Note> => {
  try {
    const response = await axiosConfig.delete<Note>(`/notes/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error deleting note with ID ${id}:`, error.message);
    } else {
      console.error("Unexpected error deleting note:", error);
    }
    throw error;
  }
};