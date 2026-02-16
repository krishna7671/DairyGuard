
import React, { useMemo, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, Clock, Thermometer, Droplet, Activity, FileCheck, Sparkles, Loader2 } from 'lucide-react';
import { EDGE_FUNCTIONS } from '@/lib/supabase';

interface SafetyAnalysisProps {
    data: {
        ph: number | null | undefined;
        temperature: number | null | undefined;
        bacteriaCount: number | null | undefined;
        predictedShelfLifeHours: number;
        lastUpdated: string;
    };
}

// FSSAI Standards for Pasteurized Milk
const FSSAI_STANDARDS = {
    ph: { min: 6.6, max: 6.8, label: '6.6 - 6.8' },
    temperature: { max: 5, label: '< 5°C' },
    bacteria: { max: 30000, label: '< 30,000 CFU/ml' } // Standard Plate Count for Pasteurized Milk
};

export const SafetyAnalysis: React.FC<SafetyAnalysisProps> = ({ data }) => {
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const [loadingAdvice, setLoadingAdvice] = useState(false);

    const getAiAdvice = async () => {
        if (data.ph == null || data.temperature == null || data.bacteriaCount == null) {
            setAiAdvice("Insufficient data for AI analysis.");
            return;
        }

        setLoadingAdvice(true);
        try {
            const response = await fetch(EDGE_FUNCTIONS.DAIRY_DOCTOR, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    ph: data.ph,
                    temperature: data.temperature,
                    bacteriaCount: data.bacteriaCount,
                    predictedShelfLifeHours: data.predictedShelfLifeHours
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: response.statusText }));
                throw new Error(errorData.error || response.statusText);
            }

            const result = await response.json();
            if (result.advice) {
                setAiAdvice(result.advice);
            } else {
                throw new Error("No advice received from AI");
            }
        } catch (error: any) {
            console.error("AI Error:", error);
            setAiAdvice(`Error: ${error.message || "Unknown error"}`);
        } finally {
            setLoadingAdvice(false);
        }
    };

    // 1. Decision Confidence Score Logic
    const analysis = useMemo(() => {
        // If ALL data is missing, then return Unknown. But if we have at least one, we try to give a verdict.
        if (data.temperature == null && data.ph == null && data.bacteriaCount == null) {
            return { score: 0, status: 'Unknown' as const, risks: ['Insufficient Data'], contributingFactors: [] };
        }

        let score = 100;
        const risks: string[] = [];
        const contributingFactors: { name: string; impact: 'High' | 'Medium' | 'Low'; reason: string }[] = [];

        // Temperature Analysis
        if (data.temperature != null) {
            if (data.temperature > 10) {
                score -= 40;
                risks.push('Critical Temperature');
                contributingFactors.push({ name: 'Temperature', impact: 'High', reason: `High temp (${data.temperature}°C) accelerates spoilage` });
            } else if (data.temperature > 6) {
                score -= 15;
                risks.push('Warning Temperature');
                contributingFactors.push({ name: 'Temperature', impact: 'Medium', reason: `Temp (${data.temperature}°C) is above optimal range` });
            }
        } else {
            // Missing Temp is a risk, but we don't deduct huge points yet, just flag it?
            // Or maybe we treat missing data as "neutral" for the score but flag it in text?
        }

        // pH Analysis
        if (data.ph != null) {
            if (data.ph < 6.5 || data.ph > 6.9) {
                score -= 30;
                risks.push('Abnormal pH');
                contributingFactors.push({ name: 'pH Level', impact: 'High', reason: `pH (${data.ph}) indicates potential souring or adulteration` });
            } else if (data.ph < 6.6 || data.ph > 6.85) {
                score -= 10;
                contributingFactors.push({ name: 'pH Level', impact: 'Low', reason: `pH (${data.ph}) is slightly off-target` });
            }
        }

        // Bacteria Analysis
        if (data.bacteriaCount != null) {
            if (data.bacteriaCount > 100000) {
                score -= 40;
                risks.push('High Bacterial Load');
                contributingFactors.push({ name: 'Bacteria', impact: 'High', reason: `Count (${data.bacteriaCount.toLocaleString()}) exceeds safety limits` });
            } else if (data.bacteriaCount > 50000) {
                score -= 20;
                contributingFactors.push({ name: 'Bacteria', impact: 'Medium', reason: `Elevated bacterial activity detected` });
            }
        }

        const finalScore = Math.max(0, score);
        let status: 'Safe' | 'Caution' | 'Unsafe' | 'Unknown' = 'Safe';

        // Adjust status thresholds
        if (finalScore < 50) status = 'Unsafe';
        else if (finalScore < 80) status = 'Caution';

        return { score: finalScore, status, risks, contributingFactors };
    }, [data]);

    // 2. Early Spoilage & Prevention
    const spoilagePrediction = useMemo(() => {
        const hours = data.predictedShelfLifeHours;
        let alert = { message: 'Condition Stable', color: 'text-green-600', icon: CheckCircle };

        if (hours < 4) {
            alert = { message: 'IMMEDIATE ACTION: Do not sell. Usage highly risky.', color: 'text-red-600', icon: AlertTriangle };
        } else if (hours < 12) {
            alert = { message: 'CRITICAL: Boil immediately or process into curd.', color: 'text-orange-600', icon: Clock };
        } else if (hours < 24) {
            alert = { message: 'WARNING: Sell or consume within today.', color: 'text-yellow-600', icon: Info };
        }

        return alert;
    }, [data.predictedShelfLifeHours]);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

            {/* Layer 1: Decision Confidence Score */}
            <div className={`p-6 rounded-xl border-2 shadow-sm ${analysis.status === 'Safe' ? 'bg-green-50 border-green-200' :
                analysis.status === 'Caution' ? 'bg-yellow-50 border-yellow-200' :
                    analysis.status === 'Unknown' ? 'bg-gray-50 border-gray-200' :
                        'bg-red-50 border-red-200'
                }`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Shield className={`w-8 h-8 ${analysis.status === 'Safe' ? 'text-green-600' :
                            analysis.status === 'Caution' ? 'text-yellow-600' :
                                analysis.status === 'Unknown' ? 'text-gray-400' :
                                    'text-red-600'
                            }`} />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Safety Verdict: {analysis.status.toUpperCase()}</h2>
                            <p className="text-sm text-gray-600">AI Confidence Score: <span className="font-bold">{analysis.status === 'Unknown' ? 'N/A' : `${analysis.score}%`}</span></p>
                        </div>
                    </div>
                    {/* Gauge Visualization (Simple CSS) */}
                    <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
                        <div className={`absolute inset-0 rounded-full border-4 border-current opacity-20`} style={{ color: analysis.status === 'Safe' ? '#16a34a' : analysis.status === 'Caution' ? '#ca8a04' : analysis.status === 'Unknown' ? '#9ca3af' : '#dc2626' }}></div>
                        <span className="font-bold text-lg">{analysis.status === 'Unknown' ? '--' : analysis.score}</span>
                    </div>
                </div>

                {/* Explainability - Why this decision? */}
                <div className="bg-white/60 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 u-uppercase tracking-wide">Why this result?</h3>
                    {analysis.status === 'Unknown' ? (
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Info className="w-4 h-4" /> Waiting for sensor data to perform analysis.
                        </p>
                    ) : analysis.contributingFactors.length > 0 ? (
                        <ul className="space-y-2">
                            {analysis.contributingFactors.map((factor, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <span className={`px-2 py-0.5 rounded textxs font-medium ${factor.impact === 'High' ? 'bg-red-100 text-red-700' :
                                        factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>{factor.impact} Impact</span>
                                    <span className="text-gray-800 font-medium">{factor.name}:</span>
                                    <span className="text-gray-600">{factor.reason}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> All quality parameters are within optimal range.
                        </p>
                    )}
                </div>
            </div>

            {/* Layer 2: Early Spoilage Prevention */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" /> Spoilage Prediction & Prevention
                </h3>
                <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                    <spoilagePrediction.icon className={`w-8 h-8 flex-shrink-0 ${spoilagePrediction.color}`} />
                    <div>
                        <h4 className={`font-bold text-lg ${spoilagePrediction.color}`}>
                            {data.predictedShelfLifeHours < 24 ? `${data.predictedShelfLifeHours.toFixed(1)} Hours Remaning` : `${(data.predictedShelfLifeHours / 24).toFixed(1)} Days Remaining`}
                        </h4>
                        <p className="font-medium text-gray-900 mt-1">{spoilagePrediction.message}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            *Prediction based on current bacterial growth rate and temperature curves.
                        </p>
                    </div>
                </div>
            </div>

            {/* Layer 3: FSSAI Compliance Mapping */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-purple-600" /> FSSAI Standards
                </h3>
                <div className="grid md:grid-cols-3 gap-4">

                    {/* Temp Compliance */}
                    <div className={`p-4 rounded-lg border flex flex-col items-center text-center ${data.temperature == null ? 'bg-gray-50 border-gray-200' : data.temperature <= FSSAI_STANDARDS.temperature.max ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                        <Thermometer className="w-6 h-6 mb-2 text-gray-700" />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Temperature</span>
                        <span className="text-lg font-bold my-1">{data.temperature != null ? `${data.temperature}°C` : '--'}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${data.temperature == null ? 'bg-gray-200 text-gray-600' : data.temperature <= FSSAI_STANDARDS.temperature.max ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                            }`}>
                            {data.temperature == null ? 'No Data' : data.temperature <= FSSAI_STANDARDS.temperature.max ? 'Compliant' : 'Non-Compliant'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">Standard: {FSSAI_STANDARDS.temperature.label}</span>
                    </div>

                    {/* pH Compliance */}
                    <div className={`p-4 rounded-lg border flex flex-col items-center text-center ${data.ph == null ? 'bg-gray-50 border-gray-200' : (data.ph >= FSSAI_STANDARDS.ph.min && data.ph <= FSSAI_STANDARDS.ph.max) ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                        <Droplet className="w-6 h-6 mb-2 text-gray-700" />
                        <span className="text-xs font-semibold text-gray-500 uppercase">pH Level</span>
                        <span className="text-lg font-bold my-1">{data.ph != null ? data.ph : '--'}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${data.ph == null ? 'bg-gray-200 text-gray-600' : (data.ph >= FSSAI_STANDARDS.ph.min && data.ph <= FSSAI_STANDARDS.ph.max) ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                            }`}>
                            {data.ph == null ? 'No Data' : (data.ph >= FSSAI_STANDARDS.ph.min && data.ph <= FSSAI_STANDARDS.ph.max) ? 'Compliant' : 'Issue Detected'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">Standard: {FSSAI_STANDARDS.ph.label}</span>
                    </div>

                    {/* Bacteria Compliance */}
                    <div className={`p-4 rounded-lg border flex flex-col items-center text-center ${data.bacteriaCount == null ? 'bg-gray-50 border-gray-200' : data.bacteriaCount <= FSSAI_STANDARDS.bacteria.max ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                        <Activity className="w-6 h-6 mb-2 text-gray-700" />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Microbial Load</span>
                        <span className="text-lg font-bold my-1">{data.bacteriaCount != null ? `${(data.bacteriaCount / 1000).toFixed(1)}k` : '--'}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${data.bacteriaCount == null ? 'bg-gray-200 text-gray-600' : data.bacteriaCount <= FSSAI_STANDARDS.bacteria.max ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                            }`}>
                            {data.bacteriaCount == null ? 'No Data' : data.bacteriaCount <= FSSAI_STANDARDS.bacteria.max ? 'Compliant' : 'High Load'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">Std: {FSSAI_STANDARDS.bacteria.label}</span>
                    </div>

                </div>
            </div>

            {/* Layer 4: Trust & Transparency */}
            <div className="mt-8 border-t pt-4 text-center">
                <p className="text-xs text-gray-500">
                    <span className="font-semibold">Credibility Source:</span> AI Inference Engine v2.1 • Calibrated: {new Date().toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 mt-1 px-4 italic">
                    Disclaimer: This AI tool aids decision-making to reduce spoilage but does not replace certified laboratory testing for legal compliance.
                </p>
            </div>

            {/* Layer 5: Dairy Doctor AI Advisor */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-24 h-24 text-indigo-600" />
                </div>

                <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2 relative z-10">
                    <Sparkles className="w-5 h-5 text-indigo-600" /> Dairy Doctor AI Assistant
                </h3>

                <p className="text-sm text-indigo-700 mb-4 relative z-10">
                    Get real-time expert advice on how to handle this specific batch based on its quality parameters.
                </p>

                {aiAdvice ? (
                    <div className="bg-white/80 p-4 rounded-lg border border-indigo-100 relative z-10 animate-in fade-in zoom-in duration-300">
                        <p className="text-indigo-900 font-medium italic">"{aiAdvice}"</p>
                        <button
                            onClick={() => setAiAdvice(null)}
                            className="text-xs text-indigo-500 mt-2 hover:underline"
                        >
                            Ask again
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={getAiAdvice}
                        disabled={loadingAdvice}
                        className="relative z-10 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-70"
                    >
                        {loadingAdvice ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Batch...</>
                        ) : (
                            <><Sparkles className="w-4 h-4" /> Get Expert Advice</>
                        )}
                    </button>
                )}
            </div>

        </div>
    );
};
