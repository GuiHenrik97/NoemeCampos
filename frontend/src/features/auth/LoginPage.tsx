import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import * as authService from "./authService";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const response = await authService.login({ email, password });
            login(response.token);
            navigate("/dashboard");
        } catch {
            setError("Credenciais inválidas");
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
            style={{
                backgroundImage: "url('/colegio2.jpg')",
            }}
        >
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Card */}
            <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Colégio Noeme Campos
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Sistema Administrativo
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#ff6900] text-white py-2 rounded-lg hover:opacity-90 transition"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}