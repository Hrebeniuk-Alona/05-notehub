import css from "../SearchBox/SearchBox.module.css"
import { useState } from 'react';


interface SearchBoxProps{
    onSubmit:(query:string)=> void,
}


export default function SearchBox({ onSubmit }: SearchBoxProps) {
    const [value, setValue] = useState("");


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
    setValue(inputValue);
    onSubmit(inputValue);
      };
    

    return (
        <>
            <input
             className={css.input}
             type="text"
             value={value}
             onChange={handleChange}
                placeholder="Search notes" />
    </>    )
   

}