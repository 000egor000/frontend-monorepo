import {
  ListSvg,
  TreeListSvg,
  PlaySvg,
  AddDocSvg,
  FilterSvg,
  DeleteSvg,
  MicrosoftExcelSvg,
  SpecificationSvg,
  BlockSvg,
  InfoSvg,
  MdiTableCogSvg,
  PeopleOutlineSvg,
} from '@atollis/ot_105_5_0080';

export const BtnsId = {
  list: 'list',
  treeList: 'treeList',
  filter: 'filter',
  create: 'create',
  remove: 'remove',
  play: 'play',
  block: 'block',
  details: 'details',
  export: 'export',
  info: 'info',
  separator: 'separator',
  columnChooser: 'columnChooser',
  changingUser: 'changingUser',
};

export const btnsInfo = {
  [BtnsId.changingUser]: {
    name: 'Сменить пользователя',
    icon: <PeopleOutlineSvg id={`_${BtnsId.changingUser}`} />,
  },
  [BtnsId.list]: {
    name: 'Список',
    icon: <ListSvg id={`_${BtnsId.list}`} />,
  },
  [BtnsId.treeList]: {
    name: 'По группам',
    icon: <TreeListSvg id={`_${BtnsId.treeList}`} />,
  },
  [BtnsId.filter]: {
    name: 'Сохранить набор',
    icon: <FilterSvg id={`_${BtnsId.filter}`} />,
  },
  [BtnsId.create]: {
    icon: <AddDocSvg id={`_${BtnsId.create}`} />,
  },
  [BtnsId.remove]: {
    icon: <DeleteSvg id={`_${BtnsId.remove}`} />,
  },
  [BtnsId.play]: {
    icon: <PlaySvg id={`_${BtnsId.play}`} />,
  },
  [BtnsId.block]: {
    icon: <BlockSvg id={`_${BtnsId.block}`} />,
  },
  [BtnsId.details]: {
    icon: <SpecificationSvg id={`_${BtnsId.details}`} />,
  },
  [BtnsId.export]: {
    name: 'Экспорт',
    icon: <MicrosoftExcelSvg id={`_${BtnsId.export}`} />,
  },
  [BtnsId.info]: {
    name: 'Справка',
    icon: <InfoSvg id={`_${BtnsId.info}`} />,
  },
  [BtnsId.columnChooser]: {
    name: 'Выбор столбцов',
    icon: <MdiTableCogSvg id={`_${BtnsId.info}`} />,
  },
};
