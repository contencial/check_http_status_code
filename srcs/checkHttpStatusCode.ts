function checkHttpStatusCode() {
	const START = new Date();

	const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
	const MAIN_SHEET = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Main');
	const SIZE_CELL = MAIN_SHEET.getRange('B1');
	const LIST_SIZE: int = SIZE_CELL.getValue();
	const DOMAIN_COL: int = 6;
	console.log('Start checkHttpStatusCode');
	try {
		if (SIZE_CELL.isBlank() || typeof LIST_SIZE != 'number' || LIST_SIZE < 0)
			throw new Error('List Size Error: 取得数に誤りがあります。');
		const DOMAIN_INFO = MAIN_SHEET.getRange(3, DOMAIN_COL, LIST_SIZE, 5).getValues();
		let i: number;
		DOMAIN_INFO.forEach(function(data, index) {
			i = index;
			if (data[4]) {
				return ;
			}

			const NOW = new Date();
			const TIMESTAMP = `${NOW.getFullYear()}/${NOW.getMonth()+1}/${NOW.getDate()} ${NOW.getHours()}:${NOW.getMinutes()}:${NOW.getSeconds()}`;
			let diff = NOW.getTime() - START.getTime();
			if (diff / 1000 > 240)
				throw new Error('checkHttpStatusCode: Timeout 5 min') ;

			if (data[1] == false || data[2] == false || data[3] == false) {
				MAIN_SHEET.getRange(3 + index, DOMAIN_COL + 4).setValue('-');
				MAIN_SHEET.getRange(3 + index, DOMAIN_COL + 5).setValue(TIMESTAMP);
				return ;
			}
			const URL = `https://${data[0]}`;
			let options = {
				muteHttpExceptions: true
			};
			let value: string;
			try {
				let response = UrlFetchApp.fetch(URL, options);
				value = response.getResponseCode();
			} catch (e) {
				err = e.message.split(':');
				value = err[0];
			}
			MAIN_SHEET.getRange(3 + index, DOMAIN_COL + 4).setValue(value);
			MAIN_SHEET.getRange(3 + index, DOMAIN_COL + 5).setValue(TIMESTAMP);
		});
	} catch (e) {
		console.log(`FINISH: index: ${i}: ${e.message}`);
	} finally {
		console.log(`FINISH: index: ${i}`);
	}
}
