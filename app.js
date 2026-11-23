/**
 * AutoKorea 2026 - Master Application Engine
 * Accurate FTS Customs Tariff Engine (Korea Encar KRW & China CNY)
 * Live Central Bank of Russia (CBR) Exchange Rates API with Fallback
 * Dynamic Free Encar Lot Calculator + Model Showcase Catalog
 * URL Personalization Engine (?brand=...&tg=...&phone=...&country=...)
 * 5-Layer Anti-Spam & Anti-Flood Defense Matrix
 * 152-FZ Legal Privacy Compliance
 */

// Exchange Rates (Live CBR rates with institutional fallback)
const RATES = {
  KRW: 0.0685, // 1 KRW = 0.0685 RUB (1 000 ₩ = 68.50 ₽)
  CNY: 13.40,  // 1 CNY = 13.40 RUB
  EUR: 104.50, // 1 EUR = 104.50 RUB
  USD: 97.20   // 1 USD = 97.20 RUB
};

// Cloudflare Worker Endpoint for Lead Processing
const CF_WORKER_URL = 'https://shy-sun-dedf.odnovalov14.workers.dev';

// Car Catalog with Original Won (KRW) and Yuan (CNY) Prices + Engine Displacement
const CAR_CATALOG = {
  korea: {
    brands: {
      'Hyundai': [
        { model: 'Avante (Elantra)', baseYear: 2021, engineDesc: '1.6 л • 123 л.с.', engineCc: 1598, priceForeign: 18500000, img: 'img/car_avante.png' },
        { model: 'Sonata DN8', baseYear: 2021, engineDesc: '2.0 л • 160 л.с.', engineCc: 1999, priceForeign: 22500000, img: 'img/car_avante.png' },
        { model: 'Santa Fe TM', baseYear: 2021, engineDesc: '2.5 л Turbo • 281 л.с.', engineCc: 2497, priceForeign: 28500000, img: 'img/car_genesis.png' },
        { model: 'Palisade 3.8', baseYear: 2021, engineDesc: '3.8 л • 295 л.с.', engineCc: 3778, priceForeign: 33000000, img: 'img/car_genesis.png' },
        { model: 'Tucson NX4', baseYear: 2022, engineDesc: '1.6 л Turbo • 180 л.с.', engineCc: 1598, priceForeign: 25000000, img: 'img/car_avante.png' }
      ],
      'Kia': [
        { model: 'K5 DL3', baseYear: 2021, engineDesc: '2.0 л • 160 л.с.', engineCc: 1999, priceForeign: 21500000, img: 'img/car_k5.png' },
        { model: 'Sportage NQ5', baseYear: 2022, engineDesc: '2.0 л Дизель • 186 л.с.', engineCc: 1998, priceForeign: 26500000, img: 'img/car_k5.png' },
        { model: 'Sorento MQ4', baseYear: 2021, engineDesc: '2.2 л Дизель • 199 л.с.', engineCc: 2151, priceForeign: 31000000, img: 'img/car_k5.png' },
        { model: 'Carnival 4', baseYear: 2021, engineDesc: '2.2 л Дизель • 199 л.с.', engineCc: 2151, priceForeign: 34000000, img: 'img/car_k5.png' }
      ],
      'Genesis': [
        { model: 'GV80 2.5T AWD', baseYear: 2021, engineDesc: '2.5 л Turbo • 304 л.с.', engineCc: 2497, priceForeign: 54000000, img: 'img/car_genesis.png' },
        { model: 'G80 RG3', baseYear: 2021, engineDesc: '2.5 л Turbo • 304 л.с.', engineCc: 2497, priceForeign: 48000000, img: 'img/car_genesis.png' },
        { model: 'GV70 AWD', baseYear: 2022, engineDesc: '2.5 л Turbo • 304 л.с.', engineCc: 2497, priceForeign: 45000000, img: 'img/car_genesis.png' },
        { model: 'G70 2.0T', baseYear: 2021, engineDesc: '2.0 л Turbo • 252 л.с.', engineCc: 1998, priceForeign: 34000000, img: 'img/car_genesis.png' }
      ],
      'BMW': [
        { model: '3 Series (G20) 320i', baseYear: 2021, engineDesc: '2.0 л Turbo • 184 л.с.', engineCc: 1998, priceForeign: 35000000, img: 'img/hero_car.jpg' },
        { model: '5 Series (G30) 520i', baseYear: 2021, engineDesc: '2.0 л Turbo • 184 л.с.', engineCc: 1998, priceForeign: 42000000, img: 'img/hero_car.jpg' },
        { model: 'X3 20d xDrive', baseYear: 2021, engineDesc: '2.0 л Дизель • 190 л.с.', engineCc: 1995, priceForeign: 44000000, img: 'img/hero_car.jpg' },
        { model: 'X5 30d xDrive', baseYear: 2021, engineDesc: '3.0 л Дизель • 265 л.с.', engineCc: 2993, priceForeign: 68000000, img: 'img/hero_car.jpg' }
      ]
    }
  },
  china: {
    brands: {
      'Geely': [
        { model: 'Monjaro 2.0 4WD', baseYear: 2023, engineDesc: '2.0 л Turbo • 238 л.с.', engineCc: 1969, priceForeign: 185000, img: 'img/car_monjaro.png' },
        { model: 'Tugella 2.0 4WD', baseYear: 2022, engineDesc: '2.0 л Turbo • 238 л.с.', engineCc: 1969, priceForeign: 160000, img: 'img/car_monjaro.png' },
        { model: 'Atlas Pro 1.5 4WD', baseYear: 2022, engineDesc: '1.5 л Turbo • 177 л.с.', engineCc: 1477, priceForeign: 125000, img: 'img/car_monjaro.png' }
      ],
      'Li Auto': [
        { model: 'L7 Pro (EREV)', baseYear: 2023, engineDesc: '1.5T Hybrid • 449 л.с.', engineCc: 1499, priceForeign: 315000, img: 'img/car_l7.png' },
        { model: 'L8 Max (EREV)', baseYear: 2023, engineDesc: '1.5T Hybrid • 449 л.с.', engineCc: 1499, priceForeign: 355000, img: 'img/car_l7.png' },
        { model: 'L9 Ultra (EREV)', baseYear: 2023, engineDesc: '1.5T Hybrid • 449 л.с.', engineCc: 1499, priceForeign: 435000, img: 'img/car_l7.png' }
      ],
      'Zeekr': [
        { model: '001 You 100kWh', baseYear: 2023, engineDesc: 'EV • 544 л.с. • 4WD', engineCc: 0, priceForeign: 320000, img: 'img/car_zeekr.png' },
        { model: '007 4WD', baseYear: 2024, engineDesc: 'EV • 646 л.с. • 4WD', engineCc: 0, priceForeign: 265000, img: 'img/car_zeekr.png' },
        { model: 'X 4WD 5-seat', baseYear: 2023, engineDesc: 'EV • 428 л.с. • 4WD', engineCc: 0, priceForeign: 210000, img: 'img/car_zeekr.png' }
      ],
      'Changan': [
        { model: 'CS55 Plus II', baseYear: 2022, engineDesc: '1.5 л Turbo • 181 л.с.', engineCc: 1494, priceForeign: 115000, img: 'img/car_monjaro.png' },
        { model: 'UNI-K 2.0 AWD', baseYear: 2022, engineDesc: '2.0 л Turbo • 226 л.с.', engineCc: 1998, priceForeign: 165000, img: 'img/car_monjaro.png' }
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
let customCalcData = {
  priceForeign: 24500000,
  engineCc: 1999,
  ageCategory: '3_to_5',
  lotTitle: ''
};
let isCustomCar = false;
let currentCalculation = null;

// Currency Formatter
function formatPrice(num) {
  return Math.round(num).toLocaleString('ru-RU') + ' ₽';
}

function formatForeign(val, country) {
  if (country === 'korea') {
    return Math.round(val).toLocaleString('ru-RU') + ' ₩';
  } else {
    return Math.round(val).toLocaleString('ru-RU') + ' ¥';
  }
}

// -------------------------------------------------------------
// 1. LIVE CBR EXCHANGE RATES FETCHER
// -------------------------------------------------------------
async function fetchLiveCbrRates() {
  const statusBadge = document.getElementById('cbrStatusBadge');
  try {
    const res = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    if (!res.ok) throw new Error('CBR network response not ok');
    const data = await res.json();
    
    if (data && data.Valute) {
      if (data.Valute.KRW) {
        RATES.KRW = data.Valute.KRW.Value / (data.Valute.KRW.Nominal || 1000);
      }
      if (data.Valute.EUR) {
        RATES.EUR = data.Valute.EUR.Value;
      }
      if (data.Valute.USD) {
        RATES.USD = data.Valute.USD.Value;
      }
      if (data.Valute.CNY) {
        RATES.CNY = data.Valute.CNY.Value / (data.Valute.CNY.Nominal || 1);
      }
      
      updateRateTickerDisplay(true);
      updateResultView();
    }
  } catch (err) {
    console.warn('CBR API fetch note (fallback rates active):', err.message);
    updateRateTickerDisplay(false);
  }
}

function updateRateTickerDisplay(isLive) {
  const elKrw = document.getElementById('cbrKrw');
  const elEur = document.getElementById('cbrEur');
  const elUsd = document.getElementById('cbrUsd');
  const elCny = document.getElementById('cbrCny');
  const elBadge = document.getElementById('cbrStatusBadge');

  if (elKrw) elKrw.textContent = (RATES.KRW * 1000).toFixed(2);
  if (elEur) elEur.textContent = RATES.EUR.toFixed(2);
  if (elUsd) elUsd.textContent = RATES.USD.toFixed(2);
  if (elCny) elCny.textContent = RATES.CNY.toFixed(2);
  if (elBadge) {
    elBadge.textContent = isLive ? 'ЦБ РФ онлайн' : 'Курс ЦБ РФ';
  }
}

// -------------------------------------------------------------
// 2. ACCURATE FTS CUSTOMS TARIFF ENGINE
// -------------------------------------------------------------
function calculateCustomsFTS({
  country = 'korea',
  priceForeign = 24500000,
  engineCc = 1999,
  ageCategory = '3_to_5',
  yearVal = '2021'
}) {
  const foreignRate = country === 'korea' ? RATES.KRW : RATES.CNY;
  const carCostRub = Math.round(priceForeign * foreignRate);
  const carCostEur = carCostRub / RATES.EUR;

  // 1. Customs Duty (Пошлина ФТС РФ)
  let dutyEur = 0;
  let dutyTag = '';
  let dutyFormulaDesc = '';

  if (ageCategory === '3_to_5') {
    // 3–5 лет (проходные): строго в евро за 1 см3 объема двигателя
    let ratePerCc = 1.5;
    if (engineCc <= 1000) ratePerCc = 1.5;
    else if (engineCc <= 1500) ratePerCc = 1.7;
    else if (engineCc <= 1800) ratePerCc = 2.5;
    else if (engineCc <= 2300) ratePerCc = 2.7;
    else if (engineCc <= 3000) ratePerCc = 3.0;
    else ratePerCc = 3.6;

    dutyEur = engineCc * ratePerCc;
    dutyTag = `3–5 лет, проходной (${ratePerCc} €/см³)`;
    dutyFormulaDesc = `${engineCc} см³ × ${ratePerCc} € = ${Math.round(dutyEur).toLocaleString('ru-RU')} €`;
  } else if (ageCategory === 'under_3') {
    // До 3 лет (свежие): 48% (или 54% если <= 8500€), но не менее ставки за см3
    let percent = 0.48;
    let minRatePerCc = 2.5;

    if (carCostEur <= 8500) {
      percent = 0.54;
      minRatePerCc = 2.5;
    } else if (carCostEur <= 16700) {
      percent = 0.48;
      minRatePerCc = 3.5;
    } else if (carCostEur <= 42300) {
      percent = 0.48;
      minRatePerCc = 5.5;
    } else if (carCostEur <= 84500) {
      percent = 0.48;
      minRatePerCc = 7.5;
    } else if (carCostEur <= 169000) {
      percent = 0.48;
      minRatePerCc = 15.0;
    } else {
      percent = 0.48;
      minRatePerCc = 20.0;
    }

    const dutyByPercent = carCostEur * percent;
    const dutyByCc = engineCc > 0 ? (engineCc * minRatePerCc) : 0;
    dutyEur = Math.max(dutyByPercent, dutyByCc);
    dutyTag = `до 3 лет (${Math.round(percent * 100)}% от стоимости)`;
    dutyFormulaDesc = dutyByPercent >= dutyByCc
      ? `${Math.round(percent * 100)}% от ${Math.round(carCostEur).toLocaleString('ru-RU')} € = ${Math.round(dutyEur).toLocaleString('ru-RU')} €`
      : `мин. ${minRatePerCc} €/см³ (${engineCc} см³) = ${Math.round(dutyEur).toLocaleString('ru-RU')} €`;
  } else {
    // Старше 5 лет (непроходные): повышенные ставки за см3
    let ratePerCc = 3.0;
    if (engineCc <= 1000) ratePerCc = 3.0;
    else if (engineCc <= 1500) ratePerCc = 3.2;
    else if (engineCc <= 1800) ratePerCc = 3.5;
    else if (engineCc <= 2300) ratePerCc = 4.8;
    else if (engineCc <= 3000) ratePerCc = 5.0;
    else ratePerCc = 5.7;

    dutyEur = engineCc * ratePerCc;
    dutyTag = `старше 5 лет, повышенная (${ratePerCc} €/см³)`;
    dutyFormulaDesc = `${engineCc} см³ × ${ratePerCc} € = ${Math.round(dutyEur).toLocaleString('ru-RU')} €`;
  }

  const customsDutyRub = Math.round(dutyEur * RATES.EUR);

  // 2. Таможенный сбор за таможенное оформление (Постановление Правительства РФ)
  let customsFeeRub = 775;
  if (carCostRub <= 200000) customsFeeRub = 775;
  else if (carCostRub <= 450000) customsFeeRub = 1550;
  else if (carCostRub <= 1200000) customsFeeRub = 3100;
  else if (carCostRub <= 2700000) customsFeeRub = 8530;
  else if (carCostRub <= 4200000) customsFeeRub = 12000;
  else if (carCostRub <= 5500000) customsFeeRub = 15500;
  else if (carCostRub <= 7000000) customsFeeRub = 20000;
  else if (carCostRub <= 8000000) customsFeeRub = 23000;
  else if (carCostRub <= 9000000) customsFeeRub = 25000;
  else if (carCostRub <= 10000000) customsFeeRub = 27000;
  else customsFeeRub = 30000;

  // 3. Утилизационный сбор РФ (для личного пользования физлиц до 3.0 л)
  let utilFeeRub = ageCategory === 'under_3' ? 3400 : 5200;
  if (engineCc > 3000 && engineCc <= 3500) {
    utilFeeRub = ageCategory === 'under_3' ? 972000 : 1620000;
  } else if (engineCc > 3500) {
    utilFeeRub = ageCategory === 'under_3' ? 1235000 : 1620000;
  }

  // 4. Логистика и расходы в стране отправления
  let freightAndOriginRub = 0;
  if (country === 'korea') {
    const koreaLocalCosts = Math.round(1500000 * RATES.KRW); // снятие с учета, порт Инчхон/Пусан
    const seaFreight = Math.round(1100 * RATES.USD);         // паром во Владивосток
    freightAndOriginRub = koreaLocalCosts + seaFreight;
  } else {
    const chinaLocalCosts = Math.round(6500 * RATES.CNY);   // экспортная лицензия Хоргос
    const deliveryToRf = 185000;                             // автовоз в РФ
    freightAndOriginRub = chinaLocalCosts + deliveryToRf;
  }

  // 5. Оформление в РФ: СБКТС, ЭПТС, лаборатория, таможенный брокер
  const paperworkAndCertRub = 95000;

  // 6. Фиксированная комиссия под ключ
  const commissionRub = 120000;

  // Итого под ключ
  const totalRub = carCostRub + customsDutyRub + customsFeeRub + utilFeeRub + freightAndOriginRub + paperworkAndCertRub + commissionRub;

  return {
    priceForeign,
    foreignCurrency: country === 'korea' ? '₩' : '¥',
    carCostRub,
    carCostEur,
    customsDutyRub,
    customsFeeRub,
    utilFeeRub,
    freightAndOriginRub,
    paperworkAndCertRub,
    commissionRub,
    totalRub,
    dutyTag,
    dutyFormulaDesc
  };
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
  const brands = Object.keys(CAR_CATALOG[currentCountry].brands);
  
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
  
  currentBrand = brands[0];
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
    opt.textContent = 'Любая модель (свободный расчет с Encar)';
    modelSelect.appendChild(opt);
    isCustomCar = true;
    updateResultView();
    return;
  }
  
  isCustomCar = false;
  const models = CAR_CATALOG[currentCountry].brands[currentBrand] || [];
  
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

function updateResultView() {
  const resPrice = document.getElementById('resPrice');
  const resTitle = document.getElementById('resTitle');
  const resSpecs = document.getElementById('resSpecs');
  const resThumb = document.getElementById('resThumb');
  const orderBtnText = document.getElementById('orderBtnText');
  const resCaption = document.getElementById('resPriceCaption');
  const resSub = document.getElementById('resPriceSub');
  
  if (!resPrice || !resTitle || !resSpecs) return;

  let calc = null;
  let carName = '';
  let specsText = '';
  let imgSrc = 'img/calc_cars.png';
  let foreignSummary = '';

  if (calcMode === 'encar') {
    // Mode 2: Free Encar / Custom Lot
    const priceForeign = parseFloat(document.getElementById('encarPriceInput')?.value) || 24500000;
    const engineCc = parseInt(document.getElementById('encarEngineCcInput')?.value, 10) || 1999;
    const ageCategory = document.getElementById('encarAgeSelect')?.value || '3_to_5';
    const lotInput = document.getElementById('encarLotInput')?.value.trim();

    calc = calculateCustomsFTS({
      country: currentCountry,
      priceForeign,
      engineCc,
      ageCategory
    });

    const flag = currentCountry === 'korea' ? '🇰🇷' : '🇨🇳';
    carName = lotInput ? `${flag} ${lotInput}` : `${flag} Автомобиль с ${currentCountry === 'korea' ? 'Encar' : 'рынка Китая'}`;
    const ageLabel = ageCategory === '3_to_5' ? '3–5 лет (проходной)' : (ageCategory === 'under_3' ? 'до 3 лет' : 'старше 5 лет');
    specsText = `${(engineCc / 1000).toFixed(1)} л (${engineCc} см³) • ${ageLabel}`;
    imgSrc = currentCountry === 'korea' ? 'img/car_k5.png' : 'img/car_monjaro.png';
    foreignSummary = formatForeign(priceForeign, currentCountry);
  } else {
    // Mode 1: Catalog
    if (isCustomCar || currentBrand === 'other') {
      resPrice.textContent = 'Индивидуально';
      resCaption.textContent = 'Под ваш бюджет:';
      resSub.textContent = 'Рассчитаем любой лот с Encar под ключ с фиксированной гарантией';
      resTitle.textContent = 'Индивидуальный подбор авто';
      resSpecs.textContent = `${currentCountry === 'korea' ? 'Корея (Encar)' : 'Китай'} • Расчет по тарифам ФТС 2026`;
      if (resThumb) resThumb.src = 'img/car_other.png';
      if (orderBtnText) orderBtnText.textContent = 'Обсудить подбор с менеджером';
      return;
    }

    if (!currentModelData) return;

    const ageCategory = getAgeCategoryFromYear(selectedYear);
    calc = calculateCustomsFTS({
      country: currentCountry,
      priceForeign: currentModelData.priceForeign,
      engineCc: currentModelData.engineCc,
      ageCategory,
      yearVal: selectedYear
    });

    carName = `${currentBrand} ${currentModelData.model}`;
    specsText = `${selectedYear} год • ${currentModelData.engineDesc}`;
    imgSrc = currentModelData.img || 'img/calc_cars.png';
    foreignSummary = formatForeign(currentModelData.priceForeign, currentCountry);
  }

  currentCalculation = calc;

  // Update Result Banner
  resCaption.textContent = 'Точный расчет под ключ:';
  resSub.textContent = `Включает: авто на аукционе, растаможку ФТС, утильсбор, фрахт и СБКТС/ЭПТС`;
  resPrice.textContent = formatPrice(calc.totalRub);
  resTitle.textContent = carName;
  resSpecs.textContent = specsText;
  if (orderBtnText) orderBtnText.textContent = 'Оставить заявку на этот автомобиль';
  if (resThumb) resThumb.src = imgSrc;

  // Update Breakdown Drawer
  const dCost = document.getElementById('detailCarCost');
  const dForeign = document.getElementById('detailForeignPrice');
  const dFreight = document.getElementById('detailFreight');
  const dDuty = document.getElementById('detailDuty');
  const dDutyFormula = document.getElementById('detailDutyFormula');
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
  if (dUtil) dUtil.textContent = formatPrice(calc.utilFeeRub);
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
  const currencyTag = document.getElementById('encarCurrencyTag');
  const lblPrice = document.getElementById('lblEncarPrice');

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

  // Quick Chips for Free Encar Input
  document.querySelectorAll('.quick-chip-btn[data-price]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pInput = document.getElementById('encarPriceInput');
      if (pInput) {
        pInput.value = btn.getAttribute('data-price');
        updateResultView();
      }
    });
  });

  document.querySelectorAll('.quick-chip-btn[data-cc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ccInput = document.getElementById('encarEngineCcInput');
      if (ccInput) {
        ccInput.value = btn.getAttribute('data-cc');
        updateResultView();
      }
    });
  });

  // Real-time input listeners for free calculator
  const pInput = document.getElementById('encarPriceInput');
  const ccInput = document.getElementById('encarEngineCcInput');
  const ageSelect = document.getElementById('encarAgeSelect');
  const lotInput = document.getElementById('encarLotInput');

  if (pInput) pInput.addEventListener('input', updateResultView);
  if (ccInput) ccInput.addEventListener('input', updateResultView);
  if (ageSelect) ageSelect.addEventListener('change', updateResultView);
  if (lotInput) lotInput.addEventListener('input', updateResultView);
}

// -------------------------------------------------------------
// 5. COUNTRY TOGGLES & SELECT LISTENERS
// -------------------------------------------------------------
function setupCountryToggles() {
  const btnKorea = document.getElementById('btnCountryKorea');
  const btnChina = document.getElementById('btnCountryChina');
  const currencyTag = document.getElementById('encarCurrencyTag');
  const lblPrice = document.getElementById('lblEncarPrice');
  const currencyHint = document.getElementById('encarCurrencyHint');
  
  function applyCountry(country) {
    currentCountry = country;
    const priceChipsRow = document.querySelector('#encarFieldsWrap .calc-field-group:first-child .quick-chips-row');
    
    if (country === 'korea') {
      btnKorea?.classList.add('active');
      btnChina?.classList.remove('active');
      if (currencyTag) currencyTag.textContent = '₩ (воны)';
      if (lblPrice) lblPrice.textContent = 'Цена на Encar';
      if (currencyHint) currencyHint.textContent = 'в вонах (₩)';
      const pInput = document.getElementById('encarPriceInput');
      if (pInput && pInput.value < 1000000) pInput.value = 24500000;
      
      if (priceChipsRow) {
        priceChipsRow.innerHTML = `
          <button type="button" class="quick-chip-btn" data-price="18500000">18.5 млн ₩</button>
          <button type="button" class="quick-chip-btn" data-price="24500000">24.5 млн ₩</button>
          <button type="button" class="quick-chip-btn" data-price="32000000">32 млн ₩</button>
          <button type="button" class="quick-chip-btn" data-price="54000000">54 млн ₩</button>
        `;
      }
    } else {
      btnChina?.classList.add('active');
      btnKorea?.classList.remove('active');
      if (currencyTag) currencyTag.textContent = '¥ (юани)';
      if (lblPrice) lblPrice.textContent = 'Цена в Китае';
      if (currencyHint) currencyHint.textContent = 'в юанях (¥)';
      const pInput = document.getElementById('encarPriceInput');
      if (pInput && pInput.value > 1000000) pInput.value = 185000;
      
      if (priceChipsRow) {
        priceChipsRow.innerHTML = `
          <button type="button" class="quick-chip-btn" data-price="125000">125 тыс ¥</button>
          <button type="button" class="quick-chip-btn" data-price="185000">185 тыс ¥</button>
          <button type="button" class="quick-chip-btn" data-price="265000">265 тыс ¥</button>
          <button type="button" class="quick-chip-btn" data-price="350000">350 тыс ¥</button>
        `;
      }
    }

    if (priceChipsRow) {
      priceChipsRow.querySelectorAll('.quick-chip-btn[data-price]').forEach(btn => {
        btn.addEventListener('click', () => {
          const pInput = document.getElementById('encarPriceInput');
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

  if (btnKorea) btnKorea.addEventListener('click', () => applyCountry('korea'));
  if (btnChina) btnChina.addEventListener('click', () => applyCountry('china'));
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
      const models = CAR_CATALOG[currentCountry].brands[currentBrand] || [];
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
        banner.style.boxShadow = '0 0 0 3px #5833EA, 0 12px 36px rgba(88,51,234,0.18)';
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
  if (!toggleBtn || !drawer) return;
  
  toggleBtn.addEventListener('click', () => {
    const isHidden = drawer.style.display === 'none';
    drawer.style.display = isHidden ? 'block' : 'none';
    toggleBtn.classList.toggle('active', isHidden);
  });
}

// -------------------------------------------------------------
// 6. URL PERSONALIZATION ENGINE (?brand=...&tg=...&phone=...)
// -------------------------------------------------------------
function applyUrlPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const brand = params.get('brand') || params.get('company') || params.get('name');
  const tg = params.get('tg') || params.get('telegram');
  const phone = params.get('phone') || params.get('tel');
  const country = params.get('country');
  const mode = params.get('mode');

  // 1. Dynamic Brand Name Replacement
  if (brand) {
    const cleanBrand = brand.trim();
    document.title = `${cleanBrand} — Автомобили из Кореи и Китая под ключ`;
    
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

    // Show header Telegram pill
    const headerTgPill = document.getElementById('headerTgPill');
    const headerTgUsername = document.getElementById('headerTgUsername');
    if (headerTgPill && headerTgUsername) {
      headerTgPill.href = tgUrl;
      headerTgUsername.textContent = `@${cleanTg}`;
      headerTgPill.style.display = 'inline-flex';
    }

    // Update footer Telegram button
    const footerTgBtn = document.getElementById('footerTgBtn');
    if (footerTgBtn) {
      footerTgBtn.href = tgUrl;
    }

    // Update all dynamic telegram links
    document.querySelectorAll('.tg-dynamic-link').forEach(link => {
      link.href = tgUrl;
    });
  }

  // 3. Dynamic Phone Replacement
  if (phone) {
    const cleanPhone = phone.trim();
    const telUrl = `tel:${cleanPhone.replace(/[^\d+]/g, '')}`;

    document.querySelectorAll('.phone-dynamic-link').forEach(link => {
      link.href = telUrl;
    });

    document.querySelectorAll('.phone-text-dynamic').forEach(span => {
      span.textContent = cleanPhone;
    });
  }

  // 4. Default Country Preset
  if (country && (country.toLowerCase() === 'china' || country.toLowerCase() === 'korea')) {
    const btn = country.toLowerCase() === 'china' ? document.getElementById('btnCountryChina') : document.getElementById('btnCountryKorea');
    if (btn) btn.click();
  }

  // 5. Default Mode Preset
  if (mode === 'encar') {
    const tabEncar = document.getElementById('tabModeEncar');
    if (tabEncar) tabEncar.click();
  }
}

// -------------------------------------------------------------
// 7. LEAD MODAL & 5-LAYER ANTI-SPAM DEFENSE
// -------------------------------------------------------------
function setupModals() {
  const leadModal = document.getElementById('leadModal');
  const privacyModal = document.getElementById('privacyModal');
  
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
  
  const leadCloseBtn = document.getElementById('modalCloseBtn');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const privacyCloseBtn = document.getElementById('privacyCloseBtn');
  const privacyAgreeBtn = document.getElementById('privacyAgreeBtn');
  
  const leadForm = document.getElementById('leadForm');
  const modalFormView = document.getElementById('modalFormView');
  const modalSuccessView = document.getElementById('modalSuccessView');
  const modalSummaryBox = document.getElementById('modalSummaryBox');
  const modalError = document.getElementById('modalError');
  const submitBtn = document.getElementById('modalSubmitBtn');
  
  let modalOpenedAt = 0;

  function openLeadModalWithData() {
    modalOpenedAt = Date.now();
    if (modalSummaryBox && currentCalculation) {
      const flag = currentCountry === 'korea' ? '🇰🇷' : '🇨🇳';
      const resTitle = document.getElementById('resTitle')?.textContent || 'Авто под заказ';
      modalSummaryBox.textContent = `${flag} ${resTitle} • ${formatPrice(currentCalculation.totalRub)} под ключ`;
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
  
  if (leadCloseBtn) leadCloseBtn.addEventListener('click', closeLeadModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeLeadModal);
  if (privacyCloseBtn) privacyCloseBtn.addEventListener('click', closePrivacy);
  if (privacyAgreeBtn) privacyAgreeBtn.addEventListener('click', closePrivacy);
  
  window.addEventListener('click', (e) => {
    if (e.target === leadModal) closeLeadModal();
    if (e.target === privacyModal) closePrivacy();
  });
  
  // Interactive Phone Mask: +7 (___) ___-__-__
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
  
  // Submit handler with 152-FZ, Honeypot, Speed-Gate & Cooldown
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('userName')?.value.trim();
      const phone = document.getElementById('userPhone')?.value.trim();
      const tgOrCity = document.getElementById('userTg')?.value.trim() || 'Не указан';
      const consent = document.getElementById('consentCheck')?.checked;
      const hpField = document.getElementById('userWebsiteHp');
      
      // 1. Basic validation
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
      
      // 3. 152-FZ Consent verification
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
        console.warn('Bot detected by defense matrix. Silently discarding submission.');
        setTimeout(() => {
          if (modalFormView) modalFormView.style.display = 'none';
          if (modalSuccessView) modalSuccessView.style.display = 'block';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Отправить заявку менеджеру</span><span class="btn-arrow">→</span>';
          }
          leadForm.reset();
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
      const foreignPrice = currentCalculation?.priceForeign || 0;
      const currency = currentCalculation?.foreignCurrency || '₩';
      
      const payload = {
        client: {
          name: name,
          phone: phone,
          contact: tgOrCity
        },
        order: {
          car: resTitle,
          specs: resSpecs,
          country: currentCountry === 'korea' ? 'Южная Корея' : 'Китай',
          foreignPrice: `${foreignPrice.toLocaleString('ru-RU')} ${currency}`,
          cbrRate: currentCountry === 'korea' ? `${(RATES.KRW * 1000).toFixed(2)} ₽/1000₩` : `${RATES.CNY.toFixed(2)} ₽/¥`,
          grandTotalRub: totalNum,
          savingsRub: Math.round(totalNum * 0.15),
          customsDutyRub: dutyNum
        },
        name: name,
        contact: phone,
        city: tgOrCity,
        car: resTitle,
        year: selectedYear,
        price: formatPrice(totalNum),
        country: currentCountry === 'korea' ? 'Южная Корея' : 'Китай',
        user_website_hp: hpField ? hpField.value : '',
        fill_time_ms: fillDuration,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('lead_last_sent_ts', Date.now().toString());

      fetch(CF_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => {
        console.info('Worker dispatch note (local test):', err);
      });
      
      setTimeout(() => {
        if (modalFormView) modalFormView.style.display = 'none';
        if (modalSuccessView) modalSuccessView.style.display = 'block';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Отправить заявку менеджеру</span><span class="btn-arrow">→</span>';
        }
        leadForm.reset();
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
// 8. MASTER INITIALIZATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  setupCountryToggles();
  setupModeSwitcher();
  populateBrands();
  setupSelectListeners();
  setupDrawer();
  setupModals();
  setupCookieBar();
  setupSmoothNav();

  // Apply URL personalization right away
  applyUrlPersonalization();

  // Fetch live CBR rates in background
  fetchLiveCbrRates();
});
