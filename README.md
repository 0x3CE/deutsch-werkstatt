# Deutsch-Werkstatt

Un site statique pour apprendre l'allemand de A1 à B1, pensé pour s'installer et travailler en Suisse alémanique. Il utilise l'API Claude avec ta propre clé, ton micro pour parler et la synthèse vocale de ton navigateur pour écouter.

Aucun serveur : tout tourne dans le navigateur. La clé API et la progression restent sur ton appareil.

## Ce qu'il fait

| Onglet | Contenu |
|---|---|
| **Heute** | Le programme du jour, un minuteur de session, la progression (heures, série, cartes à revoir, coût API du mois) et la « ligne » des 34 unités. |
| **Kurs** | 34 unités : révision A1, A2 (examen Goethe A2), B1, et un aperçu B2. Claude prépare chaque leçon à la première ouverture (explication, tableau, exemples lus à voix haute, vocabulaire, dialogue, exercices corrigés), puis elle est gardée. |
| **Gespräch** | Jeux de rôle (premier jour au bureau, entretien, visite d'appartement, commune, gare, médecin, stand-up, épreuve « organiser ensemble » du Goethe A2…). Tu parles au micro, Claude répond à voix haute et corrige chaque message. Le mode **mains libres** enchaîne écoute et réponse sans clic. |
| **Sprechen** | **Nachsprechen** : écoute une phrase, répète-la, et vois quels mots ont été reconnus. **Monologue** : parle une à deux minutes sur un thème avec quatre mots-clés (Goethe A2, Sprechen Teil 2), puis Claude évalue la tâche, l'aisance, le vocabulaire, la grammaire et les mots probablement mal prononcés. |
| **Schreiben** | Sujets type Goethe, correction notée avec texte corrigé et erreurs expliquées. |
| **Übungen** | Exercices générés à la demande sur n'importe quel point de grammaire. |
| **Wortschatz** | Cartes en révision espacée (5 boîtes), paquet de départ de 52 mots utiles en Suisse, réponse au micro dans le sens français → allemand. |
| **Hören & Lesen** | Textes générés au niveau choisi, lus à voix haute, avec questions de compréhension. |
| **Réglages** | Clé API, modèles, voix, langue du micro, profil, export / import des données. |

## Mise en route

### 1. Créer une clé API

1. Ouvre la console Claude : <https://platform.claude.com/>.
2. Ajoute des crédits si besoin.
3. Crée une clé **dédiée à ce site**, et fixe une **limite de dépenses** sur son espace de travail.

### 2. Mettre le site en ligne avec GitHub Pages

1. Pousse ces fichiers à la racine d'un dépôt **public** (GitHub Pages gratuit l'exige).
2. Dans le dépôt : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site est publié sur `https://<ton-compte>.github.io/<nom-du-dépôt>/` au bout d'une minute ou deux.

Le dépôt ne contient aucune clé. Quelqu'un qui ouvre ton site ne peut rien faire sans saisir sa propre clé.

### 3. Brancher la clé

Ouvre le site, va dans **Réglages**, colle la clé, puis **Enregistrer** et **Tester**.

### En local

Le micro demande une page servie en HTTPS ou depuis `localhost` :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Navigateurs

| | Micro (reconnaissance vocale) | Voix (lecture) |
|---|---|---|
| Chrome, Edge (ordinateur, Android) | oui | oui |
| Safari (Mac, iPhone, iPad) | oui, si la Dictée est activée dans les réglages du système | oui |
| Firefox | non | oui |

La reconnaissance vocale est celle du navigateur : Chrome envoie l'audio aux serveurs de Google, Safari à ceux d'Apple. Le site ne reçoit que le texte.

Pour une meilleure voix sur Mac : **Réglages Système → Accessibilité → Contenu énoncé → Voix du système → Gérer les voix**, puis télécharge une voix allemande « améliorée » ou « premium » et choisis-la dans Réglages.

## Coûts

| Usage | Modèle par défaut | Ordre de grandeur |
|---|---|---|
| Conversation, sujets, mots, textes | Claude Haiku 5.5 (0,10 $ / 0,50 $ par million de tokens) | moins d'un centime par réplique |
| Leçons, exercices, corrections | Claude Sonnet 5.5 (2 $ / 10 $ par million de tokens) | quelques centimes par leçon ou correction |

Le site affiche une estimation du coût du mois à partir des tokens renvoyés par l'API. La facture réelle est dans la console. Prix de base relevés en octobre 2026 : <https://platform.claude.com/docs/en/about-claude/pricing>.

Les identifiants de modèle se changent dans **Réglages → Modèles**, par exemple quand un modèle est retiré.

## Confidentialité et sécurité

- La clé est stockée dans le `localStorage` du navigateur, ou seulement le temps de l'onglet si tu décoches « Mémoriser ».
- Les appels partent directement du navigateur vers `api.anthropic.com` (en-tête `anthropic-dangerous-direct-browser-access`). C'est acceptable ici parce que c'est **ta** clé, sur **ton** appareil. Ne publie jamais une version du site qui embarque une clé.
- La page applique une politique de sécurité (CSP) stricte : pas de script externe, connexions limitées à l'API Claude et aux polices Google.
- La progression, les leçons et les cartes restent dans le navigateur. **Réglages → Sauvegarde** permet de les exporter et de les réimporter sur un autre appareil. La clé n'est jamais exportée.

## Structure

```text
index.html   structure de la page et politique de sécurité
styles.css   mise en forme (thèmes clair et sombre)
app.js       programme, appels à l'API Claude, micro, voix, stockage local
```

## Ressources gratuites en complément

- [Nicos Weg (Deutsche Welle)](https://learngerman.dw.com/en/nicos-weg/c-36519789) : cours vidéo complet A1 → B1.
- [Goethe-Zertifikat A2](https://www.goethe.de/ins/gb/de/m/sta/lon/prf/gzsd2/inf.html) : format de l'examen.
