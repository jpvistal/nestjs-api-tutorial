#!/bin/sh
set -e

LOCKFILE_STAMP="node_modules/.package-lock.json"
PRISMA_SCHEMA_STAMP="node_modules/.prisma-schema.prisma"

if [ ! -d node_modules ] || [ ! -f "$LOCKFILE_STAMP" ] || ! cmp -s package-lock.json "$LOCKFILE_STAMP"; then
  echo "Installing dependencies inside the container..."
  npm ci
  cp package-lock.json "$LOCKFILE_STAMP"
fi

if [ ! -f "$PRISMA_SCHEMA_STAMP" ] || ! cmp -s prisma/schema.prisma "$PRISMA_SCHEMA_STAMP"; then
  echo "Generating Prisma client..."
  ./node_modules/.bin/prisma generate
  cp prisma/schema.prisma "$PRISMA_SCHEMA_STAMP"
fi

exec "$@"
