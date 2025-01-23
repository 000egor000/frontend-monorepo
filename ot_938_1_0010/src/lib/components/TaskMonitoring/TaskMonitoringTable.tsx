import { memo, MouseEvent, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import manageRoutes from '@atollis/ot_938_5_0010';
import { CustomTable, oData2Adapter } from '@atollis/ot_105_5_0070';
import { selectUserFunctions } from '@atollis/ot_105_7_0010';
import columns from './config';

import './TaskMonitoringTable.scss';
import Endpoints from '../../Endpoints';

interface UsersTableProps {
  onSelectionChanged?: (e: unknown) => void;
  setVisibleNoAccessPopup?: (val: boolean) => void;
}

const TaskMonitoringTable = ({
  onSelectionChanged,
  setVisibleNoAccessPopup,
}: UsersTableProps) => {
  const navigate = useNavigate();
  const userFunctions = useSelector(selectUserFunctions);

  const onLinkClick =
    (companyId: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (userFunctions.includes('OT.105.APP.SF.006.002')) {
        navigate(`${manageRoutes.campaigns}/${companyId}`);
      } else {
        setVisibleNoAccessPopup?.(true);
      }
    };

  const handleSelect = useCallback(
    (selectedRowsData: unknown) => {
      onSelectionChanged?.({ selectedRowsData });
    },
    [onSelectionChanged],
  );

  return (
    <div className="task-table management-datagrid">
      <CustomTable
        columns={columns}
        endpoint={Endpoints.showcaseTasks()}
        rowKeyField="id"
        oDataAdapter={oData2Adapter}
        onSelectionChanged={handleSelect}
        renderCell={props => {
          if (props.column?.key === 'NAIMENOVANIE_ZADACHI')
            return (
              <Link
                className="value-wrapper"
                to={`${manageRoutes.tasks}/${props.rowData.IDENTIFIKATOR_ZADACHI}`}
              >
                {props.rowData.NAIMENOVANIE_ZADACHI}
              </Link>
            );
          if (props.column?.key === 'FORMA_VVODA')
            return (
              <a
                className="value-wrapper"
                href={`/itg_sugd/#${props.rowData.FORMA_VVODA}`}
                target="_blank"
                rel="noreferrer"
              >
                {props.rowData['IDENTIFIKATOR_FORMY`_VVODA']}
              </a>
            );

          if (props.column?.key === 'KAMPANIYA')
            return (
              <a
                className="value-wrapper"
                href="/"
                onClick={onLinkClick(props.rowData.IDENTIFIKATOR_KAMPANII)}
              >
                {props.rowData.KAMPANIYA}
              </a>
            );

          return null;
        }}
      />
    </div>
  );
};

export default memo(TaskMonitoringTable);
