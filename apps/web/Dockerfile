FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
 
FROM base AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Add build args for NEXT_PUBLIC_ variables
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_MIDTRANS_CLIENT_KEY

# Set them as env vars for the build
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=$NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
ENV NODE_ENV=production

RUN pnpm run build
 
FROM base AS dokploy
WORKDIR /app
ENV NODE_ENV=production
 
# Copy only the necessary files
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
 
EXPOSE 4000
CMD ["pnpm", "serve"]