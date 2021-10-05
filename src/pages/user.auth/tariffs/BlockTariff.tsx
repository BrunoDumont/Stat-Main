import React from "react";

interface IBlockTariff {
  title: string
}
const BlockTariff: React.FC<IBlockTariff> = ({title, children}) => {
  return <div className="bg-white rounded shadow w-full md:w-auto p-4 mt-4 mr-4">
    <p className="text-center font-semibold text-lg mb-4">{title}</p>
    {children}
  </div>
}

export default BlockTariff


interface IRowTariff {
  name: string
}
export const RowTariff: React.FC<IRowTariff> = ({name,children}) => {
  return <div className="p-2 grid grid-cols-2 border-b text-right">
    <p className="mr-20 text-left font-semibold">{name}</p>
    {children}
  </div>
}