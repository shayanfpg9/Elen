//deps
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Table, {
  SearchLoader,
  TableLoader,
} from "./component/Content/AtomicTable/Table";

//components
import Info, { InfoLoader } from "./component/Content/Info/Info";
import Elen, { InitLoader } from "./component/Elen";
import Error from "./component/Error/Error";
import Search from "./component/Header/Search";
import Home from "./component/Home/Home";
import Document, { ApiGatewaysLoader } from "./component/Document/Document";
import DocumentPages from "./component/Document/Pages";

//utils
import "./translate/i18n";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Elen />,
    loader: InitLoader,
    errorElement: <Elen use={<Error loaded />} />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "table",
        loader: async () => ({ all: await TableLoader({ refresh: false }) }),
        errorElement: <Error loaded />,
        element: <Table />,
      },
      {
        path: "table/find/:query",
        element: <Table />,
        loader: async (data) => ({
          all: await TableLoader({ refresh: false }),
          bold: await SearchLoader(data),
        }),
        errorElement: <Error loaded />,
      },
      {
        path: "table/find",
        element: <Search single />,
      },
      {
        path: "atom/:atom",
        loader: InfoLoader,
        errorElement: <Error loaded />,
        element: <Info />,
      },
      {
        path: "document",
        element: <Document />,
        loader: ApiGatewaysLoader,
        children: [
          {
            path: ":method?/:action?",
            element: <DocumentPages />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
