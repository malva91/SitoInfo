<?php
$calendarFile = 'calendar_data.js?v=CURRENT_VERSION&t=1682814000on';

if (isset($_POST['day']) && isset($_POST['content'])) {
    $day = intval($_POST['day']);
    $content = $_POST['content'];

    if (file_exists($calendarFile)) {
        $calendarData = json_decode(file_get_contents($calendarFile), true);
    } else {
        $calendarData = [];
    }

    $calendarData[$day] = $content;

    file_put_contents($calendarFile, json_encode($calendarData));

    echo "Giorno $day salvato con successo!";
} else {
    echo "Errore: dati mancanti";
}
