# PROJEKT - Aplikacja do obsługi Bufetu - BufetPW

Wykonali: Martyna Orzechowska, Mateusz Ogniewski, Joanna Jóśko, Filip Fijałkowski, Jakub Sikorski

## Dokumentacja projektowa

### Wstęp

Tematyką projektu jest prosta aplikacja bazodanowa przeznaczona do obsługi bufetu. Aplikacja składa się z części transakcyjnej dotyczącej realizacji zamówień wraz z aktualizacją stanu magazynowego oraz części analitycznej dotyczącej analizy sprzedaży i przychodów w wybranych okresach czasowych.

#### Technologie
Do stworzenia aplikacji skorzystaliśmy z następujących technologii:
<div style="display: flex; gap: 50px; max-width: 500px; flex-wrap: wrap; justify-content: center;">
  <img src="https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg" alt="PostgreSQL" />
  <img src = "https://static.djangoproject.com/img/logos/django-logo-positive.svg" height = 50 alt="Django"/>
  <img src = "https://www.django-rest-framework.org/img/logo.png". height = 50 alt="Django REST framework"/>
  <img src = "https://avatars.githubusercontent.com/u/2545424?s=48&v=4" alt ="pg crone" />
  <img src="https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg" alt="NextJS" />
  <img src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg" alt="React" />
  <img src="https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg" alt="TypeScript" />
  <img src="https://www.vectorlogo.zone/logos/js_redux/js_redux-icon.svg" alt="Redux" />
  <img src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/prisma.svg" height=60 alt="Prisma" />
  <img src="https://authjs.dev/img/etc/logo-sm.webp" height=60 alt="AuthJS" />
  <img src="https://www.vectorlogo.zone/logos/sass-lang/sass-lang-icon.svg" alt="Sass" />
  <img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg" alt="NodeJS" />
  <img src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/zod.svg" height=60 alt="Zod" />
</div>


### Opracowanie modelu pojęciowego (E-R)
Przy opracowaniu modelu pojęciowego skupiliśmy się na jak najdokładniejszym odwzorowaniu zależności występujących między obiektami w świecie rzeczywistym w modelu E-R. W związku z tym zdecydowaliśmy się odpowiednio na:

- Odseparowanie stanu magazynowego produktu jako osobą encję - bezpieczeństwo wykonywania transakcji przykładowo zmiana kategorii produktu w tym samym czasie co wykonywanie zamówienia nie przekształci błędnie stanu magazynu;
- Wykorzystanie encji słownikowych do kategorii produktów oraz alergenów - ręczne wprowadzanie kategorii oraz alergenów produktów po ich jest mało wygodne dla użytkownika aplikacji oraz umożliwiałoby wielokrotnie dodawanie tych samych danych wyrażonych innymi słowami np. *słodkie* oraz *słodkości* znaczą to samo czy *orzechy* oraz *mieszanka orzechów* są tym samym alergenem.
- W celu dalszego opracowywania modelu logicznego bazy relacja wiele-do-wielu produktów do alergenów została zastąpiona tabelą pośrednią.
- Model pojęciowy został również zgodnie z sugestią "uzupełniony" o zmiany wynikające z później przeprowadzonej denormalizacji w tabeli dot. pozycji zamówień.

[Model pojęciowy](baza/pojeciowy.pdf)
<iframe src = "./baza/pojeciowy.pdf" width = 100%> </iframe>


### Opracowanie modelu logicznego

Na podstawie opracowanego modelu pojęciowego przystąpiliśmy do stworzenia modelu logicznego dla bazy relacyjnej. Dodatkow skorzystaliśmy z możliwości Data Modeler i określiliśmy w modelu dodatkowe indeksy mające na celu poprawę wydajności zapytań wykonywanych na bazie danych.


### Denormalizacja

- tu dodajmy o triggerach jakie są wykorzystywane (czytaj jeden przy prejoin na nazwie produktu na pozycji zamówienia)

### Indeksy

### Widoki

### Widoki zmaterializowane

### Funkcjonalności aplikacji

#### części operacyjnej (transakcyjnej)

#### części analityczno-raportowej

## Testowanie aplikacji

## Obsługa aplikacji

- jak uruchomić etc.

