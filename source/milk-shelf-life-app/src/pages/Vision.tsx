import { Map, Users, TrendingUp, Layers, CheckCircle, Circle, ArrowDown, Shield } from 'lucide-react';

export default function Vision() {
    const steps = [
        {
            phase: 'Phase 1',
            status: 'Completed',
            title: 'Prototype Development',
            desc: 'Developed core ML models for shelf-life prediction and built the initial web interface with simulated data.',
            color: 'text-green-600',
            bg: 'bg-green-100',
            border: 'border-green-600',
            icon: <CheckCircle className="w-6 h-6 text-white" />
        },
        {
            phase: 'Phase 2',
            status: 'In Progress',
            title: 'Live IoT Sensor Integration',
            desc: 'Deploying physical ESP32 sensors for real-time pH and Temperature data collection synced with Supabase.',
            color: 'text-blue-600',
            bg: 'bg-blue-100',
            border: 'border-blue-600',
            icon: <Circle className="w-6 h-6 text-white" />
        },
        {
            phase: 'Phase 3',
            status: 'Planned',
            title: 'Industrial Pilot',
            desc: 'Large-scale deployment in partner dairies with a centralized dashboard for FSSAI compliance monitoring.',
            color: 'text-indigo-600',
            bg: 'bg-indigo-100',
            border: 'border-indigo-400',
            icon: <Circle className="w-6 h-6 text-white" />
        },
        {
            phase: 'Phase 4',
            status: 'Future',
            title: 'Advanced AI Reasoning',
            desc: 'Integration of OpenAI for "Dairy Doctor" to provide autonomous corrective actions and root cause analysis.',
            color: 'text-purple-600',
            bg: 'bg-purple-100',
            border: 'border-purple-400',
            icon: <Circle className="w-6 h-6 text-white" />
        },
        {
            phase: 'Phase 5',
            status: 'Future',
            title: 'Expansion to Perishables',
            desc: 'Adapting the core DairyGuard architecture to monitor other cold-chain goods like meat and produce.',
            color: 'text-orange-600',
            bg: 'bg-orange-100',
            border: 'border-orange-400',
            icon: <Circle className="w-6 h-6 text-white" />
        }
    ];

    return (
        <div className="min-h-screen bg-background-page pb-20">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-[128px]"></div>
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-secondary-400 rounded-full blur-[96px]"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 ring-1 ring-white/20">
                        <Map className="w-10 h-10 text-secondary-300" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Strategic Roadmap</h1>
                    <p className="text-xl md:text-2xl text-primary-100 max-w-2xl mx-auto font-light leading-relaxed">
                        From prototype to an industry-standard ecosystem for perishable food safety.
                    </p>
                </div>
            </section>

            {/* Roadmap Graph */}
            <section className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-16 border border-neutral-100">

                    <div className="flex items-center gap-3 mb-16 border-b border-neutral-100 pb-8">
                        <TrendingUp className="w-8 h-8 text-primary-600" />
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900">Project Trajectory</h2>
                            <p className="text-neutral-500 text-sm">Estimated timeline 2025-2027</p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-green-500 via-primary-500 to-neutral-200 hidden md:block"></div>

                        <div className="space-y-12">
                            {steps.map((step, idx) => (
                                <div key={idx} className="relative flex flex-col md:flex-row gap-8 group">

                                    {/* Node Point */}
                                    <div className={`hidden md:flex flex-none w-16 h-16 rounded-full items-center justify-center border-4 z-10 bg-white transition-transform duration-300 group-hover:scale-110 shadow-sm ${step.phase === 'Phase 1' ? 'bg-green-500 border-green-100' : 'bg-white ' + step.border}`}>
                                        {step.phase === 'Phase 1' ? <CheckCircle className="w-8 h-8 text-white" /> : <div className={`w-4 h-4 rounded-full ${step.bg.replace('bg-', 'bg-').split('-')[1] === 'gray' ? 'bg-gray-400' : step.color.replace('text-', 'bg-')}`}></div>}
                                    </div>

                                    {/* Content Card */}
                                    <div className="flex-1">
                                        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${step.phase === 'Phase 1' ? 'bg-green-50/50 border-green-100' : 'bg-white border-neutral-100 hover:border-primary-100'}`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${step.bg} ${step.color}`}>
                                                    {step.phase}
                                                </span>
                                                <span className={`text-sm font-medium ${step.status === 'Completed' ? 'text-green-600' : 'text-neutral-400'}`}>
                                                    {step.status}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-neutral-900 mb-2">{step.title}</h3>
                                            <p className="text-neutral-600 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>

                                    {/* Mobile Line Connector */}
                                    {idx < steps.length - 1 && (
                                        <div className="md:hidden flex justify-center py-2">
                                            <ArrowDown className="w-6 h-6 text-neutral-300 animate-bounce" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Impact Stats */}
            <section className="max-w-6xl mx-auto px-6 mt-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                            <Layers className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-5xl font-bold text-neutral-900 mb-2">40%</h3>
                        <p className="text-neutral-500 font-medium uppercase tracking-wide text-sm">Less Spoilage</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-100 text-center hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
                            <Shield className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-5xl font-bold text-neutral-900 mb-2">100%</h3>
                        <p className="text-neutral-500 font-medium uppercase tracking-wide text-sm">Traceability</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-5xl font-bold text-neutral-900 mb-2">5M+</h3>
                        <p className="text-neutral-500 font-medium uppercase tracking-wide text-sm">Farmers Empowered</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
