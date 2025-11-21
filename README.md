# NestJS RabbitMQ JWT Microservices

This project demonstrates two NestJS applications communicating via RabbitMQ RPC:
- **web-gateway**: REST API that receives HTTP requests
- **jwt-service**: Microservice that handles JWT signing and decoding

## Architecture

```
Client → [REST API: web-gateway] → [RabbitMQ RPC] → [Microservice: jwt-service]
```

## Project Structure

```
nestjs-rabbitmq-jwt/
├── web-gateway/           # REST API Gateway
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── dto/
│   │   │       ├── sign-user.dto.ts
│   │   │       └── decode-token.dto.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── jwt-service/           # JWT Microservice
│   ├── src/
│   │   ├── jwt/
│   │   │   ├── jwt.controller.ts
│   │   │   ├── jwt.service.ts
│   │   │   └── jwt.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env
└── docker-compose.yml
```

## Prerequisites

- Docker
- Docker Compose

## Setup and Running

### Option 1: Using Docker Compose (Recommended)

1. **Navigate to the project directory:**
   ```bash
   cd nestjs-rabbitmq-jwt
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - RabbitMQ (ports 5672, 15672)
   - JWT Service (microservice)
   - Web Gateway (port 3000)

3. **Access the services:**
   - Web Gateway: http://localhost:3000
   - RabbitMQ Management UI: http://localhost:15672 (guest/guest)

### Option 2: Local Development

1. **Start RabbitMQ:**
   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

2. **Install dependencies and run jwt-service:**
   ```bash
   cd jwt-service
   npm install
   npm run start:dev
   ```

3. **Install dependencies and run web-gateway:**
   ```bash
   cd web-gateway
   npm install
   npm run start:dev
   ```

## API Endpoints

### 1. Sign User (Generate JWT Token)

**POST** `http://localhost:3000/auth/sign-user`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/auth/sign-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
  }'
```

### 2. Decode Token (Verify and Decode JWT)

**POST** `http://localhost:3000/auth/decode-token`

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Valid Token):**
```json
{
  "valid": true,
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "iat": 1234567890,
    "exp": 1234571490
  }
}
```

**Response (Invalid Token):**
```json
{
  "valid": false,
  "error": "invalid signature"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/auth/decode-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_JWT_TOKEN_HERE"
  }'
```

## Testing the Flow

### Complete Test Scenario:

1. **Generate a token:**
   ```bash
   curl -X POST http://localhost:3000/auth/sign-user \
     -H "Content-Type: application/json" \
     -d '{"name":"Alice","email":"alice@example.com"}'
   ```

2. **Copy the token from the response and decode it:**
   ```bash
   curl -X POST http://localhost:3000/auth/decode-token \
     -H "Content-Type: application/json" \
     -d '{"token":"PASTE_TOKEN_HERE"}'
   ```

## Environment Variables

### web-gateway/.env
```
PORT=3000
RABBITMQ_URL=amqp://rabbitmq:5672
```

### jwt-service/.env
```
RABBITMQ_URL=amqp://rabbitmq:5672
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=1h
```

## Technical Details

### RabbitMQ RPC Patterns

- **jwt.sign**: Generates JWT token with 1-hour expiration
  - Input: `{ name, email, role }`
  - Output: `{ token }`

- **jwt.decode**: Verifies and decodes JWT token
  - Input: `{ token }`
  - Output: `{ valid, user?, error? }`

### Validation

The web-gateway uses `class-validator` for DTO validation:
- **SignUserDto**: Validates name (min 3 chars), email format
- **DecodeTokenDto**: Validates token is a non-empty string

### Docker Network

All services run on a shared Docker network (`nestjs-network`) for seamless communication.

## Stopping the Services

```bash
docker-compose down
```

To remove volumes as well:
```bash
docker-compose down -v
```
