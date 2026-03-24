import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
    email: string
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string
}

interface AuthUser {
    email: string
    role: string
}

interface AuthContextType {
    user: AuthUser | null
    login: (token: string) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token)

                setUser({
                    email: decoded.email,
                    role:
                        decoded[
                            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                            ],
                })
            } catch {
                logout()
            }
        }
    }, [])

    function login(token: string) {
        localStorage.setItem("token", token)

        const decoded = jwtDecode<JwtPayload>(token)

        setUser({
            email: decoded.email,
            role:
                decoded[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    ],
        })
    }

    function logout() {
        localStorage.removeItem("token")
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider")
    }

    return context
}