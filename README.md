# Quiz app made with React / Fastapi
### Dependencies:
- git
- python
- pip
- virtualenv
- node.js & yarn
# Quick start in development mode
## **1. Clone this repo**
## **2. Run backend**
### Create and activate a virtual environment:
```
$  cd backend
$  virtualenv venv
```
Windows
```
$  .\venv\Scripts\activate
```
Mac/Linux
```
$  source venv/bin/activate
```
### Install requirements:
Windows
```python
$  pip install -r requirements.txt
```
Mac/Linux
```python
$  pip3 install -r requirements.txt
```
### Run server:
Windows
```python
$ python main.py --dev
```
Mac/Linux:
```python
$ python3 main.py --dev
```
## **3. Run frontend**
### Install requirements:
```
$  cd frontend
$  yarn
```
### Run server:
```
$  yarn dev
```
# Production mode
## Copy and rename **.env.production.example** to **.env.production** then edit it.

Do the same steps as in a dev mode but
### Change
```python
$ python3 main.py --dev
```
to
```python
$ python3 main.py --prod
```
### Change
```
$  yarn dev
```
to
```
$  yarn build
$  yarn preview
```
