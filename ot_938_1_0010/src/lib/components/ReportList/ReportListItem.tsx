/* eslint-disable react/destructuring-assignment */
type ReportListItemProps = {
  NAIMENOVANIE_OTCHETA: string;
  'AKTIVNOST`': string;
};

const ReportListItem = (item: ReportListItemProps): React.ReactNode => (
  <div className="report-item">
    <span className="report-item__name">{item?.NAIMENOVANIE_OTCHETA}</span>
    <span className="report-item__type">{item['AKTIVNOST`']}</span>
  </div>
);

export default ReportListItem;
