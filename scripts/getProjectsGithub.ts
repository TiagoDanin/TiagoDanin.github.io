import fetch from 'node-fetch'
import fs from 'fs'

const baseUrl = (page: number): string => `https://api.github.com/users/TiagoDanin/repos?page=${page}&per_page=100`
const pages: number[] = [0,1,2]

let allProjects: any[] = []

const main = async (): Promise<void> => {
	console.log('Get github projects')
	for (const page of pages) {
		const response = await fetch(baseUrl(page))
		const data = await response.json()
		allProjects = [...allProjects, ...data]
	}

	fs.writeFile('src/data/github.json', JSON.stringify(allProjects, null, 4), (err: NodeJS.ErrnoException | null) => {
		if(err) {
			return console.log(err);
		}
		return console.log('OK!')
	})
}

main()