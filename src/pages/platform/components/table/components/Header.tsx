//core
import React, {useState} from "react";
import {ColumnTable, TableOptions} from "@pages/platform/components/table/Table";
import HeaderMenu from "@pages/platform/components/table/components/HeaderMenu";

interface IHeaderTable {
  headerGroups: object[],
  options: TableOptions
  setCols: (arg0: ColumnTable[]) => void
}

const HeaderTable: React.FC<IHeaderTable> = ({headerGroups, options, setCols}) => {
  const [showMenu, setShowMenu] = useState('')
  return (
    <>
      {headerGroups.map((headerGroup: { getHeaderGroupProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>; headers: any[]; }) => (
        <div {...headerGroup.getHeaderGroupProps()}>
          {
            headerGroup.headers.map(column => {
              return <div
                className="p-4 bg-gray-200 flex flex-row bg-opacity-50 transition-opacity font-bold hover:bg-opacity-25"
                {...column.getHeaderProps()}
                onMouseEnter={() => setShowMenu(column.id)}
                onMouseLeave={() => setShowMenu('')}
              >
                <div className="flex">
                  <p className="pr-6 truncate" {...column.getSortByToggleProps()}>
                    {column.render('Header')}
                  </p>
                  <div className="w-12 flex ml-auto">
                    {
                      column.isSorted && (column.isSortedDesc
                          ? <p className="material-icons text-base ml-1 my-auto">south</p>
                          : <p className="material-icons text-base ml-1 my-auto">north</p>
                      )
                    }
                    {
                      options.template && showMenu === column.id && <HeaderMenu
                          options={options}
                          column={column}
                          setCols={setCols}
                      />
                    }
                  </div>
                </div>


                <div
                  className="absolute top-0 right-0 h-full w-1 z-10" {...column.getResizerProps()}
                />
              </div>
            })}
        </div>
      ))}
    </>
  )
}

export default HeaderTable

