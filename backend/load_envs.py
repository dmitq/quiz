from dotenv import load_dotenv
import os
import sys

mode = "development"
if len(sys.argv) > 1 and sys.argv[1] in ("--prod", "--production", "--p"):
    mode = "production"
load_dotenv(f"../.env.{mode}")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
PUBLIC_URL = os.getenv("PUBLIC_URL")
BCRYPT_ROUNDS = os.getenv("BCRYPT_ROUNDS")
API_HOST = os.getenv("API_HOST")
API_PORT = os.getenv("API_PORT")
