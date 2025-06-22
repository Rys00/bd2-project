# Backend - Django

## Sposób uruchomienia
1. Stworzenie bazy danych psql: `psql -U nazwa_uzytkownika -c "CREATE DATABASE nazwa_baza;"`
2. Uzupełnienie pliku środowiskowego w folderze `backend/bufet` zgodnie z wzorecm w `.env_temp`.
3. Zamodelowanie bazy ORM django z folderu `backend/bufet`:
```
python manage.py makemigrations bufet
python manage.py migrate
python manage.py makemigrations
python manage.py migrate
```
3. Uruchomienie skryptów z folderu `baza/skrypty_sql` w kolejności: seed.py, reset_sekwencji_auto.sql, sales_report.sql, stock_snapshots.sql, avg_clients_weekday.sql.
4. Uruchomienie serwera backend: `python manage.py runserver`