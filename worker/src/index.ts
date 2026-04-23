interface Env {
	NOTION_TOKEN: string
	DATABASE_ID: string
	TURNSTILE_SECRET: string
	ALLOWED_ORIGIN: string
}

interface Ratings {
	slides: number
	fala: number
	conteudo: number
	aplicabilidade: number
}

interface FeedbackPayload {
	talk: string
	ratings: Ratings
	liked?: string
	improve?: string
	suggestions?: string
	email?: string
	turnstileToken: string
}

const NOTION_VERSION = '2022-06-28'
const MAX_TEXT = 2000
const MAX_TALK = 200
const MAX_EMAIL = 200

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const origin = request.headers.get('Origin') ?? ''
		const cors = corsHeaders(origin, env.ALLOWED_ORIGIN)

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: cors })
		}

		if (request.method !== 'POST') {
			return jsonResponse({ error: 'Method not allowed' }, 405, cors)
		}

		let payload: FeedbackPayload
		try {
			payload = (await request.json()) as FeedbackPayload
		} catch {
			return jsonResponse({ error: 'Invalid JSON' }, 400, cors)
		}

		const validation = validate(payload)
		if (validation) {
			return jsonResponse({ error: validation }, 400, cors)
		}

		const ip = request.headers.get('CF-Connecting-IP') ?? ''
		const captchaOk = await verifyTurnstile(payload.turnstileToken, env.TURNSTILE_SECRET, ip)
		if (!captchaOk) {
			return jsonResponse({ error: 'Captcha failed' }, 403, cors)
		}

		const ok = await createNotionPage(payload, env)
		if (!ok) {
			return jsonResponse({ error: 'Failed to save feedback' }, 502, cors)
		}

		return jsonResponse({ ok: true }, 200, cors)
	},
}

function validate(p: FeedbackPayload): string | null {
	if (!p.talk || typeof p.talk !== 'string' || p.talk.length > MAX_TALK) {
		return 'Invalid talk'
	}
	if (!p.turnstileToken || typeof p.turnstileToken !== 'string') {
		return 'Missing captcha token'
	}
	const r = p.ratings
	if (!r) return 'Missing ratings'
	const fields: (keyof Ratings)[] = ['slides', 'fala', 'conteudo', 'aplicabilidade']
	for (const f of fields) {
		const v = r[f]
		if (!Number.isInteger(v) || v < 1 || v > 5) {
			return `Invalid rating: ${f}`
		}
	}
	if (p.email && p.email.length > MAX_EMAIL) return 'Email too long'
	if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return 'Invalid email'
	return null
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
	try {
		const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ secret, response: token, remoteip: ip }),
		})
		const data = (await resp.json()) as { success: boolean }
		return data.success === true
	} catch {
		return false
	}
}

async function createNotionPage(p: FeedbackPayload, env: Env): Promise<boolean> {
	const liked = (p.liked ?? '').slice(0, MAX_TEXT)
	const improve = (p.improve ?? '').slice(0, MAX_TEXT)
	const suggestions = (p.suggestions ?? '').slice(0, MAX_TEXT)
	const email = (p.email ?? '').slice(0, MAX_EMAIL)

	const geral = Math.round(
		((p.ratings.slides + p.ratings.fala + p.ratings.conteudo + p.ratings.aplicabilidade) / 4) * 100
	) / 100

	const properties: Record<string, unknown> = {
		Name: title(`${p.talk} - ${new Date().toISOString()}`),
		Talk: richText(p.talk),
		Geral: { number: geral },
		Slides: { number: p.ratings.slides },
		Fala: { number: p.ratings.fala },
		'Conteúdo': { number: p.ratings.conteudo },
		Aplicabilidade: { number: p.ratings.aplicabilidade },
		'O que gostou': richText(liked),
		'O que melhorar': richText(improve),
		'Sugestão de talks': richText(suggestions),
		Email: { email: email || null },
	}

	const resp = await fetch('https://api.notion.com/v1/pages', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.NOTION_TOKEN}`,
			'Notion-Version': NOTION_VERSION,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			parent: { database_id: env.DATABASE_ID },
			properties,
		}),
	})

	if (!resp.ok) {
		console.error('Notion API error', resp.status, await resp.text())
		return false
	}
	return true
}

function title(content: string) {
	return { title: [{ text: { content } }] }
}

function richText(content: string) {
	return content ? { rich_text: [{ text: { content } }] } : { rich_text: [] }
}

function corsHeaders(requestOrigin: string, allowedOriginsCsv: string): Record<string, string> {
	const allowed = allowedOriginsCsv.split(',').map((s) => s.trim()).filter(Boolean)
	const isAllowed =
		allowed.includes(requestOrigin) ||
		/^http:\/\/localhost(:\d+)?$/.test(requestOrigin) ||
		/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(requestOrigin)
	return {
		'Access-Control-Allow-Origin': isAllowed ? requestOrigin : allowed[0] ?? '',
		'Vary': 'Origin',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400',
	}
}

function jsonResponse(data: unknown, status: number, extra: Record<string, string>): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json', ...extra },
	})
}
