import { useEffect, useState } from 'react';
import { http } from '@atollis/ot_105_5_0070';
import Endpoints from './Endpoints';
import {
  createIdentifiedObj,
  createIdentifiedObjUser,
  createIdentifiedObjWithIdentifier,
  createIputFormObj,
  createReport,
  IdentifiedObj,
} from './helpers';
import {
  BusinessObject,
  TaskResponse,
} from './reducers/taskParamsReducer/taskParamsReducer';

const requestConfigReport = {
  params: {
    $decorator: 'odataPlus',
    $select: 'NAIMENOVANIE, IDENTIFIKATOR',
  },
};
const requestConfigCampaign = {
  params: {
    $decorator: 'odataPlus',
    $top: 10000000,
  },
};
const requestConfigTask = {
  params: {
    $decorator: 'odataPlus',
    $top: 10000000,
  },
};

const requestDivisionsIOGV = {
  params: {
    $decorator: 'odataPlus',
    $expand: 'ТИП ПОДРАЗДЕЛЕНИЯ',
    $filter: 'TIP_PODRAZDELENIYA/NAIMENOVANIE eq "ИОГВ"',
  },
};

// ОТЧЕТЫ__________________________________________________________

export const useDivisionsIOGV = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http.get(Endpoints.divisions(), requestDivisionsIOGV).then(({ data }) => {
      setItems(data.d.map(createIdentifiedObjWithIdentifier));
    });
  }, [1]);

  return {
    items,
  };
};

export type ProcessTemplatesT = {
  id: string;
  name: string;
  identifier?: string;
};

export const useProcessTemplates = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http
      .get(Endpoints.processTemplates(), requestConfigReport)
      .then(({ data }) => {
        setItems(data.d.map(createIdentifiedObjWithIdentifier));
      });
  }, [1]);

  return {
    items,
  };
};

export const useRelevance = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http
      .get(Endpoints.relevanceStatuses(), requestConfigReport)
      .then(({ data }) => {
        setItems(data.d.map(createIdentifiedObj));
      });
  }, [1]);

  return {
    items,
  };
};

export const useStaff = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http.get(Endpoints.staff(), requestConfigReport).then(({ data }) => {
      setItems(data.d.map(createIdentifiedObjUser));
    });
  }, [1]);

  return {
    items,
  };
};

// Кампании__________________________________________________________
export const useStatusesChoose = () => {
  const [statusesChoose, setItems] = useState([]);

  useEffect(() => {
    http
      .get(Endpoints.campaignStatus(), requestConfigCampaign)
      .then(res => res.data.d.map(createIdentifiedObjWithIdentifier))
      .then(data => setItems(data));
  }, [1]);

  return {
    statusesChoose,
  };
};
// ЗАДАЧИ_____________________________________________________________________

// Campaign
export const useReportsCampaign = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http
      .get(Endpoints.reports(), {
        params: {
          $decorator: 'odataPlus',
          $inlinecount: 'allpages',
          $expand: 'SHABLON_PROCZESSA, KOD',
          $top: 20,
        },
      })
      .then(res => setItems(res.data.d.results.map(createReport)));
  }, [1]);

  return {
    items,
  };
};

export const useInputFormCampaign = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http
      .get(Endpoints.inputForms(), {
        params: {
          $decorator: 'odataPlus',
          $inlinecount: 'allpages',
          $select: 'KOD, NAIMENOVANIE, IDENTIFIKATOR, SSY`LKA_NA_FORMU_VVODA',
          $expand: 'STATUSY`_FORM_VVODA',
          $filter: 'STATUSY`_FORM_VVODA/IDENTIFIKATOR eq 22',
          $skip: 0,
          $top: 10000000,
        },
      })
      .then(res => setItems(res.data.d.results.map(createIputFormObj)));
  }, [1]);

  return {
    items,
  };
};

export const useStatusesCampaign = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http
      .get(Endpoints.campaignStatus(), requestConfigCampaign)
      .then(res => setItems(res.data.d.map(createIdentifiedObjWithIdentifier)));
  }, [1]);

  return {
    items,
  };
};

export const useCuratorCampaign = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http
      .get(Endpoints.staff(), requestConfigCampaign)
      .then(res => setItems(res.data.d.map(createIdentifiedObjUser)));
  }, [1]);

  return {
    items,
  };
};

export const useDivisionsIOGVCampaign = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http
      .get(Endpoints.divisions(), {
        params: {
          $decorator: 'odataPlus',
          $expand: 'ТИП ПОДРАЗДЕЛЕНИЯ',
          $filter: 'TIP_PODRAZDELENIYA/NAIMENOVANIE eq "ИОГВ"',
        },
      })
      .then(res => setItems(res.data.d.map(createIdentifiedObjWithIdentifier)));
  }, [1]);

  return {
    items,
  };
};
// Campaign

export const useReportsLoad = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // TODO: нужно выяснить какой запрос и запрашивать сразу уникальные
    http
      .get(Endpoints.tasks(), {
        params: {
          $decorator: 'odataPlus',
          $expand: 'KAMPANIYA/OTCHET',
          $top: 10000000,
        },
      })
      .then(res => {
        const arr = res.data.d
          .map((el: TaskResponse) => ({
            label: el.KAMPANIYA.OTCHET.NAIMENOVANIE,
            value: el.KAMPANIYA.OTCHET.IDENTIFIKATOR,
          }))
          .filter(
            (elem: IdentifiedObj, index: number, self: IdentifiedObj[]) =>
              self.findIndex(
                t => t.name === elem.name && t.value === elem.value,
              ) === index,
          );

        setItems(arr);
      });
  }, [1]);

  return {
    items,
  };
};

export const useTaskTypes = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http.get(Endpoints.taskTypes(), requestConfigTask).then(({ data }) => {
      setItems(
        data.d.map(
          ({
            obj_id: objId,
            NAIMENOVANIE,
          }: Record<'obj_id' | 'NAIMENOVANIE', any>) => ({
            label: NAIMENOVANIE,
            value: objId,
          }),
        ),
      );
    });
  }, [1]);

  return { items };
};

export const useCampaigns = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http.get(Endpoints.campaigns(), requestConfigTask).then(({ data }) => {
      setItems(
        data.d.map(
          ({
            obj_id: objId,
            NAIMENOVANIE,
          }: Record<'obj_id' | 'NAIMENOVANIE', any>) => ({
            label: NAIMENOVANIE,
            value: objId,
          }),
        ),
      );
    });
  }, [1]);

  return {
    items,
  };
};
export const useDivision = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http.get(Endpoints.divisions(), requestConfigTask).then(({ data }) => {
      setItems(
        data.d.map(
          ({
            obj_id: objId,
            NAIMENOVANIE,
          }: Record<'obj_id' | 'NAIMENOVANIE', any>) => ({
            label: NAIMENOVANIE,
            value: objId,
          }),
        ),
      );
    });
  }, [1]);

  return {
    items,
  };
};

export const useEmployees = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http.get(Endpoints.staff(), requestConfigTask).then(({ data }) => {
      setItems(
        data.d.map(
          ({
            IDENTIFIKATOR,
            NAIMENOVANIE,
          }: Record<'IDENTIFIKATOR' | 'NAIMENOVANIE', any>) => ({
            label: NAIMENOVANIE,
            value: IDENTIFIKATOR,
          }),
        ),
      );
    });
  }, [1]);

  return {
    items,
  };
};

export const useStatusesList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http.get(Endpoints.taskStatuses(), requestConfigTask).then(({ data }) => {
      setItems(
        data.d.map(
          ({
            IDENTIFIKATOR,
            NAIMENOVANIE,
          }: Record<'IDENTIFIKATOR' | 'NAIMENOVANIE', any>) => ({
            label: NAIMENOVANIE,
            value: IDENTIFIKATOR,
          }),
        ),
      );
    });
  }, [1]);

  return {
    items,
  };
};

export const useDivisionsWithEmployees = () => {
  const [divisionsWithEmployees, setItems] = useState([]);

  useEffect(() => {
    http
      .get(Endpoints.divisions(), {
        params: {
          $decorator: 'odataPlus',
          $expand: 'СОТРУДНИКИ',
          $orderby: 'NAIMENOVANIE',
        },
      })
      .then(res =>
        res.data.d.map(
          (el: {
            SOTRUDNIKIs: BusinessObject[];
            SOTRUDNIKI: BusinessObject;
          }) => {
            if (el.SOTRUDNIKI) {
              return { ...el, SOTRUDNIKIs: [el.SOTRUDNIKI] };
            }
            return el;
          },
        ),
      )
      .then(data => setItems(data));
  }, [1]);

  return {
    divisionsWithEmployees,
  };
};

export const useStatuses = () => {
  const [statuses, setItems] = useState([]);

  useEffect(() => {
    http
      .get(Endpoints.taskStatuses(), requestConfigTask)
      .then(res => res.data.d.map(createIdentifiedObjWithIdentifier))
      .then(data => setItems(data));
  }, [1]);

  return {
    statuses,
  };
};
