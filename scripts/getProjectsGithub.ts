import fetch from 'node-fetch'
import fs from 'fs'

const baseUrl = (page: number): string => `https://api.github.com/users/TiagoDanin/repos?page=${page}&per_page=100`
const pages: number[] = [0,1,2]

let allProjects: any[] = []

const main = async (): Promise<void> => {
	console.log('Get github projects')
	for (const page of pages) {
		const response = await fetch(baseUrl(page))
		const data = await response.json() as any
		if (!Array.isArray(data)) {
			console.error(`GitHub API error on page ${page} (status ${response.status}):`, data)
			throw new Error(`Failed to fetch page ${page}`)
		}
		allProjects = [...allProjects, ...data]
	}

	const uniqueProjects = Array.from(
		new Map(allProjects.map(project => [project.id, project])).values()
	)

	uniqueProjects.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

	allProjects = uniqueProjects

	fs.mkdirSync('contents/github', { recursive: true })
	fs.writeFile('contents/github/index.json', JSON.stringify(allProjects, null, 4), (err: NodeJS.ErrnoException | null) => {
		if(err) {
			return console.log(err);
		}
		return console.log('OK!')
	})
	if (process.argv.includes('--output-terminal')) {
		process.stdout.write(JSON.stringify(allProjects, null, 4))
	}
}

main()