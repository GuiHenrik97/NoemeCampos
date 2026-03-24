import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import toast from "react-hot-toast"
import {
    getTurmas,
    createTurma,
    updateTurma,
    type Turma,
} from "./turmaService"
import { useAuth } from "../../contexts/AuthContext"
import Pagination from "../../components/Pagination"
import Modal from "../../components/Modal"
import { BookOpen, Plus, Search, Eye } from "lucide-react"

export default function TurmasPage() {
    const { user } = useAuth()

    const [turmas, setTurmas] = useState<Turma[]>([])
    const [loading, setLoading] = useState(true)

    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize] = useState(5)
    const [totalPages, setTotalPages] = useState(1)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const [showModal, setShowModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const [editingTurma, setEditingTurma] = useState<Turma | null>(null)
    const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null)

    const [nome, setNome] = useState("")
    const [anoLetivo, setAnoLetivo] = useState<number>(new Date().getFullYear())
    const [sala, setSala] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPageNumber(1)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])

    async function fetchTurmas() {
        const response = await getTurmas({
            pageNumber,
            pageSize,
            nome: debouncedSearch || undefined,
        })

        setTurmas(response.data.data)
        setTotalPages(response.data.totalPages)
    }

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            await fetchTurmas()
            setLoading(false)
        }

        void load()
    }, [pageNumber, debouncedSearch])

    function openCreateModal() {
        setEditingTurma(null)
        setNome("")
        setAnoLetivo(new Date().getFullYear())
        setSala("")
        setShowModal(true)
    }

    function openEditModal(turma: Turma) {
        setEditingTurma(turma)
        setNome(turma.nome)
        setAnoLetivo(turma.anoLetivo)
        setSala(turma.sala)
        setShowModal(true)
    }

    function openDetailModal(turma: Turma) {
        setSelectedTurma(turma)
        setShowDetailModal(true)
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            if (editingTurma) {
                await updateTurma(editingTurma.id, { nome, anoLetivo, sala })
                toast.success("Turma atualizada com sucesso!")
            } else {
                await createTurma({ nome, anoLetivo, sala })
                toast.success("Turma criada com sucesso!")
            }

            setShowModal(false)
            await fetchTurmas()
        } catch {
            toast.error("Erro ao salvar turma")
        }
    }

    if (loading) return <p className="text-gray-500">Carregando...</p>

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-[#ff6900]/10 p-3 rounded-2xl">
                        <BookOpen className="text-[#ff6900]" />
                    </div>
                    <h1 className="text-3xl font-bold dark:text-white">
                        Gestão de Turmas
                    </h1>
                </div>

                {user?.role !== "Coordenador" && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#ff6900] text-white px-5 py-2 rounded-2xl shadow hover:shadow-lg transition"
                    >
                        <Plus size={18} />
                        Nova Turma
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow">
                <div className="flex items-center gap-3">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <tr>
                        <th className="p-4 text-left">ID</th>
                        <th className="p-4 text-left">Nome</th>
                        <th className="p-4 text-left">Ano</th>
                        <th className="p-4 text-left">Sala</th>
                        <th className="p-4 text-left">Alunos</th>
                        <th className="p-4 text-left">Detalhes</th>
                        {user?.role !== "Coordenador" && (
                            <th className="p-4 text-left">Ações</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {turmas.map((turma) => (
                        <tr
                            key={turma.id}
                            className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                        >
                            <td className="p-4">{turma.id}</td>
                            <td className="p-4">{turma.nome}</td>
                            <td className="p-4">{turma.anoLetivo}</td>
                            <td className="p-4">{turma.sala}</td>
                            <td className="p-4">{turma.quantidadeAlunos}</td>
                            <td className="p-4">
                                <button
                                    onClick={() => openDetailModal(turma)}
                                    className="text-indigo-500 hover:underline flex items-center gap-1"
                                >
                                    <Eye size={16} />
                                    Ver
                                </button>
                            </td>
                            {user?.role !== "Coordenador" && (
                                <td className="p-4">
                                    <button
                                        onClick={() => openEditModal(turma)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Editar
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={pageNumber}
                totalPages={totalPages}
                onPageChange={(p) => setPageNumber(p)}
            />

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h2 className="text-xl font-semibold mb-6 dark:text-white">
                        {editingTurma ? "Editar Turma" : "Nova Turma"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nome da turma"
                            className="w-full border dark:border-gray-700 p-3 rounded-xl"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Ano Letivo"
                            className="w-full border dark:border-gray-700 p-3 rounded-xl"
                            value={anoLetivo}
                            onChange={(e) => setAnoLetivo(Number(e.target.value))}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Sala"
                            className="w-full border dark:border-gray-700 p-3 rounded-xl"
                            value={sala}
                            onChange={(e) => setSala(e.target.value)}
                            required
                        />

                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>

                            <button className="bg-[#ff6900] text-white px-5 py-2 rounded-xl">
                                Salvar
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {showDetailModal && selectedTurma && (
                <Modal onClose={() => setShowDetailModal(false)}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold dark:text-white">
                            {selectedTurma.nome}
                        </h2>

                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="text-gray-400 hover:text-red-500 text-xl font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl">
                            <p className="text-gray-500 dark:text-gray-300">Ano Letivo</p>
                            <p className="text-lg font-semibold dark:text-white">
                                {selectedTurma.anoLetivo || "Não informado"}
                            </p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl">
                            <p className="text-gray-500 dark:text-gray-300">Sala</p>
                            <p className="text-lg font-semibold dark:text-white">
                                {selectedTurma.sala || "Não informada"}
                            </p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl col-span-2">
                            <p className="text-gray-500 dark:text-gray-300">
                                Total de Alunos
                            </p>
                            <p className="text-2xl font-bold text-[#ff6900]">
                                {selectedTurma.quantidadeAlunos}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500 dark:text-gray-300 mb-2">
                            Professores Vinculados
                        </p>

                        {selectedTurma.professores.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {selectedTurma.professores.map((prof, index) => (
                                    <span
                                        key={index}
                                        className="bg-[#ff6900]/10 text-[#ff6900] px-3 py-1 rounded-full text-xs font-medium"
                                    >
                            {prof}
                        </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">
                                Nenhum professor vinculado
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="bg-gray-200 dark:bg-gray-600 px-5 py-2 rounded-xl hover:opacity-80 transition"
                        >
                            Fechar
                        </button>
                    </div>
                </Modal>
            )
            }
        </div>
    )
}