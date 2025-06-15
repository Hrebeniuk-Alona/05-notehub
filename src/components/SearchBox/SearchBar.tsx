import toast from 'react-hot-toast'
import css from "../SearchBox/SearchBox.module.css"

interface SearchBoxProps{
    onSubmit:(query:string)=> void,
}
const notifyError = () => toast('Please enter your search query.');

export default function SearchBox({onSubmit}:SearchBoxProps) {

    const handleSubmit = (formData: FormData) => {
        if (formData.get("query") === "") {
            notifyError();
                return
        }
   

    const query = formData.get("query") as string;

    onSubmit(query);
     }

    return (
        <>  
    <form action={handleSubmit}>
        <input
             className={css.input}
             type="text"
                placeholder="Search notes" />

    </form>
    </>    )
   

}