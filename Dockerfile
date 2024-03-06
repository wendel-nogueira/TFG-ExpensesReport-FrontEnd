# Build image
FROM node:20.11-bullseye-slim AS build

WORKDIR /app

COPY package.json package-lock.json nx.json tsconfig.base.json jest.preset.js ./
COPY apps/expensesreport/ ./apps/expensesreport/
COPY apps/expensesreport-e2e/ ./apps/expensesreport-e2e/
COPY libs/ ./libs/

RUN npm ci
RUN npm install -g nx

ENV NX_DAEMON=false
RUN nx run expensesreport:build:production


# Runtime image
FROM node:18.15.0-bullseye-slim AS runtime

WORKDIR /app

COPY --from=build /app/dist/apps/expensesreport /app/dist/apps/expensesreport

EXPOSE 4200
RUN npm install -g serve

CMD ["serve", "-s", "dist/apps/expensesreport/browser", "--listen", "tcp://0.0.0.0:4200"]
