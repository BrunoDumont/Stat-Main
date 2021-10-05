import React, {useState} from "react";
import Popover from "react-popover";

interface ITableCell {
  // value: string
}
const TableCell: React.FC<ITableCell> = (props) => {
  const [showPopover, setShowPopover] = useState(false)
  return <Popover
    className="z-20"
    body={
      <div
        className=" rounded p-4 bg-black bg-opacity-75 text-white z-20"
      >
        {props.children}
      </div>
    }
    isOpen={showPopover}
  >
    <p
      className="truncate"
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >{props.children}</p>
  </Popover>
}

export default TableCell