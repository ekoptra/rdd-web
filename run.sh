cp .env.example .env
docker compose down
docker compose up -d
docker compose restart seed-db