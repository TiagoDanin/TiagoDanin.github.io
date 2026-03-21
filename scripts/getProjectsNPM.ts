import npmUserPackages from 'npm-user-packages-downloads';
import fs from 'fs';

console.log('Get npm packages');
(async () => {
	try {
		const data = await npmUserPackages('tiagodanin', '2010-01-01:2100-01-01');

		// Remove duplicates by package name
		const originalLength = data.length;
		const uniquePackages = Array.from(
			new Map(data.map((pkg: any) => [pkg.name, pkg])).values()
		);

		uniquePackages.sort((a: any, b: any) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

		fs.mkdirSync('contents/npm', { recursive: true })
		fs.writeFile('contents/npm/index.json', JSON.stringify(uniquePackages, null, 4), (err: NodeJS.ErrnoException | null) => {
			if (err) {
				return console.log(err);
			}
			return console.log('OK!');
		});
		if (process.argv.includes('--output-terminal')) {
			process.stdout.write(JSON.stringify(uniquePackages, null, 4));
		}
	} catch (err) {
		console.error(err);
	}
})();
