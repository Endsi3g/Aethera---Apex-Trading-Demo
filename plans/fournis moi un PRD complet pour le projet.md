<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# fournis moi un PRD complet pour le projet

Voici un **PRD complet** pour ton projet Aethera – Apex Trading Demo.

***

## 1. Contexte \& Vision

**Produit**
Application web de démonstration interactive (kiosque salon) pour présenter Apex, le modèle de trading d’Aethera, sous forme de jeu de prédiction de marché, en solo ou multijoueur, avec explications pédagogiques.

**Public cible**

- Audience principale : débutants curieux, peu ou pas d’expérience en trading.
- Audience secondaire : experts / pros de la finance.
- Environnement : salons, conférences, démos commerciales, sur écran tactile (kiosques ou laptops).

**Vision**
Créer un jeu simple, fun et pédagogique qui montre **comment Apex décide** (et surtout **quand il choisit de ne pas agir**), et qui convertit les joueurs en **inscrits à la bêta Apex + communauté**.

***

## 2. Objectifs produit

**Objectifs business**

- Générer des leads qualifiés pour la bêta Apex :
    - Taux de conversion cible : ≥ 30% des joueurs finissant une partie laissent un email.
- Renforcer le positionnement d’Apex :
    - Apex = IA multi-modèles, disciplinée, orientée préservation du capital.
- Support commercial :
    - Permettre aux sales de s’appuyer sur l’app comme “conversation starter” lors des salons.

**Objectifs utilisateur**

- Permettre à un débutant de comprendre en quelques minutes :
    - Que le trading n’est pas juste “cliquer souvent”.
    - Que **ne pas agir** est une décision forte.
    - Que Apex orchestre plusieurs “réseaux” pour décider.
- Permettre à un expert de voir :
    - Que le modèle pense en termes de **tendance / momentum / structure, régime, risque asymétrique**.
    - Que l’approche privilégie **qualité des trades**.

***

## 3. Principes \& Philosophie Apex à rendre visibles

- Orchestration multi-modèles :
    - Réseaux spécialisés : **tendance**, **momentum**, **structure de marché**.
- Analyse contextuelle :
    - Tendance générale, volatilité, régime de marché.
- Gestion du risque :
    - Risque asymétrique, protection du capital comme objectif principal.
- Philosophie :
    - **Qualité des trades > fréquence des trades**.
    - “Savoir quand ne pas agir” = signal fort de discipline.
- Dans chaque écran explicatif Apex :
    - Décision Apex.
    - Réseaux activés.
    - Pourquoi agir / ne pas agir.
    - Comment cela protège le capital.

***

## 4. Fonctionnalités clés

### 4.1. Modes de jeu

**Mode Solo**

- Le joueur joue seul une série de scénarios.
- Paramètres :
    - Nombre de scénarios : 5, 10 ou 20.
    - Difficulté : débutant / intermédiaire / expert.
    - Type de contenu :
        - Graphiques TradingView (scénarios chartés).
        - Questions simples (quiz trading).
- Score individuel, progression scénario par scénario.
- Comparaison à Apex à chaque scénario.

**Mode Multijoueur (2–4 joueurs)**

- Création d’une “salle” avec un code et lien partageable.
- 2 à 4 joueurs, temps réel.
- Paramètres définis par **vote** :
    - Scénarios : 5 / 10 / 20.
    - Difficulté : débutant / intermédiaire / expert.
    - Type : graphiques / quiz.
- Score individuel + leaderboard temps réel.
- Un gagnant final reçoit une **récompense** (accès bêta).

***

### 4.2. Navigation \& Écrans

1. **Écran d’accueil**
    - Hero : pitch Apex et boutons “Mode Solo” / “Mode Multijoueur”.
    - Tagline pédagogique courte.
    - CTA simples, gros boutons.
2. **Écran de saisie du nom**
    - Champ “Nom / Pseudo”.
    - Bouton “Continuer”.
    - Lien “Retour”.
3. **Mode Multijoueur – Salle d’attente**
    - Affichage du **code** de salle + lien partageable.
    - Liste des joueurs présents, host indiqué.
    - Astuces de trading pour débutants, en rotation.
    - Paramètres de partie + système de vote.
    - Bouton “Commencer la partie” (host only).
    - Bouton “Quitter”.
4. **Mode Solo – Paramètres**
    - Choix individuel :
        - Nombre de scénarios.
        - Difficulté.
        - Type de contenu.
    - Récap des paramètres.
    - Bouton “Lancer la partie solo”.
    - Bouton “Retour”.
5. **Écran de jeu (Scénario)**
    - Informations de contexte :
        - Mode (Solo / Multi).
        - Nom joueur.
        - Progression (Scénario X / N).
    - Contenu scénario :
        - Graphique (embed TradingView) OU question de quiz.
    - Boutons de prédiction :
        - “Monter”.
        - “Baisser”.
        - “Stable / Incertain”.
    - Bouton “Valider ma décision”.
    - Bouton “Quitter la partie”.
6. **Écran explicatif Apex (10s)**
    - Comparaison :
        - Décision utilisateur vs décision Apex.
    - Réseaux activés (tags : Tendance, Momentum, Structure).
    - Rationale : pourquoi Apex a choisi d’agir / ne pas agir.
    - Comment cela protège le capital.
    - Timer 10 secondes, non skippable (barre de progression / compte à rebours).
    - Transition automatique → scénario suivant ou résultats.
7. **Tableau de scores (en jeu / en fin de partie)**
    - Mode multi :
        - Scores en temps réel.
        - Classement.
    - Fin de partie :
        - Score final.
        - Gagnant mis en avant.
        - Mention de la récompense.
8. **Écran de résultats \& Récompense**
    - Résumé :
        - Score joueur.
        - Comparaison à Apex (ex : % de décisions alignées).
    - Message pour le gagnant (multi) :
        - “Accès bêta Apex + communauté”.
    - Formulaire email :
        - Champ email, bouton “Rejoindre la bêta”.
    - Lien QR / lien court pour rejoindre la bêta / communauté.

***

## 5. Stack \& Contraintes Techniques

### 5.1. Stack recommandée

- **Frontend** :
    - React + TypeScript.
    - Tailwind CSS (ou autre utility CSS) pour rapidité et responsive.
- **Backend** :
    - Node.js + Express.
    - WebSockets via Socket.IO pour multijoueur temps réel.
- **Base de données** :
    - MongoDB (scénarios, sessions, joueurs).
    - Redis (optionnel) pour état en temps réel / rooms, si nécessaire.
- **Temps réel** :
    - Socket.IO rooms pour la gestion des salles (by roomCode).
- **Graphiques** :
    - Widget TradingView embed / Charting Library pour les scénarios charts.
- **Déploiement** :
    - Frontend : Vercel / Netlify.
    - Backend : Render / Heroku / GCP Cloud Run.
    - Mode kiosque : Chrome/Edge en `--kiosk` / gestion du timeout, refresh auto possible.


### 5.2. Contraintes

- Responsive pour écrans plasma + laptops + tablettes.
- UX adaptée au tactile :
    - Gros boutons, spacing suffisant.
- Performance :
    - Latence faible pour mise à jour des scores.
- Sécurité :
    - Sessions éphémères.
    - Pas de données personnelles sensibles (uniquement email pour la bêta).

***

## 6. Architecture Fonctionnelle \& Données

### 6.1. Objets principaux

**User / Player**

- `id`
- `name`
- `isHost`
- `score`
- `email` (uniquement après consentement, écran final).

**Session / Room**

- `sessionId`
- `mode` : solo / multi
- `roomCode` (multi)
- `players[]`
- `gameSettings`
- `status` : waiting / playing / finished
- `currentScenarioIndex`
- `scenarios[]`
- `createdAt`, `updatedAt`

**GameSettings**

- `scenariosCount`: 5 | 10 | 20
- `difficulty`: beginner | intermediate | expert
- `contentType`: charts | quiz

**Scenario**

- `id`
- `difficulty`
- `contentType`
- `chartConfig` (config TradingView) ou `quizQuestion`
- `apexGroundTruth` :
    - `apexDecision`
    - `activatedNetworks[]`
    - `rationale`
    - `riskComment`

**Votes (multi)**

- Par joueur :
    - `playerId`
    - `scenariosCount`
    - `difficulty`
    - `contentType`

**ApexExplanation (runtime)**

- `scenarioId`
- `userDecision`
- `apexDecision`
- `activatedNetworks[]`
- `rationale`
- `riskComment`
- `isNoAction`

***

### 6.2. Flux principaux

**Solo – Flux**

1. Accueil → Mode solo.
2. Nom → Paramètres solo.
3. Paramètres solo → Génération de scénarios → Écran de jeu.
4. Décision utilisateur → Écran explicatif Apex 10s.
5. Passage au scénario suivant jusqu’au N.
6. Résultats + formulaire email (lead).

**Multijoueur – Flux**

1. Accueil → Mode multijoueur.
2. Nom host → Création salle + code.
3. Autres joueurs rejoignent (code/lien).
4. Vote des paramètres.
5. Host valide → Génération des scénarios → Écran de jeu synchronisé.
6. Chaque tour :
    - Décision de tous les joueurs.
    - Écran explicatif Apex (affiché à tous, synchronisé).
    - Mise à jour scores.
7. Fin → Résultats + gagnant + CTA bêta.

***

## 7. Gamification \& Scoring

**Scores**

- Base :
    - Si décision utilisateur alignée avec Apex → +100.
    - Sinon → 0 ou pénalité (par ex. -30).
- Bonus :
    - Streak de bonnes décisions : +20 / série.
    - Bonus “Discipline” si l’utilisateur choisit “Stable / Incertain” et que Apex = “Hold”.
- Feedback :
    - À la fin de la partie :
        - `% de décisions alignées avec Apex`.
        - Nombre de fois où Apex a choisi “Ne pas agir”.

**Récompense**

- Mode multi :
    - Gagnant = meilleur score.
    - Message clair : “Tu débloques l’accès bêta à Apex + communauté.”
- Mode solo :
    - Si score > seuil (ex. 60% d’alignement) : message “Tu es éligible pour rejoindre la bêta”.
- CTA :
    - Formulaire `email`.
    - QR code affiché sur l’écran pour smartphone.

***

## 8. UX / UI – Principes

- **Clarté d’abord** :
    - Tous les écrans explicites, phrases courtes.
- **Débutants** :
    - Glossaire implicite via tooltips / textes :
        - “Haussier = prix monte.”
        - “Volatilité = variation rapide du prix.”
- **Experts** :
    - Option “Voir plus de détails” (par ex. sous l’explication Apex) :
        - Mention de “régime de marché”, “risque asymétrique”, etc.
- **Kiosque** :
    - Full-screen, peu de scroll.
    - Actions principales au centre / bas.
- **Accessibilité** :
    - Contrastes élevés.
    - Textes lisibles, taille minimale confortable.

***

## 9. Règles de difficulté

**Débutant**

- Scénarios visuellement évidents (tendances claires).
- Explications plus longues, langage simple.
- Apex choisit plus souvent “hold” pour illustrer la prudence.

**Intermédiaire**

- Plus de faux signaux, volatilité.
- Explications intermédiaires, plus de vocabulaire technique.

**Expert**

- Scénarios complexes, multiples signaux contradictoires.
- Apex plus souvent actif (buy/sell) mais avec explication risque.
- Plus de “non-action stratégique”.

***

## 10. Mesures de succès (KPIs)

- Quantitatifs :
    - 
# de parties lancées / jour de salon.

    - 
# de parties complétées.

    - Taux de conversion email.
    - Temps moyen passé par session.
- Qualitatifs :
    - Feedback sales / visiteurs.
    - Clarté perçue de la philosophie Apex.

***

## 11. Portée de la V1 (MVP)

Inclure dans la V1 :

- Tous les écrans décrits (home → résultats).
- Mode solo complet.
- Mode multijoueur simple (2–4 joueurs) avec vote de paramètres.
- Scénarios mock (pré-enregistrés).
- Explications Apex prédéfinies par scénario.
- Formulaire email + intégration simple (liste beta).

Exclure (V2+) :

- Connexion à un vrai moteur Apex live.
- Données marché en temps réel.
- Persistance des comptes utilisateurs.
- Personnalisation avancée pour chaque salon.

***

Si tu veux, je peux maintenant transformer ce PRD en **checklist de développement** (roadmap sprint par sprint) ou en **diagramme de flux textuel** que tu pourras donner directement à ton dev / à Google AI Studio.

