async function appendToSheet(data) {
    const API_KEY = 'AIzaSyDuGzGbD_JqnMDQg-PmbE9cvK55tSPP5X4';
    const SPREADSHEET_ID = '131WLa4tvntsneCTiFSzSrgLWPTsDIKH0dgdch4j0k2U';
    const RANGE = `${data.username}!A:O`;

    try {
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const verifyUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(verifyUrl);
        
        if (!response.ok) {
            throw new Error('Errore nella lettura del foglio');
        }

        const sheetData = await response.json();
        const dataRows = sheetData.values?.slice(1) || [];
        const numActivities = data.activities.length;
        const lastRows = dataRows.slice(-numActivities);

        const convertiData = (dataFoglio) => {
            if (!dataFoglio) return '';
            
            const mesi = {
                'gen': '01', 'feb': '02', 'mar': '03', 'apr': '04',
                'mag': '05', 'giu': '06', 'lug': '07', 'ago': '08',
                'set': '09', 'ott': '10', 'nov': '11', 'dic': '12'
            };

            const parti = dataFoglio.toLowerCase().split(' ');
            if (parti.length >= 3) {
                const giorno = parti[1].padStart(2, '0');
                const mese = mesi[parti[2]] || '01';
                const anno = new Date().getFullYear();
                return `${giorno}/${mese}/${anno}`;
            }
            return dataFoglio;
        };

        const verifiche = lastRows.map((row, index) => {
            const dataFoglioConvertita = convertiData(row[0]);
            const risultato = {
                riga: dataRows.length - numActivities + index + 1,
                dataCorrisponde: dataFoglioConvertita === data.date,
                utenteCorrisponde: row[1].trim() === data.username.trim(),
                valori: {
                    data: { 
                        foglio: row[0],
                        foglioConvertita: dataFoglioConvertita,
                        inviata: data.date 
                    },
                    utente: { 
                        foglio: row[1], 
                        inviato: data.username 
                    }
                }
            };

            console.log(`Verifica riga ${risultato.riga}:`, risultato);
            return risultato;
        });

        const tutteLeVerificheOk = verifiche.every(v => 
            v.dataCorrisponde && v.utenteCorrisponde
        );

        if (!tutteLeVerificheOk) {
            throw new Error('Dati non corrispondenti');
        }

        return { 
            success: true, 
            data: lastRows
        };

    } catch (error) {
        console.error('Debug verifica:', error);
        return {
            success: false,
            error: `Verifica non riuscita: ${error.message}`
        };
    }
}
