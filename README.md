# PROJEKT - Aplikacja do obsługi Bufetu - BufetPW

Wykonali: Martyna Orzechowska, Mateusz Ogniewski, Joanna Jóśko, Filip Fijałkowski, Jakub Sikorski

## Dokumentacja projektowa

### Wstęp

Tematyką projektu jest prosta aplikacja bazodanowa przeznaczona do obsługi bufetu. Aplikacja składa się z części transakcyjnej dotyczącej realizacji zamówień wraz z aktualizacją stanu magazynowego oraz części analitycznej dotyczącej analizy sprzedaży i przychodów w wybranych okresach czasowych.

#### Technologie

Do stworzenia aplikacji skorzystaliśmy z następujących technologii:

<div style="display: flex; gap: 50px; max-width: 500px; flex-wrap: wrap; justify-content: center;">
  <img src="https://www.vectorlogo.zone/logos/docker/docker-tile.svg" alt="Docker" height=60 />
  <img src="https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg" alt="PostgreSQL" />
  <img src = "https://www.vectorlogo.zone/logos/djangoproject/djangoproject-icon.svg" alt="Django"/>
  <img src = "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/djangorest/djangorest-original-wordmark.svg" height=60 alt="Django REST framework"/>
  <img src = "https://www.vectorlogo.zone/logos/citusdata/citusdata-icon.svg" alt ="pg crone" />
  <img src="https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg" alt="NextJS" />
  <img src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg" alt="React" />
  <img src="https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg" alt="TypeScript" />
  <img src="https://www.vectorlogo.zone/logos/js_redux/js_redux-icon.svg" alt="Redux" />
  <img src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/prisma.svg" height=60 alt="Prisma" />
  <img src="https://authjs.dev/img/etc/logo-sm.webp" height=60 alt="AuthJS" />
  <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="Tailwind" />
  <img src="https://www.vectorlogo.zone/logos/sass-lang/sass-lang-icon.svg" alt="Sass" />
  <img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg" alt="NodeJS" />
  <img src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/zod.svg" height=60 alt="Zod" />
  <img src="https://raw.githubusercontent.com/dochne/wappalyzer/refs/heads/main/src/images/icons/shadcn-ui.svg" height=60 alt="ShadCN" />
</div>

### Opracowanie modelu pojęciowego (E-R)

Przy opracowaniu modelu pojęciowego skupiliśmy się na jak najdokładniejszym odwzorowaniu zależności występujących między obiektami w świecie rzeczywistym w modelu E-R. W związku z tym zdecydowaliśmy się odpowiednio na:

- Odseparowanie stanu magazynowego produktu jako osobą encję - bezpieczeństwo wykonywania transakcji przykładowo zmiana kategorii produktu w tym samym czasie co wykonywanie zamówienia nie przekształci błędnie stanu magazynu.
- Atrybut marży określa marże jaką może mieć właściciel bufetu ze względu na podpisane umowy z dostawcami. Pełni on rolę informacyjną a nie wyliczaną.
- Dodanie dodatkowego atrybutu encji produktu dot. czy dany produkt jest "aktywny". Pole to ma na celu umożliwienie wycofania np. produktu ze sprzedaży tak by nie był on widoczny np. dla kasjera, jednak została zachowana poprawna historia transakcji z tym produktem (usunięcie produktu mogłoby powodować zafałszowanie historii zamówień).
- Wykorzystanie encji słownikowych do kategorii produktów oraz alergenów - ręczne wprowadzanie kategorii oraz alergenów produktów po ich jest mało wygodne dla użytkownika aplikacji oraz umożliwiałoby wielokrotnie dodawanie tych samych danych wyrażonych innymi słowami np. _słodkie_ oraz _słodkości_ znaczą to samo czy _orzechy_ oraz _mieszanka orzechów_ są tym samym alergenem.
- W celu dalszego opracowywania modelu logicznego bazy relacja wiele-do-wielu produktów do alergenów została zastąpiona tabelą pośrednią.
- Model pojęciowy został również zgodnie z sugestią "uzupełniony" o zmiany wynikające z później przeprowadzonej denormalizacji w tabeli dot. pozycji zamówień.

![Model pojęciowy](baza/pojeciowy.png)

### Opracowanie modelu logicznego

Na podstawie opracowanego modelu pojęciowego przystąpiliśmy do stworzenia modelu logicznego dla bazy relacyjnej. Dodatkow skorzystaliśmy z możliwości Data Modeler i określiliśmy w modelu dodatkowe indeksy mające na celu poprawę wydajności zapytań wykonywanych na bazie danych. Model również odzwierciedla późniejsze decyzje dotyczące denormalizacji tabel w bazie danych (tabela pozycji zamówień).

![Model logiczny](baza/logiczny.png)

#### Denormalizacja

W celu optymalizacji zapytań do bazy danych podjęliśmy następujące decyzje:

- Dodanie kolumn pre-join dot. nazwy produktu w tabeli pozycji zamówienia. Kolumna ta jest uzupełniana przez trigger podczas operacji insert. Dodanie tej kolumny umożliwiło uproszczenia zapytania o dane zamówienie do wykorzystywania jednego złączenia zamiast dwóch.
- Dodanie kolumn wyliczanych do tabeli zamówienia oraz tabeli pozycji zamówienia. Wartości do tych tabel są wyliczane przy operacjach dodawania zamówienia na backendzie a następnie przekazywane w INSERT. Decyzja o wyliczaniu danych na backendzie wynika z możliwości automatycznego zwrotu informacji o stworzonym obiekcje na frontend aplikacji bez konieczności wykonywania dodatkowego zapytania na bazę w celu otrzymania informacji o nowo dodanym zamówieniu na bazę.
-

#### Indeksy

### Widoki

### Widoki zmaterializowane

### Funkcjonalności aplikacji

#### części operacyjnej (transakcyjnej)

#### części analityczno-raportowej

## Testowanie aplikacji

## Obsługa aplikacji

- jak uruchomić etc.
