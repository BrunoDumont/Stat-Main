//core
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {useParams} from "react-router-dom";

//components
import {Selector} from "@components/Base/Selector";
import TemplateTableModal from "@pages/platform/components/table/components/TemplateTableModal";

//requests
import GetAllTableTemplates from "@gql/table/getAllTableTemplates.gql";
import GetTableTemplate from "@gql/table/getTableTemplate.gql";
import UpdateTableColumnTemplate from "@gql/table/updateTableColumnTemplate.gql";

//types
import {URL_PARAMS} from "@pages/platform/Platform";
import {ColumnTable} from "@pages/platform/components/table/Table";

export interface ITemplate {
  id?: number
  name: string
  table?: string
  tableCols?: {
    id?: number
    col: string
    color?: string
    width?: number
  }[]
}

interface ITemplateTable {
  templateType: string,
  cols: ColumnTable[]
  allCols: ColumnTable[]
  setCols: (arg0: ColumnTable[]) => void
  columnResizing: any
}

const TemplateTable: React.FC<ITemplateTable> = ({templateType, cols, allCols, setCols, columnResizing}) => {
  const params: URL_PARAMS = useParams();
  const [showModal, setShowModal] = useState(false)
  const id_template = localStorage.getItem(templateType)
  //get list Templates
  let allTemplates = [];
  let allTableTemplates = useQuery(GetAllTableTemplates, {
    variables: {
      platformName: params.platformId,
      table: templateType
    }
  });
  if (allTableTemplates.data) allTemplates = allTableTemplates.data.getAllTableTemplates;

  //currentTemplate
  let currentTemplate: ITemplate = {
    name: ''
  }
  let currTemplate = useQuery(GetTableTemplate, {
    variables: {
      id: id_template
    }
  });
  if(currTemplate.data){
    currentTemplate = currTemplate.data.getTableTemplate
  }

  const [updateTableColumnTemplateMutation] = useMutation(UpdateTableColumnTemplate);

  function changeTableTemplateData() {
    currTemplate.refetch({
        id: id_template
    })
    allTableTemplates.refetch({
      platformName: params.platformId,
      table: templateType
    })
  }
  useEffect(() => {
    if(currentTemplate.tableCols){
      const columns = currentTemplate.tableCols.map((el) => {
        const col = allCols.find(col => col.accessor === el.col)

        return {...col, width: Number(el.width), color: el.color, column_id: el.id}
      })
      setCols(columns)
    }else {
      setCols(allCols)
    }

  }, [currTemplate.data])

  useEffect(() => {
    if (currentTemplate.tableCols && columnResizing.isResizingColumn === null && columnResizing.headerIdWidths) {
      const [nameCol, ] = columnResizing.headerIdWidths[0]
      const width = columnResizing.columnWidths[nameCol];
      const colTemplate = currentTemplate.tableCols.find(el => el.col === nameCol)
      if(colTemplate.width !== width.toFixed(0)){
        updateTableColumnTemplateMutation({
          variables: {
            updateTableColTemplateData: {...colTemplate, width: width.toFixed(0)},
          }
        }).then(e => currTemplate.refetch())
      }
    }
  }, [columnResizing]);

  const emptyTemplateList = allTemplates.length === 0 ? {
    value: '',
    label: 'Список пуст'
  } : {}

  const selectorOptions = [
      {
        value: '',
        label: <p className="border-b pb-2">Все</p>
      },
      emptyTemplateList,
      ...allTemplates.map((el: { id: number, name: string }) => ({
        value: el.id,
        label: el.name
      })),
      {
        value: 'control',
        label: <p className="flex border-t pt-2"
                  onClick={() => {
                    setShowModal(true)
                  }}
        >
          <i className="material-icons my-auto text-sm mr-2">settings</i>
          <span className="my-auto">Управление шаблонами</span>
        </p>
      }
  ]
  return (
    <>
      <Selector
        type="secondary"
        options={selectorOptions}
        onChange={(data) => {
          if(data.value === 'control') return
          if(data.value === ''){
            localStorage.removeItem('leads')
          }else{
            localStorage.setItem('leads', data.value)
          }
          currTemplate.refetch({
            id: String(data.value)
          })
        }}
        value={
          currentTemplate.id
            ? {value: currentTemplate.id, label: currentTemplate.name}
            : {value: '', label: 'Все'}
        }
      />
      <TemplateTableModal
        show={showModal}
        setShow={setShowModal}
        templateType={templateType}
        allCols={allCols}
        allTemplates={allTemplates}
        currentTemplate={currentTemplate}
        changeTableTemplateData={changeTableTemplateData}
      />
    </>
  )
}

export default TemplateTable