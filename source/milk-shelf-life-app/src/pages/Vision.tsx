
import React from 'react';
import { Map, Users, TrendingUp, Layers, ArrowRight, Shield } from 'lucide-react';

export default function Vision() {
    const steps = [
        {
            phase: 'Phase 1 (Current)',
            title: 'AI Prototype',
            desc: 'ML models for spoilage prediction using simulated data.',
            color: 'bg-blue-600',
        },
        {
            phase: 'Phase 2 (Q3 2026)',
            title: 'IoT Integration',
            desc: 'Deploying real hardware sensors for pH and Temperature data collection.',
            color: 'bg-indigo-600',
        },
        {
            phase: 'Phase 3 (2027)',
            title: 'Industry Pilot',
            desc: 'Large scale deployment with Centralized dashboard for FSSAI officials.',
            color: 'bg-purple-600',
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <Map className="w-16 h-16 opacity-80" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Vision 2027: From Farm to Fork</h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                        Scalability roadmap for transforming India's unorganized dairy sector into a digitally monitored, quality-assured ecosystem.
                    </p>
                </div>
            </section>

            {/* Roadmap Section */}
            <section className="max-w-5xl mx-auto px-6 -mt-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

                    <div className="flex items-center gap-2 mb-10">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Strategic Scalability Roadmap</h2>
                    </div>

                    <div className="relative border-l-4 border-gray-200 ml-4 md:ml-6 space-y-12">

                        {steps.map((step, idx) => (
                            <div key={idx} className="relative pl-8 md:pl-12">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[14px] md:-left-[18px] top-0 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white ${step.color}`}></div>

                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 group">
                                    <div className="flex-1">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2 ${step.color}`}>
                                            {step.phase}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            {step.title}
                                            {idx < steps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400 hidden md:block" />}
                                        </h3>
                                        <p className="text-gray-600 mt-2">{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            </section>

            {/* Impact Stats */}
            <section className="max-w-5xl mx-auto px-6 mt-12 grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                    <Layers className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900">40%</h3>
                    <p className="text-gray-600">Reduction in Milk Spoilage</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                    <Shield className="w-10 h-10 text-green-600 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900">100%</h3>
                    <p className="text-gray-600">Traceability Compliance</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                    <Users className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900">5M+</h3>
                    <p className="text-gray-600">Farmers Empowered</p>
                </div>
            </section>

        </div>
    );
}
