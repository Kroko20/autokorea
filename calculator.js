/**
 * AutoCalculator 2026 - Independent Customs & Turnkey Calculation Module
 * Implements Eurasian Economic Commission (EEC) Decision No. 107,
 * Russian Federation Government Decrees No. 1291 (with 2025–2026 indexation & 160 hp threshold),
 * and Tax Code of the Russian Federation (Art. 164 for 22% VAT, Art. 193 for 2026 Excise).
 * 
 * Works in both Browser (window.AutoCalculator) and Node.js (module.exports).
 */

(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.AutoCalculator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Embedded default tariffs fallback for 2026
  const DEFAULT_TARIFFS = {
    preferentialLimits: {
      maxEngineCc: 3000,
      maxHorsepower: 160
    },
    dutyUnder3Years: [
      { minEur: 0, maxEur: 8500, percent: 0.54, minRatePerCc: 2.5, desc: "до 8 500 € — 54%, но не менее 2.5 €/см³" },
      { minEur: 8501, maxEur: 16700, percent: 0.48, minRatePerCc: 3.5, desc: "8 501 – 16 700 € — 48%, но не менее 3.5 €/см³" },
      { minEur: 16701, maxEur: 42300, percent: 0.48, minRatePerCc: 5.5, desc: "16 701 – 42 300 € — 48%, но не менее 5.5 €/см³" },
      { minEur: 42301, maxEur: 84500, percent: 0.48, minRatePerCc: 7.5, desc: "42 301 – 84 500 € — 48%, но не менее 7.5 €/см³" },
      { minEur: 84501, maxEur: 169000, percent: 0.48, minRatePerCc: 15.0, desc: "84 501 – 169 000 € — 48%, но не менее 15.0 €/см³" },
      { minEur: 169001, maxEur: null, percent: 0.48, minRatePerCc: 20.0, desc: "свыше 169 000 € — 48%, но не менее 20.0 €/см³" }
    ],
    duty3To5Years: [
      { maxCc: 1000, ratePerCc: 1.5, desc: "до 1 000 см³ — 1.5 €/см³" },
      { maxCc: 1500, ratePerCc: 1.7, desc: "1 001 – 1 500 см³ — 1.7 €/см³" },
      { maxCc: 1800, ratePerCc: 2.5, desc: "1 501 – 1 800 см³ — 2.5 €/см³" },
      { maxCc: 2300, ratePerCc: 2.7, desc: "1 801 – 2 300 см³ — 2.7 €/см³" },
      { maxCc: 3000, ratePerCc: 3.0, desc: "2 301 – 3 000 см³ — 3.0 €/см³" },
      { maxCc: null, ratePerCc: 3.6, desc: "свыше 3 000 см³ — 3.6 €/см³" }
    ],
    dutyOver5Years: [
      { maxCc: 1000, ratePerCc: 3.0, desc: "до 1 000 см³ — 3.0 €/см³" },
      { maxCc: 1500, ratePerCc: 3.2, desc: "1 001 – 1 500 см³ — 3.2 €/см³" },
      { maxCc: 1800, ratePerCc: 3.5, desc: "1 501 – 1 800 см³ — 3.5 €/см³" },
      { maxCc: 2300, ratePerCc: 4.8, desc: "1 801 – 2 300 см³ — 4.8 €/см³" },
      { maxCc: 3000, ratePerCc: 5.0, desc: "2 301 – 3 000 см³ — 5.0 €/см³" },
      { maxCc: null, ratePerCc: 5.7, desc: "свыше 3 000 см³ — 5.7 €/см³" }
    ],
    evCustoms: {
      dutyPercent: 0.15,
      vatPercent: 0.22,
      exciseRates: [
        { minHp: 0, maxHp: 90, ratePerHp: 0 },
        { minHp: 91, maxHp: 150, ratePerHp: 66 },
        { minHp: 151, maxHp: 200, ratePerHp: 637 },
        { minHp: 201, maxHp: 300, ratePerHp: 1044 },
        { minHp: 301, maxHp: 400, ratePerHp: 1780 },
        { minHp: 401, maxHp: 500, ratePerHp: 1841 },
        { minHp: 501, maxHp: null, ratePerHp: 1902 }
      ]
    },
    customsFees: [
      { maxRub: 200000, fee: 775 },
      { maxRub: 450000, fee: 1550 },
      { maxRub: 1200000, fee: 3100 },
      { maxRub: 2700000, fee: 8530 },
      { maxRub: 4200000, fee: 12000 },
      { maxRub: 5500000, fee: 15500 },
      { maxRub: 7000000, fee: 20000 },
      { maxRub: 8000000, fee: 23000 },
      { maxRub: 9000000, fee: 25000 },
      { maxRub: 10000000, fee: 27000 },
      { maxRub: null, fee: 30000 }
    ],
    recyclingFee: {
      baseRate: 20000,
      personal: {
        under_3: {
          up_to_3000cc: { coefficient: 0.17, amount: 3400 },
          from_3001_to_3500cc: { coefficient: 107.68, amount: 2153600 },
          over_3500cc: { coefficient: 137.11, amount: 2742200 },
          ev: { coefficient: 0.17, amount: 3400 }
        },
        over_3: {
          up_to_3000cc: { coefficient: 0.26, amount: 5200 },
          from_3001_to_3500cc: { coefficient: 142.16, amount: 2843200 },
          over_3500cc: { coefficient: 180.29, amount: 3605800 },
          ev: { coefficient: 0.26, amount: 5200 }
        }
      },
      commercial: {
        under_3: {
          up_to_1000cc: { coefficient: 9.02, amount: 180400 },
          from_1001_to_2000cc: { coefficient: 33.37, amount: 667400 },
          from_2001_to_3000cc: { coefficient: 93.92, amount: 1878400 },
          from_3001_to_3500cc: { coefficient: 107.68, amount: 2153600 },
          over_3500cc: { coefficient: 137.11, amount: 2742200 },
          ev: { coefficient: 33.37, amount: 667400 }
        },
        over_3: {
          up_to_1000cc: { coefficient: 23.00, amount: 460000 },
          from_1001_to_2000cc: { coefficient: 52.49, amount: 1049800 },
          from_2001_to_3000cc: { coefficient: 142.48, amount: 2849600 },
          from_3001_to_3500cc: { coefficient: 142.16, amount: 2843200 },
          over_3500cc: { coefficient: 180.29, amount: 3605800 },
          ev: { coefficient: 58.70, amount: 1174000 }
        }
      }
    }
  };

  /**
   * 1. Customs Duty Calculator (Пошлина ФТС РФ / СТП для EV с НДС 22%)
   */
  function calculateDuty({
    carCostEur,
    carCostRub,
    engineCc,
    horsepower = 0,
    ageCategory,
    isEv = false,
    eurRate = 100,
    tariffs = DEFAULT_TARIFFS
  }) {
    const cc = Math.max(0, Number(engineCc) || 0);
    const eur = Math.max(0, Number(carCostEur) || 0);
    const rub = Math.max(0, Number(carCostRub) || (eur * eurRate));
    const hp = Math.max(0, Number(horsepower) || (isEv ? 272 : 0));

    // A. Electric Vehicles (СТП: Пошлина 15% + Акциз 2026 по л.с. + НДС 22%)
    if (isEv || (cc === 0 && hp > 0)) {
      const evConfig = tariffs.evCustoms || DEFAULT_TARIFFS.evCustoms;
      const dutyPercent = evConfig.dutyPercent || 0.15;
      const vatPercent = evConfig.vatPercent !== undefined ? evConfig.vatPercent : 0.22; // НДС 22% с 2026 г.
      const exciseBrackets = evConfig.exciseRates || DEFAULT_TARIFFS.evCustoms.exciseRates;

      let ratePerHp = 0;
      for (const b of exciseBrackets) {
        if (b.maxHp === null || hp <= b.maxHp) {
          ratePerHp = b.ratePerHp;
          break;
        }
      }

      const evDutyRub = Math.round(rub * dutyPercent);
      const exciseRub = Math.round(hp * ratePerHp);
      const vatBaseRub = rub + evDutyRub + exciseRub;
      const vatRub = Math.round(vatBaseRub * vatPercent);
      const stpTotalRub = evDutyRub + exciseRub + vatRub;
      const dutyEur = stpTotalRub / eurRate;
      const vatPercentLabel = Math.round(vatPercent * 100);

      return {
        isEv: true,
        dutyEur,
        dutyRub: stpTotalRub,
        evDutyRub,
        exciseRub,
        vatRub,
        vatPercent,
        horsepower: hp,
        ratePerHp,
        dutyTag: `СТП для электромобилей (15% + Акциз + НДС ${vatPercentLabel}%)`,
        dutyFormula: `Пошлина 15% (${Math.round(evDutyRub).toLocaleString('ru-RU')} ₽) + Акциз (${Math.round(exciseRub).toLocaleString('ru-RU')} ₽) + НДС ${vatPercentLabel}% (${Math.round(vatRub).toLocaleString('ru-RU')} ₽) = ${Math.round(stpTotalRub).toLocaleString('ru-RU')} ₽`
      };
    }

    // B. Internal Combustion & Hybrids
    let dutyEur = 0;
    let dutyTag = '';
    let dutyFormula = '';

    if (ageCategory === '3_to_5') {
      const brackets = tariffs.duty3To5Years || DEFAULT_TARIFFS.duty3To5Years;
      let ratePerCc = 3.6;
      for (const b of brackets) {
        if (b.maxCc === null || cc <= b.maxCc) {
          ratePerCc = b.ratePerCc;
          break;
        }
      }
      dutyEur = cc * ratePerCc;
      dutyTag = `3–5 лет (${ratePerCc} €/см³)`;
      dutyFormula = `${cc.toLocaleString('ru-RU')} см³ × ${ratePerCc} € = ${Math.round(dutyEur).toLocaleString('ru-RU')} €`;

    } else if (ageCategory === 'under_3') {
      const brackets = tariffs.dutyUnder3Years || DEFAULT_TARIFFS.dutyUnder3Years;
      let percent = 0.48;
      let minRatePerCc = 2.5;

      for (const b of brackets) {
        if (b.maxEur === null || eur <= b.maxEur) {
          percent = b.percent;
          minRatePerCc = b.minRatePerCc;
          break;
        }
      }

      const dutyByPercent = eur * percent;
      const dutyByCc = cc > 0 ? (cc * minRatePerCc) : 0;
      dutyEur = Math.max(dutyByPercent, dutyByCc);

      dutyTag = `до 3 лет (${Math.round(percent * 100)}%)`;
      dutyFormula = dutyByPercent >= dutyByCc
        ? `${Math.round(percent * 100)}% от ${Math.round(eur).toLocaleString('ru-RU')} € = ${Math.round(dutyEur).toLocaleString('ru-RU')} €`
        : `мин. ${minRatePerCc} €/см³ (${cc} см³) = ${Math.round(dutyEur).toLocaleString('ru-RU')} €`;

    } else {
      // over_5 years
      const brackets = tariffs.dutyOver5Years || DEFAULT_TARIFFS.dutyOver5Years;
      let ratePerCc = 5.7;
      for (const b of brackets) {
        if (b.maxCc === null || cc <= b.maxCc) {
          ratePerCc = b.ratePerCc;
          break;
        }
      }
      dutyEur = cc * ratePerCc;
      dutyTag = `старше 5 лет (${ratePerCc} €/см³)`;
      dutyFormula = `${cc.toLocaleString('ru-RU')} см³ × ${ratePerCc} € = ${Math.round(dutyEur).toLocaleString('ru-RU')} €`;
    }

    return {
      isEv: false,
      dutyEur,
      dutyRub: Math.round(dutyEur * eurRate),
      dutyTag,
      dutyFormula
    };
  }

  /**
   * 2. Customs Processing Fee (Таможенный сбор за оформление)
   */
  function calculateCustomsFee({ carCostRub, tariffs = DEFAULT_TARIFFS }) {
    const rub = Math.max(0, Number(carCostRub) || 0);
    const brackets = tariffs.customsFees || DEFAULT_TARIFFS.customsFees;
    let fee = 30000;

    for (const b of brackets) {
      if (b.maxRub === null || rub <= b.maxRub) {
        fee = b.fee;
        break;
      }
    }
    return fee;
  }

  /**
   * 3. Disposal Fee (Утилизационный сбор РФ: 2026 порог 160 л.с. и 3.0 л)
   */
  function calculateUtilFee({
    engineCc,
    horsepower = 0,
    ageCategory,
    importType = 'personal',
    isEv = false,
    tariffs = DEFAULT_TARIFFS
  }) {
    const cc = Math.max(0, Number(engineCc) || 0);
    const hp = Math.max(0, Number(horsepower) || 0);
    const ageKey = ageCategory === 'under_3' ? 'under_3' : 'over_3';

    // 2025–2026 Strict Rule: Preferential rate (3,400 ₽ / 5,200 ₽) applies ONLY IF:
    // 1) importType === 'personal'
    // 2) hp <= 160 л.с. (для всех типов ТС: ДВС, гибриды, электромобили)
    // 3) cc <= 3000 см³ (для ДВС и гибридов)
    let isPreferential = false;
    let utilFeeReason = '';
    let reasonCode = 'commercial';

    if (importType === 'personal') {
      if (hp > 160) {
        isPreferential = false;
        reasonCode = 'over_hp';
        utilFeeReason = `Коммерческий утиль: мощность свыше 160 л.с. (${hp} л.с.)`;
      } else if (cc > 3000 && !isEv) {
        isPreferential = false;
        reasonCode = 'over_cc';
        utilFeeReason = `Коммерческий утиль: объем мотора свыше 3.0 л (${cc} см³)`;
      } else {
        isPreferential = true;
        reasonCode = 'preferential';
        utilFeeReason = `Льготный утиль (мощность ≤ 160 л.с., объем ≤ 3.0 л)`;
      }
    } else {
      isPreferential = false;
      reasonCode = 'commercial';
      utilFeeReason = `Коммерческий ввоз (для перепродажи / юрлицо)`;
    }

    const typeKey = isPreferential ? 'personal' : 'commercial';
    const rFeeConfig = tariffs.recyclingFee || tariffs.utilFees || DEFAULT_TARIFFS.recyclingFee;
    const baseRate = rFeeConfig.baseRate || 20000;
    const categoryMap = rFeeConfig[typeKey] ? rFeeConfig[typeKey][ageKey] : null;

    if (!categoryMap) {
      return {
        amountRub: 5200,
        isPreferential,
        reasonCode,
        utilFeeReason,
        typeKey
      };
    }

    let targetEntry = null;

    if (isEv || cc === 0) {
      targetEntry = categoryMap.ev;
    } else if (typeKey === 'personal') {
      if (cc <= 3000) targetEntry = categoryMap.up_to_3000cc;
      else if (cc <= 3500) targetEntry = categoryMap.from_3001_to_3500cc;
      else targetEntry = categoryMap.over_3500cc;
    } else {
      // commercial
      if (cc <= 1000) targetEntry = categoryMap.up_to_1000cc;
      else if (cc <= 2000) targetEntry = categoryMap.from_1001_to_2000cc;
      else if (cc <= 3000) targetEntry = categoryMap.from_2001_to_3000cc;
      else if (cc <= 3500) targetEntry = categoryMap.from_3001_to_3500cc;
      else targetEntry = categoryMap.over_3500cc;
    }

    let amountRub = 5200;
    let coefficient = null;

    if (targetEntry) {
      if (typeof targetEntry === 'number') {
        amountRub = targetEntry;
      } else if (targetEntry.amount !== undefined) {
        amountRub = targetEntry.amount;
        coefficient = targetEntry.coefficient;
      } else if (targetEntry.coefficient !== undefined) {
        coefficient = targetEntry.coefficient;
        amountRub = Math.round(baseRate * coefficient);
      }
    }

    return {
      amountRub,
      coefficient,
      isPreferential,
      reasonCode,
      utilFeeReason,
      typeKey
    };
  }

  /**
   * 4. Logistics & Local Export Expenses
   */
  function calculateLogistics({ country = 'korea', rates, configCountrySettings = {} }) {
    const localForeign = Number(configCountrySettings.localCostsForeign) || 0;
    const freightUsd = Number(configCountrySettings.seaFreightUsd) || 0;
    const inlandRub = Number(configCountrySettings.inlandDeliveryRub) || 0;

    let localRub = 0;
    if (country === 'korea') {
      localRub = Math.round(localForeign * (rates.KRW || 0.0614));
    } else if (country === 'china') {
      localRub = Math.round(localForeign * (rates.CNY || 12.26));
    } else if (country === 'japan') {
      localRub = Math.round(localForeign * (rates.JPY || 0.515));
    } else if (country === 'uae') {
      localRub = Math.round(localForeign * (rates.AED || 22.37));
    }

    const freightRub = Math.round(freightUsd * (rates.USD || 82.15));
    const totalLogisticsRub = localRub + freightRub + inlandRub;

    return {
      localForeign,
      localRub,
      freightUsd,
      freightRub,
      inlandRub,
      totalLogisticsRub
    };
  }

  /**
   * 5. Master Turnkey Calculator (Итого под ключ)
   */
  function calculateTurnkey({
    country = 'korea',
    priceForeign = 24500000,
    engineCc = 1999,
    horsepower = 0,
    ageCategory = '3_to_5',
    importType = 'personal',
    isEv = false,
    rates = {},
    config = {},
    tariffs = DEFAULT_TARIFFS
  }) {
    // 1. Currency & Car Cost
    let currency = 'KRW';
    let currencySymbol = '₩';
    let foreignRate = rates.KRW || 0.0614;

    if (country === 'china') {
      currency = 'CNY';
      currencySymbol = '¥';
      foreignRate = rates.CNY || 12.26;
    } else if (country === 'japan') {
      currency = 'JPY';
      currencySymbol = '¥';
      foreignRate = rates.JPY || 0.515;
    } else if (country === 'uae') {
      currency = 'AED';
      currencySymbol = 'AED';
      foreignRate = rates.AED || 22.37;
    }

    const safePriceForeign = Math.max(0, Number(priceForeign) || 0);
    const safeEngineCc = Math.max(0, Number(engineCc) || 0);
    const eurRate = rates.EUR || 90.28;
    const carCostRub = Math.round(safePriceForeign * foreignRate);
    const carCostEur = carCostRub / eurRate;

    // Detect EV flag
    const effectiveIsEv = isEv || safeEngineCc === 0;
    const effectiveHp = horsepower > 0 ? horsepower : (effectiveIsEv ? 272 : 160);

    // 2. Customs Duty (или СТП для электромобиля с НДС 22%)
    const dutyResult = calculateDuty({
      carCostEur,
      carCostRub,
      engineCc: safeEngineCc,
      horsepower: effectiveHp,
      ageCategory,
      isEv: effectiveIsEv,
      eurRate,
      tariffs
    });

    const customsDutyRub = dutyResult.dutyRub;

    // 3. Customs Processing Fee
    const customsFeeRub = calculateCustomsFee({
      carCostRub,
      tariffs
    });

    // 4. Disposal Fee (Утильсбор с порогом 160 л.с.)
    const utilResult = calculateUtilFee({
      engineCc: safeEngineCc,
      horsepower: effectiveHp,
      ageCategory,
      importType,
      isEv: effectiveIsEv,
      tariffs
    });

    const utilFeeRub = utilResult.amountRub;

    // Total Customs Package
    const customsTotalRub = customsDutyRub + customsFeeRub + utilFeeRub;

    // 5. Logistics & Origin Country Costs
    const countryCfg = (config.countries && config.countries[country]) || {};
    const logisticsResult = calculateLogistics({
      country,
      rates,
      configCountrySettings: countryCfg
    });

    // 6. Paperwork & Broker (СБКТС, ЭПТС, лаборатория)
    const paperworkAndCertRub = Number(config.paperworkAndCertRub) || 95000;

    // 7. Company Commission
    const commissionRub = Number(config.commissionRub) || 120000;

    // 8. Grand Total Turnkey
    const totalRub = carCostRub + customsTotalRub + logisticsResult.totalLogisticsRub + paperworkAndCertRub + commissionRub;

    return {
      country,
      currency,
      currencySymbol,
      priceForeign: safePriceForeign,
      foreignRate,
      eurRate,
      carCostRub,
      carCostEur,
      engineCc: safeEngineCc,
      isEv: effectiveIsEv,
      horsepower: effectiveHp,
      customsDutyRub,
      dutyEur: dutyResult.dutyEur,
      dutyTag: dutyResult.dutyTag,
      dutyFormulaDesc: dutyResult.dutyFormula,
      evDetails: effectiveIsEv ? {
        evDutyRub: dutyResult.evDutyRub,
        exciseRub: dutyResult.exciseRub,
        vatRub: dutyResult.vatRub,
        ratePerHp: dutyResult.ratePerHp,
        vatPercent: dutyResult.vatPercent
      } : null,
      customsFeeRub,
      utilFeeRub,
      utilReason: utilResult.utilFeeReason,
      utilReasonCode: utilResult.reasonCode,
      isPreferentialUtil: utilResult.isPreferential,
      importType: utilResult.typeKey,
      customsTotalRub,
      logistics: logisticsResult,
      freightAndOriginRub: logisticsResult.totalLogisticsRub,
      paperworkAndCertRub,
      commissionRub,
      totalRub
    };
  }

  return {
    DEFAULT_TARIFFS,
    calculateDuty,
    calculateCustomsFee,
    calculateUtilFee,
    calculateLogistics,
    calculateTurnkey
  };
}));
