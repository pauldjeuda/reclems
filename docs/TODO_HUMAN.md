# Actions humaines restantes

## Avant toute publication

- [ ] Revérifier chaque fait et lien avant publication ; ajouter un comparatif de prix sourcé si disponible.
- [ ] Faire relire les pages Confidentialité et Mentions légales par un juriste camerounais.
- [ ] Vérifier les formalités de déclaration/autorisation auprès de l’autorité de protection des données et son nom exact, son adresse et ses modalités de saisine.
- [ ] Choisir et inscrire la durée de conservation des signatures confirmées.
- [ ] Renseigner `[NOM / ASSOCIATION]`, l’adresse, le directeur de publication, `[CONTACT_EMAIL]`, `[PRESSE_EMAIL]`, `[NUMÉRO]` et `[DÉLAI]` ; confirmer la déclaration d’indépendance.
- [ ] Confirmer la région réelle de Firestore et décrire les transferts internationaux de données avec conseil juridique.
- [ ] Faire valider la mention de non-affiliation et l’usage nominatif de la marque par un juriste.
- [ ] Fournir/autoriser les coordonnées de contact définitives ; ne pas publier les placeholders.

## Comptes et configuration externe

- [ ] Créer les projets Firebase `prod` et `staging`, choisir une région Europe définitive, activer Google Sign-In pour l’administration, et ajouter les domaines autorisés.
- [ ] Déployer les règles et index Firestore dans chacun des projets ; vérifier les quotas et budgets.
- [ ] Définir les e-mails administrateurs dans `ADMIN_EMAILS` et activer le MFA de leurs comptes Google.
- [ ] Créer le widget Cloudflare Turnstile et mettre les clés réelles en production.
- [ ] Choisir Brevo ou Resend, vérifier le domaine d’envoi, puis publier SPF, DKIM et DMARC.
- [ ] Créer Upstash Redis et configurer les variables d’environnement.
- [ ] Créer les environnements Preview et Production sur Vercel ; Preview doit utiliser uniquement Firebase `staging` et des données fictives.
- [ ] Configurer domaine, HTTPS, surveillance `/api/health`, alertes Vercel et les variables d’environnement depuis `.env.example`.
- [ ] Générer les secrets avec `pnpm gen:secrets`, les conserver dans un gestionnaire de secrets et sauvegarder `EMAIL_PEPPER` séparément.
- [ ] Planifier et tester des exports complets réguliers ; conserver les sauvegardes chiffrées hors du dépôt.

## Recette avant mise en ligne

- [ ] Suivre `docs/SETUP.md`, puis tester signature, vérification e-mail, anti-doublon, retrait, contact, désabonnement et accès admin avec les vrais fournisseurs.
- [ ] Tester les messages FR/EN et l’aperçu de partage dans WhatsApp et Facebook.
- [ ] Examiner les captures d’écran fournies dans `docs/screenshots/` (360, 768 et 1280 px pour l’accueil, `/contact`, `/merci`, `/verify` et l’administration) et compléter la recette visuelle avant publication.
- [ ] Mesurer Lighthouse mobile, vérifier l’accessibilité clavier/lecteur d’écran, les contrastes et `prefers-reduced-motion`.
- [ ] Simuler une connexion lente et des soumissions abusives ; vérifier les limites adaptées aux IP partagées/CGNAT.
- [ ] Vérifier les index Firestore en Preview avec des données fictives, les exports et l’impression du dossier de remise.
- [ ] Documenter les responsables de réponse et de restauration avant lancement.
