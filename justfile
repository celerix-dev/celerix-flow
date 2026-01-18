# celerix-flow Task Runner
# Translates Docker multi-stage build to local commands
set dotenv-load := true
export PORT := "8085"
export DATA_DIR := "./data"
export STORAGE_DIR := "./data/uploads"

# Default recipe: show available commands
default:
    @just --list

# 1. Frontend Build Stage
build-frontend:
    cd frontend && npm install
    cd frontend && npm run build

# 2. Backend Build Stage (Depends on Frontend)
# This mimics the COPY --from=frontend-builder step
build-backend: build-frontend
    # Prepare distribution directory in backend
    mkdir -p backend/cmd/flow/dist
    cp -r frontend/dist/* backend/cmd/flow/dist/
    cp version.json backend/cmd/flow/version.json
    # Build the Go binary
    cd backend && CGO_ENABLED=0 go build -ldflags="-s -w" -o ../flow ./cmd/flow/main.go

# 3. Setup local environment
setup:
    mkdir -p data/uploads

# 4. Final 'Run' command (Stage 3 equivalent)
run: build-backend setup
    ./flow

# Clean up artifacts
clean:
    rm -rf frontend/dist
    rm -rf backend/cmd/flow/dist
    rm -f flow

dev-backend:
    cd backend && air && cd ..