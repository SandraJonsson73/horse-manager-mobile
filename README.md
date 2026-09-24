# Hästregistrering – Mobilapp

Mobilapp byggd med **React Native och Expo** för att bläddra, lägga till, redigera och radera hästar. Använder samma backend-API som webbapplikationen ([horse-manager](https://github.com/SandraJonsson73/horse-manager) / [horse-manager-api](https://github.com/SandraJonsson73/horse-manager-api)).

## Funktionalitet

- Lista över hästar, uppdelad i "Nuvarande hästar" och "Tidigare hästar"
- Tryck på en häst → detaljvy med bild och all information
- Lägg till ny häst med formulär (namn, ras, födelseår, uppfödare, ägare, tränare, anteckningar, status, profilbild)
- Redigera och radera befintlig häst
- Ladda upp/byta profilbild från telefonens bildbibliotek
- Felmeddelanden visas i appen om ett API-anrop misslyckas (t.ex. om backend inte är igång), utan att appen kraschar

## Förutsättningar

- [Node.js](https://nodejs.org/)
- [Expo Go](https://expo.dev/go) installerad på en fysisk telefon (iOS eller Android)
- Backend-API:et (`horse-manager-api`) klonat, igång och nåbart på nätverket (se nedan)
- Telefonen och datorn måste vara anslutna till **samma WiFi-nätverk**

## Klona och installera

```powershell
git clone https://github.com/SandraJonsson73/horse-manager-mobile.git
cd horse-manager-mobile
npm install
```

## Starta backend (krävs)

I `horse-manager-api`-mappen, starta API:et så att det lyssnar på alla nätverksgränssnitt (inte bara localhost), annars kan telefonen inte nå det:

```powershell
dotnet run --urls http://0.0.0.0:5280
```
## Konfigurera API-adressen
Mobilappen kan inte använda `localhost` för att nå backend, eftersom telefonen är en egen enhet på nätverket. Öppna `src/api/horses.js` och ändra IP-adressen till din egen dators lokala IP-adress:
```Powershell
const API_BASE = 'http://DIN-DATORS-IP:5280/api';
export const API_ORIGIN = 'http://DIN-DATORS-IP:5280';
```
Hitta din dators lokala IP-adress med `ipconfig` (leta efter "IPv4-adress" under ditt WiFi-nätverkskort).

## Starta appen
```PowerShell
npx expo start
```
**Skanna** QR-koden som visas i terminalen med Expo Go-appen på telefonen (Android: skannern inbyggd i Expo Go-appen, iPhone: kameraappen).

## Tekniska val
   **Expo Router** användes för navigering (filbaserad routing) istället för att sätta upp React Navigation manuellt – det följer med i standardprojektet och ger enkel navigering mellan lista, detaljvy och formulär utifrån mappstrukturen.
   **JavaScript** istället för TypeScript, för att hålla samma språk som webbapplikationen.
   **Bilduppladdning** använder **expo-file-systems** `uploadAsync` istället för `fetch` med `FormData`, eftersom `FormData` gav ett klientfel ("Unsupported FormDataPart implementation") på den nyare React Native-versionen som Expo SDK 57 använder. `expo-file-system` är byggt specifikt för att hantera filuppladdningar på ett tillförlitligt sätt i Expo-appar.
   **CORS** behöver inte konfigureras separat för mobilappen, eftersom CORS är en webbläsarregel – React Native/Expo-appar körs inte i en webbläsarmiljö och begränsas därför inte av backendens CORS-inställningar (som bara tillåter `http://localhost:5173` för webbappen).

## Mappstruktur
```text
src/
├── api/
│   └── horses.js          # API-anrop mot backend
├── components/
│   └── HorseForm.jsx      # Delat formulär för att lägga till/redigera
└── app/
    ├── _layout.jsx         # Root-navigering (Stack)
    ├── index.jsx           # Listskärm
    └── horse/
        ├── new.jsx          # Lägg till häst
        └── [id]/
            ├── index.jsx    # Detaljvy
            └── edit.jsx     # Redigera häst
```