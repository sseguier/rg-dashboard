# Notes de version — Dashboard RG System Suite

Historique des évolutions de l'application (fichier `site/index.html`, et parfois `worker/worker.js` quand une fonctionnalité a besoin d'un nouveau chemin d'API autorisé).

> **v0.1 à v0.25 — historique non détaillé.** Ces versions ont construit les fondations de l'application : architecture GitHub Pages + relais Cloudflare Worker (pour ne jamais exposer le token API), les deux onglets Alertes et Parc, la fiche agent (infos système, courbes de supervision, état des sauvegardes), la recherche multi-critères, l'installation en PWA, et le retrait du service worker (causait des pages figées). Le détail précis de chaque version dans cette plage n'a pas été conservé.

## v0.26
Affichage du domaine Microsoft 365 correspondant sur la fiche d'un agent M365 (ex. `M365x34151956.onmicrosoft.com`), récupéré depuis les données de sauvegarde de l'agent.

## v0.27
Ajout d'un menu hamburger sur l'écran Parc : en sélectionnant un dossier, il permet de filtrer son contenu (tous les agents / serveurs uniquement / postes uniquement / avec alertes uniquement), avec un indicateur visuel quand un filtre est actif.

## v0.28
Le menu hamburger passe à gauche du titre et devient la navigation principale de l'app : les boutons "Parc" et "Alertes" du haut sont supprimés, remplacés par des liens de navigation dans le tiroir latéral (en plus des filtres de dossier existants).

## v0.29
La barre de recherche affiche désormais simplement "Rechercher un agent..." sur tous les écrans. (Tentative d'affichage de la date de création sur chaque alerte étudiée puis abandonnée : ce champ n'existe pas dans les données renvoyées par l'API pour les alertes.)

## v0.30
Nouvelle section "Journal d'événements" sur la fiche de chaque agent : erreurs et avertissements des journaux Windows (Système / Application), triés du plus récent au plus ancien.

## v0.31
Les courbes de la fiche agent sont regroupées en un seul bloc, dans un ordre fixe (Heartbeat, disque, disque E/S, mémoire, CPU, antivirus, réseau) — la courbe technique "Octets Transmis par l'Agent" est retirée. Ajout de filtres par criticité sur les blocs Alertes et Journal d'événements de la fiche agent.

## v0.32
Correction d'un chevauchement visuel avec la barre de statut de l'iPhone (heure, réseau, batterie) quand l'application est ouverte depuis l'icône ajoutée à l'écran d'accueil.

## v0.33
Nouvel onglet "Carte" : affiche chaque client sur une carte (OpenStreetMap), localisé automatiquement à partir de son adresse enregistrée dans RG System. Un tap sur un client ouvre sa fiche dans l'onglet Parc.

## v0.34
Sur un dossier client, affichage du nombre de serveurs, postes et devices (comptage sur tout le client, pas seulement le premier niveau). Ajout d'un bouton "Tout afficher / Tout replier" au-dessus des courbes d'un agent, pour les ouvrir toutes en un clic.

## v0.35
Retrait des icônes (œil / singe) sur le bouton d'affichage des courbes, ne garde que le texte. Ajout d'un bouton "Actualiser" sur l'onglet Carte pour recharger la liste des clients. Correction du positionnement du titre "Filtrer ce dossier" dans le menu latéral (bien séparé du groupe de navigation au-dessus). Création de ce fichier de notes de version.

## v0.36
Retrait du trait sous "Filtrer ce dossier" dans le menu latéral (ne garde que la ligne de séparation au-dessus). Les cadres récapitulatifs d'un dossier client affichent désormais "Serveur(s)", "Poste(s)", "Device(s)".
