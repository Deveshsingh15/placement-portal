Quick deployment guide

Option A — Local Docker (fast, requires Docker Desktop)

1. Install Docker Desktop: https://docs.docker.com/get-docker/
2. Build & run locally:

```bash
# from project root
docker compose up --build
```

3. App will be available at http://localhost:5000 (server) and the client will be served from the built files.

Environment variables
- Copy `.env.example` to `.env` in project root or set env vars in your hosting platform.
- Required: `MONGO_URI`, `JWT_SECRET`, `ADMIN_SECRET`, `NODE_ENV=production`, `PORT` (optional), `CLIENT_URL`.

Option B — GitHub Container Registry + Cloud host (recommended for production)

1. The repository already contains a GitHub Actions workflow `.github/workflows/publish-image.yml` that builds and pushes a Docker image to GitHub Container Registry on push to `main`.
2. Once the image exists at `ghcr.io/<your-org>/placement-portal:latest`, you can deploy it to any container host (Render, Fly.io, DigitalOcean App Platform, AWS ECS, Heroku Container Registry, etc.).
3. Provide required environment variables (esp. `MONGO_URI` and secrets) in the target platform's secret settings.

Option C — Deploy frontend separately (Vercel/Netlify) and use Atlas + hosted server

- Build frontend (`cd client && npm run build`) and deploy `client/dist` to Vercel or Netlify.
- Deploy server as a Docker container or on a Node host (e.g., Render) and set `CLIENT_URL` accordingly.

If you want, I can:
- Run `docker compose up --build` locally (I attempted but Docker wasn't available in this environment), or
- Enable GitHub Actions (already added) and watch the publish build run (I can open the workflow run logs if you want), or
- Configure S3 uploads and add secrets handling instructions.

Tell me which option you want me to finish now and I'll proceed.

Option D — Deploy to Render (automatic via GitHub Actions)

1. Create a Web Service on Render and connect it to this GitHub repository, or plan to use the Render Docker deploy flow.
2. Get a Render API key: go to https://dashboard.render.com/account/api-keys and create a key.
3. Get your Render service ID: open your service in Render and note the service id from the URL (it looks like `srv-xxxxxxxx`).
4. In your GitHub repository, add two secrets: `RENDER_API_KEY` (value from step 2) and `RENDER_SERVICE_ID` (value from step 3).
5. Push to `main`; the workflow `.github/workflows/deploy-to-render.yml` will POST to the Render API to trigger a deploy.

Notes:
- The workflow uses the Render `/services/:serviceId/deploys` endpoint. Ensure your service is configured to deploy from GitHub or to accept manual deploys via the API.
- If you prefer an integrated approach, you can configure Render to auto-deploy on GitHub pushes (recommended) and skip the API trigger.

If you want, I can also add a workflow step to wait and report the Render deploy status back to the Actions logs.
