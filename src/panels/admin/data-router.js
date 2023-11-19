import { lazy } from "react";
import ApplicationEdit from "../../pages/admin/application_edit";
import Employees from "../../pages/admin/employees";
const Application = lazy(() =>
  import("./../../pages/admin/applications/index")
);
const ApplicationAdd = lazy(() =>
  import("./../../pages/admin/application_add/index")
);
const FinanceComponent = lazy(() =>
  import("./../../pages/admin/finance/index")
);
const Setting = lazy(() => import("../../pages/admin/setting/index"));
const Chess = lazy(() => import("../../pages/admin/chess/index"));
const AdditServies = lazy(() =>
  import("../../pages/admin/additservices/index")
);
const Room = lazy(() => import("../../pages/admin/room/index"));
const UpdateOrder = lazy(() => import("../../pages/admin/update_order/index"));

export const data = [
  {
    id: 1,
    path: "/admin/application",
    Element: <Application />,
  },
  {
    id: 2,
    path: "/admin/applicationadd",
    Element: <ApplicationAdd />,
  },
  {
    id: 3,
    path: "/admin/applicationadd/:id",
    Element: <ApplicationAdd />,
  },

  {
    id: 4,
    path: "/admin/applicationedit/:id",
    Element: <ApplicationEdit />,
  },
  {
    id: 5,
    path: "/admin/finance",
    Element: <FinanceComponent />,
  },
  {
    id: 6,
    path: "/admin/setting",
    Element: <Setting />,
  },
  {
    id: 7,
    path: "/admin/employees",
    Element: <Employees />,
  },
  {
    id: 8,
    path: "/admin/chess",
    Element: <Chess />,
  },
  {
    id: 9,
    path: "/admin/additservies",
    Element: <AdditServies />,
  },
  {
    id: 10,
    path: "/admin/room/:id",
    Element: <Room />,
  },
  {
    id: 11,
    path: "/admin/update/order/:id",
    Element: <UpdateOrder />,
  },
];
