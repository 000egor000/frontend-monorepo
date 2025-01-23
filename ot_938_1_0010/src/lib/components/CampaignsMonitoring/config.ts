import { Column } from 'ka-table/models';
import { DataType } from 'ka-table';

const columns: Column[] = [
  {
    key: 'KOD_KAMPANII',
    title: 'Код',
    dataType: DataType.String,
    // cellTemplate: 'defaultCell',
  },
  {
    key: 'NAIMENOVANIE_KAMPANII',
    title: 'Наименование',
    dataType: DataType.String,
    // cellTemplate: 'campaignsLink',
  },
  {
    key: 'OTCHETNAYA_DATA',
    title: 'Отчетная дата',
    dataType: DataType.Date,
    // cellTemplate: 'defaultCell',
  },
  {
    key: 'STATUS_KAMPANII',
    title: 'Статус',
    dataType: DataType.String,
    // cellTemplate: 'defaultCell',
  },
  {
    key: 'DATA_ZAVERSHENIYA_`<PLAN`>',
    title: 'Дата завершения (план)',
    dataType: DataType.Date,
    // cellTemplate: 'defaultCell',
  },
  {
    key: 'DATA_ZAVERSHENIYA_`<FAKT`>',
    title: 'Дата завершения (факт)',
    dataType: DataType.Date,
    // cellTemplate: 'defaultCell',
  },
  {
    key: 'FORMA_VVODA',
    title: 'Форма ввода',
    dataType: DataType.String,
    // cellTemplate: 'inputFormLink',
  },
  {
    key: 'DATA_NACHALA_`<FAKT`>',
    title: 'Дата начала',
    dataType: DataType.Date,
    // cellTemplate: 'defaultCell',
  },
  {
    key: 'OTCHET',
    title: 'Отчет',
    dataType: DataType.String,
    // cellTemplate: 'campaignsReportLink',
  },
  {
    key: 'OTVETSTVENNY`J_IOGV',
    title: 'Ответственный ИОГВ',
    dataType: DataType.String,
    // cellTemplate: 'defaultCell',
  },
  {
    key: 'UCHASTNIKI',
    title: 'Участники',
    dataType: DataType.String,
    // cellTemplate: 'defaultCell',
    // headerFilter: {
    //   dataSource: divisionsFromFilter,
    // },
  },
  {
    key: 'KURATOR',
    title: 'Куратор',
    dataType: DataType.String,
    // cellTemplate: 'defaultCell',
  },
];

export default columns;
