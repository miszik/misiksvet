// js/products.js
// Single source of truth pro produktova data.
// Phase 2 prida property "type" pro ucel akce 3+1 (uterky vs zastera).
// Phase 2 prida tlacitko "Pridat do kosiku" — zatim pouze vizualni karta.

const PRODUCTS = [
  {
    id: 'kopretina',
    name: 'Utěrka Kopretina',
    price: 380,
    image: 'fotky/kopretina.webp',
    images: ['fotky/kopretina.webp', 'fotky/kopretina-baleni.webp'],
    description: 'Luční kopretiny na přírodním lnu. Jemný motiv ve třech barvách.',
    material: '100% len',
    size: '40 × 70 cm',
    properties: ['Vysoce savá', 'Rychle schne', 'Antibakteriální', 'Změkčuje se praním'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Kuchyňská utěrka, dekorace, prostírka, obal na chléb.',
    type: 'uterka'
  },
  {
    id: 'vlci-mak',
    name: 'Utěrka Vlčí mák',
    price: 380,
    image: 'fotky/vlci-mak.webp',
    images: ['fotky/vlci-mak.webp', 'fotky/vlci-mak-baleni.webp'],
    description: 'Rudý květ vlčího máku s listy. Výrazný a elegantní.',
    material: '100% len',
    size: '40 × 70 cm',
    properties: ['Vysoce savá', 'Rychle schne', 'Antibakteriální', 'Změkčuje se praním'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Kuchyňská utěrka, dekorace, prostírka, obal na chléb.',
    type: 'uterka'
  },
  {
    id: 'siska',
    name: 'Utěrka Šiška s větvičkou',
    price: 380,
    image: 'fotky/siska.webp',
    images: ['fotky/siska.webp', 'fotky/siska-baleni.webp'],
    description: 'Detailní šiška s jehličím. Ideální dárek pro milovníky přírody.',
    material: '100% len',
    size: '40 × 70 cm',
    properties: ['Vysoce savá', 'Rychle schne', 'Antibakteriální', 'Změkčuje se praním'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Kuchyňská utěrka, dekorace, prostírka, obal na chléb.',
    type: 'uterka'
  },
  {
    id: 'zastera',
    name: 'Zástěra',
    price: 890,
    image: 'fotky/zastera.webp',
    images: ['fotky/zastera.webp', 'fotky/20251115_111917.webp'],
    description: 'Zástěra s kopretinou a humorem. \u201eNemám šajnu co z toho bude.\u201c S praktickou kapsičkou.',
    material: '85 % bavlna, 15 % len',
    size: null,
    properties: ['S kapsičkou', 'Pevná a odolná', 'Příjemná na dotek'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Vaření, pečení, zahradničení — nebo jen jako módní doplněk do kuchyně.',
    type: 'zastera'
  }
];
