import { memo, RefObject, useCallback, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CustomTable, oData2Adapter } from '@atollis/ot_105_5_0070';
import manageRoutes from '@atollis/ot_938_5_0010';
import { selectUserFunctions } from '@atollis/ot_105_7_0010';
import { TableCtxMenuItem } from './CampaignsMonitoring';
import columns from './config';
import Endpoints from '../../Endpoints';

import './CampaignsMonitoringTable.scss';

interface CampaignMonitoringTableProps {
  tableRef?: RefObject<any>;
  contextMenuList?: TableCtxMenuItem[];
  onSelectionChanged?: (e: any) => void;
  setVisibleNoAccessPopup?: (val: boolean) => void;
  data?: any;
}

const CampaignMonitoringTable = ({
  tableRef,
  contextMenuList = [],
  onSelectionChanged,
  setVisibleNoAccessPopup,
  data,
}: CampaignMonitoringTableProps) => {
  const navigate = useNavigate();

  const userFunctions = useSelector(selectUserFunctions);

  const onLinkClick =
    (reportId: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (userFunctions.includes('OT.105.APP.SF.006.001')) {
        navigate(`${manageRoutes.reports}/${reportId}`);
      } else {
        setVisibleNoAccessPopup?.(true);
      }
    };

  const handleSelect = useCallback(
    selectedRowsData => {
      onSelectionChanged?.({ selectedRowsData } as any);
    },
    [onSelectionChanged],
  );

  return (
    <div className="campaigns-table management-datagrid">
      <CustomTable
        columns={columns}
        endpoint={Endpoints.showcaseCampaigns()}
        rowKeyField="IDENTIFIKATOR"
        oDataAdapter={oData2Adapter}
        onSelectionChanged={handleSelect}
        renderCell={props => {
          if (props.column?.key === 'NAIMENOVANIE_KAMPANII')
            return (
              <Link
                className="value-wrapper"
                to={`${manageRoutes.campaigns}/${props.rowData.IDENTIFIKATOR_KAMPANII}`}
              >
                {props.rowData.NAIMENOVANIE_KAMPANII}
              </Link>
            );
          if (props.column?.key === 'FORMA_VVODA')
            return (
              <a
                className="value-wrapper"
                href={`/gwtLink?title=${props.rowData.FORMA_VVODA}&url=${props.rowData['SSY`LKA_NA_FORMU_VVODA']}`}
                target="_blank"
                rel="noreferrer"
              >
                {props.rowData.FORMA_VVODA}
              </a>
            );
          if (props.column?.key === 'OTCHET')
            return (
              <a
                className="value-wrapper"
                href="/"
                onClick={onLinkClick(props.rowData.IDENTIFIKATOR_OTCHETA)}
              >
                {props.rowData.OTCHET}
              </a>
            );

          return null;
        }}
      />
    </div>
  );
};

export default memo(CampaignMonitoringTable);

const allowedPageSizes = [20, 50, 100, 'all'];

const remoteOperations = {
  filtering: true,
  groupPaging: false,
  grouping: false,
  paging: true,
  sorting: true,
};
