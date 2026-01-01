so now i want to introduce a whole new system to my platform :
affiliate system:
The new affiliate system will allow users to earn commissions by promoting our products and services. Here’s how it will work:
-US1 - Créer un affilié:
En tant qu’admin, je veux pouvoir créer un affilié (nom, prénom, pseudo, email, téléphone, % commission) afin de lui donner accès à son espace affilié.

✅ Critères d’acceptation :

Formulaire de création avec les champs obligatoires.

Validation email unique.

Génération auto des accès affilié.

Commission personnalisable (%).
-US1.2 – Modifier/Supprimer un affilié:
En tant qu’admin, je veux pouvoir éditer les infos d’un affilié ou le supprimer afin de garder mes données à jour.
✅ Champs éditables : pseudo, email, téléphone, commission.
✅ Confirmation avant suppression.

-US1.3 Valider une demande d’affilié (venant d’un autre affilié qui peut recommandé)

En tant qu’admin, je veux voir les demandes d’affiliés soumises par des affiliés deja accépté ayant l'option (recommandé un autre affilié activé) afin de les accepter ou refuser.
✅ Liste des demandes en attente.
✅ Bouton “Valider” → création affilié avec envoi d’accès.
✅ Bouton “Refuser” → notif au recommandeur.

-US2.1 – Onboarding obligatoire
En tant qu’affilié, je dois renseigner mes infos bancaires, société, et signer mon contrat pour activer mon compte.
✅ Accès bloqué tant que les 3 étapes non complètes.
✅ Signature stockée (scan/checkbox).

-US2.2 – Génération lien affilié
En tant qu’affilié, je veux avoir un lien unique APP_URL/affiliate/{affiliate_id}, affiliate_id doit pas etre l'ID dans la base de donnée , mais un identifiant unique et sécurisé pour promouvoir la plateforme.
✅ Lien affiché dans dashboard.
✅ Bouton “copier lien”.

-US2.3 – Dashboard affilié
En tant qu’affilié, je veux voir mes performances mensuelles (graphique + stats) afin de suivre mes gains.
✅ Filtre mois.
✅ Graphique gains/mois (axe X = mois, Y = montant).
✅ Statistiques : clics, ventes, commissions (€), abonnés actifs, taux conversion.

-US2.4 – Infos personnelles
En tant qu’affilié, je veux modifier mes infos bancaires, société, personnelles.

-US2.5 – Factures affilié
En tant qu’affilié, je veux voir mes factures mensuelles et leur statut afin de suivre mes paiements.
✅ Factures générées auto chaque mois.
✅ Statut : réglée / en attente.
✅ Téléchargement PDF.

-US2.6 – Attribution permanente
En tant qu’affilié, je veux que tout client arrivé par mon lien reste toujours lié à moi afin d’avoir mes commissions à vie.
✅ Logique de tag immuable → aucune réattribution possible.
