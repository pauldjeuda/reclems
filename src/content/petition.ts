export const petition = {
  fr: {
    title: 'Orange Cameroun : un service à la hauteur de ce que nous payons',
    intro:
      'Nous, abonnés d’Orange Cameroun, citoyens de toutes les régions du pays, constatons que le service ne correspond pas à ce que nous payons : réseau instable ou absent hors des grandes villes, appels coupés, Internet lent, forfaits plus chers que dans d’autres pays, et achats de forfaits débités sans être livrés. Malgré les sanctions de l’ART, les problèmes persistent.',
    requests: [
      'Une qualité de réseau conforme aux obligations légales sur tout le territoire, avec un calendrier public de déploiement (zones rurales et axes routiers inclus).',
      'Des tarifs plus justes : révision à la baisse des prix des forfaits, avec une comparaison publique avec les pays de la région.',
      'Le remboursement automatique et rapide de tout montant débité pour un forfait non reçu, et le remboursement des données perdues lors des coupures.',
      'Un service client réactif : traitement des réclamations sous un délai fixé et publié.',
      'Une transparence totale : rapports publics trimestriels sur la qualité et les réclamations traitées.'
    ],
    closing:
      'Nous ne demandons pas une faveur, mais le respect des engagements d’un opérateur envers ses clients.'
  },
  en: {
    title: 'Orange Cameroon: service that meets the price we pay',
    intro:
      'We, Orange Cameroon subscribers and citizens from every region of the country, find that the service does not match what we pay for: unstable or absent coverage outside major cities, dropped calls, slow internet, bundles that cost more than in other countries, and bundle purchases charged without being delivered. Despite sanctions by the ART, problems persist.',
    requests: [
      'Network quality that meets legal obligations throughout the country, with a public rollout schedule that includes rural areas and road corridors.',
      'Fairer prices: lower bundle prices, with a public comparison with countries in the region.',
      'Automatic and prompt refunds for any amount charged for a bundle not received, and for data lost during outages.',
      'Responsive customer service: complaints handled within a set and published timeframe.',
      'Full transparency: quarterly public reports on quality and complaints handled.'
    ],
    closing:
      'We are not asking for a favor, but for an operator to honor its commitments to its customers.'
  }
} as const;

export const contextFacts = [
  {
    fr: 'En juillet 2025, l’ART a sanctionné Orange Cameroun et MTN Cameroun, au total 2,6 milliards FCFA, pour manquements à leurs engagements (couverture, qualité de service).',
    en: 'In July 2025, the ART sanctioned Orange Cameroon and MTN Cameroon a combined CFAF 2.6 billion for breaches of their commitments (coverage and service quality).',
    source:
      'https://itweb.africa/article/cameroon-sanction-telcos-over-quality-of-service/RgeVDMPRLjPvKJN3'
  },
  {
    fr: 'En novembre 2026, l’ART a relevé 29 manquements réglementaires d’Orange Cameroun, évalués à 5,8 milliards FCFA ; Orange a promis d’améliorer son réseau.',
    en: 'In November 2026, the ART identified 29 regulatory violations by Orange Cameroon, valued at CFAF 5.8 billion; Orange pledged to improve its network.',
    source:
      'https://www.wearetech.africa/en/fils-uk/news/telecom/cameroon-orange-pledges-network-improvements-after-regulator-flags-10-million-in-violations'
  },
  {
    fr: 'Les abonnés continuent de signaler coupures, appels qui n’aboutissent pas, lenteur d’Internet et forfaits qui s’épuisent vite.',
    en: 'Subscribers continue to report outages, calls that fail to connect, slow internet and bundles that run out quickly.',
    source:
      'https://osiris.sn/cameroun-malgre-les-sanctions-la-qualite-des-reseaux-mobiles-reste-contestee.html'
  },
  {
    fr: 'Le cadre légal invoqué par le régulateur : décret n° 2013/0399 du 27 février 2013 (service de qualité, accessible et régulier sur l’ensemble du territoire).',
    en: 'The regulator cites Decree No. 2013/0399 of 27 February 2013, which provides for quality, accessible and regular service throughout the country.',
    source:
      'https://www.osiris.sn/cameroun-le-regulateur-inflige-une-amende-de-4-6-millions-a-orange-et-mtn.html'
  }
];
