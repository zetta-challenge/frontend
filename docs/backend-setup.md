# 🔧 Backend Setup Guide

This document provides instructions for setting up and configuring the backend server required for the ElevenLabs Frontend application.

> **For specific backend implementation details, please refer to your backend repository documentation!**

## 🌐 Environment Configuration

The frontend expects the backend to be running and accessible via the `PUBLIC_API_URL` environment variable.

Create a `.env` file in the frontend root directory:

```env
PUBLIC_API_URL=http://localhost:8080
```
---

> We know sometimes how annoying it is as a FrontEnd dev to have to run the backend when you should worry about only your part of the code... so you have several options. Either use a the hosted dev backend API that is mainintaining it's release schedule... and pray access is configured or pull the backend repo like a strong independent frontender and use docker 😉

## 🐋 Running both FE and BE via `docker compose`
If you clone the FE and BE repo in a common folder
1. Create a `docker-compose.yaml` pasting inside the contents below 
2. Inside the common folder with the docker-compose file just run `docker compose up` 
>
```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    env_file:
      - ./frontend/.env
    ports:
      - "3000:8080"
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    env_file:
      - ./backend/.env 
    ports:
      - "8080:8080"
```
Something important to note, both services are configured to serve at port `8080` - due to gcloud run builtin proxy (serverless...) so to make it easier, the frontend port is mapped to `3000`

## 🔧 CORS Configuration

Your backend should be configured to allow requests from your frontend origin. Make sure to set appropriate CORS headers for:

- `http://localhost:<FE_PORT>` (development)
- Your production frontend domain

> **For specific backend implementation details, please refer to your backend repository documentation!**