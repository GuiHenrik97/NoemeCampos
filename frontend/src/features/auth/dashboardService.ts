import { api } from "../../app/axios"

export interface DashboardMetrics {
    totalAlunos: number
    totalTurmas: number
    totalProfessores: number
}

export function getDashboardMetrics() {
    return api.get<DashboardMetrics>("/dashboard")
}