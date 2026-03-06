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
    description: 'Luční kopretiny na přírodním lnu. Jemný motiv ve třech barvách.',
    material: '100% český len',
    type: 'uterka'
  },
  {
    id: 'vlci-mak',
    name: 'Utěrka Vlčí mák',
    price: 380,
    image: 'fotky/vlci-mak.webp',
    description: 'Rudý květ vlčího máku s listy. Výrazný a elegantní.',
    material: '100% český len',
    type: 'uterka'
  },
  {
    id: 'siska',
    name: 'Utěrka Šiška s větvičkou',
    price: 380,
    image: 'fotky/siska.webp',
    description: 'Detailní šiška s jehličím. Ideální dárek pro milovníky přírody.',
    material: '100% český len',
    type: 'uterka'
  },
  {
    id: 'zastera',
    name: 'Zástěra',
    price: 890,
    image: 'fotky/zastera.webp',
    description: 'Lněná zástěra s kopretinou a humorem. \u201eNemám šajnu co z toho bude.\u201c',
    material: '100% český len',
    type: 'zastera'
  }
];
