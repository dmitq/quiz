# Quiz app made with React / Fastapi

## Development mode
```console
cd backend
pip install -r requirements.txt
python main.py --dev
cd ../frontend
yarn
yarn dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Production mode
Copy and rename **.env.production.example** to **.env.production** then edit it.
```console
cd backend
pip install -r requirements.txt
python main.py --prod
cd ../frontend
yarn
yarn build
yarn preview
```
## **Make sure you run main.py with the right parameter (--dev is set by default, change it to --prod if required)**
