import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FormBuilderConstructorPage,
  FormBuilderDetalizationPage,
  FormBuilderMonitoringPage,
} from '@atollis/ot_105_1_0040';
import { selectAuth } from '@atollis/ot_105_7_0010';
import { FunctionsGuard } from '@atollis/ot_105_5_0070';

const formBuilderRoutes = {
  base: '/form-builder',
  edit: ':id',
  create: 'create',
  constructor: 'constructor',
};

export const FormBuilder = () => {
  const { functions } = useSelector(selectAuth);

  return (
    <Routes>
      <Route
        element={
          <FunctionsGuard
            functionRule="OT.105.APP.SF.005"
            functionRules={functions}
          />
        }
      >
        <Route index element={<FormBuilderMonitoringPage />} />
        <Route
          path={`${formBuilderRoutes.edit}`}
          element={<FormBuilderDetalizationPage key="edit" />}
        />
        <Route
          path={`${formBuilderRoutes.create}`}
          element={<FormBuilderDetalizationPage key="create" />}
        />
        <Route
          element={
            <FunctionsGuard
              functionRule="OT.105.APP.SF.005.002"
              functionRules={functions}
            />
          }
        >
          <Route path={`${formBuilderRoutes.constructor}`}>
            <Route
              path={`${formBuilderRoutes.edit}`}
              element={<FormBuilderConstructorPage />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default formBuilderRoutes;
