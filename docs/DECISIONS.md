# Décisions

## Choix produit et techniques

- Application App Router en Next.js 16, React 19 et TypeScript strict ; pnpm gère les dépendances.
- Les URL publiques portent la langue (`/fr` et `/en`) avec `next-intl`. Les pages françaises sont l’original éditorial ; la version anglaise vise une traduction fidèle.
- Firestore et `firebase-admin` restent exclusivement côté serveur. Les règles refusent tout accès direct depuis un client.
- En développement, Firebase Emulator Suite, les clés de test Turnstile, une limitation de débit mémoire et le fournisseur e-mail console permettent le parcours public sans secret de production.
- Une adresse e-mail normalisée et hachée par HMAC identifie chaque document. Les jetons de vérification et de retrait sont aléatoires et stockés sous forme hachée.
- Les chiffres de la pétition sont issus des faits et sources fournis. Le fait de novembre 2026 a été vérifié sur la source citée avant intégration. Les sources restent visibles auprès de chaque affirmation.
- Aucun logo, style de marque ou visuel Orange n’est utilisé. L’illustration du héros est un SVG original en niveaux de gris ; la police est système pour éviter un chargement externe.
- La politique CSP utilise un nonce généré par `src/proxy.ts` pour les scripts Next.js et limite les hôtes Google aux chemins admin ; les styles en ligne restent autorisés pour les styles React. L’injection du nonce peut faire rendre les pages à la demande ; mesurer ce compromis avec Lighthouse avant de chercher à rétablir l’ISR.
- Firestore est configuré pour la région Europe `europe-west1` dans le guide, mais le projet réel et la région finale doivent être confirmés avant sa création (le choix est irréversible).

## Limites connues et périmètre v1

- La signature exige une adresse e-mail. Une partie du public camerounais utilise surtout WhatsApp ou le téléphone ; la vérification SMS/WhatsApp serait payante et reste à étudier.
- Commentaires publics, témoignages publiés, mode sombre, application mobile et paiement/dons sont hors périmètre v1.
- Les modèles juridiques et coordonnées de l’éditeur sont des placeholders. Une validation juridique est requise avant publication.
- Les métriques sont basées sur les signatures conservées dans Firestore ; la remise publique reste agrégée.
