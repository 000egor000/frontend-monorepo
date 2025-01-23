import { DataType } from 'ka-table';
import { Column } from 'ka-table/Models/Column';
import { ColumnDx } from '../Reports/config';

const columns: Column[] = [
  {
    key: 'NAIMENOVANIE_ZADACHI',
    title: 'Наименование',
    dataType: DataType.String,
    width: '25%',
  },
  {
    key: 'DATA_NACHALA_`<FAKT`>',
    title: 'Дата начала',
    dataType: DataType.Date,
    width: '12%',
  },
  {
    key: 'DATA_ZAVERSHENIYA_`<FAKT`>',
    title: 'Дата окончания',
    dataType: DataType.Date,
    width: '12%',
  },
  {
    key: 'STATUS_ZADACHI',
    title: 'Статус',
    dataType: DataType.String,
    width: '12.5%',
  },
  {
    key: 'PODRAZDELENIE',
    title: 'Организация',
    dataType: DataType.String,
    width: '14%',
  },
  {
    key: 'ISPOLNITEL`',
    title: 'Исполнитель',
    dataType: DataType.String,
    width: '14%',
  },
  {
    key: 'FORMA_VVODA',
    title: 'Форма ввода',
    dataType: DataType.String,
    width: '10.5%',
    // cellTemplate: 'formLink',
  },
];

export const columnsDx: ColumnDx[] = [
  {
    dataField: 'NAIMENOVANIE_ZADACHI',
    caption: 'Наименование',
    alignment: 'left',
    dataType: 'string',
    cellTemplate: 'taskLink',
    width: '25%',
  },
  {
    dataField: 'DATA_NACHALA_`<FAKT`>',
    caption: 'Дата начала',
    dataType: 'date',
    alignment: 'left',
    width: '12%',
  },
  {
    dataField: 'DATA_ZAVERSHENIYA_`<FAKT`>',
    caption: 'Дата окончания',
    dataType: 'date',
    alignment: 'left',
    width: '12%',
  },
  {
    dataField: 'STATUS_ZADACHI',
    caption: 'Статус',
    dataType: 'string',
    alignment: 'center',
    width: '12.5%',
  },
  {
    dataField: 'PODRAZDELENIE',
    caption: 'Организация',
    dataType: 'string',
    alignment: 'center',
    width: '14%',
    groupIndex: 1,
  },
  {
    dataField: 'ISPOLNITEL`',
    caption: 'Исполнитель',
    dataType: 'string',
    alignment: 'left',
    width: '14%',
  },
  {
    dataField: 'FORMA_VVODA',
    caption: 'Форма ввода',
    dataType: 'string',
    alignment: 'center',
    width: '10.5%',
    cellTemplate: 'formLink',
  },
];

export default columns;
