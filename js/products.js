// js/products.js
// Single source of truth pro produktova data.
// visible: false = produkt je pripraveny, ale nezobrazuje se na webu.

const PRODUCTS = [
  {
    id: 'hermanek',
    name: 'Utěrka Heřmánek',
    price: 380,
    image: 'fotky/nove/hermanek_hezka.JPG',
    images: [
      'fotky/nove/hermanek_hezka.JPG',
      'fotky/nove/hermanek_balicek.JPG',
      'fotky/nove/hermanek_detail.JPG',
      'fotky/nove/hermanek_plot.JPG',
      'fotky/nove/hermanek_plot_detail.JPG'
    ],
    description: 'Jemné luční heřmánky na přírodním lnu. Světlý a vzdušný motiv plný léta.',
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
    image: 'fotky/nove/mak_hezka.JPG',
    images: [
      'fotky/nove/mak_hezka.JPG',
      'fotky/nove/mak_balicek.JPG',
      'fotky/nove/mak_detail.JPG',
      'fotky/nove/mak_plot.JPG',
      'fotky/nove/mak_plot_detail.JPG'
    ],
    description: 'Rudý květ vlčího máku na přírodním lnu. Výrazný a elegantní motiv plný léta.',
    material: '100% len',
    size: '40 × 70 cm',
    properties: ['Vysoce savá', 'Rychle schne', 'Antibakteriální', 'Změkčuje se praním'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Kuchyňská utěrka, dekorace, prostírka, obal na chléb.',
    type: 'uterka'
  },
  {
    id: 'vlci-bob',
    name: 'Utěrka Vlčí bob',
    price: 380,
    image: 'fotky/nove/vlci-bob_hezka.JPG',
    images: [
      'fotky/nove/vlci-bob_hezka.JPG',
      'fotky/nove/vlci-bob_balicek.JPG',
      'fotky/nove/vlci-bob_detail.JPG',
      'fotky/nove/vlci-bob_plot.JPG',
      'fotky/nove/vlci-bob_plot_detail.JPG'
    ],
    description: 'Vysoký vlčí bob s fialovými klasy. Impozantní motiv plný letní energie.',
    material: '100% len',
    size: '40 × 70 cm',
    properties: ['Vysoce savá', 'Rychle schne', 'Antibakteriální', 'Změkčuje se praním'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Kuchyňská utěrka, dekorace, prostírka, obal na chléb.',
    type: 'uterka'
  },
  {
    id: 'jirnice-modra',
    name: 'Utěrka Jirnice modrá',
    price: 380,
    image: 'fotky/nove/jirnice-modra_hezka.JPG',
    images: [
      'fotky/nove/jirnice-modra_hezka.JPG',
      'fotky/nove/jirnice-modra_balicek.JPG',
      'fotky/nove/jirnice-modra_detail.JPG',
      'fotky/nove/jirnice-modra_plot.JPG',
      'fotky/nove/jirnice-modra_plot_detail.JPG'
    ],
    description: 'Modrá jirnice s jemným listozím. Elegantní motiv české přírody.',
    material: '100% len',
    size: '40 × 70 cm',
    properties: ['Vysoce savá', 'Rychle schne', 'Antibakteriální', 'Změkčuje se praním'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Kuchyňská utěrka, dekorace, prostírka, obal na chléb.',
    type: 'uterka'
  },
  {
    id: 'vitod',
    name: 'Utěrka Vítod',
    price: 380,
    image: 'fotky/nove/vitod_detail.JPG',
    imagePosition: 'center top',
    images: [
      'fotky/nove/vitod_hezka.JPG',
      'fotky/nove/vitod_balicek.JPG',
      'fotky/nove/vitod_detail.JPG',
      'fotky/nove/vitod_plot.JPG',
      'fotky/nove/vitod_plot_detail.JPG'
    ],
    description: 'Luční vítod s drobnými kvítky. Jemný přírodní motiv plný klidu.',
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
    image: 'fotky/stare/siska.webp',
    images: ['fotky/stare/siska.webp', 'fotky/stare/siska-baleni.webp'],
    description: 'Detailní šiška s jehličím. Ideální dárek pro milovníky přírody.',
    material: '100% len',
    size: '40 × 70 cm',
    properties: ['Vysoce savá', 'Rychle schne', 'Antibakteriální', 'Změkčuje se praním'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Kuchyňská utěrka, dekorace, prostírka, obal na chléb.',
    type: 'uterka'
  },
  {
    id: 'vicenec',
    name: 'Utěrka Vičenec',
    price: 380,
    image: 'fotky/nove/vicenec_hezka.JPG',
    images: [
      'fotky/nove/vicenec_hezka.JPG',
      'fotky/nove/vicenec_balicek.JPG',
      'fotky/nove/vicenec_detail.JPG',
      'fotky/nove/vicenec_plot.JPG',
      'fotky/nove/vicenec_plot_detail.JPG'
    ],
    description: 'Růžové kvítky vičence na lněném podkladu. Jemný a roztomilý motiv.',
    material: '100% len',
    size: '40 × 70 cm',
    properties: ['Vysoce savá', 'Rychle schne', 'Antibakteriální', 'Změkčuje se praním'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Kuchyňská utěrka, dekorace, prostírka, obal na chléb.',
    type: 'uterka',
    visible: false
  },
  {
    id: 'kakost',
    name: 'Utěrka Kakost',
    price: 380,
    image: 'fotky/nove/kakost_hezka.JPG',
    images: [
      'fotky/nove/kakost_hezka.JPG',
      'fotky/nove/kakost_balicek.JPG',
      'fotky/nove/kakost_detail.JPG',
      'fotky/nove/kakost_plot.JPG',
      'fotky/nove/kakost_plot_detail.JPG'
    ],
    description: 'Luční kakost s fialovými okvětními lístky. Osvěžující přírodní motiv.',
    material: '100% len',
    size: '40 × 70 cm',
    properties: ['Vysoce savá', 'Rychle schne', 'Antibakteriální', 'Změkčuje se praním'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Kuchyňská utěrka, dekorace, prostírka, obal na chléb.',
    type: 'uterka',
    visible: false
  },
  {
    id: 'lichorerisnice',
    name: 'Utěrka Lichořeřišnice',
    price: 380,
    image: 'fotky/nove/lichorerisnice_hezka.JPG',
    images: [
      'fotky/nove/lichorerisnice_hezka.JPG',
      'fotky/nove/lichorerisnice_balicek.JPG',
      'fotky/nove/lichorerisnice_detail.JPG',
      'fotky/nove/lichorerisnice_plot.JPG',
      'fotky/nove/lichorerisnice_plot_detail.JPG'
    ],
    description: 'Zářivá lichořeřišnice v plném rozkvětu. Radostný motiv plný barev.',
    material: '100% len',
    size: '40 × 70 cm',
    properties: ['Vysoce savá', 'Rychle schne', 'Antibakteriální', 'Změkčuje se praním'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Kuchyňská utěrka, dekorace, prostírka, obal na chléb.',
    type: 'uterka',
    visible: false
  },
  {
    id: 'zastera',
    name: 'Zástěra',
    price: 890,
    image: 'fotky/stare/zastera.webp',
    images: ['fotky/stare/zastera.webp', 'fotky/stare/20251115_111917.webp'],
    description: 'Zástěra s kopretinou a humorem. \u201eNemám šajnu co z toho bude.\u201c S praktickou kapsičkou.',
    material: '85 % bavlna, 15 % len',
    size: null,
    properties: ['S kapsičkou', 'Pevná a odolná', 'Příjemná na dotek'],
    care: ['Prát na 40 °C', 'Nebělit', 'Nesušit v sušičce', 'Lze žehlit'],
    uses: 'Vaření, pečení, zahradničení — nebo jen jako módní doplněk do kuchyně.',
    type: 'zastera'
  }
];
