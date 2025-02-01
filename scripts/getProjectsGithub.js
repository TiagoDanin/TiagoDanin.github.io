import fetch from 'node-fetch'
import fs from 'fs'

const baseUrl = page => `https://api.github.com/users/TiagoDanin/repos?page=${page}&per_page=100`
const pages = [0,1,2]

let allProjects = []

const main = async () => {
	console.log('Get github projects')
	for (const page of pages) {
		const response = await fetch(baseUrl(page))
		const data = await response.json()
		allProjects = [...allProjects, ...data]
	}

	fs.writeFile('src/data/github.json', JSON.stringify(allProjects), (err) => {
		if(err) {
			return console.log(err);
		}
		return console.log('OK!')
	})
}

main()