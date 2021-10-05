//core
import React, {useMemo, useState} from "react";

//components
import {Button} from "@components/Base/Button";
import Table from "@pages/platform/components/table/Table";

//data
import header_table_personals from "@pages/platform/typePlatform/AgencyLidgen/pages/controlPersonal/header.table.personals";

const ControlPersonal: React.FC = () => {
  const columns = useMemo(() => header_table_personals, [])
  const [persons, setPersons] = useState([
    {
      id: 1,
      username: 'TEst',
      group: 'CLIENT_ADMIN',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    },
    {
      id: 2,
      username: 'Test2',
      group: 'CLIENT_CLIENT',
      status: true
    }
  ]);

  const table_options = {
    width: window.innerWidth - 112
  }

  return (
    <>
      <div>
        <span className="text-2xl font-bold">Управление сотрудниками</span>
      </div>
      <div>
        {/*<Table columns={columns} data={persons} options={table_options}/>*/}
      </div>
    </>
  )
}

export default ControlPersonal