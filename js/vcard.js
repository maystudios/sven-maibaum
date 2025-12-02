/**
 * Generiert und lädt eine .vcf Datei für Sven Maibaum herunter.
 * Versucht auf Mobile Devices das native "Teilen"-Menü zu öffnen,
 * was oft direkt "Zu Kontakten hinzufügen" anbietet.
 */
async function downloadVCard() {
    // VCard Datenstruktur (Version 3.0 für breite Kompatibilität)
    const vcardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:Maibaum;Sven;;;',
        'FN:Sven Maibaum',
        'ORG:MayStudios',
        'TITLE:Software-Architekt & Spieleentwickler',
        'EMAIL;type=INTERNET;type=WORK:company@maystudios.net',
        // KORRIGIERTE LINKS:
        'URL;type=WORK:https://sven-maibaum.com',
        'URL;type=LINKEDIN:https://www.linkedin.com/in/sven-maibaum',
        'URL;type=GITHUB:https://github.com/maystudios',
        // Optional: Foto-URL
        'PHOTO;VALUE=URI:https://sven-maibaum.com/assets/images/sven_maibaum_profile.webp',
        'END:VCARD'
    ].join('\n');

    // Datei-Objekt erstellen für die Share-API
    const file = new File([vcardData], 'Sven_Maibaum.vcf', { type: 'text/vcard' });

    // Versuch 1: Native Share API (Ideal für Mobile -> Öffnet "Teilen" / "Kontakte")
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                files: [file],
                title: 'Sven Maibaum - Kontakt',
                text: 'Kontaktkarte von Sven Maibaum speichern.'
            });
            return; // Wenn Share erfolgreich war, sind wir fertig
        } catch (error) {
            console.log('Share API fehlgeschlagen oder abgebrochen, nutze Download-Fallback', error);
        }
    }

    // Versuch 2: Klassischer Download (Fallback für Desktop oder wenn Share nicht geht)
    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', 'Sven_Maibaum.vcf');
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 1000);
}

/**
 * Versucht, den Wallet-Pass herunterzuladen.
 * Die Datei 'assets/sven_maibaum.pkpass' muss existieren.
 */
function addToWallet() {
    const walletFileUrl = 'assets/sven_maibaum.pkpass';
    
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = walletFileUrl;
    link.setAttribute('download', 'sven_maibaum.pkpass');
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
    }, 1000);
}