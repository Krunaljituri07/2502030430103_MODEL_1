# SOLARA Workspace

This workspace contains two servers:

- `dreamdrive/` — Node/Express backend (original project)
- `SOLARA/` — Local SOLARA API (Express + Mongoose) used by the frontend

Start both servers together from the workspace root:

```bash
npm install
npm run start:all
```

This will run `npm run server` inside both `dreamdrive` and `SOLARA` directories and pipe their output to the terminal.

You can also start them individually:

```bash
# from workspace root
npm run start:dreamdrive
npm run start:solara
```
