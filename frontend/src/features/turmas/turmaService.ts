import { api } from "../../app/axios"
import type { PaginatedResult } from "../../types/PaginatedResult"

export interface Turma {
  id: number
  nome: string
  anoLetivo: number
  sala: string
  quantidadeAlunos: number
  professores: string[]
}

interface GetTurmasParams {
  pageNumber: number
  pageSize: number
  nome?: string
}

export async function getTurmas(params: GetTurmasParams) {
  return api.get<PaginatedResult<Turma>>("/turma", { params })
}

export async function createTurma(data: {
  nome: string
  anoLetivo: number
  sala: string
}) {
  return api.post("/turma", data)
}

export async function updateTurma(
    id: number,
    data: {
      nome: string
      anoLetivo: number
      sala: string
    }
) {
  return api.put(`/turma/${id}`, data)
}

export async function deleteTurma(id: number) {
  return api.delete(`/turma/${id}`)
}