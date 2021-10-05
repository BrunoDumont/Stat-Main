//core
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "./react-datepicker.scss";
import {registerLocale} from "react-datepicker";
import ru from 'date-fns/locale/ru';

//components
import {Button} from "@components/Base/Button";
import {Selector} from "@components/Base/Selector";
import {
  get_current_month,
  get_current_week,
  get_current_year, get_previously_month,
  get_previously_week, get_today_range,
  get_yesterday_range
} from "@core/workWithDate";
import TemplateTable from "@pages/platform/components/table/components/TemplateTable";
import {ColumnTable} from "@pages/platform/components/table/Table";
import HeaderTable from "@pages/platform/components/table/components/Header";

registerLocale('ru', ru)

interface IControlTablePanel {
  pageSize: number,
  setPageSize: (arg0: number) => void,
  options: any
  selectedRows: []
  cols: ColumnTable[]
  allCols: ColumnTable[]
  setCols: (arg0: ColumnTable[]) => void
  columnResizing: any
}

const ControlTablePanel: React.FC<IControlTablePanel> = ({
                                                           pageSize,
                                                           setPageSize,
                                                           options,
                                                           selectedRows,
                                                           cols,
                                                           allCols,
                                                           setCols,
                                                           columnResizing
                                                         }) => {
  const button_add = options.add && <Button
      className="mr-2"
      type="primary"
      text="Добавить"
      icon="add"
      onClick={options.add}
  />
  const button_delete = options.delete && <Button
      type="secondary"
      text="Удалить"
      icon="close"
      className="mr-2"
      disabled={selectedRows.length === 0}
      onClick={options.delete.onClick}
  />
  const dateRange = options.dateRange && <DateRange {...options.dateRange}/>
  return <div className="mt-6 mb-4 flex">
    {dateRange}
    {options.template && <TemplateTable
        templateType={options.template}
        cols={cols}
        allCols={allCols}
        setCols={setCols}
        columnResizing={columnResizing}
    />}
    {button_add}
    {button_delete}
    <Selector
      type="secondary"
      value={{value: pageSize, label: `Строк: ${pageSize}`}}
      onChange={({value}) => {
        setPageSize(Number(value))
      }}
      options={[10, 25, 50, 100].map(pageSize => {
        return {value: pageSize, label: `Строк: ${pageSize}`}
      })}
    />
  </div>
}

export default ControlTablePanel

export interface IDateRange {
  listOfValues?: DateRangeTableType[]
  defaultValue?: DateRangeTableType
  setDateRange: (arg0: { date_start: Date, date_end: Date }) => void
}

export type DateRangeTableType = 'today' | 'yesterday' | 'current_week' | 'previously_week' |
  'current_month' | 'previously_month' | 'current_year' | 'manually'

const DateRange: React.FC<IDateRange> = ({
                                           listOfValues = ['today', 'yesterday', 'current_week',
                                             'previously_week', 'current_month', 'previously_month', 'current_year', 'manually'],
                                           defaultValue = 'today',
                                           setDateRange
                                         }) => {

  const [showManual, setShowManual] = useState(defaultValue === 'manually')
  const allListOfValues = {
    'today': {
      label: 'Сегодня',
      change: () => {
        setDateRange(get_today_range(new Date()))
      }
    },
    'yesterday': {
      label: 'Вчера',
      change: () => {
        setDateRange(get_yesterday_range(new Date()))
      }
    },
    'current_week': {
      label: 'Текущая неделя',
      change: () => {
        setShowManual(false)
        setDateRange(get_current_week(new Date()))
      }
    },
    'previously_week': {
      label: 'Прошлая неделя',
      change: () => {
        setDateRange(get_previously_week(new Date()))
      }
    },
    'current_month': {
      label: 'Текущий месяй',
      change: () => {
        setDateRange(get_current_month(new Date()))
      }
    },
    'previously_month': {
      label: 'Прошлый месяй',
      change: () => {
        setDateRange(get_previously_month(new Date()))
      }
    },
    'current_year': {
      label: 'Текущий год',
      change: () => {
        setDateRange(get_current_year(new Date()))
      }
    },
    'manually': {
      label: 'Выборочно',
      change: () => {
        setShowManual(true)
      }
    },
  }

  const [curValue, setCurValue] = useState({
    value: defaultValue,
    label: allListOfValues[defaultValue].label
  })

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setDateRange({
        date_start: new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())),
        date_end: new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59 ,59)),
      })
    }
  };

  return <>
    <Selector
      type="secondary"
      value={curValue}
      onChange={(data: { value: DateRangeTableType, label: string }) => {
        setCurValue(data)
        setShowManual(false)
        allListOfValues[data.value].change()
      }}
      options={listOfValues.map((el) => {
        return {
          value: el,
          label: allListOfValues[el].label
        }
      })}
    />
    {
      showManual && <DatePicker
          selected={startDate}
          onChange={onChange}
          className="h-full"
          startDate={startDate}
          endDate={endDate}
          selectsRange
          locale={ru}
          dateFormat="dd.MM.yyyy"
          customInput={<input
            className="mx-1 h-full p-2 px-3 rounded text-white cursor-pointer"
            style={{backgroundColor: '#B4B4BF', width: '195px'}}
          />}
      />
    }
  </>
}