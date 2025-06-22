source .env


source .venv/bin/activate
uv pip install .
# python manage.py flush --noinput
# rm -r ./bufet/migrations
python3 manage.py makemigrations bufet
python3 manage.py migrate bufet
python3 manage.py makemigrations
python3 manage.py migrate

psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME -a -f /sql/indeks.sql && \
psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME -a -f /sql/trg_product_name_ord_pst.sql && \
psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME -a -f /sql/seed.sql && \
psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME -a -f /sql/avg_clients_weekday.sql && \
psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME -a -f /sql/sales_reports.sql && \
psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME -a -f /sql/stock_snapshots.sql && \
psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME -a -f /sql/pg_cron_setup.sql

python3 manage.py runserver 0.0.0.0:8000