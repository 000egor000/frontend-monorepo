import { InfoSvg } from '@atollis/ot_105_5_0080';
import formBuilderRoutes from './formBuilderRoutes';

const formBuilderLinks = [
  {
    id: `${formBuilderRoutes.base}/${formBuilderRoutes.create}`,
    name: 'Управление формами ввода',
    baseUrl: formBuilderRoutes.base,
    icon: <InfoSvg />,
    functions: ['OT.105.APP.SF.005.001'],
  },
  {
    id: `${formBuilderRoutes.base}/${formBuilderRoutes.constructor}`,
    name: 'Конструктор форм ввода',
    baseUrl: formBuilderRoutes.base,
    icon: <InfoSvg />,
    functions: ['OT.105.APP.SF.005.002'],
  },
];

export default formBuilderLinks;
