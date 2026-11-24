/**
 * AutoHub 2026 - Master White-Label Application Engine
 * Supports 4 Countries: South Korea (KRW), China (CNY), Japan (JPY), UAE (AED)
 * Accurate FTS Customs Tariff Engine (EEC Decision No. 107 & RF Decrees No. 1291 & 2555)
 * EV Customs STP Engine: 15% Duty + Horsepower Excise (Art. 193 Tax Code) + 20% VAT
 * Live CBR Exchange Rates with LocalStorage Caching & Institutional Fallback
 * Personal vs Commercial Import Type Switcher with Legal Guardrails
 * Unified Configuration & Theme Presets (Default Purple & ProAvto Obsidian/Red)
 * URL Personalization (?brand=...&phone=...&tg=...&theme=proavto&country=...)
 * Strict Optional Phone Privacy Guardrail (hides call UI if phone is absent)
 * 5-Layer Anti-Spam & 152-FZ Privacy Compliance
 */

// Embedded Institutional Config Fallback
const DEFAULT_CONFIG = {
  brandName: "AutoKorea",
  phone: "",
  telegram: "https://t.me/",
  whatsapp: "",
  theme: "default",
  commissionRub: 120000,
  paperworkAndCertRub: 95000,
  defaultRates: {
    KRW: 0.0614,
    CNY: 12.26,
    JPY: 0.515,
    AED: 22.37,
    USD: 82.15,
    EUR: 90.28
  },
  countries: {
    korea: {
      name: "Южная Корея",
      flag: "🇰🇷",
      currency: "KRW",
      currencySymbol: "₩",
      currencyNameRu: "воны",
      unitLabel: "млн ₩",
      priceLabel: "Цена на Encar",
      defaultPrice: 24500000,
      defaultCc: 1999,
      defaultHp: 160,
      defaultYear: "2021",
      priceStep: 500000,
      quickPriceChips: [18500000, 24500000, 32000000, 54000000],
      quickPriceChipLabels: ["18.5 млн ₩", "24.5 млн ₩", "32 млн ₩", "54 млн ₩"],
      localCostsForeign: 1500000,
      seaFreightUsd: 1100,
      inlandDeliveryRub: 0
    },
    china: {
      name: "Китай",
      flag: "🇨🇳",
      currency: "CNY",
      currencySymbol: "¥",
      currencyNameRu: "юани",
      unitLabel: "тыс ¥",
      priceLabel: "Цена в Китае",
      defaultPrice: 185000,
      defaultCc: 1969,
      defaultHp: 238,
      defaultYear: "2023",
      priceStep: 5000,
      quickPriceChips: [125000, 185000, 265000, 350000],
      quickPriceChipLabels: ["125 тыс ¥", "185 тыс ¥", "265 тыс ¥", "350 тыс ¥"],
      localCostsForeign: 6500,
      seaFreightUsd: 0,
      inlandDeliveryRub: 185000
    },
    japan: {
      name: "Япония",
      flag: "🇯🇵",
      currency: "JPY",
      currencySymbol: "¥",
      currencyNameRu: "иены",
      unitLabel: "млн ¥",
      priceLabel: "Цена на аукционе",
      defaultPrice: 2800000,
      defaultCc: 1496,
      defaultHp: 150,
      defaultYear: "2021",
      priceStep: 100000,
      quickPriceChips: [1500000, 2800000, 4200000, 6800000],
      quickPriceChipLabels: ["1.5 млн ¥", "2.8 млн ¥", "4.2 млн ¥", "6.8 млн ¥"],
      localCostsForeign: 120000,
      seaFreightUsd: 950,
      inlandDeliveryRub: 0
    },
    uae: {
      name: "ОАЭ",
      flag: "🇦🇪",
      currency: "AED",
      currencySymbol: "AED",
      currencyNameRu: "дирхамы",
      unitLabel: "тыс AED",
      priceLabel: "Цена в ОАЭ",
      defaultPrice: 125000,
      defaultCc: 2494,
      defaultHp: 204,
      defaultYear: "2022",
      priceStep: 5000,
      quickPriceChips: [85000, 125000, 195000, 320000],
      quickPriceChipLabels: ["85 тыс AED", "125 тыс AED", "195 тыс AED", "320 тыс AED"],
      localCostsForeign: 4500,
      seaFreightUsd: 2200,
      inlandDeliveryRub: 65000
    }
  },
  themes: {
    default: {
      colorPrimary: "#5833EA",
      colorPrimaryHover: "#4724D3",
      colorPrimaryLight: "#EEEDFD",
      colorPrimarySubtle: "#F4F2FF",
      colorTextDark: "#111827",
      colorTextBody: "#374151",
      colorTextMuted: "#6B7280",
      bgPage: "#FFFFFF",
      bgAlt: "#FAFAFC",
      bgCard: "#FFFFFF",
      borderLight: "#ECEEF3",
      shadowPrimary: "0 8px 24px rgba(88, 51, 234, 0.22)"
    },
    proavto: {
      colorPrimary: "#E52E2E",
      colorPrimaryHover: "#C81E1E",
      colorPrimaryLight: "rgba(229, 46, 46, 0.16)",
      colorPrimarySubtle: "rgba(229, 46, 46, 0.08)",
      colorTextDark: "#FFFFFF",
      colorTextBody: "#E5E7EB",
      colorTextMuted: "#9CA3AF",
      bgPage: "#0B0D12",
      bgAlt: "#12151D",
      bgCard: "#181B26",
      borderLight: "#262B3A",
      shadowPrimary: "0 8px 24px rgba(229, 46, 46, 0.3)"
    }
  }
};

let APP_CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

// Live CBR Rates Matrix (with instant fallback)
const RATES = {
  KRW: 0.0614,
  CNY: 12.26,
  JPY: 0.515,
  AED: 22.37,
  EUR: 90.28,
  USD: 82.15
};

// Endpoints
const CF_WORKER_URL = 'https://shy-sun-dedf.odnovalov14.workers.dev';
const LOCAL_LEAD_URL = './api/lead.php';

// 4-Country Automotive Catalog with HP metadata for EV & Hybrids
const CAR_CATALOG = {
  korea: {
    brands: {
      'Hyundai': [
        { model: 'Avante (Elantra)', baseYear: 2021, engineDesc: '1.6 л • 123 л.с.', engineCc: 1598, hp: 123, priceForeign: 18500000, img: 'img/car_avante.png' },
        { model: 'Sonata DN8', baseYear: 2021, engineDesc: '2.0 л • 160 л.с.', engineCc: 1999, hp: 160, priceForeign: 22500000, img: 'img/car_avante.png' },
        { model: 'Santa Fe TM', baseYear: 2021, engineDesc: '2.5 л Turbo • 281 л.с.', engineCc: 2497, hp: 281, priceForeign: 28500000, img: 'img/car_genesis.png' },
        { model: 'Palisade 3.8', baseYear: 2021, engineDesc: '3.8 л • 295 л.с.', engineCc: 3778, hp: 295, priceForeign: 33000000, img: 'img/car_genesis.png' },
        { model: 'Tucson NX4', baseYear: 2022, engineDesc: '1.6 л Turbo • 180 л.с.', engineCc: 1598, hp: 180, priceForeign: 25000000, img: 'img/car_avante.png' }
      ],
      'Kia': [
        { model: 'K5 DL3', baseYear: 2021, engineDesc: '2.0 л • 160 л.с.', engineCc: 1999, hp: 160, priceForeign: 21500000, img: 'img/car_k5.png' },
        { model: 'Sportage NQ5', baseYear: 2022, engineDesc: '2.0 л Дизель • 186 л.с.', engineCc: 1998, hp: 186, priceForeign: 26500000, img: 'img/car_k5.png' },
        { model: 'Sorento MQ4', baseYear: 2021, engineDesc: '2.2 л Дизель • 199 л.с.', engineCc: 2151, hp: 199, priceForeign: 31000000, img: 'img/car_k5.png' },
        { model: 'Carnival 4', baseYear: 2021, engineDesc: '2.2 л Дизель • 199 л.с.', engineCc: 2151, hp: 199, priceForeign: 34000000, img: 'img/car_k5.png' }
      ],
      'Genesis': [
        { model: 'GV80 2.5T AWD', baseYear: 2021, engineDesc: '2.5 л Turbo • 304 л.с.', engineCc: 2497, hp: 304, priceForeign: 54000000, img: 'img/car_genesis.png' },
        { model: 'G80 RG3', baseYear: 2021, engineDesc: '2.5 л Turbo • 304 л.с.', engineCc: 2497, hp: 304, priceForeign: 48000000, img: 'img/car_genesis.png' },
        { model: 'GV70 AWD', baseYear: 2022, engineDesc: '2.5 л Turbo • 304 л.с.', engineCc: 2497, hp: 304, priceForeign: 45000000, img: 'img/car_genesis.png' },
        { model: 'G70 2.0T', baseYear: 2021, engineDesc: '2.0 л Turbo • 252 л.с.', engineCc: 1998, hp: 252, priceForeign: 34000000, img: 'img/car_genesis.png' }
      ],
      'BMW': [
        { model: '3 Series (G20) 320i', baseYear: 2021, engineDesc: '2.0 л Turbo • 184 л.с.', engineCc: 1998, hp: 184, priceForeign: 35000000, img: 'img/hero_car.jpg' },
        { model: '5 Series (G30) 520i', baseYear: 2021, engineDesc: '2.0 л Turbo • 184 л.с.', engineCc: 1998, hp: 184, priceForeign: 42000000, img: 'img/hero_car.jpg' },
        { model: 'X3 20d xDrive', baseYear: 2021, engineDesc: '2.0 л Дизель • 190 л.с.', engineCc: 1995, hp: 190, priceForeign: 44000000, img: 'img/hero_car.jpg' },
        { model: 'X5 30d xDrive', baseYear: 2021, engineDesc: '3.0 л Дизель • 265 л.с.', engineCc: 2993, hp: 265, priceForeign: 68000000, img: 'img/hero_car.jpg' }
      ]
    }
  },
  china: {
    brands: {
      'Geely': [
        { model: 'Monjaro 2.0 4WD', baseYear: 2023, engineDesc: '2.0 л Turbo • 238 л.с.', engineCc: 1969, hp: 238, priceForeign: 185000, img: 'img/car_monjaro.png' },
        { model: 'Tugella 2.0 4WD', baseYear: 2022, engineDesc: '2.0 л Turbo • 238 л.с.', engineCc: 1969, hp: 238, priceForeign: 160000, img: 'img/car_monjaro.png' },
        { model: 'Atlas Pro 1.5 4WD', baseYear: 2022, engineDesc: '1.5 л Turbo • 177 л.с.', engineCc: 1477, hp: 177, priceForeign: 125000, img: 'img/car_monjaro.png' }
      ],
      'Li Auto': [
        { model: 'L7 Pro (EREV)', baseYear: 2023, engineDesc: '1.5T Hybrid • 449 л.с.', engineCc: 1499, hp: 449, priceForeign: 315000, img: 'img/car_l7.png' },
        { model: 'L8 Max (EREV)', baseYear: 2023, engineDesc: '1.5T Hybrid • 449 л.с.', engineCc: 1499, hp: 449, priceForeign: 355000, img: 'img/car_l7.png' },
        { model: 'L9 Ultra (EREV)', baseYear: 2023, engineDesc: '1.5T Hybrid • 449 л.с.', engineCc: 1499, hp: 449, priceForeign: 435000, img: 'img/car_l7.png' }
      ],
      'Zeekr': [
        { model: '001 RWD (Single Motor)', baseYear: 2023, engineDesc: 'EV • 272 л.с. • RWD', engineCc: 0, hp: 272, isEv: true, priceForeign: 269000, img: 'img/car_zeekr.png' },
        { model: '001 You 100kWh (4WD)', baseYear: 2023, engineDesc: 'EV • 544 л.с. • 4WD', engineCc: 0, hp: 544, isEv: true, priceForeign: 320000, img: 'img/car_zeekr.png' },
        { model: '007 4WD', baseYear: 2024, engineDesc: 'EV • 646 л.с. • 4WD', engineCc: 0, hp: 646, isEv: true, priceForeign: 265000, img: 'img/car_zeekr.png' },
        { model: 'X 4WD 5-seat', baseYear: 2023, engineDesc: 'EV • 428 л.с. • 4WD', engineCc: 0, hp: 428, isEv: true, priceForeign: 210000, img: 'img/car_zeekr.png' }
      ],
      'Changan': [
        { model: 'CS55 Plus II', baseYear: 2022, engineDesc: '1.5 л Turbo • 181 л.с.', engineCc: 1494, hp: 181, priceForeign: 115000, img: 'img/car_monjaro.png' },
        { model: 'UNI-K 2.0 AWD', baseYear: 2022, engineDesc: '2.0 л Turbo • 226 л.с.', engineCc: 1998, hp: 226, priceForeign: 165000, img: 'img/car_monjaro.png' }
      ]
    }
  },
  japan: {
    brands: {
      'Toyota': [
        { model: 'Camry 2.5 Hybrid', baseYear: 2021, engineDesc: '2.5 л Hybrid • 211 л.с.', engineCc: 2487, hp: 211, priceForeign: 2800000, img: 'img/car_avante.png' },
        { model: 'RAV4 2.0 4WD', baseYear: 2021, engineDesc: '2.0 л • 171 л.с.', engineCc: 1986, hp: 171, priceForeign: 2600000, img: 'img/car_genesis.png' },
        { model: 'Land Cruiser Prado 150', baseYear: 2021, engineDesc: '2.7 л • 163 л.с.', engineCc: 2693, hp: 163, priceForeign: 3800000, img: 'img/car_genesis.png' },
        { model: 'Harrier 2.0 G', baseYear: 2021, engineDesc: '2.0 л • 171 л.с.', engineCc: 1986, hp: 171, priceForeign: 3100000, img: 'img/car_genesis.png' },
        { model: 'Alphard 2.5', baseYear: 2021, engineDesc: '2.5 л • 182 л.с.', engineCc: 2493, hp: 182, priceForeign: 4400000, img: 'img/car_k5.png' }
      ],
      'Honda': [
        { model: 'CR-V 1.5 Turbo', baseYear: 2021, engineDesc: '1.5 л Turbo • 190 л.с.', engineCc: 1496, hp: 190, priceForeign: 2300000, img: 'img/car_genesis.png' },
        { model: 'Stepwgn Spada 1.5', baseYear: 2021, engineDesc: '1.5 л Turbo • 150 л.с.', engineCc: 1496, hp: 150, priceForeign: 2500000, img: 'img/car_k5.png' },
        { model: 'Vezel 1.5 e:HEV', baseYear: 2022, engineDesc: '1.5 л Hybrid • 131 л.с.', engineCc: 1496, hp: 131, priceForeign: 1950000, img: 'img/car_avante.png' }
      ],
      'Mazda': [
        { model: 'CX-5 2.2 Diesel AWD', baseYear: 2021, engineDesc: '2.2 л Дизель • 190 л.с.', engineCc: 2188, hp: 190, priceForeign: 2200000, img: 'img/car_genesis.png' },
        { model: 'CX-8 2.2 Diesel', baseYear: 2021, engineDesc: '2.2 л Дизель • 190 л.с.', engineCc: 2188, hp: 190, priceForeign: 2700000, img: 'img/car_genesis.png' },
        { model: 'Mazda 6 2.0', baseYear: 2021, engineDesc: '2.0 л • 156 л.с.', engineCc: 1997, hp: 156, priceForeign: 1800000, img: 'img/car_avante.png' }
      ],
      'Nissan': [
        { model: 'X-Trail e-POWER 4WD', baseYear: 2022, engineDesc: '1.5 л Turbo Hybrid • 204 л.с.', engineCc: 1497, hp: 204, priceForeign: 2900000, img: 'img/car_monjaro.png' },
        { model: 'Serena e-POWER', baseYear: 2021, engineDesc: '1.2 л Hybrid • 136 л.с.', engineCc: 1198, hp: 136, priceForeign: 2400000, img: 'img/car_k5.png' },
        { model: 'Note e-POWER', baseYear: 2022, engineDesc: '1.2 л Hybrid • 116 л.с.', engineCc: 1198, hp: 116, priceForeign: 1450000, img: 'img/car_avante.png' }
      ],
      'Subaru': [
        { model: 'Forester 2.0 e-BOXER', baseYear: 2021, engineDesc: '2.0 л Hybrid • 145 л.с.', engineCc: 1995, hp: 145, priceForeign: 2400000, img: 'img/car_genesis.png' },
        { model: 'Outback 1.8 Turbo AWD', baseYear: 2021, engineDesc: '1.8 л Turbo • 177 л.с.', engineCc: 1795, hp: 177, priceForeign: 3300000, img: 'img/car_genesis.png' }
      ]
    }
  },
  uae: {
    brands: {
      'Toyota': [
        { model: 'Land Cruiser 300 3.5T', baseYear: 2022, engineDesc: '3.5 л V6 Twin-Turbo • 415 л.с.', engineCc: 3444, hp: 415, priceForeign: 285000, img: 'img/car_genesis.png' },
        { model: 'Prado 250 2.4T', baseYear: 2024, engineDesc: '2.4 л Turbo • 281 л.с.', engineCc: 2393, hp: 281, priceForeign: 195000, img: 'img/car_genesis.png' },
        { model: 'Camry 2.5', baseYear: 2022, engineDesc: '2.5 л • 204 л.с.', engineCc: 2487, hp: 204, priceForeign: 105000, img: 'img/car_avante.png' }
      ],
      'Lexus': [
        { model: 'LX600 3.5T VIP', baseYear: 2022, engineDesc: '3.5 л V6 Twin-Turbo • 415 л.с.', engineCc: 3444, hp: 415, priceForeign: 465000, img: 'img/car_genesis.png' },
        { model: 'RX350 2.4T AWD', baseYear: 2023, engineDesc: '2.4 л Turbo • 279 л.с.', engineCc: 2393, hp: 279, priceForeign: 245000, img: 'img/car_genesis.png' },
        { model: 'ES250 2.5', baseYear: 2022, engineDesc: '2.5 л • 204 л.с.', engineCc: 2487, hp: 204, priceForeign: 175000, img: 'img/car_avante.png' }
      ],
      'Nissan': [
        { model: 'Patrol 5.6 V8 Platinum', baseYear: 2022, engineDesc: '5.6 л V8 • 400 л.с.', engineCc: 5552, hp: 400, priceForeign: 265000, img: 'img/car_genesis.png' },
        { model: 'X-Terra 2.5 4WD', baseYear: 2022, engineDesc: '2.5 л • 165 л.с.', engineCc: 2488, hp: 165, priceForeign: 120000, img: 'img/car_monjaro.png' }
      ],
      'Porsche': [
        { model: 'Cayenne 3.0T AWD', baseYear: 2022, engineDesc: '3.0 л V6 Turbo • 340 л.с.', engineCc: 2995, hp: 340, priceForeign: 375000, img: 'img/hero_car.jpg' }
      ]
    }
  }
};

// Application State
let currentCountry = 'korea';
let currentBrand = 'Hyundai';
let currentModelData = CAR_CATALOG.korea.brands['Hyundai'][0];
let selectedYear = '2021';
let calcMode = 'catalog'; // 'catalog' | 'encar'
let currentImportType = 'personal'; // 'personal' | 'commercial'
let isCustomCar = false;
let currentCalculation = null;

// Currency Formatter Helpers
function formatPrice(num) {
  if (isNaN(num)) return '0 ₽';
  return Math.round(num).toLocaleString('ru-RU') + ' ₽';
}

function formatForeign(val, country) {
  const num = Math.round(val).toLocaleString('ru-RU');
  if (country === 'korea') return `${num} ₩`;
  if (country === 'china') return `${num} ¥`;
  if (country === 'japan') return `${num} ¥`;
  if (country === 'uae') return `${num} AED`;
  return `${num} ₩`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// -------------------------------------------------------------
// 1. CONFIG LOADER & THEME ENGINE
// -------------------------------------------------------------
async function loadConfig() {
  try {
    const res = await fetch('./config.json');
    if (res.ok) {
      const externalConfig = await res.json();
      const mergedCountries = {};
      const countryKeys = new Set([
        ...Object.keys(DEFAULT_CONFIG.countries || {}),
        ...Object.keys(externalConfig.countries || {})
      ]);
      countryKeys.forEach(k => {
        mergedCountries[k] = Object.assign(
          {},
          (DEFAULT_CONFIG.countries && DEFAULT_CONFIG.countries[k]) || {},
          (externalConfig.countries && externalConfig.countries[k]) || {}
        );
      });

      APP_CONFIG = Object.assign({}, DEFAULT_CONFIG, externalConfig, {
        defaultRates: Object.assign({}, DEFAULT_CONFIG.defaultRates, externalConfig.defaultRates || {}),
        countries: mergedCountries,
        themes: Object.assign({}, DEFAULT_CONFIG.themes, externalConfig.themes || {})
      });
    }
  } catch (err) {
    console.info('Config fetch note: Using embedded configuration.');
  }

  // Load tariffs if accessible
  try {
    const tRes = await fetch('./tariffs.json');
    if (tRes.ok) {
      const extTariffs = await tRes.json();
      if (window.AutoCalculator) {
        window.AutoCalculator.DEFAULT_TARIFFS = extTariffs;
      }
    }
  } catch (tErr) {
    // Falls back to AutoCalculator internal DEFAULT_TARIFFS
  }
}

function applyTheme(themeKey) {
  const key = themeKey || APP_CONFIG.theme || 'default';
  const themeObj = (APP_CONFIG.themes && APP_CONFIG.themes[key]) || APP_CONFIG.themes.default;
  const root = document.documentElement;
  const body = document.body;

  if (key === 'proavto') {
    root.setAttribute('data-theme', 'proavto');
    body.classList.add('theme-proavto');
  } else {
    root.removeAttribute('data-theme');
    body.classList.remove('theme-proavto');
  }

  if (themeObj) {
    if (themeObj.colorPrimary) root.style.setProperty('--color-primary', themeObj.colorPrimary);
    if (themeObj.colorPrimaryHover) root.style.setProperty('--color-primary-hover', themeObj.colorPrimaryHover);
    if (themeObj.colorPrimaryLight) root.style.setProperty('--color-primary-light', themeObj.colorPrimaryLight);
    if (themeObj.colorPrimarySubtle) root.style.setProperty('--color-primary-subtle', themeObj.colorPrimarySubtle);
    if (themeObj.colorTextDark) root.style.setProperty('--color-text-dark', themeObj.colorTextDark);
    if (themeObj.colorTextBody) root.style.setProperty('--color-text-body', themeObj.colorTextBody);
    if (themeObj.colorTextMuted) root.style.setProperty('--color-text-muted', themeObj.colorTextMuted);
    if (themeObj.bgPage) root.style.setProperty('--bg-page', themeObj.bgPage);
    if (themeObj.bgAlt) root.style.setProperty('--bg-alt', themeObj.bgAlt);
    if (themeObj.bgCard) root.style.setProperty('--bg-card', themeObj.bgCard);
    if (themeObj.borderLight) root.style.setProperty('--border-light', themeObj.borderLight);
    if (themeObj.shadowPrimary) {
      root.style.setProperty('--shadow-primary', themeObj.shadowPrimary);
      root.style.setProperty('--shadow-purple', themeObj.shadowPrimary);
    }
  }
}

// -------------------------------------------------------------
// 2. LIVE CBR RATES WITH LOCALSTORAGE CACHING
// -------------------------------------------------------------
const CBR_STORAGE_KEY = 'auto_import_cbr_rates_v2';
const CBR_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

async function fetchLiveCbrRates() {
  // 1. Try reading valid cache first
  try {
    const rawCache = localStorage.getItem(CBR_STORAGE_KEY);
    if (rawCache) {
      const parsed = JSON.parse(rawCache);
      const isFresh = (Date.now() - parsed.timestamp) < CBR_CACHE_TTL_MS;
      if (isFresh && parsed.rates) {
        Object.assign(RATES, parsed.rates);
        updateRateTickerDisplay(true, 'ЦБ РФ (кэш)');
        updateResultView();
      }
    }
  } catch (cacheErr) {
    console.warn('CBR cache read note:', cacheErr.message);
  }

  // 2. Fetch fresh rates from CBR API
  try {
    const res = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    if (!res.ok) throw new Error(`CBR HTTP status ${res.status}`);
    const data = await res.json();

    if (data && data.Valute) {
      if (data.Valute.KRW) {
        RATES.KRW = data.Valute.KRW.Value / (data.Valute.KRW.Nominal || 1000);
      }
      if (data.Valute.CNY) {
        RATES.CNY = data.Valute.CNY.Value / (data.Valute.CNY.Nominal || 1);
      }
      if (data.Valute.JPY) {
        RATES.JPY = data.Valute.JPY.Value / (data.Valute.JPY.Nominal || 100);
      }
      if (data.Valute.AED) {
        RATES.AED = data.Valute.AED.Value / (data.Valute.AED.Nominal || 1);
      }
      if (data.Valute.EUR) {
        RATES.EUR = data.Valute.EUR.Value / (data.Valute.EUR.Nominal || 1);
      }
      if (data.Valute.USD) {
        RATES.USD = data.Valute.USD.Value / (data.Valute.USD.Nominal || 1);
      }

      try {
        localStorage.setItem(CBR_STORAGE_KEY, JSON.stringify({
          timestamp: Date.now(),
          rates: RATES
        }));
      } catch (saveErr) {}

      updateRateTickerDisplay(true, 'ЦБ РФ онлайн');
      updateResultView();
    }
  } catch (err) {
    console.warn('CBR API live fetch note (using fallback):', err.message);
    updateRateTickerDisplay(false, 'Курс ЦБ РФ');
  }
}

function updateRateTickerDisplay(isLive, badgeText) {
  const elKrw = document.getElementById('cbrKrw');
  const elCny = document.getElementById('cbrCny');
  const elJpy = document.getElementById('cbrJpy');
  const elAed = document.getElementById('cbrAed');
  const elEur = document.getElementById('cbrEur');
  const elUsd = document.getElementById('cbrUsd');
  const elBadge = document.getElementById('cbrStatusBadge');

  if (elKrw) elKrw.textContent = (RATES.KRW * 1000).toFixed(2);
  if (elCny) elCny.textContent = RATES.CNY.toFixed(2);
  if (elJpy) elJpy.textContent = (RATES.JPY * 100).toFixed(2);
  if (elAed) elAed.textContent = RATES.AED.toFixed(2);
  if (elEur) elEur.textContent = RATES.EUR.toFixed(2);
  if (elUsd) elUsd.textContent = RATES.USD.toFixed(2);

  if (elBadge) {
    elBadge.textContent = badgeText || (isLive ? 'ЦБ РФ онлайн' : 'Курс ЦБ РФ');
  }
}

// -------------------------------------------------------------
// 3. UI POPULATION & CALCULATION LOGIC
// -------------------------------------------------------------
function getAgeCategoryFromYear(yearStr) {
  const y = parseInt(yearStr, 10);
  if (y >= 2024) return 'under_3';
  if (y >= 2021 && y <= 2023) return '3_to_5';
  return 'over_5';
}

function populateBrands() {
  const brandSelect = document.getElementById('selectBrand');
  if (!brandSelect) return;

  brandSelect.innerHTML = '';
  const currentCountryCatalog = CAR_CATALOG[currentCountry] || CAR_CATALOG.korea;
  const brands = Object.keys(currentCountryCatalog.brands);

  brands.forEach((brand, idx) => {
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = brand;
    if (idx === 0) opt.selected = true;
    brandSelect.appendChild(opt);
  });

  const otherOpt = document.createElement('option');
  otherOpt.value = 'other';
  otherOpt.textContent = '✨ Другая марка (Индивидуальный подбор)';
  brandSelect.appendChild(otherOpt);

  currentBrand = brands[0] || 'Hyundai';
  isCustomCar = false;
  populateModels();
}

function populateModels() {
  const modelSelect = document.getElementById('selectModel');
  if (!modelSelect) return;

  modelSelect.innerHTML = '';

  if (currentBrand === 'other') {
    const opt = document.createElement('option');
    opt.value = 'other';
    opt.textContent = 'Любая модель (свободный расчет с аукциона)';
    modelSelect.appendChild(opt);
    isCustomCar = true;
    updateResultView();
    return;
  }

  isCustomCar = false;
  const currentCountryCatalog = CAR_CATALOG[currentCountry] || CAR_CATALOG.korea;
  const models = currentCountryCatalog.brands[currentBrand] || [];

  models.forEach((item, idx) => {
    const opt = document.createElement('option');
    opt.value = item.model;
    const priceFmt = formatForeign(item.priceForeign, currentCountry);
    opt.textContent = `${item.model} — от ${priceFmt}`;
    if (idx === 0) opt.selected = true;
    modelSelect.appendChild(opt);
  });

  const otherOpt = document.createElement('option');
  otherOpt.value = 'other';
  otherOpt.textContent = 'Другая модель этой марки...';
  modelSelect.appendChild(otherOpt);

  if (models.length > 0) {
    currentModelData = models[0];
    updateResultView();
  }
}

function updateImportTypeHint(importHint, engineCc, horsepower, isEv) {
  if (!importHint) return;
  if (currentImportType === 'commercial') {
    importHint.textContent = 'полный коммерческий утиль';
    importHint.style.color = '';
  } else if (engineCc > 3000 && !isEv) {
    importHint.textContent = 'Мотор > 3.0 л: по закону РФ льгота не действует (полный утиль)';
    importHint.style.color = 'var(--color-primary)';
  } else if (horsepower > 160) {
    importHint.textContent = 'Мощность > 160 л.с.: по закону РФ льгота не действует (полный утиль)';
    importHint.style.color = 'var(--color-primary)';
  } else {
    importHint.textContent = 'льгота 3 400 – 5 200 ₽';
    importHint.style.color = '';
  }
}

function getUtilReasonLabel(calc) {
  if (currentImportType === 'commercial') {
    return 'коммерческий';
  }
  if (calc.isPreferentialUtil) {
    return 'льготный физлиц';
  }
  if (calc.utilReasonCode === 'over_hp' || (!calc.utilReasonCode && calc.horsepower > 160)) {
    return 'коммерческий, >160 л.с.';
  }
  if (calc.utilReasonCode === 'over_cc' || (!calc.utilReasonCode && !calc.isEv && calc.engineCc > 3000)) {
    return 'коммерческий, >3.0 л';
  }
  return 'коммерческий';
}

function updateResultView() {
  const resPrice = document.getElementById('resPrice');
  const resTitle = document.getElementById('resTitle');
  const resSpecs = document.getElementById('resSpecs');
  const resThumb = document.getElementById('resThumb');
  const orderBtnText = document.getElementById('orderBtnText');
  const resCaption = document.getElementById('resPriceCaption');
  const resSub = document.getElementById('resPriceSub');
  const importHint = document.getElementById('importTypeHint');
  const toggleBtn = document.getElementById('toggleDetailsBtn');
  const drawer = document.getElementById('breakdownDrawer');
  const banner = document.getElementById('resultBanner');

  if (!resPrice || !resTitle || !resSpecs) return;

  let calc = null;
  let carName = '';
  let specsText = '';
  let imgSrc = 'img/calc_cars.png';
  let foreignSummary = '';

  const countryConfig = APP_CONFIG.countries[currentCountry] || APP_CONFIG.countries.korea;

  if (calcMode === 'encar') {
    // Mode 2: Free Lot / Custom Input
    const parsedPrice = parseFloat(document.getElementById('encarPriceInput')?.value);
    const priceForeign = (!isNaN(parsedPrice) && parsedPrice > 0) ? parsedPrice : countryConfig.defaultPrice;
    const rawCc = parseInt(document.getElementById('encarEngineCcInput')?.value, 10);
    const engineCc = isNaN(rawCc) ? countryConfig.defaultCc : Math.max(0, rawCc);
    const rawHp = parseInt(document.getElementById('encarHpInput')?.value, 10);
    const horsepower = (!isNaN(rawHp) && rawHp > 0) ? rawHp : (countryConfig.defaultHp || 160);
    const ageCategory = document.getElementById('encarAgeSelect')?.value || '3_to_5';
    const lotInput = document.getElementById('encarLotInput')?.value.trim();

    const isEv = engineCc === 0;
    updateImportTypeHint(importHint, engineCc, horsepower, isEv);

    if (window.AutoCalculator) {
      calc = window.AutoCalculator.calculateTurnkey({
        country: currentCountry,
        priceForeign,
        engineCc,
        horsepower,
        ageCategory,
        importType: currentImportType,
        isEv,
        rates: RATES,
        config: APP_CONFIG
      });
    }

    const flag = countryConfig.flag;
    carName = lotInput ? `${flag} ${lotInput}` : `${flag} Автомобиль (${countryConfig.name})`;
    const ageLabel = ageCategory === '3_to_5' ? '3–5 лет (проходной)' : (ageCategory === 'under_3' ? 'до 3 лет (свежий)' : 'старше 5 лет');
    specsText = isEv ? `Электромобиль (EV) • ${horsepower} л.с. • ${ageLabel}` : `${(engineCc / 1000).toFixed(1)} л (${engineCc} см³) • ${horsepower ? `${horsepower} л.с. • ` : ''}${ageLabel}`;

    if (currentCountry === 'korea') imgSrc = 'img/car_k5.png';
    else if (currentCountry === 'china') imgSrc = isEv ? 'img/car_zeekr.png' : 'img/car_monjaro.png';
    else if (currentCountry === 'japan') imgSrc = 'img/car_avante.png';
    else imgSrc = 'img/car_genesis.png';

    foreignSummary = formatForeign(priceForeign, currentCountry);

  } else {
    // Mode 1: Catalog
    if (isCustomCar || currentBrand === 'other') {
      currentCalculation = null;
      if (drawer) drawer.style.display = 'none';
      if (banner) banner.classList.remove('drawer-open');
      if (toggleBtn) {
        toggleBtn.classList.remove('active');
        toggleBtn.style.display = 'none';
      }
      resPrice.textContent = 'Индивидуально';
      resCaption.textContent = 'Под ваш бюджет:';
      resSub.textContent = `Рассчитаем любой лот из ${countryConfig.name} под ключ с фиксированной гарантией`;
      resTitle.textContent = `Индивидуальный подбор авто (${countryConfig.name})`;
      resSpecs.textContent = `${countryConfig.name} • Расчет по тарифам ФТС РФ 2026`;
      if (resThumb) resThumb.src = 'img/car_other.png';
      if (orderBtnText) orderBtnText.textContent = 'Обсудить подбор с менеджером';
      return;
    }

    if (!currentModelData) return;

    const ageCategory = getAgeCategoryFromYear(selectedYear);
    const engineCc = currentModelData.engineCc;
    const isEv = currentModelData.isEv || engineCc === 0;
    const horsepower = currentModelData.hp || 272;

    updateImportTypeHint(importHint, engineCc, horsepower, isEv);

    if (window.AutoCalculator) {
      calc = window.AutoCalculator.calculateTurnkey({
        country: currentCountry,
        priceForeign: currentModelData.priceForeign,
        engineCc: engineCc,
        horsepower: horsepower,
        ageCategory,
        importType: currentImportType,
        isEv,
        rates: RATES,
        config: APP_CONFIG
      });
    }

    carName = `${currentBrand} ${currentModelData.model}`;
    specsText = `${selectedYear} год • ${currentModelData.engineDesc}`;
    imgSrc = currentModelData.img || 'img/calc_cars.png';
    foreignSummary = formatForeign(currentModelData.priceForeign, currentCountry);
  }

  currentCalculation = calc;
  if (!calc) return;
  if (toggleBtn) toggleBtn.style.display = 'inline-flex';

  // Update Result Banner
  resCaption.textContent = 'Точный расчет под ключ:';
  const utilReasonFull = getUtilReasonLabel(calc);
  const utilNoteInBanner = utilReasonFull === 'льготный физлиц' ? 'льготный' : utilReasonFull;
  resSub.textContent = `Включает: авто на аукционе, растаможку ФТС${calc.isEv ? ' (СТП)' : ''}, утильсбор (${utilNoteInBanner}), логистику и СБКТС/ЭПТС`;
  resPrice.textContent = formatPrice(calc.totalRub);
  resTitle.textContent = carName;
  resSpecs.textContent = specsText;
  if (orderBtnText) orderBtnText.textContent = 'Оставить заявку на этот автомобиль';
  if (resThumb) resThumb.src = imgSrc;

  // Update Breakdown Drawer Rows
  const dCost = document.getElementById('detailCarCost');
  const dFreight = document.getElementById('detailFreight');
  const dDuty = document.getElementById('detailDuty');
  const dDutyTag = document.getElementById('detailDutyTag');
  const dCustomsFee = document.getElementById('detailCustomsFee');
  const dUtil = document.getElementById('detailUtil');
  const dPaperwork = document.getElementById('detailPaperwork');
  const dCommission = document.getElementById('detailCommission');

  if (dCost) dCost.innerHTML = `${formatPrice(calc.carCostRub)} <span class="sub-cost-tag" id="detailForeignPrice">(${foreignSummary})</span>`;
  if (dFreight) dFreight.textContent = formatPrice(calc.freightAndOriginRub);
  if (dDuty) dDuty.innerHTML = `${formatPrice(calc.customsDutyRub)} <span class="sub-cost-tag" id="detailDutyFormula">(${calc.dutyFormulaDesc})</span>`;
  if (dDutyTag) dDutyTag.textContent = calc.dutyTag;
  if (dCustomsFee) dCustomsFee.textContent = formatPrice(calc.customsFeeRub);
  if (dUtil) {
    dUtil.textContent = `${formatPrice(calc.utilFeeRub)} (${utilReasonFull})`;
  }
  if (dPaperwork) dPaperwork.textContent = formatPrice(calc.paperworkAndCertRub);
  if (dCommission) dCommission.textContent = formatPrice(calc.commissionRub);
}

// -------------------------------------------------------------
// 4. MODE SWITCHER & QUICK CHIPS
// -------------------------------------------------------------
function setupModeSwitcher() {
  const tabCatalog = document.getElementById('tabModeCatalog');
  const tabEncar = document.getElementById('tabModeEncar');
  const catalogWrap = document.getElementById('catalogFieldsWrap');
  const encarWrap = document.getElementById('encarFieldsWrap');

  if (tabCatalog && tabEncar) {
    tabCatalog.addEventListener('click', () => {
      tabCatalog.classList.add('active');
      tabEncar.classList.remove('active');
      calcMode = 'catalog';
      if (catalogWrap) catalogWrap.style.display = 'block';
      if (encarWrap) encarWrap.style.display = 'none';
      updateResultView();
    });

    tabEncar.addEventListener('click', () => {
      tabEncar.classList.add('active');
      tabCatalog.classList.remove('active');
      calcMode = 'encar';
      if (catalogWrap) catalogWrap.style.display = 'none';
      if (encarWrap) encarWrap.style.display = 'block';
      updateResultView();
    });
  }

  // Quick Chips for Engine CC
  document.querySelectorAll('.quick-chip-btn[data-cc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ccInput = document.getElementById('encarEngineCcInput');
      if (ccInput) {
        ccInput.value = btn.getAttribute('data-cc');
        updateResultView();
      }
    });
  });

  // Quick Chips for Horsepower
  document.querySelectorAll('.quick-chip-btn[data-hp]').forEach(btn => {
    btn.addEventListener('click', () => {
      const hpInput = document.getElementById('encarHpInput');
      if (hpInput) {
        hpInput.value = btn.getAttribute('data-hp');
        updateResultView();
      }
    });
  });

  // Real-time input listeners for free calculator
  const pInput = document.getElementById('encarPriceInput');
  const ccInput = document.getElementById('encarEngineCcInput');
  const hpInput = document.getElementById('encarHpInput');
  const ageSelect = document.getElementById('encarAgeSelect');
  const lotInput = document.getElementById('encarLotInput');

  if (pInput) pInput.addEventListener('input', updateResultView);
  if (ccInput) ccInput.addEventListener('input', updateResultView);
  if (hpInput) hpInput.addEventListener('input', updateResultView);
  if (ageSelect) ageSelect.addEventListener('change', updateResultView);
  if (lotInput) lotInput.addEventListener('input', updateResultView);
}

// -------------------------------------------------------------
// 5. IMPORT TYPE TOGGLES (PERSONAL VS COMMERCIAL)
// -------------------------------------------------------------
function setupImportTypeToggles() {
  const btnPersonal = document.getElementById('btnImportPersonal');
  const btnCommercial = document.getElementById('btnImportCommercial');

  if (btnPersonal && btnCommercial) {
    btnPersonal.addEventListener('click', () => {
      btnPersonal.classList.add('active');
      btnCommercial.classList.remove('active');
      currentImportType = 'personal';
      updateResultView();
    });

    btnCommercial.addEventListener('click', () => {
      btnCommercial.classList.add('active');
      btnPersonal.classList.remove('active');
      currentImportType = 'commercial';
      updateResultView();
    });
  }
}

// -------------------------------------------------------------
// 6. 4-COUNTRY TOGGLES & SELECT LISTENERS
// -------------------------------------------------------------
function setupCountryToggles() {
  const countryBtns = {
    korea: document.getElementById('btnCountryKorea'),
    china: document.getElementById('btnCountryChina'),
    japan: document.getElementById('btnCountryJapan'),
    uae: document.getElementById('btnCountryUae')
  };

  const currencyTag = document.getElementById('encarCurrencyTag');
  const lblPrice = document.getElementById('lblEncarPrice');
  const currencyHint = document.getElementById('encarCurrencyHint');

  function applyCountry(countryKey) {
    if (!APP_CONFIG.countries[countryKey]) return;
    currentCountry = countryKey;
    const cfg = APP_CONFIG.countries[countryKey];

    Object.keys(countryBtns).forEach(k => {
      if (countryBtns[k]) {
        countryBtns[k].classList.toggle('active', k === countryKey);
      }
    });

    if (currencyTag) currencyTag.textContent = `${cfg.currencySymbol} (${cfg.currencyNameRu})`;
    if (lblPrice) lblPrice.textContent = cfg.priceLabel;
    if (currencyHint) currencyHint.textContent = `в ${cfg.currencyNameRu} (${cfg.currencySymbol})`;

    const pInput = document.getElementById('encarPriceInput');
    if (pInput) {
      pInput.value = cfg.defaultPrice;
      pInput.step = cfg.priceStep;
      pInput.placeholder = cfg.defaultPrice;
    }

    const ccInput = document.getElementById('encarEngineCcInput');
    if (ccInput) {
      ccInput.value = cfg.defaultCc;
    }

    const hpInput = document.getElementById('encarHpInput');
    if (hpInput && cfg.defaultHp) {
      hpInput.value = cfg.defaultHp;
    }

    const priceChipsRow = document.querySelector('#encarFieldsWrap .calc-field-group:first-child .quick-chips-row');
    if (priceChipsRow && cfg.quickPriceChips && cfg.quickPriceChipLabels) {
      priceChipsRow.innerHTML = cfg.quickPriceChips.map((chipVal, i) => {
        return `<button type="button" class="quick-chip-btn" data-price="${chipVal}">${cfg.quickPriceChipLabels[i]}</button>`;
      }).join('');

      priceChipsRow.querySelectorAll('.quick-chip-btn[data-price]').forEach(btn => {
        btn.addEventListener('click', () => {
          if (pInput) {
            pInput.value = btn.getAttribute('data-price');
            updateResultView();
          }
        });
      });
    }

    populateBrands();
    updateResultView();
  }

  if (countryBtns.korea) countryBtns.korea.addEventListener('click', () => applyCountry('korea'));
  if (countryBtns.china) countryBtns.china.addEventListener('click', () => applyCountry('china'));
  if (countryBtns.japan) countryBtns.japan.addEventListener('click', () => applyCountry('japan'));
  if (countryBtns.uae) countryBtns.uae.addEventListener('click', () => applyCountry('uae'));

  const initialChips = document.querySelectorAll('#encarFieldsWrap .calc-field-group:first-child .quick-chips-row .quick-chip-btn[data-price]');
  initialChips.forEach(btn => {
    btn.addEventListener('click', () => {
      const pInput = document.getElementById('encarPriceInput');
      if (pInput) {
        pInput.value = btn.getAttribute('data-price');
        updateResultView();
      }
    });
  });

  // Sync default country values (including defaultHp) on first boot
  applyCountry(currentCountry);
}

function setupSelectListeners() {
  const brandSelect = document.getElementById('selectBrand');
  const modelSelect = document.getElementById('selectModel');
  const yearSelect = document.getElementById('selectYear');
  const calcBtn = document.getElementById('calculateBtn');

  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      currentBrand = e.target.value;
      populateModels();
    });
  }

  if (modelSelect) {
    modelSelect.addEventListener('change', (e) => {
      if (e.target.value === 'other') {
        isCustomCar = true;
        updateResultView();
        return;
      }
      isCustomCar = false;
      const currentCountryCatalog = CAR_CATALOG[currentCountry] || CAR_CATALOG.korea;
      const models = currentCountryCatalog.brands[currentBrand] || [];
      const found = models.find(m => m.model === e.target.value);
      if (found) {
        currentModelData = found;
        updateResultView();
      }
    });
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', (e) => {
      selectedYear = e.target.value;
      updateResultView();
    });
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      updateResultView();
      const banner = document.getElementById('resultBanner');
      if (banner) {
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        banner.style.boxShadow = '0 0 0 3px var(--color-primary), 0 12px 36px rgba(0,0,0,0.18)';
        setTimeout(() => {
          banner.style.boxShadow = '';
        }, 1200);
      }
    });
  }
}

function setupDrawer() {
  const toggleBtn = document.getElementById('toggleDetailsBtn');
  const drawer = document.getElementById('breakdownDrawer');
  const banner = document.getElementById('resultBanner');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = drawer.style.display === 'none';
    drawer.style.display = isHidden ? 'block' : 'none';
    toggleBtn.classList.toggle('active', isHidden);
    if (banner) {
      banner.classList.toggle('drawer-open', isHidden);
    }
  });
}

// -------------------------------------------------------------
// 7. URL PERSONALIZATION ENGINE & STRICT PHONE PRIVACY
// -------------------------------------------------------------
function applyUrlPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const brand = params.get('brand') || params.get('company') || params.get('name');
  const tg = params.get('tg') || params.get('telegram');
  const phone = params.get('phone') || params.get('tel');
  const theme = params.get('theme');
  const country = params.get('country');
  const mode = params.get('mode');

  // Apply Theme
  if (theme) {
    applyTheme(theme.toLowerCase());
  } else if (APP_CONFIG.theme) {
    applyTheme(APP_CONFIG.theme);
  }

  // 1. Dynamic Brand Name Replacement
  if (brand) {
    const cleanBrand = brand.trim();
    document.title = `${cleanBrand} — Автомобили из Кореи, Китая, Японии и ОАЭ под ключ`;

    document.querySelectorAll('.brand-name-dynamic').forEach(el => {
      el.textContent = cleanBrand;
    });

    const heroSuffix = document.getElementById('heroBrandSuffix');
    if (heroSuffix) {
      heroSuffix.textContent = `с ${cleanBrand}`;
    }
  }

  // 2. Dynamic Telegram Contact Replacement
  if (tg) {
    const cleanTg = tg.trim().replace(/^@/, '');
    const tgUrl = `https://t.me/${cleanTg}`;

    const headerTgPill = document.getElementById('headerTgPill');
    const headerTgUsername = document.getElementById('headerTgUsername');
    if (headerTgPill && headerTgUsername) {
      headerTgPill.href = tgUrl;
      headerTgUsername.textContent = `@${cleanTg}`;
      headerTgPill.style.display = 'inline-flex';
    }

    const footerTgBtn = document.getElementById('footerTgBtn');
    if (footerTgBtn) {
      footerTgBtn.href = tgUrl;
    }

    document.querySelectorAll('.tg-dynamic-link').forEach(link => {
      link.href = tgUrl;
    });
  }

  // 3. Strict Optional Phone Handling: Hide call buttons if phone is not provided
  const headerPhoneBlock = document.getElementById('headerPhoneBlock');
  const footerPhoneWrap = document.getElementById('footerPhoneWrap');
  const footerWaBtn = document.getElementById('footerWaBtn');
  const effectivePhone = (phone || APP_CONFIG.phone || '').trim();

  if (effectivePhone.length > 0) {
    let cleanPhone = effectivePhone;
    if (!cleanPhone.startsWith('+')) {
      if (cleanPhone.startsWith('7') || cleanPhone.startsWith('82') || cleanPhone.startsWith('8')) {
        if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
          cleanPhone = '+7' + cleanPhone.slice(1);
        } else {
          cleanPhone = '+' + cleanPhone;
        }
      }
    }
    const telDigits = cleanPhone.replace(/[^\d+]/g, '');
    const telUrl = `tel:${telDigits}`;

    if (headerPhoneBlock) headerPhoneBlock.style.display = 'flex';
    if (footerPhoneWrap) footerPhoneWrap.style.display = 'block';
    if (footerWaBtn) {
      footerWaBtn.href = `https://wa.me/${telDigits.replace('+', '')}`;
      footerWaBtn.style.display = 'inline-flex';
    }

    document.querySelectorAll('.phone-dynamic-link').forEach(link => {
      link.href = telUrl;
    });

    document.querySelectorAll('.phone-text-dynamic').forEach(span => {
      span.textContent = cleanPhone;
    });
  } else {
    // Hide phone elements when no phone is provided (preserves privacy in demo links)
    if (headerPhoneBlock) headerPhoneBlock.style.display = 'none';
    if (footerPhoneWrap) footerPhoneWrap.style.display = 'none';
    if (footerWaBtn) footerWaBtn.style.display = 'none';
  }

  // 4. Default Country Preset
  if (country) {
    const c = country.toLowerCase();
    const btnMap = {
      korea: 'btnCountryKorea',
      china: 'btnCountryChina',
      japan: 'btnCountryJapan',
      uae: 'btnCountryUae'
    };
    if (btnMap[c]) {
      const btn = document.getElementById(btnMap[c]);
      if (btn) btn.click();
    }
  }

  // 5. Default Mode Preset
  if (mode === 'encar') {
    const tabEncar = document.getElementById('tabModeEncar');
    if (tabEncar) tabEncar.click();
  }
}

// -------------------------------------------------------------
// 8. LEAD MODAL & SERVERLESS LEAD ROUTER MATRIX
// -------------------------------------------------------------
function setupModals() {
  const leadModal = document.getElementById('leadModal');
  const privacyModal = document.getElementById('privacyModal');
  const consentModal = document.getElementById('consentModal');

  // Populate dynamic legal information across the page
  if (APP_CONFIG && APP_CONFIG.legal) {
    const leg = APP_CONFIG.legal;
    if (leg.legalName) document.querySelectorAll('.legal-name-dynamic').forEach(el => el.textContent = leg.legalName);
    if (leg.inn) document.querySelectorAll('.legal-inn-dynamic').forEach(el => el.textContent = leg.inn);
    if (leg.ogrn) document.querySelectorAll('.legal-ogrn-dynamic').forEach(el => el.textContent = leg.ogrn);
    if (leg.legalAddress) document.querySelectorAll('.legal-address-dynamic').forEach(el => el.textContent = leg.legalAddress);
    if (leg.email) document.querySelectorAll('.legal-email-dynamic').forEach(el => el.textContent = leg.email);
  }

  const openLeadBtns = [
    document.getElementById('headerCtaBtn'),
    document.getElementById('orderCarBtn'),
    document.getElementById('bannerCtaBtn'),
    document.getElementById('learnMoreBtn')
  ];

  const scrollCalcBtn = document.getElementById('scrollCalcBtn');
  if (scrollCalcBtn) {
    scrollCalcBtn.addEventListener('click', () => {
      const calcSec = document.getElementById('calculator');
      if (calcSec) {
        calcSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const privacyOpenLinks = [
    document.getElementById('openPrivacyFooterLink'),
    document.getElementById('openPrivacyBottomLink'),
    document.getElementById('openPrivacyFromModal'),
    document.getElementById('openPrivacyFromModal2'),
    document.getElementById('openPrivacyModal')
  ];

  const consentOpenLinks = [
    document.getElementById('openConsentFromModal'),
    document.getElementById('openConsentFooterLink')
  ];

  const leadCloseBtn = document.getElementById('modalCloseBtn');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const privacyCloseBtn = document.getElementById('privacyCloseBtn');
  const privacyAgreeBtn = document.getElementById('privacyAgreeBtn');
  const consentCloseBtn = document.getElementById('consentCloseBtn');
  const consentAgreeBtn = document.getElementById('consentAgreeBtn');

  const leadForm = document.getElementById('leadForm');
  const modalFormView = document.getElementById('modalFormView');
  const modalSuccessView = document.getElementById('modalSuccessView');
  const modalSummaryBox = document.getElementById('modalSummaryBox');
  const modalError = document.getElementById('modalError');
  const submitBtn = document.getElementById('modalSubmitBtn');
  const consentCheck = document.getElementById('consentCheck');

  // Enforce mandatory unchecked consent disabling the submit button
  if (consentCheck && submitBtn) {
    submitBtn.disabled = !consentCheck.checked;
    consentCheck.addEventListener('change', () => {
      submitBtn.disabled = !consentCheck.checked;
    });
  }

  let modalOpenedAt = 0;

  function openLeadModalWithData() {
    modalOpenedAt = Date.now();
    if (modalSummaryBox) {
      const cfg = APP_CONFIG.countries[currentCountry] || APP_CONFIG.countries.korea;
      const resTitle = document.getElementById('resTitle')?.textContent || 'Авто под заказ';
      if (currentCalculation) {
        modalSummaryBox.textContent = `${cfg.flag} ${resTitle} • ${formatPrice(currentCalculation.totalRub)} под ключ`;
      } else {
        modalSummaryBox.textContent = `${cfg.flag} ${resTitle} • Расчет под ваш бюджет`;
      }
    }
    if (modalFormView) modalFormView.style.display = 'block';
    if (modalSuccessView) modalSuccessView.style.display = 'none';
    if (modalError) modalError.style.display = 'none';
    if (leadModal) leadModal.style.display = 'flex';
  }

  function openPrivacy() {
    if (privacyModal) privacyModal.style.display = 'flex';
  }

  function closePrivacy() {
    if (privacyModal) privacyModal.style.display = 'none';
  }

  function openConsent() {
    if (consentModal) consentModal.style.display = 'flex';
  }

  function closeConsent() {
    if (consentModal) consentModal.style.display = 'none';
  }

  function closeLeadModal() {
    if (leadModal) leadModal.style.display = 'none';
  }

  openLeadBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openLeadModalWithData);
  });

  privacyOpenLinks.forEach(link => {
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openPrivacy();
      });
    }
  });

  consentOpenLinks.forEach(link => {
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openConsent();
      });
    }
  });

  if (leadCloseBtn) leadCloseBtn.addEventListener('click', closeLeadModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeLeadModal);
  if (privacyCloseBtn) privacyCloseBtn.addEventListener('click', closePrivacy);
  if (privacyAgreeBtn) privacyAgreeBtn.addEventListener('click', closePrivacy);
  if (consentCloseBtn) consentCloseBtn.addEventListener('click', closeConsent);
  if (consentAgreeBtn) consentAgreeBtn.addEventListener('click', closeConsent);

  window.addEventListener('click', (e) => {
    if (e.target === leadModal) closeLeadModal();
    if (e.target === privacyModal) closePrivacy();
    if (e.target === consentModal) closeConsent();
  });

  // Interactive Phone Mask
  const phoneInput = document.getElementById('userPhone');
  if (phoneInput) {
    function formatPhone(val) {
      let digits = val.replace(/\D/g, '');
      if (digits.startsWith('7') || digits.startsWith('8')) {
        digits = digits.substring(1);
      }
      digits = digits.substring(0, 10);
      let res = '+7';
      if (digits.length > 0) res += ' (' + digits.substring(0, 3);
      if (digits.length >= 4) res += ') ' + digits.substring(3, 6);
      if (digits.length >= 7) res += '-' + digits.substring(6, 8);
      if (digits.length >= 9) res += '-' + digits.substring(8, 10);
      return res;
    }

    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value.trim()) {
        phoneInput.value = '+7 (';
      }
    });

    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value.trim() === '+7 (' || phoneInput.value.trim() === '+7') {
        phoneInput.value = '';
      }
    });

    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatPhone(phoneInput.value);
    });

    phoneInput.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && phoneInput.value.length <= 4) {
        e.preventDefault();
        phoneInput.value = '';
      }
    });
  }

  // Submit Handler with 152-FZ, Honeypot & CRM Dispatch
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('userName')?.value.trim();
      const phone = document.getElementById('userPhone')?.value.trim();
      const tgOrCity = document.getElementById('userTg')?.value.trim() || 'Не указан';
      const consent = document.getElementById('consentCheck')?.checked;
      const hpField = document.getElementById('userWebsiteHp');

      // 1. Basic Validation
      if (!name || !phone) {
        if (modalError) {
          modalError.textContent = 'Пожалуйста, укажите имя и телефон для связи';
          modalError.style.display = 'block';
        }
        return;
      }

      // 2. Phone mask completeness check (11 digits)
      const rawDigits = phone.replace(/\D/g, '');
      if (rawDigits.length < 11) {
        if (modalError) {
          modalError.textContent = 'Введите корректный номер телефона: +7 (XXX) XXX-XX-XX';
          modalError.style.display = 'block';
        }
        return;
      }

      // 3. 152-FZ Consent verification (unchecked by default)
      if (!consent) {
        if (modalError) {
          modalError.textContent = 'Необходимо согласие на обработку персональных данных (152-ФЗ)';
          modalError.style.display = 'block';
        }
        return;
      }

      // 4. Client-side Anti-Flood Cooldown (60 seconds)
      const lastSentTs = parseInt(localStorage.getItem('lead_last_sent_ts') || '0', 10);
      const now = Date.now();
      if (now - lastSentTs < 60000) {
        const remainingSec = Math.ceil((60000 - (now - lastSentTs)) / 1000);
        if (modalError) {
          modalError.textContent = `Заявка уже отправлена! Менеджер скоро свяжется с вами. Повторный запрос через ${remainingSec} сек.`;
          modalError.style.display = 'block';
        }
        return;
      }

      // 5. Anti-Spam: Honeypot & Speed-Gate Check
      const isHpSpam = hpField && hpField.value.trim().length > 0;
      const fillDuration = now - modalOpenedAt;
      const isTooFast = modalOpenedAt > 0 && fillDuration < 1200;

        if (isHpSpam || isTooFast) {
        console.warn('Bot detected by defense matrix. Silently discarding.');
        setTimeout(() => {
          if (modalFormView) modalFormView.style.display = 'none';
          if (modalSuccessView) modalSuccessView.style.display = 'block';
          leadForm.reset();
          if (submitBtn) {
            submitBtn.disabled = consentCheck ? !consentCheck.checked : true;
            submitBtn.innerHTML = '<span>Отправить заявку менеджеру</span><span class="btn-arrow">→</span>';
          }
        }, 300);
        return;
      }

      if (modalError) modalError.style.display = 'none';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Отправка заявки...</span>';
      }

      const resTitle = document.getElementById('resTitle')?.textContent || 'Авто под заказ';
      const resSpecs = document.getElementById('resSpecs')?.textContent || '';
      const totalNum = currentCalculation?.totalRub || 0;
      const dutyNum = currentCalculation?.customsDutyRub || 0;
      const utilNum = currentCalculation?.utilFeeRub || 0;
      const foreignPrice = currentCalculation?.priceForeign || 0;
      const currency = currentCalculation?.currencySymbol || '₩';
      const cfg = APP_CONFIG.countries[currentCountry] || APP_CONFIG.countries.korea;
      const lotInputVal = document.getElementById('encarLotInput')?.value.trim() || '';

      const payload = {
        client: {
          name: name,
          phone: phone,
          contact: tgOrCity
        },
        order: {
          car: resTitle,
          specs: resSpecs,
          country: cfg.name,
          countryKey: currentCountry,
          importType: currentCalculation?.importType || currentImportType,
          foreignPrice: `${foreignPrice.toLocaleString('ru-RU')} ${currency}`,
          cbrRate: `${RATES[cfg.currency] || 0} ₽`,
          grandTotalRub: totalNum,
          savingsRub: Math.round(totalNum * 0.15),
          customsDutyRub: dutyNum,
          utilFeeRub: utilNum,
          lotUrl: lotInputVal
        },
        name: name,
        contact: phone,
        phone: phone,
        city: tgOrCity,
        car: resTitle,
        year: selectedYear,
        price: totalNum > 0 ? formatPrice(totalNum) : 'Индивидуально',
        country: cfg.name,
        lotUrl: lotInputVal,
        user_website_hp: hpField ? hpField.value : '',
        fill_time_ms: fillDuration,
        consent: true,
        consentGivenAt: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('lead_last_sent_ts', Date.now().toString());

      // Smart Multi-Environment Lead Dispatch
      const isGitHubPages = window.location.hostname.endsWith('github.io');
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';

      let isDemoMode = isGitHubPages;

      if (!isGitHubPages && !isLocal) {
        try {
          const targetUrl = (APP_CONFIG && APP_CONFIG.leadApiUrl) ? APP_CONFIG.leadApiUrl : LOCAL_LEAD_URL;
          const resp = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!resp.ok) {
            console.info(`Lead API returned HTTP ${resp.status}. Using demo mode presentation.`);
            isDemoMode = true;
          }
        } catch (dispatchErr) {
          console.info('Backend lead dispatch note:', dispatchErr.message);
          isDemoMode = true;
        }
      } else {
        isDemoMode = true;
      }

      setTimeout(() => {
        if (modalFormView) modalFormView.style.display = 'none';
        if (modalSuccessView) {
          modalSuccessView.style.display = 'block';

          const titleEl = document.getElementById('successTitle');
          const descEl = document.getElementById('successDesc');
          const previewEl = document.getElementById('modalSmetaPreview');

          if (isDemoMode) {
            if (titleEl) titleEl.textContent = 'Заявка сформирована (демо-режим)';
            if (descEl) descEl.textContent = 'При установке калькулятора на ваш домен эти данные и полная смета автоматически создадут сделку в amoCRM / Битрикс24 и упадут в Telegram.';

            if (previewEl) {
              previewEl.style.display = 'block';
              const dutyDisplay = totalNum > 0
                ? `${Math.round(dutyNum).toLocaleString('ru-RU')} ₽ + ${Math.round(utilNum).toLocaleString('ru-RU')} ₽`
                : 'Индивидуально по лоту';
              const totalDisplay = totalNum > 0 ? formatPrice(totalNum) : 'Индивидуальный подбор';
              previewEl.innerHTML = `
                <div class="smeta-badge">⚡ Готово к интеграции в amoCRM / Битрикс24</div>
                <div class="smeta-row"><span>👤 Клиент:</span> <strong>${escapeHtml(name)} (${escapeHtml(phone)})</strong></div>
                <div class="smeta-row"><span>🚗 Авто:</span> <span>${escapeHtml(resTitle)} (${escapeHtml(selectedYear || '2021')} г.)</span></div>
                <div class="smeta-row"><span>🌍 Направление:</span> <span>${escapeHtml(cfg.name)}</span></div>
                <div class="smeta-row"><span>🏛 Таможня + Утиль:</span> <span>${dutyDisplay}</span></div>
                <div class="smeta-row"><span>💰 Итоговая стоимость:</span> <strong style="color: var(--color-primary);">${totalDisplay}</strong></div>
              `;
            }
          } else {
            if (titleEl) titleEl.textContent = 'Заявка успешно принята!';
            if (descEl) descEl.textContent = 'Менеджер уже готовит подборку лотов с аукционов. Мы свяжемся с вами в течение 15 минут по телефону или в Telegram.';
            if (previewEl) previewEl.style.display = 'none';
          }
        }

        leadForm.reset();
        if (submitBtn) {
          submitBtn.disabled = consentCheck ? !consentCheck.checked : true;
          submitBtn.innerHTML = '<span>Отправить заявку менеджеру</span><span class="btn-arrow">→</span>';
        }
      }, 350);
    });
  }
}

function setupCookieBar() {
  const cookieBar = document.getElementById('cookieBar');
  const acceptBtn = document.getElementById('cookieAcceptBtn');

  if (!cookieBar || !acceptBtn) return;

  if (localStorage.getItem('cookie_accepted_v1')) {
    cookieBar.style.display = 'none';
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookie_accepted_v1', 'true');
    cookieBar.style.display = 'none';
  });
}

function setupSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// -------------------------------------------------------------
// 9. MASTER INITIALIZATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();

  setupCountryToggles();
  setupImportTypeToggles();
  setupModeSwitcher();
  setupSelectListeners();
  setupDrawer();
  setupModals();
  setupCookieBar();
  setupSmoothNav();

  applyUrlPersonalization();
  fetchLiveCbrRates();
});
