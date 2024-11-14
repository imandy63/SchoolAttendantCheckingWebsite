import datetime
import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
MONGODB_URI = os.environ['MONGOD_URI']
DB_NAME = os.environ['MONGODB_DATABASE_NAME']

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]