import css from "../NoteForm/NoteForm.module.css"
import { Form, Formik, Field, ErrorMessage as FormikErrorMessage } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { type NewNoteContent, createNote } from "../../services/noteService.ts";
import { type NoteTag } from "../../types/note";





interface NoteFormProps {
    onCancel: () => void; 
    onModalClose: () => void; 
  }
  
  const initialValues: NewNoteContent = {
    title: "",
    content: "",
    tag: "Personal", 
  };


  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title must be at most 50 characters")
      .required("Title is required"),
    content: Yup.string().max(500, "Content must be at most 500 characters"),
    tag: Yup.string<NoteTag>() 
      .oneOf(
        ["Todo", "Work", "Personal", "Meeting", "Shopping"],
        "Invalid tag selected"
      )
      .required("Tag is required"),
  });



export default function NoteForm({ onCancel, onModalClose }: NoteFormProps) {
    
    const queryClient = useQueryClient(); 

    const createNoteMutation = useMutation<Note, Error, NewNoteContent>({
        mutationFn: createNote, 
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notes"] }); 
          toast.success("Note created successfully!"); 
          onModalClose(); 
        },
        onError: (error) => {
          toast.error(`Error creating note: ${error.message}`); 
        },
      });
    
    

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
                createNoteMutation.mutate(values);
                resetForm();
             }} >

        
 {()=>(
                <Form className={css.form}>
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
    <Field id="title" type="text" name="title" className={css.input} />
    <FormikErrorMessage
              name="title"
              component="span"
              className={css.error}
            />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
    <Field
      id="content"
      name="content"
      rows="8"
      className={css.textarea}
    />
    <FormikErrorMessage
         name="content"
        component="span"
         className={css.error}
            />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="tag">Tag</label>
    <Field as="select" id="tag" name="tag" className={css.select}>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </Field>
    <FormikErrorMessage
              name="tag"
              component="span"
              className={css.error}
            />
  </div>

  <div className={css.actions}>
    <button type="button" className={css.cancelButton}
        onClick={onCancel}>
      Cancel
    </button>
    <button
      type="submit"
      className={css.submitButton}
      disabled={createNoteMutation.isPending}
    >
      Create note
    </button>
  </div>
</Form>)}
</Formik>
    )
}