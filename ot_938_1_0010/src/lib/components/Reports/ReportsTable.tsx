import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';

import manageRoutes from '@atollis/ot_938_5_0010';
import { CustomTable, oData2Adapter } from '@atollis/ot_105_5_0070';

import columns from './config';
import Endpoints from '../../Endpoints';

interface Report {
  IDENTIFIKATOR: string;
  SKHEMA_SOGLASOVANIYA: string;
  IDENTIFIKATOR_OTCHETA: string;
  KOD_OTCHETA: string;
  NAIMENOVANIE_OTCHETA: string;
  OTVETSTVENNYJ_IOGV: string;
  IDENTIFIKATOR_FORMY_VVODA: string;
  FORMA_VVODA: string;
  SSYLKA_NA_FORMU_VVODA: string;
  UCHASTNIKI_OTCHETA: string;
  KURATOR: string;
  DATA_SOZDANIYA: string;
  AVTOR_SOZDANIYA: string;
  AKTIVNOST: string;
  DATA_NACHALA_DEJSTVIYA_OTCHYOTA: string;
  DATA_OKONCHANIYA_DEJSTVIYA_OTCHYOTA: string;
}
interface ReportsTableProps {
  onSelectionChanged?: (e: any) => void;
}

const ReportsTable = ({ onSelectionChanged }: ReportsTableProps) => {
  const handleSelect = useCallback(
    (selectedRows: Report[]) => {
      let selectedRowsData = selectedRows;
      if (!Array.isArray(selectedRows)) {
        selectedRowsData = [selectedRows];
      }
      onSelectionChanged?.({ selectedRowsData } as ReportsTableProps);
    },
    [onSelectionChanged],
  );

  return (
    <div className="reports-table management-datagrid">
      <CustomTable
        columns={columns}
        endpoint={Endpoints.showcaseReports()}
        rowKeyField="IDENTIFIKATOR"
        oDataAdapter={oData2Adapter}
        onSelectionChanged={handleSelect}
        renderCell={props => {
          if (props.column?.key === 'NAIMENOVANIE_OTCHETA')
            return (
              <Link
                className="value-wrapper"
                to={`${manageRoutes.reports}/${props.rowData.IDENTIFIKATOR_OTCHETA}`}
              >
                {props.rowData.NAIMENOVANIE_OTCHETA}
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

          return null;
        }}
      />
    </div>
  );
};

export default memo(ReportsTable);
