import { useState } from "react"
import Modal from "../../components/Modal"
import type { Aluno } from "./alunoService"
import { X } from "lucide-react"

interface Props {
    aluno: Aluno
    onClose: () => void
}

export default function AlunoDetailsModal({ aluno, onClose }: Props) {
    const [activeTab, setActiveTab] = useState<"perfil" | "financeiro" | "responsaveis">("perfil")

    return (
        <Modal onClose={onClose} size="xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold">{aluno.nome}</h2>
                    <p className="text-gray-500 text-sm">Turma: {aluno.turmaNome}</p>
                </div>

                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="border-b mb-6 flex gap-8">
                <button
                    onClick={() => setActiveTab("perfil")}
                    className={`pb-3 ${
                        activeTab === "perfil"
                            ? "border-b-2 border-[#ff6900] text-[#ff6900]"
                            : "text-gray-500"
                    }`}
                >
                    Perfil
                </button>

                <button
                    onClick={() => setActiveTab("financeiro")}
                    className={`pb-3 ${
                        activeTab === "financeiro"
                            ? "border-b-2 border-[#ff6900] text-[#ff6900]"
                            : "text-gray-500"
                    }`}
                >
                    Financeiro
                </button>

                <button
                    onClick={() => setActiveTab("responsaveis")}
                    className={`pb-3 ${
                        activeTab === "responsaveis"
                            ? "border-b-2 border-[#ff6900] text-[#ff6900]"
                            : "text-gray-500"
                    }`}
                >
                    Responsáveis
                </button>
            </div>

            {activeTab === "perfil" && (
                <div className="grid grid-cols-3 gap-8">
                    {/* FOTO */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-40 h-40 bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                            {aluno.fotoUrl ? (
                                <img
                                    src={aluno.fotoUrl}
                                    alt="Foto do aluno"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400">Sem Foto</span>
                            )}
                        </div>

                        <span
                            className={`text-sm font-medium ${
                                aluno.ativo
                                    ? "text-green-600"
                                    : "text-red-500"
                            }`}
                        >
                            {aluno.ativo ? "Aluno Ativo" : "Aluno Inativo"}
                        </span>
                    </div>

                    {/* DADOS */}
                    <div className="col-span-2 grid grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="text-gray-400">CPF</p>
                            <p className="font-medium">{aluno.cpf}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Matrícula</p>
                            <p className="font-medium">{aluno.matricula}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Nascimento</p>
                            <p className="font-medium">
                                {new Date(aluno.dataNascimento).toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-400">Turma</p>
                            <p className="font-medium">{aluno.turmaNome}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Email</p>
                            <p className="font-medium">{aluno.email}</p>
                        </div>

                        <div>
                            <p className="text-gray-400">Telefone</p>
                            <p className="font-medium">{aluno.telefone}</p>
                        </div>

                        <div className="col-span-2">
                            <p className="text-gray-400">Endereço</p>
                            <p className="font-medium">{aluno.endereco || "Não informado"}</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "financeiro" && (
                <div className="py-10 text-center text-gray-500">
                    <p className="text-lg font-medium">
                        Módulo Financeiro
                    </p>
                    <p className="text-sm mt-2">
                        Em breve você poderá visualizar mensalidades,
                        boletos e histórico de pagamentos aqui.
                    </p>
                </div>
            )}

            {activeTab === "responsaveis" && (
                <div className="py-10 text-center text-gray-500">
                    <p className="text-lg font-medium">
                        Responsáveis
                    </p>
                    <p className="text-sm mt-2">
                        Em breve será possível cadastrar e visualizar
                        responsáveis vinculados ao aluno.
                    </p>
                </div>
            )}

            <div className="flex justify-end mt-10">
                <button
                    onClick={onClose}
                    className="bg-[#ff6900] text-white px-6 py-2 rounded-xl hover:opacity-90 transition"
                >
                    Fechar
                </button>
            </div>
        </Modal>
    )
}