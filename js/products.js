// js/products.js
// Single source of truth pro produktova data.
// Phase 2 prida property "type" pro ucel akce 3+1 (uterky vs zastera).
// Phase 2 prida tlacitko "Pridat do kosiku" — zatim pouze vizualni karta.

const PRODUCTS = [
  {
    id: 'kopretina',
    name: 'Utěrka Kopretina',
    price: 380,
    image: 'fotky/20251208_185910.jpg',
    description: 'Luční kopretiny na přírodním lnu. Jemný motiv ve třech barvách.',
    material: '100% český len',
    type: 'uterka'
  },
  {
    id: 'vlci-mak',
    name: 'Utěrka Vlčí mák',
    price: 380,
    image: 'fotky/20251208_190226.jpg',
    description: 'Rudý květ vlčího máku s listy. Výrazný a elegantní.',
    material: '100% český len',
    type: 'uterka'
  },
  {
    id: 'siska',
    name: 'Utěrka Šiška s větvičkou',
    price: 380,
    image: 'fotky/20251208_190438.jpg',
    description: 'Detailní šiška s jehličím. Ideální dárek pro milovníky přírody.',
    material: '100% český len',
    type: 'uterka'
  },
  {
    id: 'zastera',
    name: 'Zástěra',
    price: 890,
    image: 'fotky/20251115_111917.jpg',
    description: 'Lněná zástěra s kopretinou a humorem. \u201eNemám šajnu co z toho bude.\u201c',
    material: '100% český len',
    type: 'zastera'
  }
];
