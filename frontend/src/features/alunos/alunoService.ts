import { api } from "../../app/axios"
import type { PaginatedResult } from "../../types/PaginatedResult"

export interface Aluno {
    id: number
    nome: string
    cpf: string
    matricula: string
    dataNascimento: string
    email?: string
    telefone?: string
    endereco?: string
    ativo: boolean
    turmaId: number
    turmaNome: string
    fotoUrl?: string
}

export interface AlunoQueryParams {
    pageNumber: number
    pageSize: number
    nome?: string
}

export function getAlunos(params: AlunoQueryParams) {
    return api.get<PaginatedResult<Aluno>>("/aluno", { params })
}

export function createAluno(data: any) {
    return api.post("/aluno", data)
}

export function updateAluno(id: number, data: any) {
    return api.put(`/aluno/${id}`, data)
}

export function deleteAluno(id: number) {
    return api.delete(`/aluno/${id}`)
}