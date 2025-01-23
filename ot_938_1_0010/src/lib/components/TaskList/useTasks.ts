import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { oDataFilterFormatter, useRequest } from '@atollis/ot_105_5_0070';
import { selectAccessToken } from '@atollis/ot_105_7_0010';
import { Task } from './types';
import { IManagementSettings } from '../../defaultSettings/defaultSettings';
import Endpoints from '../../Endpoints';

type UseTasksProps = {
  search: string;
  settings: IManagementSettings;
};

function useTasks({ search = '', settings }: UseTasksProps) {
  const accessToken = useSelector(selectAccessToken);
  const bearerRef = useRef(`Bearer ${accessToken}`);
  const filter = useMemo(
    () => `(substringof('${search}',NAIMENOVANIE_ZADACHI))`,
    [search],
  );

  const params = useMemo(() => {
    const tempParams: Partial<Record<string, unknown>> & { $filter: string } = {
      $top: 10000000,
      $skip: 0,
      $filter: filter,
    };

    const selectedPresetParams =
      settings?.taskMonitoring?.activePreset?.requestParams || null;
    const isFilterInSelectedParams = Boolean(selectedPresetParams?.$filter);

    if (tempParams.$filter) {
      tempParams.$filter = oDataFilterFormatter(tempParams.$filter);
    }
    if (selectedPresetParams) {
      Object.assign(tempParams, selectedPresetParams);

      if (isFilterInSelectedParams) {
        tempParams.$filter += ` and ${selectedPresetParams.$filter}`;
      }
    }

    return tempParams;
  }, [filter, settings?.taskMonitoring?.activePreset?.requestParams]);

  const { data, ...requestOptions } = useRequest<{ d: Task[] }>(
    'get',
    Endpoints.showcaseTasks(),
    {
      params,
      headers: {
        Authorization: bearerRef.current,
      },
    },
  );

  return {
    items: data?.d ?? [],

    ...requestOptions,
  };
}

export default useTasks;
