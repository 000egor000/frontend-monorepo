import { DatePicker } from '@atollis-ui/input';
import './RunReportModalContent.scss';
import { memo } from 'react';

interface RunReportModalContentProps {
  onValueChangeReportingDate: (value: string) => void;
  onValueChangeBeginningDate: (value: string) => void;
  onValueChangeEndingDate: (value: string) => void;
  reportingDate: string;
  startDatePlan: string;
  completionDatePlan: string;
}

const RunReportModalContent = ({
  onValueChangeBeginningDate,
  onValueChangeEndingDate,
  onValueChangeReportingDate,
  reportingDate,
  startDatePlan,
  completionDatePlan,
}: RunReportModalContentProps): JSX.Element => (
  <div className="run-report-modal-container">
    <DatePicker
      placeholder="Отчётная дата"
      openOnFieldClick
      format="M/D/YYYY"
      value={reportingDate}
      elementAttr={elementAttrRow}
      className="input"
      onChange={onValueChangeReportingDate}
      required
    />
    <div className="flex-row">
      <DatePicker
        placeholder="Дата начала"
        openOnFieldClick
        format="M/D/YYYY"
        value={startDatePlan}
        elementAttr={elementAttrRow}
        className="input"
        onChange={onValueChangeBeginningDate}
        required
        classNames={{ root: 'flex-picker' }}
      />
      <DatePicker
        placeholder="Дата завершения"
        openOnFieldClick
        format="M/D/YYYY"
        value={completionDatePlan}
        elementAttr={elementAttrRow}
        className="input"
        onChange={onValueChangeEndingDate}
        required
        classNames={{ root: 'flex-picker' }}
      />
    </div>
  </div>
);
const elementAttrRow = {
  class: 'campaign-params-form-row-item',
};
export default memo(RunReportModalContent);
