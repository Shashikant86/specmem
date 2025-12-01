// API client for SpecMem backend

export interface BlockSummary {
  id: string
  type: string
  text_preview: string
  source: string
  status: string
  pinned: boolean
}

export interface BlockDetail {
  id: string
  type: string
  text: string
  source: string
  status: string
  pinned: boolean
  tags: string[]
  links: string[]
}

export interface BlockListResponse {
  blocks: BlockSummary[]
  total: number
  active_count: number
  legacy_count: number
  pinned_count: number
}

export interface StatsResponse {
  total_blocks: number
  active_count: number
  legacy_count: number
  pinned_count: number
  by_type: Record<string, number>
  by_source: Record<string, number>
  memory_size_bytes: number
}

export interface SearchResult {
  block: BlockSummary
  score: number
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
}

export interface PinnedBlockResponse {
  block: BlockSummary
  reason: string
}

export interface PinnedListResponse {
  blocks: PinnedBlockResponse[]
  total: number
}

export interface ExportResponse {
  success: boolean
  output_path: string
  message: string
}

const API_BASE = '/api'

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

export const api = {
  getBlocks: (status?: string, type?: string): Promise<BlockListResponse> => {
    const params = new URLSearchParams()
    if (status && status !== 'all') params.set('status', status)
    if (type && type !== 'all') params.set('type', type)
    const query = params.toString()
    return fetchJson(`${API_BASE}/blocks${query ? `?${query}` : ''}`)
  },

  getBlock: (id: string): Promise<BlockDetail> => {
    return fetchJson(`${API_BASE}/blocks/${id}`)
  },

  getStats: (): Promise<StatsResponse> => {
    return fetchJson(`${API_BASE}/stats`)
  },

  search: (query: string, limit = 10): Promise<SearchResponse> => {
    return fetchJson(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  },

  getPinned: (): Promise<PinnedListResponse> => {
    return fetchJson(`${API_BASE}/pinned`)
  },

  exportPack: (): Promise<ExportResponse> => {
    return fetchJson(`${API_BASE}/export`, { method: 'POST' })
  },
}
