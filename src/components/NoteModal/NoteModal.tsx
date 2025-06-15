import ReactDOM from "react-dom";
import NoteForm from "../NoteForm/NoteForm";
import css from "../NoteModal/NoteModal.module.css"
import { useEffect } from "react";

interface NoteModalProps{
    onClose:()=>(void)
}

export default function NoteModal({onClose}:NoteModalProps) {
    
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }
    
      useEffect(() => {
        const handleKeyDown = (e:KeyboardEvent) => {
          if (e.key === "Escape") {
            onClose()
          }
        }
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
          document.removeEventListener("keydown", handleKeyDown);
          document.body.style.overflow = "";
          };
       },
        [onClose])
    
    
    
    
    

    return ReactDOM.createPortal(
        <div
  className={css.backdrop}
  role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
>
  <div className={css.modal}>
                <NoteForm onCancel={onClose} onModalClose={onClose} />
            </div>
            
    </div>,
     document.body

    )
}