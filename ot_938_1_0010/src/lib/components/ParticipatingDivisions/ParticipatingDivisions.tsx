import { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Spin } from '@atollis-ui/spin';
import { ScrollArea } from '@atollis-ui/scroll-area';
import { CloseIcon } from '@atollis-ui/icons';
import {
  Card,
  CardHeader,
  CardHeaderDefault,
  CardBody,
  LayoutComponentProps,
  useLayoutMaximizedPropsForCard,
  http,
  InputLabel,
} from '@atollis/ot_105_5_0070';
import {
  IdentifiedObj,
  createIdentifiedObjWithIdentifier,
} from '../../helpers';

// import { Tag } from '@atollis-ui/tag';
// import '@atollis-ui/tag/dist/index.css';

import {
  campaignFormSelector,
  setFormData,
  setIsChanged,
  setIsCheckValid,
  setIsValidParticipatingDivisions,
} from '../../reducers/Campaigns/campaignFormReducer';

import './ParticipatingDivisions.scss';

import Endpoints from '../../Endpoints';

const ParticipatingDivisions = ({
  isMaximized,
  switchLayoutMaximizedStatus,
}: Partial<LayoutComponentProps>) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { menuList, onMenuItemClick } = useLayoutMaximizedPropsForCard(
    isMaximized,
    switchLayoutMaximizedStatus,
  );

  const [isFormReady, setIsFormReady] = useState(true);
  const [dataForm, setDataForm] = useState([]);

  const { formData, isCheckValid, isLoading, isLoadFilligFields } =
    useSelector(campaignFormSelector);

  const selectedItems = useMemo(
    () => formData?.participatingDivision?.map(i => i?.id),
    [formData?.participatingDivision],
  );

  useEffect(() => {
    if (isCheckValid) {
      const onValidate = () => {
        dispatch(setIsValidParticipatingDivisions(true));
        dispatch(setIsCheckValid({ isCheck: false }));
      };

      onValidate();
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

  useEffect(() => {
    const flter = dataForm.filter((el: IdentifiedObj) =>
      selectedItems?.includes(el?.id),
    );

    if (flter?.length) {
      dispatch(
        setFormData({
          name: 'participatingDivision',
          data: dataForm,
        }),
      );
      dispatch(setIsChanged());
    }
  }, [dataForm, dispatch, selectedItems]);

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

      await http
        .get(Endpoints.divisions(), httpParamsLocal)
        .then(res =>
          setDataForm(
            res.data.d.results.map(createIdentifiedObjWithIdentifier),
          ),
        );
    });

    return () => {
      setDataForm([]);
    };
  }, []);

  const log = (e: React.MouseEvent<HTMLElement>): void => {
    console.log(e);
  };

  return (
    <Card className="campaigns-detail-card campaigns-members">
      <CardHeader>
        <CardHeaderDefault
          title="Участвующие организации"
          onDoubleClick={switchLayoutMaximizedStatus}
          menuList={menuList}
          onMenuItemClick={onMenuItemClick}
        />
      </CardHeader>
      <CardBody>
        {!isLoading && isFormReady && dataForm?.length > 0 ? (
          <ScrollArea>
            <InputLabel label="Участники*">
              <div className="groupTag">
                {dataForm?.map(({ id, name }) => (
                  <div className="itemTag" key={id}>
                    <span>{name}</span>
                    <span onClick={log} role="presentation">
                      <CloseIcon />
                    </span>
                  </div>
                ))}
              </div>
            </InputLabel>
          </ScrollArea>
        ) : (
          <div className="spin">
            <Spin />
          </div>
        )}
      </CardBody>
      <div />
    </Card>
  );
};
export default memo(ParticipatingDivisions);
