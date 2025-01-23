import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderDefault,
  http,
  LayoutComponentProps,
  useLayoutMaximizedPropsForCard,
} from '@atollis/ot_105_5_0070';
import { Select } from '@atollis-ui/input';
import { DefaultOptionType } from 'antd/lib/select';
import {
  reportParamsSelector,
  setIsCheckValid,
  setIsValidMembers,
  updateFormData,
} from '../../reducers/reportParamsReducer/reportParamsReducer';
import {
  createIdentifiedObjWithIdentifierForAntd,
  IdentifiedObj,
} from '../../helpers';
import './ReportMembers.scss';
import Endpoints from '../../Endpoints';

const ReportMembers = ({
  isMaximized,
  switchLayoutMaximizedStatus,
}: Partial<LayoutComponentProps>) => {
  const { menuList, onMenuItemClick } = useLayoutMaximizedPropsForCard(
    isMaximized,
    switchLayoutMaximizedStatus,
  );

  const dispatch = useDispatch();
  const params = useParams();
  const [isFormReady, setIsFormReady] = useState(true);
  const [divisionsList, setDivisionsList] = useState<IdentifiedObj[]>([]);
  const [isDivisionsListLoaded, setIsDivisionsListLoaded] = useState(false);

  const { formData, isCheckValid, isLoading } =
    useSelector(reportParamsSelector);

  const selectedItems = useMemo(
    () => (formData?.reportMembers?.map(i => i?.id?.trim()) as string[]) || [],
    [formData?.reportMembers],
  );

  useEffect(() => {
    const httpParams = {
      params: {
        $decorator: 'odataPlus',
        $inlinecount: 'allpages',

        $top: 0,
      },
    };
    http.get(Endpoints.divisions(), httpParams).then(async rez => {
      const httpParamsLocal = {
        params: {
          $decorator: 'odataPlus',
          $inlinecount: 'allpages',

          /* eslint-disable no-underscore-dangle */
          $top: rez.data.d.__count,
        },
      };

      await http.get(Endpoints.divisions(), httpParamsLocal).then(res => {
        setDivisionsList(
          res.data.d.results.map(createIdentifiedObjWithIdentifierForAntd),
        );
        setIsDivisionsListLoaded(true);
      });
    });
  }, []);

  const preparedDivisionsList = useMemo(
    () =>
      divisionsList.map(el => ({
        value: el.value,
        label: el.label,
      })) as DefaultOptionType[],
    [divisionsList],
  );

  useEffect(() => {
    if (isCheckValid) {
      dispatch(setIsValidMembers(true));
      dispatch(setIsCheckValid({ isCheck: false }));
    }
  }, [isCheckValid, dispatch]);

  useEffect(() => {
    // for reset form validation
    setIsFormReady(false);
    const id = setTimeout(() => setIsFormReady(true));

    return () => {
      clearTimeout(id);
    };
  }, [params.id]);

  const onOptionChanged = useCallback(
    (e, clearAll = false) => {
      if (clearAll) {
        dispatch(
          updateFormData({
            reportMembers: [],
          }),
        );

        return;
      }

      const division =
        divisionsList.find(el => el.id === e) || (null as IdentifiedObj | null);

      if (division !== null) {
        const { id, name, identifier } = division as IdentifiedObj;

        const newDivisionsList = [
          ...(formData?.reportMembers as IdentifiedObj[]),
        ] as IdentifiedObj[];

        const indexElem = newDivisionsList.findIndex(el => el.id === e);

        if (indexElem < 0) {
          newDivisionsList.push({ id, name, identifier });
        } else {
          newDivisionsList.splice(indexElem, 1);
        }

        dispatch(
          updateFormData({
            reportMembers: newDivisionsList,
          }),
        );
      }
    },
    [dispatch, selectedItems, divisionsList, formData?.reportMembers],
  );

  return (
    <Card className="report-members-card report-members">
      <CardHeader>
        <CardHeaderDefault
          title="Участвующие организации"
          onDoubleClick={switchLayoutMaximizedStatus}
          menuList={menuList}
          onMenuItemClick={onMenuItemClick}
        />
      </CardHeader>
      <CardBody>
        {!isLoading && isFormReady && isDivisionsListLoaded && (
          <div className="select-temp">
            <Select
              label="Участники"
              required
              value={selectedItems}
              options={preparedDivisionsList}
              onSelect={e => onOptionChanged(e, false)}
              onDeselect={e => onOptionChanged(e, false)}
              onClear={e => onOptionChanged(e, true)}
              mode="multiple"
              status=""
              style={{ width: '100%', height: '100%' }}
              placeholder="Выберите участников"
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default memo(ReportMembers);
