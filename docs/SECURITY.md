# Sécurité et réponse à incident

## Mesures en place

- Firestore refuse toute lecture/écriture client ; l’API utilise `firebase-admin` côté serveur.
- E-mails normalisés identifiés par HMAC ; jetons aléatoires stockés sous forme SHA-256, à usage unique et à durée limitée.
- Le GET du lien de confirmation n’effectue aucune mutation. La confirmation passe par un bouton et un POST JSON avec contrôle d’origine.
- Vérification Turnstile, honeypot, domaines jetables, limites généreuses pour IP partagées et limites par e-mail.
- Messages de signature identiques pour éviter l’énumération ; les signatures non vérifiées ne sont pas comptées.
- Logs applicatifs structurés contenant le type d’événement et le nom d’erreur, sans e-mail ni IP en clair.
- E-mails HTML échappés, sans image distante ni suivi. Les pages de flux et d’administration portent `noindex`.

## Dépendances

- `pnpm audit --prod` ne signale aucune vulnérabilité connue. Les surcharges de versions dans `pnpm-workspace.yaml` corrigent les avis élevés ou critiques transitifs.
- L’audit complet conserve trois avis modérés sur le `stream-json` transitif de Firebase CLI. Forcer sa version 3 casse le CLI ; réévaluer après une mise à jour amont de Firebase CLI.

## Menaces et réponses

| Menace                | Mesure                                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Spam de signatures    | Turnstile, honeypot, rate limit IP et e-mail, confirmation e-mail, revue des signalements.                                    |
| Énumération d’e-mails | Même réponse publique pour les signatures existantes et nouvelles ; aucune adresse retournée par l’API publique.              |
| Scanners de liens     | Le GET de vérification est sans effet ; seul le POST déclenché par l’utilisateur confirme.                                    |
| Fuite de données      | Aucun accès Firestore client, données minimales, e-mails masqués dans l’administration, export complet réservé et journalisé. |
| Compromission admin   | Liste d’e-mails autorisés, cookie HttpOnly/SameSite Strict de 8 h, vérification des sessions côté serveur, MFA à activer.     |
| Abus API / CSRF       | Zod côté serveur, JSON seulement, vérification Origin et limites par route.                                                   |

## Sauvegarde et rotation

- L’export complet CSV de l’administration est une sauvegarde et reste soumis à une confirmation `EXPORTER`. Stocker le fichier chiffré et séparément du dépôt.
- `scripts/import.ts --dry-run` valide un CSV avant import. L’écriture exige `--apply --confirm IMPORTER`.
- `scripts/migrate-pepper.ts` recalcule les identifiants HMAC depuis les e-mails conservés. Faire une sauvegarde avant rotation ; mettre à jour toutes les références liées aux identifiants.
- **Ne jamais changer `EMAIL_PEPPER` après le lancement sans migration contrôlée.**

## Réponse à incident

1. Détecter et consigner l’heure, le système concerné, les comptes touchés et les journaux disponibles sans recopier de secrets.
2. Isoler : fermer la pétition (`isOpen=false`), retirer temporairement les routes concernées si nécessaire, révoquer les sessions Firebase et bloquer les comptes admin compromis.
3. Faire tourner les clés exposées : compte de service Firebase, clés e-mail, Turnstile, `CRON_SECRET`, `UNSUB_SECRET`, clés Upstash et autres secrets. Migrer les identifiants si `EMAIL_PEPPER` a été compromis.
4. Déterminer quelles données ont été consultées, exportées ou modifiées ; préserver les éléments nécessaires à l’enquête.
5. Avec le conseil juridique, informer les personnes concernées et l’autorité compétente si la loi l’exige.
6. Restaurer une sauvegarde vérifiée, rouvrir la pétition et documenter les mesures correctives.
