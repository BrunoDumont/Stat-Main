//core
import React, {FormEvent, useEffect} from "react";
import {ColumnTable, TableOptions} from "@pages/platform/components/table/Table";
import {useMutation} from "@apollo/client";
import UpdateTableColumnTemplate from "@gql/table/updateTableColumnTemplate.gql";
import CheckBox from "@components/Base/CheckBox";
import {useParams} from "react-router-dom";
import {URL_PARAMS} from "@pages/platform/Platform";

interface IHeaderMenu {
  column: any,
  options: TableOptions
  setCols: (arg0: ((arg1: ColumnTable[]) => ColumnTable[]) | ColumnTable[]) => void
}

interface IColorControl {
  color: string
  column: any
  updateColor: (arg0: string) => void
}

const ColorControl: React.FC<IColorControl> = ({column, color, updateColor}) => {
  return <span
    className="cursor-pointer w-5 h-5 rounded-full flex transform hover:scale-110"
    style={{background: color}}
    onClick={() => updateColor(color)}
  >
     {
       column.color === color && <i className="material-icons  font-bold text-sm text-white m-auto">done</i>
     }
  </span>
}

const HeaderMenu: React.FC<IHeaderMenu> = ({column, options, setCols}) => {
  const params: URL_PARAMS = useParams();
  const [updateTableColumnTemplateMutation] = useMutation(UpdateTableColumnTemplate);

  useEffect(() => {
    setCols(prev => {
      const idx = prev.findIndex((el: ColumnTable) => el.column_id === column.column_id)
      if (idx > -1 && prev[idx].search) {
        const savedValues = JSON.parse(localStorage.getItem(
          `${params.platformId}.${options.template}.${column.id}.search.savedValues`,
        ))
        prev[idx].search.savedValues = savedValues ? savedValues : {}
      }

      return [...prev]
    })
  }, [params])

  function updateColor(color: string) {
    updateTableColumnTemplateMutation({
      variables: {
        updateTableColTemplateData: {
          id: column.column_id,
          color,
        },
      }
    }).then(() => {
      setCols((prev) => {
        const idx = prev.findIndex((el: ColumnTable) => el.column_id === column.column_id)
        if (idx > -1) {
          prev[idx].color = color
        }
        return [...prev]
      })
    })
  }

  function addSearchValue(e: FormEvent, column: ColumnTable) {
    e.preventDefault()
    const value = e.target[0].value
    setCols(prev => {
      const idx = prev.findIndex((el: ColumnTable) => el.column_id === column.column_id)
      if (idx > -1) {
        const prevValues = prev[idx].search.addedValues ? prev[idx].search.addedValues : {}
        prev[idx].search.addedValues = Object.assign({[value]: true}, prevValues)
      }
      return [...prev]
    })
    e.target[0].value = ''
  }

  return (
    <>
      <div className="relative flex ml-auto">
        <span className="material-icons transition-opacity cursor-pointer my-auto">menu</span>
        <div className="absolute z-50 w-48 h-72 bg-white rounded shadow-lg top-8 p-4 overflow-y-auto">
          {
            options.template && <div className="my-2">
                <p style={{color: '#7E7E8C'}}>Цвет колонки</p>
                <div className="mt-2 grid grid-cols-6 pb-2 border-b">
                    <ColorControl color={'#FF99CC'} column={column} updateColor={updateColor}/>
                    <ColorControl color={'#FFCC99'} column={column} updateColor={updateColor}/>
                    <ColorControl color={'#A0F090'} column={column} updateColor={updateColor}/>
                    <ColorControl color={'#C5A6FF'} column={column} updateColor={updateColor}/>
                    <ColorControl color={'#7EDDFC'} column={column} updateColor={updateColor}/>
                    <span
                        className="cursor-pointer w-5 h-5 rounded-full flex border transform hover:scale-110"
                        onClick={() => updateColor('')}
                    >
                       <i className="material-icons font-bold text-sm m-auto" style={{color: '#B4B4BF'}}>close</i>
                    </span>
                </div>
            </div>
          }
          {
            column.search && column.search.searchField &&
            <form className="my-2 flex border rounded" onSubmit={(e) => addSearchValue(e, column)}>
                <input className="m-1 outline-none w-28" placeholder="поиск ..."/>
                <button className="material-icons border-l p-1 m-auto" type="submit">search</button>
            </form>
          }
          {
            column.search && column.search.addedValues && Object.keys(column.search.addedValues).map((el, index) => {
              const checked = column.search.addedValues[el]
              return <div key={index} className="flex">
                <CheckBox className="my-auto" onChange={(e) => {
                  setCols(prev => {
                    const idx = prev.findIndex((el: ColumnTable) => el.column_id === column.column_id)
                    if (idx > -1) {
                      const addedValues = prev[idx].search.addedValues
                      addedValues[el] = e.target.checked
                    }

                    return [...prev]
                  })
                }} checked={checked}/>
                <p className="my-auto ml-3 truncate">{el}</p>
                <i
                  className="cursor-pointer material-icons ml-auto my-auto text-base text-gray-500"
                  onClick={() => {
                    setCols(prev => {
                      const idx = prev.findIndex((el: ColumnTable) => el.column_id === column.column_id)
                      if (idx > -1) {
                        const addedValues = prev[idx].search.addedValues
                        prev[idx].search.savedValues = {
                          [el]: addedValues[el],
                          ...prev[idx].search.savedValues
                        }
                        delete addedValues[el]
                        localStorage.setItem(
                          `${params.platformId}.${options.template}.${column.id}.search.savedValues`,
                          JSON.stringify(prev[idx].search.savedValues)
                        )
                      }

                      return [...prev]
                    })
                  }}
                >add</i>
              </div>
            })
          }
          {
            column.search && column.search.savedValues && Object.keys(column.search.savedValues).map((el, index) => {
              const checked = column.search.savedValues[el]
              return <div key={index} className="flex">
                <CheckBox className="my-auto" onChange={(e) => {
                  setCols(prev => {
                    const idx = prev.findIndex((el: ColumnTable) => el.column_id === column.column_id)
                    if (idx > -1) {
                      const savedValues = prev[idx].search.savedValues
                      savedValues[el] = e.target.checked
                      localStorage.setItem(
                        `${params.platformId}.${options.template}.${column.id}.search.savedValues`,
                        JSON.stringify(savedValues)
                      )
                    }

                    return [...prev]
                  })
                }} checked={checked}/>
                <p className="my-auto ml-3 truncate">{el}</p>
                <i
                  className="cursor-pointer material-icons ml-auto my-auto text-base text-gray-500"
                  onClick={() => {
                    setCols(prev => {
                      const idx = prev.findIndex((el: ColumnTable) => el.column_id === column.column_id)
                      if (idx > -1) {
                        const savedValues = prev[idx].search.savedValues
                        delete savedValues[el]
                        localStorage.setItem(
                          `${params.platformId}.${options.template}.${column.id}.search.savedValues`,
                          JSON.stringify(savedValues)
                        )
                      }
                      return [...prev]
                    })
                  }}
                >close</i>
              </div>
            })
          }
          {
            column.search && column.search.defaultValues && Object.keys(column.search.defaultValues).map((el, index) => {
              const checked = column.search.defaultValues[el]
              return <div key={index} className="flex">
                <CheckBox className="my-auto" onChange={(e) => {
                  setCols(prev => {
                    const idx = prev.findIndex((el: ColumnTable) => el.column_id === column.column_id)
                    if (idx > -1) {
                      const defaultValues = prev[idx].search.defaultValues
                      defaultValues[el] = e.target.checked
                    }
                    return [...prev]
                  })
                }} checked={checked}/>
                <p className="my-auto ml-3 truncate">{el}</p>
              </div>
            })
          }
        </div>
      </div>
    </>
  )
}

export default HeaderMenu




