import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import AlunoDetailsModal from "./AlunoDetailsModal"
import {
    getAlunos,
    createAluno,
    updateAluno,
    deleteAluno,
    type Aluno,
} from "./alunoService"
import { getTurmas, type Turma } from "../turmas/turmaService"
import { useAuth } from "../../contexts/AuthContext"
import Pagination from "../../components/Pagination"
import Modal from "../../components/Modal"
import { Users, Plus, Search } from "lucide-react"

export default function AlunosPage() {
    const { user } = useAuth()

    const [alunos, setAlunos] = useState<Aluno[]>([])
    const [turmas, setTurmas] = useState<Turma[]>([])
    const [loading, setLoading] = useState(true)

    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize] = useState(5)
    const [totalPages, setTotalPages] = useState(1)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const [showModal, setShowModal] = useState(false)
    const [editingAluno, setEditingAluno] = useState<Aluno | null>(null)
    const [detailsAluno, setDetailsAluno] = useState<Aluno | null>(null)

    const [nome, setNome] = useState("")
    const [cpf, setCpf] = useState("")
    const [matricula, setMatricula] = useState("")
    const [dataNascimento, setDataNascimento] = useState("")
    const [email, setEmail] = useState("")
    const [telefone, setTelefone] = useState("")
    const [endereco, setEndereco] = useState("")
    const [ativo, setAtivo] = useState(true)
    const [turmaId, setTurmaId] = useState<number | "">("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPageNumber(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [search])

    async function fetchAlunos() {
        const response = await getAlunos({
            pageNumber,
            pageSize,
            nome: debouncedSearch || undefined,
        })
        setAlunos(response.data.data)
        setTotalPages(response.data.totalPages)
    }

    async function fetchTurmas() {
        const response = await getTurmas({
            pageNumber: 1,
            pageSize: 100,
        })
        setTurmas(response.data.data)
    }

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            await fetchAlunos()
            setLoading(false)
        }
        void load()
    }, [pageNumber, debouncedSearch])

    useEffect(() => {
        void fetchTurmas()
    }, [])

    function resetForm() {
        setNome("")
        setCpf("")
        setMatricula("")
        setDataNascimento("")
        setEmail("")
        setTelefone("")
        setEndereco("")
        setAtivo(true)
        setTurmaId("")
    }

    function openCreateModal() {
        setEditingAluno(null)
        resetForm()
        setShowModal(true)
    }

    function openEditModal(aluno: Aluno) {
        setEditingAluno(aluno)
        setNome(aluno.nome)
        setCpf(aluno.cpf)
        setMatricula(aluno.matricula)
        setDataNascimento(aluno.dataNascimento.split("T")[0])
        setEmail(aluno.email ?? "")
        setTelefone(aluno.telefone ?? "")
        setEndereco(aluno.endereco ?? "")
        setAtivo(aluno.ativo)
        setTurmaId(aluno.turmaId)
        setShowModal(true)
    }

    function openDetailsModal(aluno: Aluno) {
        setDetailsAluno(aluno)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!turmaId) return

        const payload = {
            nome,
            cpf,
            matricula,
            dataNascimento,
            email,
            telefone,
            endereco,
            ativo,
            turmaId: Number(turmaId),
        }

        try {
            if (editingAluno) {
                await updateAluno(editingAluno.id, payload)
                toast.success("Aluno atualizado com sucesso!")
            } else {
                await createAluno(payload)
                toast.success("Aluno criado com sucesso!")
            }

            setShowModal(false)
            await fetchAlunos()
        } catch {
            toast.error("Erro ao salvar aluno")
        }
    }

    if (loading) return <p className="text-gray-500">Carregando...</p>

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-[#ff6900]/10 p-3 rounded-2xl">
                        <Users className="text-[#ff6900]" />
                    </div>
                    <h1 className="text-3xl font-bold dark:text-white">
                        Gestão de Alunos
                    </h1>
                </div>

                {user?.role !== "Coordenador" && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-[#ff6900] text-white px-5 py-2 rounded-2xl shadow hover:shadow-lg transition"
                    >
                        <Plus size={18} />
                        Novo Aluno
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
                    <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="p-4 text-left">Nome</th>
                        <th className="p-4 text-left">Turma</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {alunos.map((aluno) => (
                        <tr key={aluno.id} className="border-t">
                            <td className="p-4">{aluno.nome}</td>
                            <td className="p-4">{aluno.turmaNome}</td>
                            <td className="p-4">
                                {aluno.ativo ? "Ativo" : "Inativo"}
                            </td>
                            <td className="p-4 space-x-4">
                                <button
                                    onClick={() => openDetailsModal(aluno)}
                                    className="text-gray-600 hover:underline"
                                >
                                    Detalhes
                                </button>
                                <button
                                    onClick={() => openEditModal(aluno)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={async () => {
                                        if (confirm("Tem certeza que deseja excluir este aluno?")) {
                                            await deleteAluno(aluno.id)
                                            toast.success("Aluno excluído!")
                                            await fetchAlunos()
                                        }
                                    }}
                                    className="text-red-500 hover:underline"
                                >
                                    Excluir
                                </button>
                            </td>
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

            {/* MODAL CRIAR / EDITAR */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h2 className="text-xl font-semibold mb-6">
                        {editingAluno ? "Editar Aluno" : "Novo Aluno"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input required placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full border p-3 rounded-xl"/>
                        <input required placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full border p-3 rounded-xl"/>
                        <input required placeholder="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} className="w-full border p-3 rounded-xl"/>
                        <input required type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="w-full border p-3 rounded-xl"/>
                        <input required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 rounded-xl"/>
                        <input required placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full border p-3 rounded-xl"/>
                        <input required placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full border p-3 rounded-xl"/>

                        <select required value={turmaId} onChange={(e) => setTurmaId(Number(e.target.value))} className="w-full border p-3 rounded-xl">
                            <option value="">Selecione uma turma</option>
                            {turmas.map((turma) => (
                                <option key={turma.id} value={turma.id}>
                                    {turma.nome}
                                </option>
                            ))}
                        </select>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
                            Ativo
                        </label>

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

            {/* MODAL DETALHES */}
            {detailsAluno && (
                <AlunoDetailsModal
                    aluno={detailsAluno}
                    onClose={() => setDetailsAluno(null)}
                />
            )}
        </div>
    )
}