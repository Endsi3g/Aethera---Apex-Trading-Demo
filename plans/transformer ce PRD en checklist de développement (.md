<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# transformer ce PRD en checklist de développement (roadmap sprint par sprint)

Voici une **checklist de développement** organisée en **4 sprints** (2 semaines chacun, à adapter).

***

## Sprint 1 – Fondations \& Navigation de base

**Objectif sprint :** Avoir une app React navigable avec les écrans principaux sans logique temps réel ni TradingView.

- [ ] Mettre en place le repo \& stack
    - [ ] Initialiser projet React + TypeScript.
    - [ ] Configurer Tailwind CSS (ou système de styles choisi).
    - [ ] Config ESLint + Prettier.
- [ ] Structure de navigation (state ou router simple)
    - [ ] Définir type `Screen` (`home`, `enterName`, `soloSettings`, `multiplayerLobby`, `game`, `apexExplanation`, `results`).
    - [ ] Implémenter composant racine `App` avec rendu conditionnel par `currentScreen`.
- [ ] Écran d’accueil
    - [ ] UI Hero avec logo, pitch Apex, boutons “Mode Solo” / “Mode Multijoueur”.
    - [ ] Handlers `handleSelectSolo()` et `handleSelectMultiplayer()` (maj de `selectedMode`, navigation vers `enterName`).
- [ ] Écran de saisie du nom
    - [ ] Composant `EnterNameScreen`.
    - [ ] Input nom + bouton “Continuer” (validation non vide).
    - [ ] Bouton “Retour” vers `home`.
    - [ ] Fonction `handleNameSubmit(name)` qui :
        - [ ] En mode solo → passe à `soloSettings`.
        - [ ] En mode multi → crée une session en local et passe à `multiplayerLobby`.
- [ ] Écran de paramètres solo (`SoloSettingsScreen`)
    - [ ] Type `GameSettings` (scénarios, difficulté, contentType).
    - [ ] Boutons pour 5/10/20 scénarios.
    - [ ] Boutons “Débutant / Intermédiaire / Expert”.
    - [ ] Boutons “Graphiques TradingView / Questions simples”.
    - [ ] Récap des paramètres.
    - [ ] Bouton “Lancer la partie solo” → navigation vers `game` (mock).
- [ ] Base de styles
    - [ ] Palette, typo, composants boutons réutilisables.
    - [ ] Layout responsive simple.

***

## Sprint 2 – Multijoueur local \& Paramètres de jeu

**Objectif sprint :** Avoir la salle d’attente multijoueur avec paramètres + votes en local (sans backend temps réel encore) et la structure des scénarios.

- [ ] Salle d’attente multijoueur (`MultiplayerLobbyScreen`)
    - [ ] Génération d’un `roomCode` local.
    - [ ] Affichage du code + lien partageable fictif.
    - [ ] Liste des joueurs (host + invités simulés).
    - [ ] Bouton “Simuler un joueur invité” (ajoute Guest1, Guest2…).
    - [ ] Bouton “Quitter la salle” (retour `home`, reset state).
- [ ] Astuces de trading
    - [ ] Tableau de 6–10 astuces débutants (texte).
    - [ ] Rotation auto (setInterval ou state) dans la salle d’attente.
- [ ] Paramètres + votes (multijoueur local)
    - [ ] Type `PlayerVotes`.
    - [ ] UI de vote pour :
        - [ ] Nombre de scénarios (5/10/20).
        - [ ] Difficulté (3 niveaux).
        - [ ] Type de contenu (charts/quiz).
    - [ ] Stocker votes par `playerId`.
    - [ ] Logique pour calculer `gameSettings` global (majorité, tie = valeur actuelle).
    - [ ] Affichage des paramètres retenus.
- [ ] Rôle de l’hôte
    - [ ] Déterminer `isHost` pour un joueur.
    - [ ] Bouton “Valider ces paramètres et démarrer la partie” visible uniquement host.
    - [ ] Handler `onLockSettings` (pour l’instant `console.log` + navigation vers `game`).
- [ ] Modèle `GameScenario`
    - [ ] Type `GameScenario`.
    - [ ] Fonction `generateMockScenarios(gameSettings)` (scénarios mock, quiz \& charts).
    - [ ] Stocker `scenarios[]` et `currentScenarioIndex` dans `App`.

***

## Sprint 3 – Écran de jeu \& Explication Apex (logique mock)

**Objectif sprint :** Boucle de jeu complète scénario → décision utilisateur → explication Apex 10s → scénario suivant → fin.

- [ ] Écran de jeu (`GameScreen`)
    - [ ] En-tête : mode, nom joueur, progression.
    - [ ] Affichage scénario courant (titre + description).
    - [ ] Zone contenu :
        - [ ] Si `contentType === "charts"` : placeholder graphique.
        - [ ] Si `contentType === "quiz"` : question textuelle.
    - [ ] Boutons de prédiction : monter / baisser / stable.
    - [ ] State `selectedDecision`.
    - [ ] Bouton “Valider ma décision” (désactivé sans choix).
    - [ ] Bouton “Quitter la partie” (reset + retour `home`).
- [ ] Logique `onSubmitDecision`
    - [ ] Fonction dans `App` appelée avec `scenarioId` et `decision`.
    - [ ] `console.log` initial.
    - [ ] Stockage `lastUserDecision` si besoin (ou dans `ApexExplanation`).
- [ ] Modèle `ApexExplanation`
    - [ ] Type `ApexDecision`, `ApexExplanation`.
    - [ ] État `currentApexExplanation` dans `App`.
- [ ] Générateur d’explication mock Apex
    - [ ] Fonction `generateMockApexExplanation(scenario, userDecision)`.
    - [ ] Génération d’une décision (buy / sell / hold, avec majorité de `hold` pour illustrer discipline).
    - [ ] Choix des réseaux activés (trend, momentum, structure).
    - [ ] Texte `rationale` (tendance + momentum + structure).
    - [ ] Texte `riskComment` (risque asymétrique + protection du capital).
- [ ] Écran explicatif (`ApexExplanationScreen`)
    - [ ] Affiche :
        - [ ] Décision utilisateur vs décision Apex.
        - [ ] Réseaux activés (badges).
        - [ ] Rationale (bloc texte).
        - [ ] RiskComment (bloc texte).
    - [ ] Badge / mise en avant si `isNoAction === true`.
    - [ ] Timer 10 secondes :
        - [ ] `useEffect` + `setTimeout(10000)`.
        - [ ] Compteur visuel ou barre de progression.
        - [ ] Pas de bouton “Suivant” / “Skip”.
- [ ] Logique `onExplanationComplete`
    - [ ] Si pas dernier scénario :
        - [ ] `currentScenarioIndex++`.
        - [ ] `currentScreen = "game"`.
    - [ ] Sinon :
        - [ ] `currentScreen = "results"`.
    - [ ] Reset `currentApexExplanation`.

***

## Sprint 4 – Scores, Résultats \& Intégration Beta

**Objectif sprint :** Score, leaderboard, écran de résultats, capture email et polish.

- [ ] Système de scoring
    - [ ] Type `UserDecision` → mapping vers ApexDecision pour scoring.
    - [ ] Règle simple :
        - [ ] Aligné avec Apex → +100 pts.
        - [ ] Non aligné → 0 ou -30.
    - [ ] Bonus streak :
        - [ ] Compteur de bonnes réponses consécutives.
    - [ ] Bonus “Discipline” :
        - [ ] Si utilisateur = stable \& Apex = hold → bonus.
    - [ ] Stocker score par joueur (`players[].score`).
- [ ] Leaderboard temps réel (multi)
    - [ ] Mise à jour des scores en fin de scénario.
    - [ ] Affichage classement (en haut ou côté du `GameScreen`, ou à l’écran Apex).
- [ ] Écran de résultats (`ResultsScreen`)
    - [ ] Solo :
        - [ ] Score final.
        - [ ] % d’alignement avec Apex.
        - [ ] \# de fois où Apex a choisi de ne pas agir.
    - [ ] Multi :
        - [ ] Classement complet.
        - [ ] Mise en avant du gagnant.
    - [ ] Textes pédagogiques :
        - [ ] Rappel philosophie Apex.
- [ ] Système de récompense \& conversion bêta
    - [ ] Formulaire email :
        - [ ] Champ email.
        - [ ] Validation de base.
    - [ ] Message de récompense :
        - [ ] “Tu débloques l’accès bêta Apex + communauté” (gagnant multi / bon score solo).
    - [ ] Intégration simple :
        - [ ] Endpoint backend pour stocker email.
        - [ ] Option : intégration Mailchimp / autre.
    - [ ] Affichage QR code vers landing page bêta.
- [ ] Intégration TradingView (V1 simple)
    - [ ] Intégrer widget TradingView en remplacement des placeholders.
    - [ ] Charger un graphique statique / script par scénario.
- [ ] Finitions UX/UI
    - [ ] Ajuster tailles de boutons pour tactile.
    - [ ] Vérifier responsive sur résolutions clés.
    - [ ] Ajout de micro-animations légères (hover, transitions).

***

## Sprint 5 (optionnel) – Temps réel \& Backend robuste

Si tu veux aller plus loin après le MVP front :

- [ ] Backend Node.js + Express
    - [ ] Modèle Session, Player, Scenario.
    - [ ] Endpoints pour créer / rejoindre salle.
- [ ] Socket.IO
    - [ ] Rooms par `roomCode`.
    - [ ] Sync joueurs (join/leave).
    - [ ] Broadcast votes, paramètres, décisions.
    - [ ] Synchronisation des timers d’écran Apex.
- [ ] Persistance minimale
    - [ ] Sauvegarder sessions pour analytics (durée, scores, etc.).

***

Si tu veux, je peux maintenant te donner une **version très courte de cette checklist** à coller comme “roadmap” dans Notion / Jira (format tickets synthétiques).

