import { memo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { CustomTable, oData2Adapter } from '@atollis/ot_105_5_0070';
import { selectAccessToken } from '@atollis/ot_105_7_0010';

import columns from './RelatedTasksTableConfig';
import Endpoints from '../../Endpoints';
import './RelatedTasksTable.scss';

const defaultRowGroups = [{ columnKey: 'PODRAZDELENIE' }];

const RelatedTasksTable = () => {
  const params = useParams();
  const accessToken = useSelector(selectAccessToken);

  const bearerRef = useRef(`Bearer ${accessToken}`);
  bearerRef.current = `Bearer ${accessToken}`;

  return (
    <CustomTable
      columns={columns}
      endpoint={Endpoints.showcaseTasks()}
      rowKeyField="IDENTIFIKATOR"
      externalFilter={{ IDENTIFIKATOR_KAMPANII: { eq: params.id } }}
      defaultRowGroups={defaultRowGroups}
      oDataAdapter={oData2Adapter}
      renderCell={props => {
        if (props.column?.key === 'FORMA_VVODA')
          return (
            <Link
              to={`/gwtLink?title=Форма ввода&url=${props.rowData.FORMA_VVODA}`}
            >
              {props.rowData['IDENTIFIKATOR_FORMY`_VVODA']}
            </Link>
          );
        return null;
      }}
    />
  );
};

export default memo(RelatedTasksTable);
