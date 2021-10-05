import React from "react";
import clsx from "clsx";

interface IPagination {
    gotoPage: (arg: number) => void,
    canPreviousPage: boolean,
    previousPage: () => void,
    canNextPage: boolean,
    nextPage: () => void,
    pageIndex: number,
    pageCount: number
    rowCount: number
}

const Pagination: React.FC<IPagination> = ({gotoPage, canPreviousPage, previousPage, canNextPage, nextPage, pageIndex, pageCount, rowCount}) => {
    return <div className="relative mt-4">
        <span className="absolute flex text-gray-300 cursor-default">
            <span className="hidden md:inline-block">Всего: {' '}</span>
            <span className="inline-block">{rowCount}</span>
        </span>
        <div className="flex justify-center">

            <span
                onClick={() => canPreviousPage && gotoPage(0)}
                className={
                    clsx("material-icons text-gray-300 my-auto cursor-default",
                        {"hover:text-gray-600 cursor-pointer": canPreviousPage})
                }
            >
              first_page
            </span>
            <span
                onClick={() => canPreviousPage && previousPage()}
                className={
                    clsx("material-icons text-gray-300 my-auto cursor-default",
                        {"hover:text-gray-600 cursor-pointer": canPreviousPage})
                }
            >
              chevron_left
            </span>

            <span className="text-gray-300 my-auto cursor-default">
                {pageIndex + 1} из {pageCount}
            </span>

            <span
                onClick={() => canNextPage && nextPage()}
                className={
                    clsx("material-icons text-gray-300 my-auto cursor-default",
                        {"hover:text-gray-600 cursor-pointer": canNextPage})
                }
            >
              chevron_right
            </span>

            <span
                onClick={() => canNextPage && gotoPage(pageCount - 1)}
                className={
                    clsx("material-icons text-gray-300 my-auto cursor-default",
                        {"hover:text-gray-600 cursor-pointer": canNextPage})
                }
            >
              last_page
            </span>
        </div>
    </div>
}

export default Pagination