import axios from 'axios';
import * as cheerio from 'cheerio';

const OM_HEADER_MAPPING = {
'Objet magique' : 'vf_2020',
'VF': 'vf_2017',
'VO': 'vo',
'Type': 'type',
'Rareté' : 'rarity',
'Lien' : undefined, // Do not keep it (broken field on aidedd)
'Description' : 'description',
'Source': 'source'
};

const OM_FIELD_INDEX = {} // Completed at runtime to map OM Fields with the right index in each row

function buildObject(row): any { // TODO: Create a proper interface per scraped object type
	return {
		vf_2020: row[OM_FIELD_INDEX['vf_2020']],
		vf_2017: row[OM_FIELD_INDEX['vf_2017']],
		vo: row[OM_FIELD_INDEX['vo']],
		type: row[OM_FIELD_INDEX['type']],
		rarity: row[OM_FIELD_INDEX['rarity']],
		description: row[OM_FIELD_INDEX['description']],
		source: row[OM_FIELD_INDEX['source']]
	}
}

// Function to scrape a website and find a table with id or class "list"
async function scrapeAideDDTable(url: string): Promise<void> {
	try {
		// Send a GET request to the URL
		const response = await axios.get(url);

		// Load the HTML content with cheerio
		const $ = cheerio.load(response.data);

		// Find the table with id or class "list"
		const table = $('table#list, table.liste');

		if (table.length === 0) {
			console.log("Table with id or class 'list' not found.");
			return;
		}

		// Extract headers
		const headers: string[] = [];
		table.find('thead').find('th').each((_, element) => {
			headers.push($(element).text().trim());
			// Build OM_FIELD_INDEX
			if($(element).text().trim() in OM_HEADER_MAPPING && OM_HEADER_MAPPING[$(element).text().trim()]) {
				OM_FIELD_INDEX[OM_HEADER_MAPPING[$(element).text().trim()]] = headers.length-1
			}
		});

		// Extract rows
		const rows: string[][] = [];
		table.find('tbody').find('tr').each((_, row) => {
			const cells: string[] = [];
			$(row)
				.find('td, th')
				.each((_, cell) => {
					if ($(cell).children().length > 0) {
						for (let i = 0; i < $(cell).children().length; i++) {
							if ($(cell).children()[i].hasOwnProperty('attribs') && 'href' in $(cell).children()[i]['attribs']) {
								// cells.push($(cell).children()[i]['attribs']['href']);
								//console.log($(cell).children()[i]['attribs']['href']);
							}
							
						}
					}
					cells.push($(cell).text().trim());
				});

			if (cells.length > 0) {
				rows.push(cells);
			}
		});

		// Print the extracted data
		console.log('Headers:', headers);
		const magicObjects: any[] = [];
		console.log('Rows:');
		for(let i = 0; i < rows.length; i++) {
			//console.log(rows[i]);
			magicObjects.push(buildObject(rows[i]));
		}
		console.log(magicObjects)
	} catch (error) {
		console.error('An error occurred:', error);
	}
}

// Example usage
const url = 'https://www.aidedd.org/dnd-filters/objets-magiques.php';
scrapeAideDDTable(url);
