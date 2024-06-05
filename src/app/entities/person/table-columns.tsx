import { ColumnDef } from "@tanstack/react-table";
import Person from "./person";
import Contact from "../contact/contact";
import { Employee } from "../employee/employee";
import Address from "../address/address";

const PersonColumns = <T extends Person,>(): ColumnDef<T>[] => [
  {
    id: 'Nome',
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    id: 'E-mail',
    accessorKey: 'email',
    header: 'E-mail',
  },
  {
    id: 'Cpf',
    accessorKey: 'cpf',
    header: 'Cpf',
  },
  {
    id: 'Nascimento',
    accessorKey: 'birthday',
    header: 'Nascimento',
  },
  {
      id: 'Contato',
      header: 'Contato',
      accessorFn: row => {
        if (row.contact as Contact) {
          return "(" + row.contact.ddd + ") " + row.contact.number
        }
    },
  },
  {
    id: 'Endereço',
    header: 'Endereço',
    accessorFn: row => {
      if (row.address as Address) {
        return row.address.street + ", " + row.address.number
      }
    },
  },
];

export default PersonColumns