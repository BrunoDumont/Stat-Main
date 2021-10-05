import React from "react";
import clsx from "clsx";
import {Cell} from "react-table";
import {CSSTransition, TransitionGroup} from "react-transition-group";

//styles
import './body.css'

type RowType = {
  getRowProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>
  cells: {
    getCellProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>
    render: (arg0: string) => boolean | React.ReactChild | React.ReactFragment | React.ReactPortal;
  }[]
}

interface IBodyTable {
  getTableBodyProps: () => void,
  page: [],
  prepareRow: (arg: RowType) => void,
}

const BodyTable: React.FC<IBodyTable> = ({getTableBodyProps, page, prepareRow}) => {
  return (
    <div className="flex" {...getTableBodyProps()} style={{ minHeight: '300px'}}>
      {
        page.length > 0
          ? <TransitionGroup>
            {
              page.map((row: RowType, i: number) => {
                prepareRow(row);
                return (
                  <CSSTransition key={row.id} timeout={500} classNames="fade">
                    <div className="relative" {...row.getRowProps()}>
                      {
                        row.depth > 0
                          ? <div className="absolute h-full w-0.5 bg-gold z-10"/>
                          : null
                      }
                      {row.cells.map((cell: Cell) => {
                        const {style, ...cellProps} = cell.getCellProps()
                        if(cell.column.color){
                          style.background = cell.column.color
                        }
                        return (
                          <div
                            className={clsx("p-4 relative break-words", {
                              "bg-gray-200 bg-opacity-50": i % 2 !== 0,
                              "border-b": cell.column.color
                            })}
                            {...cellProps}
                            style={style}
                          >
                            {cell.render("Cell")}
                          </div>
                        )
                      })}
                    </div>
                  </CSSTransition>
                );
              })
            }
          </TransitionGroup>
          : <p className="p-2 text-center m-auto">Записи отсутствуют</p>
      }
    </div>
  )
}

export default BodyTable