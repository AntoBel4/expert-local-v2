\# Kit Delivery Service — Documentation



\## Emplacement

\- VPS Hetzner : 46.225.9.116

\- Dossier : /opt/kit-delivery/

\- URL : https://kit.expert-local.fr

\- Port : 5060 (derrière Caddy reverse proxy)



\## Fichiers

\- app.py — Service Flask, vérifie le token contre Notion

\- .env — NOTION\_API\_KEY + NOTION\_CLIENTS\_DB

\- static/index.html — Page Kit Express (9 métiers, scripts, SMS, vidéo)

\- static/\*.pdf — Templates visuels + Guide + Kit Relance+

\- static/\*.mp3 — 5 vocaux WhatsApp (ElevenLabs)



\## Services systemd

\- kit-delivery.service → gunicorn sur port 5060

\- Caddy (Docker, network:host) → reverse proxy kit.expert-local.fr → 127.0.0.1:5060



\## Caddy config

\- Fichier : /root/n8n-docker/Caddyfile

\- Bloc ajouté : kit.expert-local.fr { reverse\_proxy 127.0.0.1:5060 }



\## DNS

\- Record A : kit.expert-local.fr → 46.225.9.116 (dans éditeur zone o2switch)



\## Token

\- Généré par n8n (workflow Phase E2) à chaque achat

\- Stocké dans Notion base clients (colonne "Token Kit")

\- Vérifié par Flask contre l'API Notion à chaque accès



\## Commandes utiles

\- systemctl status kit-delivery

\- systemctl restart kit-delivery

\- journalctl -u kit-delivery -f

\- ls /opt/kit-delivery/static/

