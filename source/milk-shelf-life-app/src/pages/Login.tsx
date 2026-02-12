import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, Lock, Mail, Loader2, ArrowRight, User } from 'lucide-react'

export default function Login() {
    const navigate = useNavigate()
    const { loginAsGuest } = useAuth()
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                setMessage('Registration successful! Please check your email to confirm.')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                navigate('/')
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    const handleGuestLogin = async () => {
        setLoading(true)
        try {
            await loginAsGuest()
            navigate('/')
        } catch (err) {
            setError('Failed to enter as guest')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-page px-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-100/30 rounded-full blur-[120px]"></div>
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-secondary-100/30 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 z-10 animate-fade-in-up">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg mb-6">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">
                        DairyGuard
                    </h1>
                    <p className="text-neutral-500">Secure Industrial Access</p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2 animate-shake">
                        <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                        {error}
                    </div>
                )}
                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm flex items-center gap-2 animate-fade-in">
                        <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                        {message}
                    </div>
                )}

                {/* Auth Form */}
                <form onSubmit={handleAuth} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                                placeholder="admin@dairyguard.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2 font-medium">
                                {isSignUp ? 'Create Account' : 'Sign In to Platform'} <ArrowRight className="w-4 h-4" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-4 flex items-center justify-center">
                    <div className="h-px bg-neutral-200 w-full"></div>
                    <span className="px-3 text-xs text-neutral-400 font-medium">OR</span>
                    <div className="h-px bg-neutral-200 w-full"></div>
                </div>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3 px-4 border border-neutral-200 rounded-xl shadow-sm text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-200 transition-all transform hover:scale-[1.02] disabled:opacity-70"
                    >
                        <span className="flex items-center gap-2 font-medium">
                            <User className="w-4 h-4" /> Continue as Guest
                        </span>
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                    </button>
                </div>

                <div className="mt-8 text-center border-t border-neutral-100 pt-6">
                    <p className="text-xs text-neutral-400">
                        Protected by DairyGuard Identity Service v2.0
                    </p>
                </div>
            </div>
        </div>
    )
}
