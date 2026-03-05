.PHONY: dev seed db-up db-down migrate test build install setup generate studio

dev:
	cd apps/web && npm run dev

db-up:
	docker compose up db -d

db-down:
	docker compose down

migrate:
	cd apps/web && npx prisma migrate dev

seed:
	cd apps/web && npx prisma db seed

studio:
	cd apps/web && npx prisma studio

test:
	cd apps/web && npm test

build:
	cd apps/web && npm run build

install:
	cd apps/web && npm install

setup: db-up
	sleep 3
	cd apps/web && npx prisma migrate dev --name init && npx prisma db seed

generate:
	cd apps/web && npx prisma generate
