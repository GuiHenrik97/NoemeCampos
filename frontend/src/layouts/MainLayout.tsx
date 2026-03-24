import { Outlet, useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    LogOut,
    Moon,
    Sun,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function MainLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [darkMode, setDarkMode] = useState(false)

    // Carrega preferência só uma vez
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")

        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark")
            setDarkMode(true)
        } else {
            document.documentElement.classList.remove("dark")
            setDarkMode(false)
        }
    }, [])

    // Atualiza quando muda
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [darkMode])

    function handleLogout() {
        logout()
        navigate("/")
    }

    function isActive(path: string) {
        return location.pathname === path
    }

    function NavItem({
                         to,
                         label,
                         Icon,
                     }: {
        to: string
        label: string
        Icon: any
    }) {
        const active = isActive(to)

        return (
            <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
                ${
                    active
                        ? "bg-white dark:bg-gray-800 shadow-lg translate-x-2 text-[#ff6900]"
                        : "text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60"
                }`}
            >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
            </Link>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

            <aside className="w-64 bg-gray-200 dark:bg-gray-950 p-6 flex flex-col shadow-xl">

                {/* LOGO GRANDE */}
                <div className="mb-10">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex items-center justify-center">
                        <img
                            src="/CNC.svg"
                            alt="Logo Noeme Campos"
                            className="h-20 object-contain"
                        />
                    </div>
                </div>

                <nav className="flex flex-col gap-3 flex-1">
                    <NavItem to="/dashboard" label="Dashboard" Icon={LayoutDashboard} />
                    <NavItem to="/alunos" label="Alunos" Icon={Users} />
                    <NavItem to="/turmas" label="Turmas" Icon={BookOpen} />
                    <NavItem to="/professores" label="Professores" Icon={GraduationCap} />
                </nav>

                <div className="mt-auto space-y-4">

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow text-sm text-center">
                        <p className="font-semibold text-gray-800 dark:text-white">
                            {user?.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.role}
                        </p>
                    </div>

                    <button
                        onClick={() => setDarkMode((prev) => !prev)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-300 dark:bg-gray-700 text-sm text-gray-800 dark:text-white hover:opacity-80 transition"
                    >
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                        <span>
                            {darkMode ? "Modo Claro" : "Modo Escuro"}
                        </span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#ff6900] text-white hover:opacity-90 transition"
                    >
                        <LogOut size={16} />
                        Sair
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto text-gray-800 dark:text-gray-100">
                <div className="p-10 min-h-screen">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}