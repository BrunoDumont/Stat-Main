import React from "react";

interface IRow {
  label: string
}

const Row: React.FC<IRow> = ({label, children}) => {
  return <div className="md:grid md:grid-cols-4 my-6">
    <p className="md:text-right my-auto mr-4">{label}</p>
    <div className="md:col-span-3">
      {children}
    </div>
  </div>
}

export default Row