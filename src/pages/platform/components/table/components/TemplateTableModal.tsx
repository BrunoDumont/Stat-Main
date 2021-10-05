//core
import React, {useEffect, useState} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import clsx from "clsx";

//components
import {Input} from "@components/Base/Input";
import MyModal from "@components/Modal/Modal";
import {Button} from "@components/Base/Button";

//functions
import {reorder} from "@core/utilitFunctions";

//types
import {ColumnTable} from "@pages/platform/components/table/Table";
import {ITemplate} from "@pages/platform/components/table/components/TemplateTable";
import {useAlert} from "react-alert";
import {useMutation} from "@apollo/client";
import AddTableTemplate from "@gql/table/addTableTemplate.gql";
import UpdateTableTemplate from "@gql/table/updateTableTemplate.gql";
import {URL_PARAMS} from "@pages/platform/Platform";
import {useParams} from "react-router-dom";


//requests


interface ITemplateTableModal {
  show: boolean
  setShow: (arg0: boolean) => void
  templateType: string
  allCols: ColumnTable[]
  allTemplates: ITemplate[]
  currentTemplate: ITemplate
  changeTableTemplateData: () => void
}

const TemplateTableModal: React.FC<ITemplateTableModal> = ({
                                                             show,
                                                             setShow,
                                                             templateType,
                                                             allCols,
                                                             allTemplates,
                                                             currentTemplate,
                                                             changeTableTemplateData
                                                           }) => {
  const alert = useAlert();
  const params: URL_PARAMS = useParams();
  const [template, setTemplate] = useState(currentTemplate)

  const [addTableTemplateMutation] = useMutation(AddTableTemplate);
  const [updateTableTemplateMutation] = useMutation(UpdateTableTemplate);

  useEffect(() => {
    setTemplate(currentTemplate)
  }, [currentTemplate])

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }
    const tableCols = reorder(
      template.tableCols,
      result.source.index,
      result.destination.index
    );
    setTemplate(prevState => ({...prevState, tableCols}))
  }

  const addTemplate = (e: React.FormEvent) => {
    e.preventDefault()
    template.table = templateType
    addTableTemplateMutation({
      variables: {
        addTableTemplateData: template,
        platformName: params.platformId
      }
    }).then(() => {
      changeTableTemplateData()
      setShow(false)
      alert.success("Данные успешно добавлены")
    }).catch((e: ErrorEvent) => alert.error(JSON.stringify(e).substr(0, 30) + ' ...'))
  }

  const updateTemplate = (e: React.FormEvent) => {
    e.preventDefault()

    updateTableTemplateMutation({
      variables: {
        updateTableTemplateData: template,
        platformName: params.platformId
      }
    }).then(() => {
      changeTableTemplateData()
      setShow(false)
      alert.success("Данные успешно изменены")
    }).catch((e: ErrorEvent) => alert.error(JSON.stringify(e).substr(0, 30) + ' ...'))

  }
  const notSelectedCols = allCols.filter(el => !(template.tableCols && template.tableCols.find(col => col.col === el.accessor)))

  return <MyModal show={show} showModal={setShow}>
    <div className="flex pb-4 border-b">
      <p className="font-bold text-xl">Управление шаблонами</p>
      <i
        className="ml-auto my-auto material-icons cursor-pointer"
        onClick={() => {
          setShow(false)
        }}
      >close</i>
    </div>
    <div className="flex">
      <div className="w-40 border-r border-l">
        <p
          className={clsx("hover:bg-gray-100 cursor-pointer border-b p-2", {
            'bg-gold bg-opacity-50': !template.id
          })}
          onClick={() => (setTemplate({name: ''}))}
        >Новый шаблон</p>
        <p className="text-center py-4 border-b">Мои шаблоны</p>
        {
          allTemplates.map(el => {
            return <p
              key={el.id}
              className={clsx("hover:bg-gray-100 cursor-pointer border-b p-2", {
                'bg-gold bg-opacity-50': el.id === template.id
              })}
              onClick={() => {
                const templ = allTemplates.find(template => template.id === el.id)
                setTemplate(templ)
              }}
            >{el.name}</p>
          })
        }
      </div>
      <div className="flex-1">
        <p className="text-left mx-4 mt-4 font-bold">Название шаблона</p>
        <Input
          className="w-full"
          placeholder="Введите название ..."
          value={template.name}
          setValue={(data) => {
            setTemplate(prev => ({...prev, name: data}))
          }}
        />
        <div className="flex mt-4 ml-2 py-2 border-b">
          <span className="font-bold ml-2">Столбцы</span>
          <span
            className='ml-auto mr-2 text-gold cursor-pointer hover:text-gold-hover'
            onClick={() => {
              const cols = notSelectedCols.map(el => {
                return {
                  width: String(el.width),
                  col: el.accessor,
                  color: el.color
                }
              })
              const prevCol = template.tableCols ? template.tableCols : []
              setTemplate(prev => ({...prev, tableCols: [...prevCol, ...cols]}))
            }}
          >Выбрать все</span>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {
                  template.tableCols && template.tableCols.map((el, index) => {
                    return <Draggable key={el.col} draggableId={el.col} index={index}>
                      {(provided, snapshot) => {
                        if (snapshot.isDragging) {
                          // @ts-ignore
                          provided.draggableProps.style.left = provided.draggableProps.style.offsetLeft;
                          // @ts-ignore
                          provided.draggableProps.style.top = provided.draggableProps.style.offsetTop;
                        }
                        const col = allCols.find(col => col.accessor === el.col)
                        return <p
                          ref={provided.innerRef}
                          className="p-2 ml-2 border-b flex"
                          {...provided.draggableProps}
                        >
                          <i className="material-icons my-auto cursor-pointer" onClick={() => {
                            setTemplate(prev => {
                              return {...prev, tableCols: [...prev.tableCols.filter(col => col.col !== el.col)]}
                            })
                          }}>done</i>
                          <span className="my-auto ml-2">{col ? col.Header : el.col}</span>
                          <i
                            className="material-icons ml-auto"
                            {...provided.dragHandleProps}
                          >unfold_more</i>
                        </p>
                      }}
                    </Draggable>
                  })
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {
          notSelectedCols
            .map(el => <p key={el.accessor} className="p-2 ml-2 border-b flex">
              <i className="material-icons my-auto cursor-pointer" onClick={() => {
                const tableCols = template.tableCols ? template.tableCols : []
                setTemplate(prev => {
                  return {
                    ...prev, tableCols: [...tableCols, {
                      col: el.accessor,
                      width: el.width ? String(el.width) : "150",
                      color: el.color
                    }]
                  }
                })
              }}>crop_square</i>
              <span className="my-auto ml-2">{el.Header}</span>
            </p>)
        }
        <div className="mt-2 pt-2 border-t flex">
          <div className="mx-auto flex">
            <Button
              type="primary"
              text="Сохранить"
              onClick={(e) => {
                if (template.id) {
                  updateTemplate(e)
                } else {
                  addTemplate(e)
                }
              }}
            />
            {
              template.id && <Button className="ml-2" type="secondary" text="Удалить"/>
            }
          </div>
        </div>
      </div>
    </div>
  </MyModal>
}

export default TemplateTableModal