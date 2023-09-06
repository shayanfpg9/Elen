
import { createBrowserRouter } from "react-router-dom";


//components
import Table, {
    SearchLoader,
    TableLoader,
} from "./component/Content/AtomicTable/Table";
import Info, { InfoLoader } from "./component/Content/Info/Info";
import Elen, { InitLoader } from "./component/App";
import Error from "./component/Error/Error";
import Search from "./component/Header/Search";
import Home from "./component/Home/Home";
import Document, { ApiGatewaysLoader } from "./component/Document/Document";
import DocumentPages from "./component/Document/Pages";

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

export default router