import css from "../Pagination/Pagination.module.css"
import ReactPaginate from "react-paginate";


interface PaginationProps{
    onClickPage: (selectedItem: { selected: number }) => (void);
    pageCount: number,
    currentPage: number
}

export default function Pagination({ onClickPage, pageCount, currentPage }: PaginationProps) {
    if (pageCount <= 1) {
        return null;
      }


    return (
        <ReactPaginate
            pageCount={pageCount} 
            pageRangeDisplayed={5} 
            marginPagesDisplayed={1} 
            onPageChange={onClickPage} 
            forcePage={currentPage - 1} 
            containerClassName={css.pagination} 
            activeClassName={css.active}
            nextLabel="→" 
            previousLabel="←" 
            disabledClassName={css.disabled}
            breakClassName={css.break}
            pageLinkClassName={css.pageLink}
            previousLinkClassName={css.prevLink}
            nextLinkClassName={css.nextLink}
      />
    )

}