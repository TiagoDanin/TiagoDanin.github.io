import npmUserPackages from 'npm-user-packages-downloads';
import fs from 'fs';

console.log('Get npm packages');
(async () => {
	try {
		const data = await npmUserPackages('tiagodanin', '2010-01-01:2100-01-01');
		fs.writeFile('src/data/npm.json', JSON.stringify(data, null, 4), (err: NodeJS.ErrnoException | null) => {
			if (err) {
				return console.log(err);
			}
			return console.log('OK!');
		});
	} catch (err) {
		console.error(err);
	}
})();
