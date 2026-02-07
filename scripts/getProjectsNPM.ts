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

		fs.writeFile('src/data/npm.json', JSON.stringify(uniquePackages, null, 4), (err: NodeJS.ErrnoException | null) => {
			if (err) {
				return console.log(err);
			}
			return console.log('OK!');
		});
	} catch (err) {
		console.error(err);
	}
})();
