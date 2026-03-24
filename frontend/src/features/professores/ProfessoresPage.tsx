import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import toast from "react-hot-toast"
import {
    getProfessores,
    createProfessor,
    updateProfessor,
    type Professor,
} from "./professorService"
import { useAuth } from "../../contexts/AuthContext"
import Pagination from "../../components/Pagination"
import Modal from "../../components/Modal"
import { GraduationCap, Plus, Search } from "lucide-react"

export default function ProfessoresPage() {
    const { user } = useAuth()

    const [professores, setProfessores] = useState<Professor[]>([])
    const [loading, setLoading] = useState(true)

    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize] = useState(5)
    const [totalPages, setTotalPages] = useState(1)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const [showModal, setShowModal] = useState(false)
    const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null)

    const [nome, setNome] = useState("")
    const [cpf, setCpf] = useState("")
    const [especialidade, setEspecialidade] = useState("")
    const [salario, setSalario] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPageNumber(1)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])

    async function fetchProfessores() {
        try {
            const response = await getProfessores({
                pageNumber,
                pageSize,
                nome: debouncedSearch || undefined,
            })

            setProfessores(response.data.data)
            setTotalPages(response.data.totalPages)
        } catch (error) {
            console.error("Erro ao buscar professores:", error)
            toast.error("Erro ao carregar professores")
            setProfessores([])
        }
    }

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                await fetchProfessores()
            } finally {
                setLoading(false)
            }
        }

        void load()
    }, [pageNumber, debouncedSearch])

    function openCreateModal() {
        setEditingProfessor(null)
        setNome("")
        setCpf("")
        setEspecialidade("")
        setSalario("")
        setShowModal(true)
    }

    function openEditModal(prof: Professor) {
        setEditingProfessor(prof)
        setNome(prof.nome)
        setCpf(prof.cpf)
        setEspecialidade(prof.especialidade)
        setSalario(prof.salario.toString())
        setShowModal(true)
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            const payload = {
                nome,
                cpf,
                especialidade,
                salario: Number(salario),
            }

            if (editingProfessor) {
                await updateProfessor(editingProfessor.id, payload)
                toast.success("Professor atualizado com sucesso!")
            } else {
                await createProfessor(payload)
                toast.success("Professor criado com sucesso!")
            }

            setShowModal(false)
            await fetchProfessores()
        } catch {
            toast.error("Erro ao salvar professor")
        }
    }

    if (loading) return <p className="text-gray-500">Carregando...</p>

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-[#ff6900]/10 p-3 rounded-2xl">
                        <GraduationCap className="text-[#ff6900]" />
                    </div>
                    <h1 className="text-3xl font-bold dark:text-white">
                        Gestão de Professores
                    </h1>
                </div>

                {user?.role !== "Coordenador" && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#ff6900] text-white px-5 py-2 rounded-2xl shadow hover:shadow-lg transition"
                    >
                        <Plus size={18} />
                        Novo Professor
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
                        <th className="p-4 text-left">CPF</th>
                        <th className="p-4 text-left">Especialidade</th>
                        <th className="p-4 text-left">Salário</th>
                        {user?.role !== "Coordenador" && (
                            <th className="p-4 text-left">Ações</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {professores.map((prof) => (
                        <tr
                            key={prof.id}
                            className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                        >
                            <td className="p-4 text-gray-800 dark:text-gray-100">{prof.id}</td>
                            <td className="p-4 text-gray-800 dark:text-gray-100">{prof.nome}</td>
                            <td className="p-4 text-gray-800 dark:text-gray-100">{prof.cpf}</td>
                            <td className="p-4 text-gray-800 dark:text-gray-100">{prof.especialidade}</td>
                            <td className="p-4 text-gray-800 dark:text-gray-100">
                                R$ {prof.salario}
                            </td>
                            {user?.role !== "Coordenador" && (
                                <td className="p-4">
                                    <button
                                        onClick={() => openEditModal(prof)}
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
                        {editingProfessor ? "Editar Professor" : "Novo Professor"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nome do professor"
                            className="w-full border dark:border-gray-700 p-3 rounded-xl"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="CPF (11 dígitos)"
                            className="w-full border dark:border-gray-700 p-3 rounded-xl"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Especialidade"
                            className="w-full border dark:border-gray-700 p-3 rounded-xl"
                            value={especialidade}
                            onChange={(e) => setEspecialidade(e.target.value)}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Salário"
                            className="w-full border dark:border-gray-700 p-3 rounded-xl"
                            value={salario}
                            onChange={(e) => setSalario(e.target.value)}
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
        </div>
    )
}