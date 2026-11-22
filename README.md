# Initiative citoyenne — pétition Orange Cameroun

Application bilingue FR/EN de signature d’une pétition citoyenne. Stack : Next.js App Router, TypeScript strict, Firestore/Firebase Admin, Firebase Auth pour l’administration, Turnstile, Upstash et fournisseur e-mail interchangeable.

## Démarrage local

1. Installez Node LTS, pnpm et Java 21+ (l’émulateur Firestore en dépend), puis `pnpm install`.
2. Copier `.env.example` vers `.env.local` (les valeurs locales permettent l’interface publique sans clé réelle).
3. `pnpm dev:emulators` dans un terminal.
4. `pnpm dev` dans un second terminal, puis ouvrir `http://localhost:3000/fr`.

Les e-mails sont imprimés dans la console avec l’adresse masquée ; en développement le jeton Turnstile de test est simulé. Firebase Emulator Suite doit être démarré pour les routes qui lisent Firestore.

## Commandes

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:rules`, `pnpm test:e2e`
- `pnpm gen:secrets` — génère les secrets à enregistrer dans un gestionnaire sécurisé.
- `pnpm build && pnpm start` — production locale.

Les étapes Firebase, Vercel, Turnstile, e-mail, Upstash et domaine figurent dans [docs/SETUP.md](docs/SETUP.md). Lire [docs/SECURITY.md](docs/SECURITY.md), [docs/DECISIONS.md](docs/DECISIONS.md) et [docs/TODO_HUMAN.md](docs/TODO_HUMAN.md) avant une publication.

## Structure

- `src/app/[locale]` : pages publiques FR/EN.
- `src/app/api` : API Next.js, logique serveur uniquement.
- `src/lib/firebase` : clients Firebase côté serveur et administration.
- `firestore.rules` : accès client interdit.
