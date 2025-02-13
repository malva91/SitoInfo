<?php
$calendarFile = 'calendar_data.js?v=CURRENT_VERSION&t=1682814000on';

if (isset($_POST['year']) && isset($_POST['month']) && isset($_POST['day']) && isset($_POST['content'])) {
    $year = intval($_POST['year']);
    $month = intval($_POST['month']);
    $day = intval($_POST['day']);
    $content = $_POST['content'];

    if (file_exists($calendarFile)) {
        $allCalendarData = json_decode(file_get_contents($calendarFile), true);
    } else {
        $allCalendarData = [];
    }

    if (!isset($allCalendarData[$year])) {
        $allCalendarData[$year] = [];
    }
    if (!isset($allCalendarData[$year][$month])) {
        $allCalendarData[$year][$month] = [];
    }

    $allCalendarData[$year][$month][$day] = $content;

    file_put_contents($calendarFile, json_encode($allCalendarData));

    echo json_encode([
        'success' => true,
        'message' => "Giorno $day/$month/$year salvato con successo!"
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => "Errore: dati mancanti"
    ]);
}
