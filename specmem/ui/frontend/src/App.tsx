import { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { api, apiExtended, BlockSummary, BlockDetail, SessionResponse, ImpactGraphResponse, ActionResultResponse } from './api'
import { useWebSocket } from './useWebSocket'

// Modern Icons
const Icons = {
  Sun: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Pin: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Document: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Chart: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Folder: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Clock: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  X: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Coverage: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Chat: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  Bolt: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Bot: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Graph: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  Play: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Refresh: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Heart: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Info: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
}

// Strip markdown for clean text previews
const stripMarkdown = (text: string): string => {
  return text.replace(/#{1,6}\s+/g, '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/__([^_]+)__/g, '$1').replace(/_([^_]+)_/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/```[\s\S]*?```/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/^\s*[-*+]\s+/gm, '• ').replace(/^\s*\d+\.\s+/gm, '').replace(/>\s+/g, '').replace(/\n{2,}/g, ' ').trim()
}

// Type colors and icons
const typeConfig: Record<string, { color: string; bg: string; icon: string }> = {
  requirement: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800', icon: '📋' },
  design: { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800', icon: '🎨' },
  task: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800', icon: '✅' },
  decision: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800', icon: '⚡' },
  knowledge: { color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800', icon: '💡' },
}

type ViewType = 'specs' | 'search' | 'pinned' | 'analytics' | 'coverage' | 'sessions' | 'powers' | 'graph'


// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) return
    const incrementTime = duration / end
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, incrementTime)
    return () => clearInterval(timer)
  }, [value, duration])
  return <span>{count}</span>
}

// Skeleton Loader Component
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
)

// Health Score Circle Component
const HealthScoreCircle = ({ score, grade, color }: { score: number; grade: string; color: string }) => {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference
  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle cx="64" cy="64" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-200 dark:text-slate-700" />
        <circle cx="64" cy="64" r="45" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" style={{ strokeDasharray: circumference, strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{grade}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">{Math.round(score)}%</span>
      </div>
    </div>
  )
}

// Quick Action Button Component
const QuickActionButton = ({ icon, label, onClick, loading, variant = 'default' }: { icon: React.ReactNode; label: string; onClick: () => void; loading?: boolean; variant?: 'default' | 'primary' }) => (
  <button onClick={onClick} disabled={loading} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 ${variant === 'primary' ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
    {loading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
    <span>{label}</span>
  </button>
)

// Tour Step Interface
interface TourStep {
  id: string
  title: string
  description: string
  targetSelector: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const tourSteps: TourStep[] = [
  { id: 'welcome', title: 'Welcome to SpecMem!', description: 'Your living documentation hub. Let\'s take a quick tour.', targetSelector: '.logo', position: 'bottom' },
  { id: 'health', title: 'Health Score', description: 'See your project\'s specification health at a glance.', targetSelector: '.health-score', position: 'right' },
  { id: 'actions', title: 'Quick Actions', description: 'Run common tasks like scan, build, and validate with one click.', targetSelector: '.quick-actions', position: 'bottom' },
  { id: 'graph', title: 'Impact Graph', description: 'Visualize relationships between specs, code, and tests.', targetSelector: '[data-view="graph"]', position: 'right' },
  { id: 'search', title: 'Semantic Search', description: 'Find any specification using natural language.', targetSelector: '.search-bar', position: 'bottom' },
]

// Tour Overlay Component
const TourOverlay = ({ step, onNext, onSkip, currentStep, totalSteps }: { step: TourStep; onNext: () => void; onSkip: () => void; currentStep: number; totalSteps: number }) => (
  <div className="fixed inset-0 z-[100] pointer-events-none">
    <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={onSkip} />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl max-w-md pointer-events-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🎯</span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
      </div>
      <p className="text-slate-600 dark:text-slate-300 mb-4">{step.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{currentStep + 1} of {totalSteps}</span>
        <div className="flex gap-2">
          <button onClick={onSkip} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Skip</button>
          <button onClick={onNext} className="px-4 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600">{currentStep === totalSteps - 1 ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    </div>
  </div>
)


// Simple Force Graph Component (no D3 dependency)
const ForceGraph = ({ data, onNodeClick }: { data: ImpactGraphResponse | undefined; onNodeClick?: (node: any) => void }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<any[]>([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    if (!data?.nodes.length) return
    // Simple layout: arrange nodes in a circle with some randomness
    const centerX = 400, centerY = 300
    const radius = 200
    const positioned = data.nodes.map((node, i) => {
      const angle = (i / data.nodes.length) * 2 * Math.PI
      const jitter = Math.random() * 50 - 25
      return { ...node, x: centerX + Math.cos(angle) * (radius + jitter), y: centerY + Math.sin(angle) * (radius + jitter) }
    })
    setNodes(positioned)
  }, [data])

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'spec': return '#8b5cf6'
      case 'code': return '#10b981'
      case 'test': return '#f59e0b'
      default: return '#64748b'
    }
  }

  const filteredNodes = filter ? nodes.filter(n => n.type === filter) : nodes
  const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
  const filteredEdges = data?.edges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)) || []

  if (!data?.nodes.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <Icons.Graph />
        <p className="mt-4">No graph data available</p>
        <p className="text-sm mt-2">Run a scan to build the impact graph</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {['spec', 'code', 'test'].map(type => (
          <button key={type} onClick={() => setFilter(filter === type ? null : type)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === type ? 'bg-violet-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>
            <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ backgroundColor: getNodeColor(type) }} />
            {type}
          </button>
        ))}
      </div>
      <svg ref={svgRef} viewBox="0 0 800 600" className="w-full h-[500px] bg-slate-50 dark:bg-slate-900/50 rounded-xl">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>
        {/* Edges */}
        {filteredEdges.map((edge, i) => {
          const source = nodes.find(n => n.id === edge.source)
          const target = nodes.find(n => n.id === edge.target)
          if (!source || !target) return null
          return (
            <line key={i} x1={source.x} y1={source.y} x2={target.x} y2={target.y}
              stroke={hoveredNode === source.id || hoveredNode === target.id ? '#8b5cf6' : '#cbd5e1'}
              strokeWidth={hoveredNode === source.id || hoveredNode === target.id ? 2 : 1}
              markerEnd="url(#arrowhead)" className="transition-all" />
          )
        })}
        {/* Nodes */}
        {filteredNodes.map(node => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}
            onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}
            onClick={() => onNodeClick?.(node)} className="cursor-pointer">
            <circle r={hoveredNode === node.id ? 14 : 10} fill={getNodeColor(node.type)}
              className="transition-all" style={{ filter: hoveredNode === node.id ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' : 'none' }} />
            {hoveredNode === node.id && (
              <text y={-20} textAnchor="middle" className="text-xs fill-slate-700 dark:fill-slate-300 font-medium">{node.label}</text>
            )}
          </g>
        ))}
      </svg>
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-500">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-violet-500" /> Specs ({data.stats.nodes_by_type?.spec || 0})</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Code ({data.stats.nodes_by_type?.code || 0})</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500" /> Tests ({data.stats.nodes_by_type?.test || 0})</span>
      </div>
    </div>
  )
}


// Action Result Modal
const ActionResultModal = ({ result, onClose }: { result: ActionResultResponse | null; onClose: () => void }) => {
  if (!result) return null
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className={`px-6 py-4 ${result.success ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}>
          <div className="flex items-center gap-3 text-white">
            {result.success ? <Icons.Check /> : <Icons.X />}
            <span className="font-semibold capitalize">{result.action}</span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">{result.message}</p>
          {result.data && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 text-sm font-mono">
              <pre className="text-slate-600 dark:text-slate-400 overflow-auto">{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
          {result.error && <p className="text-red-500 text-sm mt-2">{result.error}</p>}
        </div>
        <div className="px-6 pb-6">
          <button onClick={onClose} className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}

// Onboarding Wizard Component
const OnboardingWizard = ({ onDismiss, onAction }: { onDismiss: () => void; onAction: (action: string) => void }) => (
  <div className="rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-8 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
    <div className="relative">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">🚀</span>
        <div>
          <h2 className="text-2xl font-bold">Welcome to SpecMem!</h2>
          <p className="text-white/80">Let's get your specifications indexed</p>
        </div>
      </div>
      <p className="text-white/90 mb-6">SpecMem helps you maintain living documentation by indexing your specs and making them searchable for AI agents.</p>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => onAction('scan')} className="flex items-center gap-2 px-5 py-2.5 bg-white text-violet-600 rounded-xl font-semibold hover:bg-white/90 transition-colors">
          <Icons.Search /> Scan Workspace
        </button>
        <button onClick={() => onAction('tour')} className="flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors">
          <Icons.Play /> Take a Tour
        </button>
        <button onClick={onDismiss} className="px-5 py-2.5 text-white/70 hover:text-white transition-colors">Skip</button>
      </div>
    </div>
  </div>
)

function App() {
  const queryClient = useQueryClient()
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [sidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState<ViewType>('specs')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [selectedBlock, setSelectedBlock] = useState<BlockDetail | null>(null)
  const [selectedSession, setSelectedSession] = useState<SessionResponse | null>(null)
  const [autoRefresh] = useState(() => localStorage.getItem('autoRefresh') !== 'false')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [actionResult, setActionResult] = useState<ActionResultResponse | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [tourActive, setTourActive] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [highlightedItems, setHighlightedItems] = useState<Set<string>>(new Set())

  const handleWebSocketRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['blocks'] })
    queryClient.invalidateQueries({ queryKey: ['stats'] })
    queryClient.invalidateQueries({ queryKey: ['health'] })
    showToast('Specs updated', 'success')
    // Add highlight animation
    setHighlightedItems(new Set(['refresh']))
    setTimeout(() => setHighlightedItems(new Set()), 2000)
  }, [queryClient])

  const { isConnected } = useWebSocket({ enabled: autoRefresh, onRefresh: handleWebSocketRefresh })

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); localStorage.setItem('darkMode', String(darkMode)) }, [darkMode])
  useEffect(() => { localStorage.setItem('autoRefresh', String(autoRefresh)) }, [autoRefresh])

  const showToast = (message: string, type: 'success' | 'error') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000) }

  // Existing queries
  const { data: blocksData, isLoading } = useQuery({ queryKey: ['blocks'], queryFn: () => api.getBlocks() })

  // Detect dogfooding mode (viewing SpecMem's own specs) - must be after blocksData is defined
  const isDogfooding = blocksData?.blocks.some(b => b.source.includes('specmem') || b.source.includes('.kiro/specs')) ?? false
  const { data: statsData } = useQuery({ queryKey: ['stats'], queryFn: api.getStats })
  const { data: searchData, isLoading: searchLoading } = useQuery({ queryKey: ['search', activeSearch], queryFn: () => api.search(activeSearch, 20), enabled: activeSearch.length > 0 })
  const { data: pinnedData } = useQuery({ queryKey: ['pinned'], queryFn: api.getPinned })

  // New queries
  const { data: coverageData, isLoading: coverageLoading } = useQuery({ queryKey: ['coverage'], queryFn: api.getCoverage })
  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({ queryKey: ['sessions'], queryFn: () => api.getSessions(20, false) })
  const { data: powersData, isLoading: powersLoading } = useQuery({ queryKey: ['powers'], queryFn: api.getPowers })
  const { data: healthData, isLoading: healthLoading } = useQuery({ queryKey: ['health'], queryFn: apiExtended.getHealthScore })
  const { data: graphData, isLoading: graphLoading } = useQuery({ queryKey: ['graph'], queryFn: () => apiExtended.getImpactGraph() })

  const exportMutation = useMutation({ mutationFn: api.exportPack, onSuccess: (d) => showToast(d.message, d.success ? 'success' : 'error'), onError: () => showToast('Export failed', 'error') })

  // Quick action mutations
  const scanMutation = useMutation({ mutationFn: apiExtended.scanAction, onSuccess: (d) => { setActionResult(d); queryClient.invalidateQueries() } })
  const buildMutation = useMutation({ mutationFn: apiExtended.buildAction, onSuccess: (d) => { setActionResult(d); queryClient.invalidateQueries() } })
  const validateMutation = useMutation({ mutationFn: apiExtended.validateAction, onSuccess: (d) => setActionResult(d) })
  const coverageMutation = useMutation({ mutationFn: apiExtended.coverageAction, onSuccess: (d) => setActionResult(d) })

  // Show onboarding if no specs
  useEffect(() => {
    if (blocksData && blocksData.total === 0 && !localStorage.getItem('onboardingDismissed')) {
      setShowOnboarding(true)
    }
  }, [blocksData])

  const handleBlockClick = async (block: BlockSummary) => { const detail = await api.getBlock(block.id); setSelectedBlock(detail) }
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setActiveSearch(searchQuery); setActiveView('search') }
  const handleSessionClick = async (session: SessionResponse) => { const detail = await api.getSession(session.session_id); setSelectedSession(detail) }
  const handleOnboardingAction = (action: string) => {
    if (action === 'scan') { scanMutation.mutate(); setShowOnboarding(false) }
    else if (action === 'tour') { setTourActive(true); setTourStep(0); setShowOnboarding(false) }
  }
  const handleTourNext = () => { if (tourStep < tourSteps.length - 1) setTourStep(tourStep + 1); else setTourActive(false) }

  const filteredBlocks = blocksData?.blocks.filter(b => {
    if (selectedType && b.type !== selectedType) return false
    if (selectedSource && !b.source.includes(selectedSource)) return false
    return true
  }) || []

  const getTypeStyle = (type: string) => typeConfig[type] || typeConfig.knowledge
  const getCoverageColor = (pct: number) => pct >= 80 ? 'text-emerald-500' : pct >= 50 ? 'text-amber-500' : 'text-red-500'
  const getCoverageBg = (pct: number) => pct >= 80 ? 'from-emerald-500 to-green-500' : pct >= 50 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500'


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-slide-in ${toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {toast.message}
        </div>
      )}

      {/* Tour Overlay */}
      {tourActive && <TourOverlay step={tourSteps[tourStep]} onNext={handleTourNext} onSkip={() => setTourActive(false)} currentStep={tourStep} totalSteps={tourSteps.length} />}

      {/* Action Result Modal */}
      <ActionResultModal result={actionResult} onClose={() => setActionResult(null)} />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4 logo">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-500 flex items-center justify-center shadow-lg shadow-violet-500/30 glow-purple">
                <span className="text-white font-bold text-xl brand-logo">S</span>
              </div>
              <div>
                <h1 className="text-2xl brand-logo gradient-text-static tracking-tight">SpecMem</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Living Documentation</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8 search-bar">
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search specifications..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all" />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></div>
            </div>
          </form>

          <div className="flex items-center gap-3">
            {isDogfooding && (
              <span className="flex items-center gap-1.5 text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/25">
                🐕 Eating our own dogfood
              </span>
            )}
            {isConnected && <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>Live</span>}
            <button onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all disabled:opacity-50">
              <Icons.Download />{exportMutation.isPending ? 'Exporting...' : 'Export Pack'}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {darkMode ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 border-r border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm min-h-[calc(100vh-73px)] transition-all duration-300`}>
          <nav className="p-4 space-y-2">
            {[
              { id: 'specs', label: 'Specifications', icon: <Icons.Document />, count: blocksData?.total },
              { id: 'graph', label: 'Impact Graph', icon: <Icons.Graph /> },
              { id: 'search', label: 'Search', icon: <Icons.Search /> },
              { id: 'pinned', label: 'Pinned', icon: <Icons.Pin />, count: pinnedData?.total },
              { id: 'coverage', label: 'Coverage', icon: <Icons.Coverage />, badge: coverageData ? `${Math.round(coverageData.coverage_percentage)}%` : undefined },
              { id: 'sessions', label: 'Sessions', icon: <Icons.Chat />, count: sessionsData?.total },
              { id: 'powers', label: 'Powers', icon: <Icons.Bolt />, count: powersData?.total },
              { id: 'analytics', label: 'Analytics', icon: <Icons.Chart /> },
            ].map((item) => (
              <button key={item.id} data-view={item.id} onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeView === item.id ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                {item.icon}
                {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
                {sidebarOpen && item.count !== undefined && <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{item.count}</span>}
                {sidebarOpen && item.badge && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCoverageColor(coverageData?.coverage_percentage || 0)} bg-slate-100 dark:bg-slate-800`}>{item.badge}</span>}
              </button>
            ))}
          </nav>

          {sidebarOpen && statsData && (
            <div className="px-4 py-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">By Type</h3>
              <div className="space-y-1">
                {Object.entries(statsData.by_type).map(([type, count]) => (
                  <button key={type} onClick={() => { setSelectedType(selectedType === type ? null : type); setActiveView('specs') }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all ${selectedType === type ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <span>{typeConfig[type]?.icon || '📄'}</span>
                    <span className="flex-1 text-left capitalize text-slate-700 dark:text-slate-300">{type}</span>
                    <span className="text-xs text-slate-500">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Specs View */}
          {activeView === 'specs' && (
            <div>
              {/* Onboarding */}
              {showOnboarding && <div className="mb-8"><OnboardingWizard onDismiss={() => { setShowOnboarding(false); localStorage.setItem('onboardingDismissed', 'true') }} onAction={handleOnboardingAction} /></div>}

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedType ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s` : selectedSource ? selectedSource : 'All Specifications'}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{filteredBlocks.length} items</p>
                </div>
                {(selectedType || selectedSource) && (
                  <button onClick={() => { setSelectedType(null); setSelectedSource(null) }} className="text-sm text-violet-600 dark:text-violet-400 hover:underline">Clear filters</button>
                )}
              </div>

              {/* Full-Width Hero Section */}
              <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden min-h-[500px]">
                {/* Hero Background with Gradient */}
                <div className="hero-bg absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950" />

                {/* Animated Decorative Orbs */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-500/30 rounded-full blur-[100px] animate-float" />
                <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-fuchsia-500/25 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />
                <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-orange-500/20 rounded-full blur-[90px] animate-float" style={{ animationDelay: '2s' }} />

                {/* Hero Content */}
                <div className="relative px-6 py-16">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-violet-200/50 dark:border-violet-700/50 shadow-xl mb-8">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">Living Documentation Engine</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl brand-logo gradient-text-hero tracking-tight mb-6">
                      SpecMem
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                      <span className="gradient-text-static font-semibold">Unified Agent Experience</span> & Cognitive Memory for Every Coding Agent
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
                    {/* Health Score Card */}
                    <div className="col-span-2 relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-xl health-score">
                      {healthLoading ? (
                        <div className="flex items-center gap-6"><Skeleton className="w-32 h-32 rounded-full" /><div className="flex-1 space-y-3"><Skeleton className="h-6 w-24" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div></div>
                      ) : healthData ? (
                        <div className="flex items-center gap-6">
                          <HealthScoreCircle score={healthData.overall_score} grade={healthData.letter_grade} color={healthData.grade_color} />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Project Health</h3>
                            <div className="space-y-2">
                              {healthData.breakdown.slice(0, 3).map(item => (
                                <div key={item.category} className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-1000" style={{ width: `${item.score}%` }} />
                                  </div>
                                  <span className="text-xs text-slate-500 w-20">{item.category}</span>
                                </div>
                              ))}
                            </div>
                            {healthData.suggestions.length > 0 && (
                              <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 flex items-center gap-1"><Icons.Info /> {healthData.suggestions[0]}</p>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Stats Cards */}
                    {[
                      { label: 'Total Specs', value: statsData?.total_blocks || 0, gradient: 'from-violet-500 via-fuchsia-500 to-pink-500', icon: '📊' },
                      { label: 'Active', value: statsData?.active_count || 0, gradient: 'from-emerald-500 via-teal-500 to-cyan-500', icon: '✅' },
                      { label: 'Features', value: healthData?.feature_count || 0, gradient: 'from-orange-500 via-amber-500 to-yellow-500', icon: '🎯' },
                    ].map((stat) => (
                      <div key={stat.label} className={`relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ${highlightedItems.has('refresh') ? 'ring-2 ring-violet-500 animate-pulse' : ''}`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-20 rounded-full -translate-y-12 translate-x-12 blur-xl`}></div>
                        <span className="text-3xl animate-float" style={{ animationDuration: '2s' }}>{stat.icon}</span>
                        <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2"><AnimatedCounter value={stat.value} /></p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8 quick-actions">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <QuickActionButton icon={<Icons.Search />} label="Scan" onClick={() => scanMutation.mutate()} loading={scanMutation.isPending} />
                  <QuickActionButton icon={<Icons.Download />} label="Build" onClick={() => buildMutation.mutate()} loading={buildMutation.isPending} />
                  <QuickActionButton icon={<Icons.Check />} label="Validate" onClick={() => validateMutation.mutate()} loading={validateMutation.isPending} />
                  <QuickActionButton icon={<Icons.Coverage />} label="Coverage" onClick={() => coverageMutation.mutate()} loading={coverageMutation.isPending} />
                  <QuickActionButton icon={<Icons.Play />} label="Start Tour" onClick={() => { setTourActive(true); setTourStep(0) }} variant="primary" />
                </div>
              </div>

              {/* Specs List */}
              {isLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
              ) : filteredBlocks.length === 0 ? (
                <div className="text-center py-20"><p className="text-slate-500 dark:text-slate-400">No specifications found</p></div>
              ) : (
                <div className="grid gap-4">
                  {filteredBlocks.map((block) => {
                    const style = getTypeStyle(block.type)
                    return (
                      <div key={block.id} onClick={() => handleBlockClick(block)}
                        className={`group relative overflow-hidden rounded-xl border ${style.bg} p-5 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center text-xl flex-shrink-0`}>{typeConfig[block.type]?.icon || '📄'}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-semibold uppercase tracking-wider ${style.color}`}>{block.type}</span>
                              {block.pinned && <span className="text-amber-500"><Icons.Pin /></span>}
                            </div>
                            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{stripMarkdown(block.text_preview)}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1"><Icons.Folder />{block.source.split('/').slice(-2).join('/')}</span>
                            </div>
                          </div>
                          <Icons.ChevronRight />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Graph View */}
          {activeView === 'graph' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">🔗 Impact Graph</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Visualize relationships between specs, code, and tests</p>
              {graphLoading ? (
                <Skeleton className="h-[500px] w-full rounded-xl" />
              ) : (
                <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-6">
                  <ForceGraph data={graphData} onNodeClick={(node) => showToast(`Selected: ${node.label}`, 'success')} />
                </div>
              )}
            </div>
          )}

          {/* Search View */}
          {activeView === 'search' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Search Results</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{activeSearch ? `Results for "${activeSearch}"` : 'Enter a query to search'}</p>
              {searchLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
              ) : !activeSearch ? (
                <div className="text-center py-20 text-slate-500"><p>Use the search bar above</p></div>
              ) : searchData?.results.length === 0 ? (
                <div className="text-center py-20 text-slate-500"><p>No results found</p></div>
              ) : (
                <div className="space-y-4">
                  {searchData?.results.map((result, idx) => {
                    const style = getTypeStyle(result.block.type)
                    return (
                      <div key={result.block.id} onClick={() => handleBlockClick(result.block)} className={`rounded-xl border ${style.bg} p-5 cursor-pointer hover:shadow-lg transition-all`}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm">#{idx + 1}</span>
                          <span className={`text-xs font-semibold uppercase ${style.color}`}>{result.block.type}</span>
                          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{(result.score * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200">{stripMarkdown(result.block.text_preview)}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Pinned View */}
          {activeView === 'pinned' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">📌 Pinned Specifications</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Critical specs always included in agent context</p>
              {pinnedData?.blocks.length === 0 ? (
                <div className="text-center py-20 text-slate-500"><p>No pinned specifications</p></div>
              ) : (
                <div className="space-y-4">
                  {pinnedData?.blocks.map((item) => {
                    const style = getTypeStyle(item.block.type)
                    return (
                      <div key={item.block.id} onClick={() => handleBlockClick(item.block)} className={`rounded-xl border ${style.bg} p-5 cursor-pointer hover:shadow-lg transition-all`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-amber-500"><Icons.Pin /></span>
                          <span className={`text-xs font-semibold uppercase ${style.color}`}>{item.block.type}</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 mb-2">{stripMarkdown(item.block.text_preview)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">{item.reason}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}


          {/* Coverage View */}
          {activeView === 'coverage' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">📊 Spec Coverage</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Acceptance criteria coverage analysis</p>
              {coverageLoading ? (
                <div className="space-y-4"><Skeleton className="h-32 w-full rounded-xl" /><Skeleton className="h-48 w-full rounded-xl" /></div>
              ) : !coverageData || coverageData.total_criteria === 0 ? (
                <div className="text-center py-20"><Icons.Coverage /><p className="text-slate-500 dark:text-slate-400 mt-4">No acceptance criteria found</p></div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getCoverageBg(coverageData.coverage_percentage)} p-6 text-white`}>
                      <p className="text-5xl font-bold">{Math.round(coverageData.coverage_percentage)}%</p>
                      <p className="text-white/80 mt-1">Overall Coverage</p>
                      <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full" style={{ width: `${coverageData.coverage_percentage}%` }}></div></div>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-6">
                      <p className="text-4xl font-bold text-emerald-500">{coverageData.covered_criteria}</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">Covered Criteria</p>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-6">
                      <p className="text-4xl font-bold text-red-500">{coverageData.total_criteria - coverageData.covered_criteria}</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">Uncovered Criteria</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {coverageData.features.map((feature) => (
                      <div key={feature.feature_name} className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-slate-900 dark:text-white">{feature.feature_name}</span>
                          <span className={`text-sm font-bold ${getCoverageColor(feature.coverage_percentage)}`}>{Math.round(feature.coverage_percentage)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                          <div className={`h-full bg-gradient-to-r ${getCoverageBg(feature.coverage_percentage)} rounded-full`} style={{ width: `${feature.coverage_percentage}%` }}></div>
                        </div>
                        <div className="space-y-2">
                          {feature.criteria.map((c) => (
                            <div key={c.id} className={`flex items-start gap-3 p-3 rounded-lg ${c.is_covered ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                              <span className={c.is_covered ? 'text-emerald-500' : 'text-red-500'}>{c.is_covered ? <Icons.Check /> : <Icons.X />}</span>
                              <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">{c.text.slice(0, 150)}{c.text.length > 150 ? '...' : ''}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Sessions View */}
          {activeView === 'sessions' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">💬 Kiro Sessions</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Browse and search your Kiro conversation history</p>
              {sessionsLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
              ) : !sessionsData || sessionsData.sessions.length === 0 ? (
                <div className="text-center py-20"><Icons.Chat /><p className="text-slate-500 dark:text-slate-400 mt-4">No sessions found</p></div>
              ) : (
                <div className="space-y-4">
                  {sessionsData.sessions.map((session) => (
                    <div key={session.session_id} onClick={() => handleSessionClick(session)}
                      className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-5 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white"><Icons.Chat /></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 dark:text-white truncate">{session.title || 'Untitled Session'}</h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1"><Icons.Clock />{new Date(session.date_created_ms).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Icons.Chat />{session.message_count} messages</span>
                          </div>
                        </div>
                        <Icons.ChevronRight />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Powers View */}
          {activeView === 'powers' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">⚡ Kiro Powers</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Installed Kiro Powers and their capabilities</p>
              {powersLoading ? (
                <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>
              ) : !powersData || powersData.powers.length === 0 ? (
                <div className="text-center py-20"><Icons.Bolt /><p className="text-slate-500 dark:text-slate-400 mt-4">No Powers installed</p></div>
              ) : (
                <div className="grid gap-6">
                  {powersData.powers.map((power) => (
                    <div key={power.name} className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
                        <div className="flex items-center gap-3 text-white">
                          <Icons.Bolt />
                          <div><h3 className="text-lg font-semibold">{power.name}</h3>{power.version && <p className="text-sm text-white/70">v{power.version}</p>}</div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{power.description || 'No description'}</p>
                        {power.tools.length > 0 && (
                          <div className="space-y-2">
                            {power.tools.map((tool) => (
                              <div key={tool.name} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                <Icons.Check />
                                <div><p className="font-mono text-sm text-slate-900 dark:text-white">{tool.name}</p><p className="text-xs text-slate-500">{tool.description}</p></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {/* Analytics View */}
          {activeView === 'analytics' && statsData && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">📊 Analytics</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Insights into your specification memory</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Specification Types</h3>
                  <div className="space-y-3">
                    {Object.entries(statsData.by_type).map(([type, count]) => {
                      const percentage = Math.round((count / statsData.total_blocks) * 100)
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><span>{typeConfig[type]?.icon}</span><span className="capitalize">{type}</span></span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">{count} ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Source Files</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(statsData.by_source).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
                      <div key={source} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                        <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{source.split('/').slice(-2).join('/')}</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Memory Overview</h3>
                  <div className="grid grid-cols-4 gap-6">
                    <div><p className="text-4xl font-bold">{statsData.total_blocks}</p><p className="text-violet-200">Total Specs</p></div>
                    <div><p className="text-4xl font-bold">{(statsData.memory_size_bytes / 1024).toFixed(1)}</p><p className="text-violet-200">KB Memory</p></div>
                    <div><p className="text-4xl font-bold">{Object.keys(statsData.by_source).length}</p><p className="text-violet-200">Source Files</p></div>
                    <div><p className="text-4xl font-bold">{Object.keys(statsData.by_type).length}</p><p className="text-violet-200">Spec Types</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Block Detail Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setSelectedBlock(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className={`${getTypeStyle(selectedBlock.type).bg} px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{typeConfig[selectedBlock.type]?.icon || '📄'}</span>
                  <div>
                    <span className={`text-sm font-semibold uppercase ${getTypeStyle(selectedBlock.type).color}`}>{selectedBlock.type}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedBlock.pinned && <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">📌 Pinned</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${selectedBlock.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>{selectedBlock.status}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedBlock(null)} className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"><Icons.X /></button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-slate dark:prose-invert max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedBlock.text}</ReactMarkdown></div>
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
                <div><h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Source</h4><p className="text-sm text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-700/50 px-3 py-2 rounded-lg">{selectedBlock.source}</p></div>
                {selectedBlock.tags.length > 0 && (<div><h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Tags</h4><div className="flex flex-wrap gap-2">{selectedBlock.tags.map((tag, i) => <span key={i} className="text-xs bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full">{tag}</span>)}</div></div>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setSelectedSession(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white"><Icons.Chat /><div><h3 className="font-semibold">{selectedSession.title || 'Untitled Session'}</h3><p className="text-sm text-white/70">{new Date(selectedSession.date_created_ms).toLocaleString()}</p></div></div>
                <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"><Icons.X /></button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {selectedSession.messages?.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role !== 'user' && <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0"><Icons.Bot /></div>}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-violet-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}><p className="text-sm whitespace-pre-wrap">{msg.content}</p></div>
                    {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0 text-white"><Icons.User /></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slide-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  )
}

export default App
