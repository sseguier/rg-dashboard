# Dashboard mobile RG System Suite — Guide complet

## Introduction

Ce site est une application web mobile (PWA — installable sur l'écran d'accueil comme une vraie app, sans passer par un store) qui affiche en temps réel les données de supervision de votre compte **RG System Suite**. Elle est pensée pour être consultée en déplacement, sur téléphone.

Elle propose deux écrans principaux :

- **🗂️ Parc** (écran d'accueil) — navigation dans l'arborescence de votre compte (clients, groupes, agents), une **recherche** multi-critères (nom, IP, OS, numéro de série, commentaire...) sur l'ensemble du parc, et pour chaque agent une **fiche détaillée** : informations système (OS, CPU, mémoire, disque, réseau...), **courbes de supervision** (CPU, mémoire, disque, réseau, antivirus...), **état des sauvegardes** (fichiers, SQL Server, Hyper-V, Microsoft 365...), et les **alertes actives** de cet agent.
- **🔔 Alertes** — vue globale de toutes les alertes en cours, classées par criticité (Critique / Moyenne / Basse), filtrables par niveau, avec recherche texte et le chemin complet de chaque agent concerné. Un clic sur une alerte ouvre directement la fiche de l'agent.

### Comment ça marche (architecture)

Le site est composé de deux briques distinctes, toutes deux gratuites :

1. **Un site statique hébergé sur GitHub Pages** (dossier `site/`) — la partie visible, celle que vous consultez sur votre téléphone.
2. **Un relais (Cloudflare Worker)** (dossier `worker/`) — un petit programme intermédiaire qui reçoit les demandes du site et les transmet à l'API RG System Suite, en y ajoutant votre token d'authentification.

**Pourquoi un relais et pas un appel direct depuis le site ?** Une GitHub Pages est un site 100 % public : n'importe qui peut voir son code source, y compris toute clé qui y serait écrite en clair. Le relais garde votre token secret **côté serveur**, à l'abri des regards — le site public ne connaît que l'adresse du relais, jamais le token lui-même.

```
Téléphone ──► GitHub Pages (site/)   [public, pas de secret]
                    │
                    ▼
             Cloudflare Worker (worker/)   [privé, détient le token]
                    │
                    ▼
             API RG System Suite (api.rg-supervision.com)
```

---

## Prérequis

- Un compte **RG System Suite** avec accès API (clé API du compte + droit de générer un token personnel).
- Un compte **GitHub** (gratuit) — [github.com](https://github.com).
- Un compte **Cloudflare** (gratuit) — [dash.cloudflare.com](https://dash.cloudflare.com).
- Aucune compétence en développement n'est nécessaire : tout se fait par copier-coller dans des interfaces web.

---

## Étape 1 — Récupérer les accès API

1. **Clé API du compte** : à demander au support RG System ou à un administrateur du compte si vous ne l'avez pas déjà (elle ne peut être demandée que par un compte manager/administrateur).
2. **Token API personnel** :
   - Connectez-vous à votre dashboard RG System Suite.
   - En haut à droite, ouvrez **Mon Profil**.
   - Section **API Token** → **Créer un token API**.
   - Renseignez un nom (ex. `Dashboard mobile`) et la clé API du compte pour valider.
   - **Copiez immédiatement le token affiché** dans un endroit sûr (gestionnaire de mots de passe) — il ne sera plus jamais visible ensuite.
   - Recommandé : utilisez ou créez un compte utilisateur **en lecture seule** pour ce token, afin d'éliminer tout risque d'action involontaire depuis le dashboard.

⚠️ Ne partagez jamais ce token dans un email, un chat, ou un fichier public — traitez-le comme un mot de passe.

---

## Étape 2 — Déployer le relais (Cloudflare Workers)

1. Allez sur [dash.cloudflare.com](https://dash.cloudflare.com), créez un compte ou connectez-vous.
2. Menu de gauche : **Workers & Pages** → **Create** → **Create Worker**.
3. Donnez-lui un nom (ex. `rg-dashboard-relay`) → **Deploy**.
4. Cliquez **Edit code** pour ouvrir l'éditeur en ligne.
5. Supprimez le code d'exemple et collez-y l'intégralité du contenu du fichier **`worker/worker.js`** fourni.
6. Cliquez **Deploy** (en haut à droite) pour publier.
7. Allez dans l'onglet **Settings** → **Variables and Secrets**, ajoutez :
   - `RG_API_TOKEN` — cochez **Encrypt** (secret) — collez votre token personnel de l'étape 1.
   - `ALLOWED_ORIGIN` — texte simple — mettez `*` pour l'instant (sera restreint à l'étape 4).
8. Sauvegardez / redéployez si demandé.
9. **Notez l'URL de votre Worker**, affichée en haut de la page — de la forme :
   `https://rg-dashboard-relay.VOTRE-PSEUDO.workers.dev`

---

## Étape 3 — Publier le site (GitHub Pages)

1. Sur [github.com/new](https://github.com/new), créez un dépôt **public** (ex. `rg-dashboard`).
2. Sur la page du dépôt vide, cliquez **uploading an existing file**.
3. Glissez-déposez **tout le contenu du dossier `site/`** (y compris le sous-dossier `icons/`, en le glissant lui-même) — pas le dossier `worker/`.
4. Commit directement sur la branche `main`.
5. **Settings** → **Pages** → Source : **Deploy from a branch**, Branch : `main` / `(root)` → **Save**.
6. Après ~1 minute, le site est en ligne à l'adresse :
   `https://VOTRE-PSEUDO.github.io/rg-dashboard/`

---

## Étape 4 — Connecter le site au relais et sécuriser

1. Sur GitHub, ouvrez `index.html` → icône crayon (Edit).
2. Repérez la ligne :
   ```js
   const WORKER_URL = "https://VOTRE-WORKER.VOTRE-SOUS-DOMAINE.workers.dev";
   ```
   Remplacez-la par l'URL réelle de votre Worker notée à l'étape 2. Commit.
3. Retournez dans Cloudflare → votre Worker → **Settings** → **Variables**, changez `ALLOWED_ORIGIN` de `*` vers :
   `https://VOTRE-PSEUDO.github.io` *(sans slash final, sans chemin après)*
   → redéployez.

Cette dernière étape verrouille le relais : il ne répondra désormais qu'aux requêtes provenant de votre site, aucun autre site ou script ne pourra l'utiliser même s'il en découvre l'adresse.

---

## Étape 5 — Installer sur le téléphone

1. Ouvrez `https://VOTRE-PSEUDO.github.io/rg-dashboard/` dans le navigateur de votre téléphone.
2. **Android (Chrome)** : menu ⋮ → *Ajouter à l'écran d'accueil* / *Installer l'application*.
3. **iPhone (Safari)** : bouton Partager → *Sur l'écran d'accueil*.

L'icône apparaît alors comme une app à part entière, en plein écran.

---

## Mettre à jour l'application

Pour toute mise à jour ultérieure (nouvelle version des fichiers fournie) :

1. **Si `worker/worker.js` a changé** : Cloudflare → votre Worker → **Edit code** → remplacez tout le contenu → **Deploy**.
2. **Si `site/index.html` a changé** : GitHub → `index.html` → crayon (Edit) → remplacez tout le contenu → **avant de commit, vérifiez que la ligne `const WORKER_URL = ...` pointe bien vers votre Worker** (elle est généralement déjà pré-remplie) → Commit.
3. Rouvrez simplement l'application sur votre téléphone — pas de réinstallation nécessaire, la page se recharge toujours depuis le réseau.

Aucune de ces étapes ne nécessite de repasser par l'étape 4 (sécurisation), sauf si l'adresse de votre site ou de votre Worker change.

---

## Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| Erreur `403` / `forbidden_origin` | `ALLOWED_ORIGIN` dans Cloudflare ne correspond pas exactement à l'adresse du site | Vérifiez qu'il n'y a ni slash final, ni faute de frappe, ni `http` au lieu de `https` |
| Erreur `403` / `path_not_allowed` | Le Worker déployé est une ancienne version | Redéployez `worker/worker.js` (Étape 2, point 5-6) |
| Erreur `500` / `server_misconfigured` | Le secret `RG_API_TOKEN` n'est pas défini dans Cloudflare | Vérifiez Settings → Variables and Secrets |
| Page qui ne se met pas à jour après une modification | Cache du navigateur | Fermez complètement l'app (pas juste changer d'onglet) et rouvrez-la |
| "Aucune alerte à afficher" alors qu'il devrait y en avoir | Normal si tout va bien, ou vérifiez `ROOT_NODE_ID` dans `index.html` (doit correspondre à votre `nodeId` de compte) | — |

---

## Notes de sécurité

- Le token API n'est **jamais** présent dans le code du site (`index.html`) — uniquement dans le Worker, chiffré côté Cloudflare.
- Utilisez un token associé à un compte **lecture seule** pour éviter tout risque d'action involontaire.
- Le relais Cloudflare n'autorise qu'une liste précise de types de requêtes (lecture seule : alertes, arborescence, fiches agents, courbes, sauvegardes) — impossible de l'utiliser pour modifier quoi que ce soit sur votre compte RG System.
- L'application n'a pas d'utilisation hors-ligne : sans réseau, elle affiche une erreur de chargement, ce qui est normal (il n'y a de toute façon aucune donnée de supervision à afficher sans connexion).
