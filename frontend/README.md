# Bufet PW

## Zintegrowane i użyte technologie:

<div style="display: flex; gap: 50px; max-width: 500px; flex-wrap: wrap; justify-content: center;">
  <img src="https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg" alt="NextJS" />
  <img src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg" alt="React" />
  <img src="https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg" alt="TypeScript" />
  <img src="https://www.vectorlogo.zone/logos/js_redux/js_redux-icon.svg" alt="Redux" />
  <img src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/prisma.svg" height=60 alt="Prisma" />
  <img src="https://authjs.dev/img/etc/logo-sm.webp" height=60 alt="AuthJS" />
  <img src="https://www.vectorlogo.zone/logos/sass-lang/sass-lang-icon.svg" alt="Sass" />
  <img src="https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg" alt="PostgreSQL" />
  <img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg" alt="NodeJS" />
  <img src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/zod.svg" height=60 alt="Zod" />
</div>

## Konfiguracja lokalnego serwera u siebie:

**!!! Zalecana metoda konfiguracji to ta z wykorzystaniem Dockera, opisana w głównym [README](../README.md) projektowym, poniższy opis przedstawia sposób bez użycia dockera w celu postawienia wyłącznie frontendu na lokalnej maszynie !!!**

- Trzeba sobie zainstalować **NodeJS** wraz z **npm**.
  NodeJS to java-scriptowa platforma backendowa, npm to program zarządzający
  pakietami w projekcie. Tu macie link do instrukcji instalacyjnych: [link](https://nodejs.org/en/download/package-manager).
- Teraz wywołujemy kilka komend inicjalizujących projekt:

```sh
# klonujemy repozytorium
git clone https://gitlab-stud.elka.pw.edu.pl/bd2-25l/bd2-25l-z19
cd bd2-25l-z19/frontend # wchodzimy do projektu
# instalujemy wszystkie wymagane w projekcie pakiety (instalacja lokalna dla projektu)
npm install
```

- Następnie konfigurujemy bazę danych. W tym celu na początku instalujemy **PostgreSQL**. Instrukcje instalacyjne: [link](https://www.postgresql.org/download/). Po zakończeniu instalacji i skonfigurowania sobie jakiegoś administratora domyślnego na serwerze (zazwyczaj o nazwie postgres) przechodzimy dalej.
- W pliku `.env` w katalogu głównym (pliku najprawdopodobniej nie będzie ponieważ nie powinien on być pushowany, więc go tworzymy) dodajemy poniższą linijkę. Pola user, password i database podmieniamy oczywiście na te na naszym serwerze (możemy wpisać nazwę nieistniejącej bazy, zostanie wtedy utworzona)

```sh
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>?schema=public"
```

- Integracja bazy z prismą. **Prisma** udostępnia nam kilka narzędzi służących do jej szybkiej integracji z właściwą bazą danych. Ogólny schemat bazy zapisujemy w pliku `prisma/schema.prisma`. Żeby zaaplikować zmiany w tych plikach:

```sh
# regenerujemy typy w projekcie tak, żeby odzwierciedlały konfigurację schema.prisma
npx prisma generate
```

- Dodajemy jeszcze 2 zmienne do `.env`:

```sh
NEXT_PUBLIC_BACKEND_URL= # adres backendu np. "http://localhost:8000/api"
AUTH_SECRET= # sekret do autoryzacji jwt
```

Jeżeli wszystko poszło zgodnie z planem nasz projekt powinien być w pełni skonfigurowany i gotowy do pracy. Aby go uruchomić wpisujemy:

```sh
npm run dev
```

O ile nie wystąpi żaden niespodziewany błąd to strona powinna być dostępna pod
adresem [http://localhost:3000](http://localhost:3000),
