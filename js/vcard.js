/**
 * Generiert und lädt eine .vcf Datei für Sven Maibaum herunter.
 * Wird auf der Visitenkarten-Seite verwendet.
 */
function downloadVCard() {
    // VCard Datenstruktur (Version 3.0 für breite Kompatibilität)
    const vcardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Maibaum;Sven;;;',
        'FN:Sven Maibaum',
        'ORG:MayStudios',
        'TITLE:Software-Architekt & Spieleentwickler',
        'EMAIL;type=INTERNET;type=WORK:company@maystudios.net',
        'URL;type=WORK:https://www.svenmaibaum.dev',
        'URL;type=LINKEDIN:https://www.linkedin.com/in/sven-maibaum-034122326',
        'URL;type=GITHUB:https://github.com/Svenni551',
        // Optional: Foto-URL (funktioniert nicht in allen Clients direkt beim Import ohne Bilddaten)
        // 'PHOTO;VALUE=URI:https://www.svenmaibaum.dev/assets/images/sven_maibaum_profile.webp',
        'END:VCARD'
    ].join('\n');

    // Blob erstellen
    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    
    // Download-Link erstellen
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Sven_Maibaum.vcf');
    
    // Klick simulieren
    document.body.appendChild(link);
    link.click();
    
    // Aufräumen
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}