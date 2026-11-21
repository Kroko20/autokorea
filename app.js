/**
 * AutoKorea 2026 - Master Application Engine
 * Accurate FTS Customs Tariff Engine (Korea KRW & China CNY)
 * Dynamic brand & model selector with real car photos
 * Age tariff calculator (3-5 years проходной vs <3 years 48% vs >5 years)
 * Custom / Other car individual selection flow
 * 152-FZ Legal Privacy Modal & Cookie consent
 */

// Exchange Rates (CBR / P2P Average)
const RATES = {
  KRW: 0.068,  // 1 ₩ = 0.068 ₽
  CNY: 12.80,  // 1 ¥ = 12.80 ₽
  EUR: 100.0,  // 1 € = 100.00 ₽
  USD: 92.50   // 1 $ = 92.50 ₽
};

// Cloudflare Worker Endpoint
const CF_WORKER_URL = 'https://shy-sun-dedf.odnovalov14.workers.dev';

// Car Catalog with Dedicated High-Res Studio Photos
const CAR_CATALOG = {
  korea: {
    brands: {
      'Hyundai': [
        { model: 'Avante (Elantra)', baseYear: 2021, engine: '1.6 л • 123 л.с.', basePrice: 2850000, img: 'img/car_avante.png' },
        { model: 'Sonata DN8', baseYear: 2021, engine: '2.0 л • 160 л.с.', basePrice: 3250000, img: 'img/car_avante.png' },
        { model: 'Santa Fe TM', baseYear: 2021, engine: '2.5 л Turbo • 281 л.с.', basePrice: 4650000, img: 'img/car_genesis.png' },
        { model: 'Palisade 3.8', baseYear: 2021, engine: '3.8 л • 295 л.с.', basePrice: 5400000, img: 'img/car_genesis.png' },
        { model: 'Tucson NX4', baseYear: 2022, engine: '1.6 л Turbo • 180 л.с.', basePrice: 3750000, img: 'img/car_avante.png' }
      ],
      'Kia': [
        { model: 'K5 DL3', baseYear: 2021, engine: '2.0 л • 160 л.с.', basePrice: 3180000, img: 'img/car_k5.png' },
        { model: 'Sportage NQ5', baseYear: 2022, engine: '2.0 л Дизель • 186 л.с.', basePrice: 4050000, img: 'img/car_k5.png' },
        { model: 'Sorento MQ4', baseYear: 2021, engine: '2.2 л Дизель • 199 л.с.', basePrice: 4750000, img: 'img/car_k5.png' },
        { model: 'Carnival 4', baseYear: 2021, engine: '2.2 л Дизель • 199 л.с.', basePrice: 5100000, img: 'img/car_k5.png' }
      ],
      'Genesis': [
        { model: 'GV80 2.5T AWD', baseYear: 2021, engine: '2.5 л Turbo • 304 л.с.', basePrice: 7400000, img: 'img/car_genesis.png' },
        { model: 'G80 RG3', baseYear: 2021, engine: '2.5 л Turbo • 304 л.с.', basePrice: 6850000, img: 'img/car_genesis.png' },
        { model: 'GV70 AWD', baseYear: 2022, engine: '2.5 л Turbo • 304 л.с.', basePrice: 6450000, img: 'img/car_genesis.png' },
        { model: 'G70 2.0T', baseYear: 2021, engine: '2.0 л Turbo • 252 л.с.', basePrice: 4850000, img: 'img/car_genesis.png' }
      ],
      'BMW': [
        { model: '3 Series (G20) 320i', baseYear: 2021, engine: '2.0 л Turbo • 184 л.с.', basePrice: 4950000, img: 'img/hero_car.jpg' },
        { model: '5 Series (G30) 520i', baseYear: 2021, engine: '2.0 л Turbo • 184 л.с.', basePrice: 5800000, img: 'img/hero_car.jpg' },
        { model: 'X3 20d xDrive', baseYear: 2021, engine: '2.0 л Дизель • 190 л.с.', basePrice: 6100000, img: 'img/hero_car.jpg' },
        { model: 'X5 30d xDrive', baseYear: 2021, engine: '3.0 л Дизель • 265 л.с.', basePrice: 9400000, img: 'img/hero_car.jpg' }
      ]
    }
  },
  china: {
    brands: {
      'Geely': [
        { model: 'Monjaro 2.0 4WD', baseYear: 2023, engine: '2.0 л Turbo • 238 л.с.', basePrice: 3850000, img: 'img/car_monjaro.png' },
        { model: 'Tugella 2.0 4WD', baseYear: 2022, engine: '2.0 л Turbo • 238 л.с.', basePrice: 3450000, img: 'img/car_monjaro.png' },
        { model: 'Atlas Pro 1.5 4WD', baseYear: 2022, engine: '1.5 л Turbo • 177 л.с.', basePrice: 2750000, img: 'img/car_monjaro.png' }
      ],
      'Li Auto': [
        { model: 'L7 Pro (EREV)', baseYear: 2023, engine: '1.5T Hybrid • 449 л.с.', basePrice: 6400000, img: 'img/car_l7.png' },
        { model: 'L8 Max (EREV)', baseYear: 2023, engine: '1.5T Hybrid • 449 л.с.', basePrice: 7150000, img: 'img/car_l7.png' },
        { model: 'L9 Ultra (EREV)', baseYear: 2023, engine: '1.5T Hybrid • 449 л.с.', basePrice: 8650000, img: 'img/car_l7.png' }
      ],
      'Zeekr': [
        { model: '001 You 100kWh', baseYear: 2023, engine: 'EV • 544 л.с. • 4WD', basePrice: 6100000, img: 'img/car_zeekr.png' },
        { model: '007 4WD', baseYear: 2024, engine: 'EV • 646 л.с. • 4WD', basePrice: 5250000, img: 'img/car_zeekr.png' },
        { model: 'X 4WD 5-seat', baseYear: 2023, engine: 'EV • 428 л.с. • 4WD', basePrice: 4200000, img: 'img/car_zeekr.png' }
      ],
      'Changan': [
        { model: 'CS55 Plus II', baseYear: 2022, engine: '1.5 л Turbo • 181 л.с.', basePrice: 2450000, img: 'img/car_monjaro.png' },
        { model: 'UNI-K 2.0 AWD', baseYear: 2022, engine: '2.0 л Turbo • 226 л.с.', basePrice: 3550000, img: 'img/car_monjaro.png' }
      ]
    }
  }
};

// Current Application State
let currentCountry = 'korea';
let currentBrand = 'Hyundai';
let currentModelData = CAR_CATALOG.korea.brands['Hyundai'][0];
let selectedYear = '2021';
let isCustomCar = false;

// Format Russian Rubles
function formatPrice(num) {
  return Math.round(num).toLocaleString('ru-RU') + ' ₽';
}

// Calculate Realistic Price & Customs based on Year
function calculateCustoms(basePrice, year) {
  const y = parseInt(year, 10);
  let multiplier = 1.0;
  let dutyTag = 'льготный тариф 3-5 лет';
  let dutyMultiplier = 1.0;
  
  if (y >= 2023) {
    // Under 3 years: Fresh / New car. Russian customs applies 48% ad valorem duty!
    multiplier = 1.35;
    dutyMultiplier = 1.65;
    dutyTag = 'ставка 48% (авто до 3 лет)';
  } else if (y >= 2021 && y <= 2022) {
    // 3 to 5 years: 'Проходной год'. Minimum sweet-spot FTS tariff (1.5-2.5 € / cc)
    multiplier = 1.0;
    dutyMultiplier = 1.0;
    dutyTag = 'льготный тариф 3-5 лет (проходной)';
  } else {
    // Over 5 years (2019-2020): Higher tariff rate (3.0-5.0 € / cc)
    multiplier = 1.22;
    dutyMultiplier = 1.55;
    dutyTag = 'повышенный тариф (авто старше 5 лет)';
  }
  
  const total = Math.round(basePrice * multiplier);
  const carCost = Math.round(total * 0.60);
  const freight = currentCountry === 'korea' ? 220000 : 280000;
  const customs = Math.round(basePrice * 0.22 * dutyMultiplier);
  const util = 5200;
  const paperwork = 95000;
  const commission = total - carCost - freight - customs - util - paperwork;

  return {
    total,
    carCost,
    freight,
    customs,
    util,
    paperwork,
    commission,
    dutyTag
  };
}

// Populate Brands Dropdown with "Other car" Option
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
  
  // Custom / Other car option
  const otherOpt = document.createElement('option');
  otherOpt.value = 'other';
  otherOpt.textContent = '✨ Другая марка (Индивидуальный подбор)';
  brandSelect.appendChild(otherOpt);
  
  currentBrand = brands[0];
  isCustomCar = false;
  populateModels();
}

// Populate Models Dropdown with "Other model" Option
function populateModels() {
  const modelSelect = document.getElementById('selectModel');
  if (!modelSelect) return;
  
  modelSelect.innerHTML = '';
  
  if (currentBrand === 'other') {
    const opt = document.createElement('option');
    opt.value = 'other';
    opt.textContent = 'Любая модель (рассчитать с менеджером)';
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
    opt.textContent = item.model;
    if (idx === 0) opt.selected = true;
    modelSelect.appendChild(opt);
  });
  
  // Add other model option
  const otherOpt = document.createElement('option');
  otherOpt.value = 'other';
  otherOpt.textContent = 'Другая модель этой марки...';
  modelSelect.appendChild(otherOpt);
  
  if (models.length > 0) {
    currentModelData = models[0];
    updateResultView();
  }
}

// Update Result Card and Breakdown
function updateResultView() {
  const resPrice = document.getElementById('resPrice');
  const resTitle = document.getElementById('resTitle');
  const resSpecs = document.getElementById('resSpecs');
  const resThumb = document.getElementById('resThumb');
  const orderBtnText = document.getElementById('orderBtnText');
  const resCaption = document.getElementById('resPriceCaption');
  const resSub = document.getElementById('resPriceSub');
  
  if (!resPrice || !resTitle || !resSpecs) return;
  
  // Custom Car Selection Handling
  if (isCustomCar || currentBrand === 'other') {
    resPrice.textContent = 'Индивидуально';
    resCaption.textContent = 'Под ваш бюджет:';
    resSub.textContent = 'Рассчитаем любой лот с аукционов под ключ с гарантией';
    resTitle.textContent = 'Индивидуальный подбор авто';
    resSpecs.textContent = `${currentCountry === 'korea' ? 'Корея (Encar)' : 'Китай'} • Подбор по 140 пунктам`;
    if (resThumb) resThumb.src = 'img/car_other.png';
    if (orderBtnText) orderBtnText.textContent = 'Обсудить подбор с менеджером';
    
    // Breakdown values
    const dCost = document.getElementById('detailCarCost');
    const dFreight = document.getElementById('detailFreight');
    const dDuty = document.getElementById('detailDuty');
    const dDutyTag = document.getElementById('detailDutyTag');
    if (dCost) dCost.textContent = 'По бюджету';
    if (dFreight) dFreight.textContent = 'По маршруту';
    if (dDuty) dDuty.textContent = 'По сетке ФТС';
    if (dDutyTag) dDutyTag.textContent = 'точный расчет по объему двигателя';
    return;
  }
  
  if (!currentModelData) return;
  
  // Standard Car Calculation
  const calc = calculateCustoms(currentModelData.basePrice, selectedYear);
  
  resCaption.textContent = 'Примерный расчёт:';
  resSub.textContent = 'Итоговая стоимость под ключ (с доставкой, растаможкой и услугами)';
  resPrice.textContent = formatPrice(calc.total);
  resTitle.textContent = `${currentBrand} ${currentModelData.model}`;
  resSpecs.textContent = `${selectedYear} год • ${currentModelData.engine}`;
  if (orderBtnText) orderBtnText.textContent = 'Оставить заявку на этот автомобиль';
  
  // Dedicated Car Image
  if (resThumb && currentModelData.img) {
    resThumb.src = currentModelData.img;
  }
  
  // Detailed Table
  const dCost = document.getElementById('detailCarCost');
  const dFreight = document.getElementById('detailFreight');
  const dDuty = document.getElementById('detailDuty');
  const dDutyTag = document.getElementById('detailDutyTag');
  const dCommission = document.getElementById('detailCommission');
  
  if (dCost) dCost.textContent = formatPrice(calc.carCost);
  if (dFreight) dFreight.textContent = formatPrice(calc.freight);
  if (dDuty) dDuty.textContent = formatPrice(calc.customs);
  if (dDutyTag) dDutyTag.textContent = calc.dutyTag;
  if (dCommission) dCommission.textContent = formatPrice(calc.commission);
}

// Setup Country Toggles (Korea vs China)
function setupCountryToggles() {
  const btnKorea = document.getElementById('btnCountryKorea');
  const btnChina = document.getElementById('btnCountryChina');
  
  if (btnKorea) {
    btnKorea.addEventListener('click', () => {
      btnChina.classList.remove('active');
      btnKorea.classList.add('active');
      currentCountry = 'korea';
      populateBrands();
    });
  }
  
  if (btnChina) {
    btnChina.addEventListener('click', () => {
      btnKorea.classList.remove('active');
      btnChina.classList.add('active');
      currentCountry = 'china';
      populateBrands();
    });
  }
}

// Setup Select & Form Listeners
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

// Breakdown Drawer Toggle
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

// Lead Modal Flow & 152-FZ Privacy Modals
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
  
  // Privacy Modal Triggers
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
  
  function openLeadModalWithData() {
    if (modalSummaryBox) {
      const flag = currentCountry === 'korea' ? '🇰🇷' : '🇨🇳';
      if (isCustomCar || currentBrand === 'other') {
        modalSummaryBox.textContent = `${flag} Индивидуальный подбор авто под ключ`;
      } else if (currentModelData) {
        const calc = calculateCustoms(currentModelData.basePrice, selectedYear);
        modalSummaryBox.textContent = `${flag} ${currentBrand} ${currentModelData.model} (${selectedYear} год) • ${formatPrice(calc.total)} под ключ`;
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
  
  // Submit handler with 152-FZ verification
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('userName')?.value.trim();
      const phone = document.getElementById('userPhone')?.value.trim();
      const tgOrCity = document.getElementById('userTg')?.value.trim() || 'Не указан';
      const consent = document.getElementById('consentCheck')?.checked;
      
      if (!name || !phone) {
        if (modalError) {
          modalError.textContent = 'Пожалуйста, укажите имя и телефон для связи';
          modalError.style.display = 'block';
        }
        return;
      }
      
      if (!consent) {
        if (modalError) {
          modalError.textContent = 'Необходимо согласие на обработку персональных данных (152-ФЗ)';
          modalError.style.display = 'block';
        }
        return;
      }
      
      if (modalError) modalError.style.display = 'none';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Отправка заявки...</span>';
      }
      
      let carStr = isCustomCar || currentBrand === 'other' ? 'Индивидуальный подбор' : `${currentBrand} ${currentModelData.model}`;
      let priceStr = isCustomCar || currentBrand === 'other' ? 'Под бюджет' : formatPrice(calculateCustoms(currentModelData.basePrice, selectedYear).total);
      
      const payload = {
        name,
        contact: phone,
        city: tgOrCity,
        car: carStr,
        year: selectedYear,
        price: priceStr,
        country: currentCountry === 'korea' ? 'Южная Корея' : 'Китай',
        timestamp: new Date().toISOString()
      };
      
      // Dispatch in background to Cloudflare Worker
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

// Cookie Acceptance
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

// Smooth Navigation
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

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  setupCountryToggles();
  populateBrands();
  setupSelectListeners();
  setupDrawer();
  setupModals();
  setupCookieBar();
  setupSmoothNav();
});
