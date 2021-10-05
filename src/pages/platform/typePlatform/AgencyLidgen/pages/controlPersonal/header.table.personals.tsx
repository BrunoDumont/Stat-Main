import React from "react";

const header_table_personals = [
  {
    Header: "ID",
    accessor: "id",
    Cell: ({ value }) => value,
    collapse: true
  },
  {
    Header: "Имя пользователя",
    accessor: "username",
  },
  {
    Header: "Группа",
    accessor: "group",
  },
  {
    Header: "Статус",
    accessor: "status",
  },
  {
    Header: "Редактировать",
    accessor: "edit",
  },
]

export default header_table_personals