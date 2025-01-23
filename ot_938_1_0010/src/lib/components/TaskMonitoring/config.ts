import { DataType } from 'ka-table';
import { Column } from 'ka-table/models';

const columns: Column[] = [
  {
    key: 'NAIMENOVANIE_ZADACHI',
    title: 'Наименование',
    dataType: DataType.String,
    // cellTemplate: 'taskLink'
  },
  {
    key: 'DATA_NACHALA_`<FAKT`>',
    title: 'Дата начала',
    dataType: DataType.Date,
  },
  {
    key: 'DATA_ZAVERSHENIYA_`<FAKT`>',
    title: 'Дата завершения',
    dataType: DataType.Date,
  },
  {
    key: 'STATUS_ZADACHI',
    title: 'Статус',
    dataType: DataType.String,
  },
  {
    key: 'FORMA_VVODA',
    title: 'Форма ввода',
    dataType: DataType.String,
  },
  {
    key: 'TIP_ZADACHI',
    title: 'Тип задачи',
    dataType: DataType.String,
  },
  {
    key: 'OTCHETNAYA_DATA',
    title: 'Отчётная дата',
    dataType: DataType.Date,
  },
  {
    key: 'PODRAZDELENIE',
    title: 'Организация',
    dataType: DataType.String,
  },
  {
    key: 'AVTOR',
    title: 'Автор',
    dataType: DataType.String,
  },
  {
    key: 'ISPOLNITEL`',
    title: 'Исполнитель',
    dataType: DataType.String,
  },
  {
    key: 'KAMPANIYA',
    title: 'Кампания',
    dataType: DataType.String,
    // cellTemplate: 'taskCampaignLink',
  },
];

export default columns;
