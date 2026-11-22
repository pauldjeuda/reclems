# Guide de mise en service

Ce guide configure la pétition dans l’ordre. Les menus des consoles changent parfois : cherchez l’option équivalente si un libellé a évolué. Gardez `staging` séparé de `prod` et n’utilisez jamais de données réelles en Preview.

## A. Comptes à préparer

- [ ] GitHub avec dépôt privé.
- [ ] Compte Google pour Firebase et l’administration.
- [ ] Vercel.
- [ ] Cloudflare pour Turnstile.
- [ ] Brevo ou Resend pour les e-mails.
- [ ] Upstash pour Redis.
- [ ] Registrar pour le domaine.
- [ ] Java 21 ou version prise en charge pour les émulateurs Firebase locaux (`java -version`).

Activez l’authentification à deux facteurs sur les comptes administrateurs et conservez les secrets dans un gestionnaire sécurisé.

## B. Firebase — staging et production

Créez deux projets, par exemple `petition-citoyenne-staging` et `petition-citoyenne-prod`. Répétez les étapes ci-dessous pour chaque projet.

1. Dans [Firebase Console](https://console.firebase.google.com/), **Ajouter un projet** ; désactivez Google Analytics si proposé.
2. **Build → Firestore Database → Créer une base de données** ; choisissez le mode production.
3. Choisissez la région Firestore, par exemple `europe-west1`. **Ce choix est irréversible** ; confirmez résidence, transferts et obligations juridiques avant de valider.
4. **Build → Authentication → Commencer → Sign-in method → Google → Activer** et renseignez l’adresse d’assistance.
5. Dans **Authentication → Settings → Authorized domains**, ajoutez le domaine final et le domaine `*.vercel.app` exact du projet.
6. Dans **Paramètres du projet → Général → Vos applications → Web (`</>`)**, créez l’application et copiez la configuration vers `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
7. Dans **Paramètres du projet → Comptes de service**, générez une clé privée uniquement si nécessaire. Reportez `project_id`, `client_email`, `private_key` dans les variables Vercel. Supprimez le JSON téléchargé du poste ensuite ; ne l’ajoutez jamais au dépôt.
8. En local : `npm install -g firebase-tools`, `firebase login`, sélectionnez le bon projet puis `firebase deploy --only firestore:rules,firestore:indexes`.
9. Surveillez l’usage, les quotas et les coûts Firestore depuis la console.
10. Activez le MFA du compte Google administrateur.

## C. Turnstile

Dans Cloudflare, ouvrez **Turnstile → Add widget** (ou l’option équivalente). Saisissez le domaine final et `localhost`, choisissez le mode **Managed**, puis renseignez `NEXT_PUBLIC_TURNSTILE_SITE_KEY` et `TURNSTILE_SECRET_KEY`. Utilisez les clés de test seulement en développement ou en Preview.

## D. E-mail transactionnel

1. Choisissez Brevo ou Resend et créez un compte.
2. Ajoutez et vérifiez le domaine d’envoi.
3. Publiez chez le registrar les enregistrements SPF, DKIM et DMARC indiqués par le fournisseur.
4. Créez une clé API et configurez `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM`, `CONTACT_EMAIL`.
5. Vérifiez les quotas du plan choisi, la délivrabilité auprès de Gmail/Yahoo/Orange et le dossier spam.

## E. Upstash

Créez une base Redis (REST) dans une région proche. Configurez `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`. Sans ces variables, le développement utilise un limiteur mémoire ; en production, configurez Redis pour partager les limites entre instances.

## F. GitHub et Vercel

1. Créez un dépôt GitHub privé et poussez ce projet.
2. Dans Vercel, **Add New → Project**, importez le dépôt et choisissez Next.js.
3. Configurez toutes les variables de `.env.example` dans les environnements Vercel. **Production** pointe vers Firebase prod ; **Preview** pointe vers staging, clés Turnstile de test et données fictives.
4. Exécutez `pnpm gen:secrets` pour produire `EMAIL_PEPPER`, `IP_PEPPER`, `UNSUB_SECRET` et `CRON_SECRET`. Sauvegardez `EMAIL_PEPPER` séparément dans un gestionnaire de mots de passe. **Ne le changez jamais après le lancement sans migration contrôlée.**
5. Déployez et vérifiez le cron `/api/cron/cleanup` dans **Settings → Cron Jobs**.
6. Dans **Settings → Domains**, ajoutez le domaine ; copiez chez le registrar les enregistrements DNS exactement comme Vercel les affiche, puis attendez le certificat HTTPS.
7. Mettez `NEXT_PUBLIC_SITE_URL` à jour avec l’URL finale, ajoutez le domaine à Turnstile et aux domaines autorisés Firebase, puis redéployez.
8. Vérifiez les conditions actuelles du plan Vercel gratuit avant usage.

## G. Vérifications après déploiement

- [ ] Signer avec une adresse contrôlée, recevoir le courriel, confirmer et vérifier le compteur.
- [ ] Réessayer la même adresse ; la réponse doit rester identique et aucun nouveau courriel ne doit partir avant le délai de renvoi.
- [ ] Tester le retrait complet.
- [ ] Tester le formulaire de contact et le désabonnement depuis un courriel réel.
- [ ] Connexion admin avec un compte autorisé ; vérifier qu’un compte non autorisé est refusé.
- [ ] Télécharger un export agrégé et vérifier qu’il ne contient aucune donnée personnelle.
- [ ] Vérifier le rendu WhatsApp/Facebook, Lighthouse mobile, la simulation réseau lent et les deux langues.
- [ ] Tester Turnstile, honeypot et limites de débit avec prudence sur les réseaux mobiles partagés.
- [ ] Planifier des exports complets réguliers et stocker les fichiers chiffrés hors du dépôt.

## Retour arrière

Dans Vercel, ouvrez **Project → Deployments**, choisissez le dernier déploiement sain et utilisez **Promote to Production** (ou l’option de rollback équivalente). Vérifiez ensuite `/api/health`, la page publique et les journaux. Ne restaurez pas une version qui nécessite une migration de données inverse sans plan séparé.
