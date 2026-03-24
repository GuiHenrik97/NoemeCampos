import { api } from "../../app/axios"

export interface Professor {
    id: number
    nome: string
    cpf: string
    especialidade: string
    salario: number
    turmas: string[]
}

interface GetProfessoresParams {
    pageNumber: number
    pageSize: number
    nome?: string
}

export async function getProfessores(params: GetProfessoresParams) {
    return api.get("/professor", { params })
}

export async function createProfessor(data: {
    nome: string
    cpf: string
    especialidade: string
    salario: number
}) {
    return api.post("/professor", data)
}

export async function updateProfessor(
    id: number,
    data: {
        nome: string
        cpf: string
        especialidade: string
        salario: number
    }
) {
    return api.put(`/professor/${id}`, data)
}

export async function deleteProfessor(id: number) {
    return api.delete(`/professor/${id}`)
}