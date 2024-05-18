create-env:
	python -m venv env

activate-env:
	env\scripts\activate

install:
	npm install && pip install -r requirements.txt

run-front:
	npm run dev

run-back:
	python server/app.py