const SPREADSHEET_ID = '131WLa4tvntsneCTiFSzSrgLWPTsDIKH0dgdch4j0k2U';

function doPost(e) {
  console.log('Received POST request');
  try {
    var data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', JSON.stringify(data));
    
    if (!isValidData(data)) {
      throw new Error('Dati non validi');
    }

    var result = processData(data);
    console.log('Process result:', JSON.stringify(result));
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function isValidData(data) {
  console.log('Validating data');
  return data &&
    data.username &&
    data.date &&
    Array.isArray(data.activities) &&
    (data.activities.length > 0 || data.activities.some(a => a.activityType === 'festa'));
}

function processData(data) {
  console.log('Processing data');
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  console.log('Opened spreadsheet');
  
  let sheet = spreadsheet.getSheetByName(data.username);
  if (!sheet) {
    console.log('Creating new sheet for:', data.username);
    sheet = spreadsheet.insertSheet(data.username);
    if (!sheet) {
      console.error('Failed to create sheet');
      return { success: false, message: 'Impossibile creare il foglio per l\'utente' };
    }
    sheet.getRange(1, 1, 1, 6).setValues([['Data', 'Username', 'Attività', 'Minuti', 'Persone', 'Moltiplicatore']]);
  }

  const row = findFirstEmptyRow(sheet);
  console.log('First empty row:', row);
  
  const allValues = data.activities.map(activity => formatActivityData(data.date, data.username, activity));
  console.log('Formatted data:', JSON.stringify(allValues));

  try {
    sheet.getRange(row, 1, allValues.length, 6).setValues(allValues);
    console.log('Data written to sheet');
  } catch (error) {
    console.error('Error writing to sheet:', error);
    return { success: false, message: 'Errore durante la scrittura dei dati: ' + error.message };
  }

  return { success: true };
}

function formatActivityData(date, username, activity) {
  const minutes = parseFloat(activity.minutes);  
  const moltiplicatore = parseFloat(activity.moltiplicatore) || 1;
  const people = parseInt(activity.people);
  
  return [
    date,
    username,
    activity.activity,
    minutes,
    people,
    moltiplicatore
  ];
}

function findFirstEmptyRow(sheet) {
  const column = sheet.getRange('A:A');
  const values = column.getValues();
  for (let i = 0; i < values.length; i++) {
    if (!values[i][0]) {
      return i + 1;
    }
  }
  return values.length + 1;
}

// Funzione di test
function testProcessData() {
  const testData = {
    username: "Test User",
    date: "2023-06-01",
    activities: [
      {
        activityType: "test",
        activity: "Test Activity",
        minutes: "60",
        people: "1",
        moltiplicatore: "1"
      }
    ]
  };
  
  const result = processData(testData);
  console.log('Test result:', JSON.stringify(result));
}