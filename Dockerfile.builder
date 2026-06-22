# ── Builder: compila React y copia a volumen compartido ──────
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=/api
ARG VITE_GROQ_API_KEY
ARG VITE_GROQ_MODEL=llama-3.3-70b-versatile
ARG VITE_GEMINI_API_KEY
ARG VITE_GEMINI_MODEL=gemini-2.5-flash-lite
ARG VITE_COMPANY_NAME="Forward Vision"
ARG VITE_COMPANY_EMAIL="contacto@forwardvision.com"
ARG VITE_COMPANY_PHONE="+51 900 970 806"

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GROQ_API_KEY=$VITE_GROQ_API_KEY
ENV VITE_GROQ_MODEL=$VITE_GROQ_MODEL
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_GEMINI_MODEL=$VITE_GEMINI_MODEL
ENV VITE_COMPANY_NAME=$VITE_COMPANY_NAME
ENV VITE_COMPANY_EMAIL=$VITE_COMPANY_EMAIL
ENV VITE_COMPANY_PHONE=$VITE_COMPANY_PHONE

COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Etapa final: solo copia el dist al volumen /dist
FROM alpine:3.19
COPY --from=builder /app/dist /dist
# El contenedor corre cp y sale (no es un servidor)
CMD ["cp", "-r", "/dist/.", "/dist"]
