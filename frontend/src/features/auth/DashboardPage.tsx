import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { getDashboardMetrics, type DashboardMetrics } from "./dashboardService"
import { Users, GraduationCap, BookOpen } from "lucide-react"

export default function DashboardPage() {
    const { user } = useAuth()
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getDashboardMetrics()
                setMetrics(response.data)
            } finally {
                setLoading(false)
            }
        }

        void load()
    }, [])

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Bem-vindo, {user?.email}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card title="Total de Alunos" value={metrics?.totalAlunos} loading={loading} Icon={Users} />
                <Card title="Total de Professores" value={metrics?.totalProfessores} loading={loading} Icon={GraduationCap} />
                <Card title="Turmas Ativas" value={metrics?.totalTurmas} loading={loading} Icon={BookOpen} />
            </div>
        </div>
    )
}

function Card({ title, value, loading, Icon }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
                    {loading ? (
                        <div className="mt-4 h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mt-2">
                            {value}
                        </h2>
                    )}
                </div>
                <div className="bg-[#ff6900]/10 p-4 rounded-2xl">
                    <Icon size={28} className="text-[#ff6900]" />
                </div>
            </div>
        </div>
    )
}