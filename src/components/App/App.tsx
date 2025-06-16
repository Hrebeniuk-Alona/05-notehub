import { useState, useEffect } from 'react'
import css from "../App/App.module.css"

import { type Note } from '../../types/note'
import SearchBox from "../SearchBox/SearchBox.tsx"
import { keepPreviousData, useQuery, useQueryClient  } from "@tanstack/react-query"
import { fetchNotes } from "../../services/noteService"
import NoteList from "../NoteList/NoteList"
import Pagination from '../Pagination/Pagination'
import toast, { Toaster } from 'react-hot-toast';
import { useDebounce } from "use-debounce";
import { type PaginatedNotesResponse } from "../../services/noteService.ts";
import NoteModal from '../NoteModal/NoteModal.tsx'
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx"



function App() {
  const queryClient = useQueryClient(); 
 const [currentSearchQuery, setCurrentSearchQuery]= useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [debouncedSearchQuery] = useDebounce(currentSearchQuery, 500);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  
  
 
  const { data, isFetching, isError, isLoading } = useQuery<
  PaginatedNotesResponse,
  Error
>({
    queryKey: ['notes', currentPage, debouncedSearchQuery],
    queryFn: () => fetchNotes(currentPage, 12, debouncedSearchQuery),
    enabled: true,
    placeholderData:  keepPreviousData
})

 
  const notes: Note[] = data?.notes || [];
  const totalPage:number = data?.totalPages ?? 0;


  const notifyNoNotesFound  = () =>
    toast.error("No movies found for your request.", {
      style: { background: "rgba(125, 183, 255, 0.8)" },
    });
  
  
  useEffect(() => {
    if (data?.notes.length === 0) {
      notifyNoNotesFound()
        return;
    }
  }, [data]);


  const handleSearch = async (newQuery:string)=>{
    setCurrentSearchQuery(newQuery);
    setCurrentPage(1);
    setErrorMessage(null);
  }

  const handlePageClick = (event:{selected:number}) => {
    setCurrentPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setErrorMessage(null);
  }


  const openCreateNoteModal = () => setIsNoteModalOpen(true);
  const closeCreateNoteModal = () => setIsNoteModalOpen(false);

  const handleCloseErrorMessage = () => {
    setErrorMessage(null);
    queryClient.resetQueries({ queryKey: ["notes"], exact: false }); 
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };



  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
	 
          <SearchBox onSubmit={handleSearch} />
          
          {notes.length > 0 && (<Pagination onClickPage={handlePageClick} pageCount={totalPage}
          currentPage={currentPage} />)}
          
          <button className={css.button} onClick={openCreateNoteModal}>Create note +</button>
     
        </header>

        
        {(isLoading || isFetching) && <Loader />}
    
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            onClose={handleCloseErrorMessage}
          />
        )}
        {notes.length > 0 && <NoteList notes={notes} />}

  
        
        {!isLoading &&
          !isFetching &&
          !isError &&
          notes.length === 0 &&
          !currentSearchQuery && (
            <p className={css.initialMessage}>
              Start by searching for notes or create a new one!
            </p>
          )}
        {!isLoading &&
          !isFetching &&
          !isError &&
          notes.length === 0 &&
          currentSearchQuery && (
            <p className={css.noResultsMessage}>
              No notes found for "{currentSearchQuery}".
            </p>
          )}
        <Toaster />
        {isNoteModalOpen && <NoteModal onClose={closeCreateNoteModal} />}
      </div>
    </>


  )
}

export default App
