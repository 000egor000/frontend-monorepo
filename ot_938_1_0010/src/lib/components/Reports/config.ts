import { DataType } from 'ka-table';
import { Column } from 'ka-table/Models/Column';

export type ColumnDx = {
  dataField: string;
  caption: string;
  dataType: string;
  cellTemplate?: string;
  alignment?: string;
  headerFilter?: any;
  width?: string;
  groupIndex?: number;
};

const columns: Column[] = [
  {
    key: 'KOD_OTCHETA',
    title: 'Код',
    dataType: DataType.String,
  },
  {
    key: 'NAIMENOVANIE_OTCHETA',
    title: 'Наименование',
    dataType: DataType.String,
  },
  {
    key: 'OTVETSTVENNY`J_IOGV',
    title: 'Ответственный ИОГВ',
    dataType: DataType.String,
  },
  {
    key: 'FORMA_VVODA',
    title: 'Форма ввода',
    dataType: DataType.String,
  },
  {
    key: 'UCHASTNIKI_OTCHETA',
    title: 'Участники отчета',
    dataType: DataType.String,
  },
  {
    key: 'REGLAMENT',
    title: 'Регламент',
    dataType: DataType.String,
  },
  {
    key: 'KURATOR',
    title: 'Куратор',
    dataType: DataType.String,
  },
  {
    key: 'DATA_NACHALA_DEJSTVIYA_OTCHYOTA',
    title: 'Дата начала действия',
    dataType: DataType.Date,
  },
  {
    key: 'DATA_OKONCHANIYA_DEJSTVIYA_OTCHYOTA',
    title: 'Дата окончания действия',
    dataType: DataType.Date,
  },
  {
    key: 'DATA_SOZDANIYA',
    title: 'Дата создания',
    dataType: DataType.Date,
  },
  {
    key: 'AVTOR_SOZDANIYA',
    title: 'Автор создания',
    dataType: DataType.String,
  },
  {
    key: 'AKTIVNOST`',
    title: 'Активность',
    dataType: DataType.String,
  },
];

export default columns;
