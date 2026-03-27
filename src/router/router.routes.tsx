import { createBrowserRouter } from "react-router-dom";
import  HomePage from "../pages/ui/HomePage";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import Layout from "../layout";
import ToolMarketplace from "../pages/ui/ToolMarketPlace";
import BorrowToolPage from "../pages/ui/BorrowToolPage";
import UserSettings from "../pages/ui/UserSettings";
import ListATool from "../pages/ui/ListATool";
import EditTool from "../pages/ui/EditTool";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true, 
                element: <HomePage />,
            },
            {
                path: "tools", 
                element: <ToolMarketplace />,
            },
            {
                path: "borrow/:id",
                element: <BorrowToolPage />
            },
            {
                path: "settings",
                element: <UserSettings />
            },
            {
                path: "list-tool",
                element: <ListATool />
            },
            {
                path: "edit-tool/:id",
                element: <EditTool />
            }
        ],
    },
    {
        path: "/auth/login",
        element: <LoginPage />,
    },
    {
        path: "/auth/register",
        element: <RegisterPage />,
    },
]);