source .venv/Scripts/activate
uv pip install .
python manage.py flush --noinput
python manage.py makemigrations bufet
python manage.py migrate bufet
python manage.py makemigrations
python manage.py migrate
python manage.py runserver