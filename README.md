# DataGame-MVP

Operation OMNI — narrative data-literacy escape room (Mastermind terminal).

## Stack

- **App:** Next.js (`web/`) — login → video intro → missions 1–5 → hub
- **Auth:** NextAuth credentials + Prisma/Postgres progress API
- **Reference:** Legacy HTML missions in `reference/legacy-missions/`

## Quick start

```bash
cd web
npm install
cp .env.example .env   # configure DATABASE_URL + AUTH_SECRET
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Test accounts

| Role | Email | Password |
|------|-------|----------|
| Playtest | `playtest@omni.local` | `playtest12` |
| Admin (all missions unlocked, skip nav) | `admin@maverxtest.com` | `test123.com` |

## Missions

Each mission ends with a **stats debrief** driven by live gameplay state (time, accuracy, score, crew/routing breakdown).

1. **M1** — Evidence board / cross-reference
2. **M2** — Data ownership tribunal
3. **M3** — Ethics routing / vault
4. **M4** — Onboarding flow handoffs
5. **M5** — Framing, crew Q&A, vote
