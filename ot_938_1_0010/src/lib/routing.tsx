import React from 'react';

export const TaskManagementPage = React.lazy(
  () => import('./TaskManagement/TaskManagement'),
);

export const ReportManagementPage = React.lazy(
  () => import('./ReportManagement/ReportManagement'),
);

export const ManagementPage = React.lazy(
  () => import('./Management/Management'),
);

export const CampaignManagementPage = React.lazy(
  () => import('./components/CampaignsManagement/CampaignsManagement'),
);
