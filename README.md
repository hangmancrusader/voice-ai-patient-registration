# Voice AI Patient Registration

A voice-based patient registration system that collects patient demographics through a conversational AI agent and stores them in a persistent PostgreSQL database.

## Tech Stack

- Vapi — Voice AI + US phone number
- Node.js + TypeScript + Express — REST API
- Neon PostgreSQL — Database
- Vercel — Deployment
- Zod — Server-side validation

## Architecture

Caller → Vapi Voice Agent → `create_patient` tool → Express API → Neon PostgreSQL

## Live Voice Agent

US Number: `+1 (943) 222 9062`

Call the number above to test the patient registration flow.

## Live API

Base URL:

```text
https://voice-ai-patient-registration-flame.vercel.app
```
