import { createBrowserRouter } from "react-router-dom"
import LoginPage from "../features/auth/LoginPage"
import DashboardPage from "../features/auth/DashboardPage"
import AlunosPage from "../features/alunos/AlunosPage"
import TurmasPage from "../features/turmas/TurmasPage"
import ProfessoresPage from "../features/professores/ProfessoresPage"
import PrivateRoute from "./PrivateRoute"
import MainLayout from "../layouts/MainLayout"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <DashboardPage />,
                    },
                    {
                        path: "/alunos",
                        element: <AlunosPage />,
                    },
                    {
                        path: "/turmas",
                        element: <TurmasPage />,
                    },
                    {
                        path: "/professores",
                        element: <ProfessoresPage />,
                    },
                ],
            },
        ],
    },
])