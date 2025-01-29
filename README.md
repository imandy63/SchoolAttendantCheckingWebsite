
# School attendants checking website 🚀

#### A RESTful E-commerce Backend System built with Node.js, featuring microservices architecture, authentication, caching.

## Features

✅ Microservices Architecture for scalability

✅ Authentication & Authorization using JWT

✅ Distributed Locks with Redis

✅ Cloudinary Integration for image storage

## Tech Stack

Fronend: NextJS

Backend: NodeJS, ExpressJS, FastAPI

Database: MongoDB, Redis

Messaging Queue: RabbitMQ (if used)

Storage: Cloudinary (for images)

Authentication: JWT

# Installation

## Clone the repository:

```
git clone https://github.com/imandy63/SchoolAttendantCheckingWebsite.git
cd Final
```
Install dependencies:
Main:
```
cd Server/main
npm install
```

Website:
```
cd Website/website
npm install
```

## Set up environment variables in a .env file:

Auth:
```
PORT=your_auth_port

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port

MONGODB_URI=your_mongo_uri

MONGODB_HOST=your_mongo_host
MONGODB_PORT=your_mongo_port
MONGODB_DATABASE_NAME=your_database_naem

FE_URL=http://localhost:3000 (this is default)
```
Main:
```
PORT=your_main_port

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port

MONGODB_URI=your_mongo_uri

RABBITMQ_URL=amqp://localhost (this is default)
RABBITMQ_NOTIFICATION_QUEUE_NAME=your_rabbit_queue_name

MONGODB_HOST=your_mongo_host
MONGODB_PORT=your_mongo_port
MONGODB_DATABASE_NAME=your_database_name

AUTH_SERVER=your_auth_uri

FE_URL=http://localhost:3000 (this is default)
```
Notification:
```
MONGODB_URI=your_mongo_uri
MONGODB_DATABASE_NAME=your_database_name

AUTH_DOMAIN=your_auth_uri
FE_URL=http://localhost:3000 (this is default)

RABBITMQ_HOST=localhost (default)
RABBITMQ_PORT=5672 (default)

RABBITMQ_QUEUE=your_rabbit_queue_name
```
Upload:
```
PORT=39897

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SETRET_API_KEY=your_cloudinary_secret_api_key

AUTH_SERVER=your_auth_uri
```

OCR:
```
FE_URL=http://localhost:3000 (This is default)
```

Restore:
```
./restore year_month_day-hour_minute_second
```


## Run the Project:

1. Run docker compose:

```
docker-compose up -d --build
```

2. Start frontend

```
cd Website/website
npm run dev
```

3. Open another terminal and start the main server
```
cd Server/main
npm run dev
```
