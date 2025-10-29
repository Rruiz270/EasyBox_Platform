/**
 * McKee Formula Calculation Engine
 * Calculates Box Compression Test (BCT) strength for corrugated boxes
 * Based on R.C. McKee's research from 1963
 */

export class McKeeCalculationEngine {
  constructor() {
    // McKee formula constants
    this.K1_SIMPLIFIED = 5.87; // Simplified McKee constant (imperial)
    this.K1_METRIC = 0.83; // Metric equivalent
    
    // Environmental factors
    this.HUMIDITY_FACTORS = {
      50: 1.0,   // 50% RH baseline
      60: 0.95,  // 60% RH
      70: 0.85,  // 70% RH
      80: 0.75,  // 80% RH
      90: 0.65   // 90% RH
    };
    
    // Creep factors for long-term stacking
    this.CREEP_FACTORS = {
      1: 1.0,    // 1 day
      7: 0.9,    // 1 week
      30: 0.75,  // 1 month
      90: 0.65,  // 3 months
      365: 0.5   // 1 year
    };
    
    // Safety factors by box type
    this.SAFETY_FACTORS = {
      'regular': 2.0,
      'heavy_duty': 1.5,
      'export': 2.5,
      'food_grade': 2.2
    };
  }

  /**
   * Calculate BCT using simplified McKee formula
   * BCT = K1 * ECT * √(h * Z)
   * 
   * @param {Object} params - Calculation parameters
   * @param {number} params.ect - Edge Crush Test (kN/m)
   * @param {number} params.thickness - Board thickness (mm)
   * @param {number} params.length - Box length (mm)
   * @param {number} params.width - Box width (mm)
   * @param {number} params.height - Box height (mm)
   * @param {Object} params.environmental - Environmental conditions
   * @param {Object} params.stacking - Stacking requirements
   * @returns {Object} BCT calculation results
   */
  calculateSimplifiedMcKee(params) {
    const { ect, thickness, length, width, height, environmental = {}, stacking = {} } = params;
    
    // Convert to consistent units (metric)
    const thicknessCm = thickness / 10; // mm to cm
    const perimeterCm = 2 * (length + width) / 10; // mm to cm
    
    // Basic McKee calculation (metric version)
    const basicBCT = this.K1_METRIC * ect * Math.sqrt(thicknessCm * perimeterCm);
    
    // Apply environmental factors
    const humidity = environmental.humidity || 50;
    const humidityFactor = this.getHumidityFactor(humidity);
    
    // Apply stacking duration factor
    const stackingDays = stacking.duration || 1;
    const creepFactor = this.getCreepFactor(stackingDays);
    
    // Calculate adjusted BCT
    const adjustedBCT = basicBCT * humidityFactor * creepFactor;
    
    // Calculate safety factor
    const boxType = stacking.type || 'regular';
    const safetyFactor = this.SAFETY_FACTORS[boxType] || 2.0;
    const safeBCT = adjustedBCT / safetyFactor;
    
    return {
      basicBCT: Math.round(basicBCT * 100) / 100,
      adjustedBCT: Math.round(adjustedBCT * 100) / 100,
      safeBCT: Math.round(safeBCT * 100) / 100,
      factors: {
        humidity: humidityFactor,
        creep: creepFactor,
        safety: safetyFactor
      },
      recommendations: this.generateRecommendations(params, safeBCT)
    };
  }

  /**
   * Calculate BCT using full McKee formula with bending stiffness
   * More accurate but requires additional material properties
   */
  calculateFullMcKee(params) {
    const { ect, md_stiffness, cd_stiffness, environmental = {}, stacking = {} } = params;
    
    // Full McKee formula: BCT = 2.028 * ECT^0.746 * √(D_MD * D_CD)
    const basicBCT = 2.028 * Math.pow(ect, 0.746) * Math.sqrt(md_stiffness * cd_stiffness);
    
    // Apply same environmental adjustments
    const humidity = environmental.humidity || 50;
    const humidityFactor = this.getHumidityFactor(humidity);
    
    const stackingDays = stacking.duration || 1;
    const creepFactor = this.getCreepFactor(stackingDays);
    
    const adjustedBCT = basicBCT * humidityFactor * creepFactor;
    
    const boxType = stacking.type || 'regular';
    const safetyFactor = this.SAFETY_FACTORS[boxType] || 2.0;
    const safeBCT = adjustedBCT / safetyFactor;
    
    return {
      basicBCT: Math.round(basicBCT * 100) / 100,
      adjustedBCT: Math.round(adjustedBCT * 100) / 100,
      safeBCT: Math.round(safeBCT * 100) / 100,
      factors: {
        humidity: humidityFactor,
        creep: creepFactor,
        safety: safetyFactor
      },
      recommendations: this.generateRecommendations(params, safeBCT)
    };
  }

  /**
   * Calculate stacking capacity
   * How many boxes can be safely stacked
   */
  calculateStackingCapacity(bct, boxWeight, productWeight) {
    const totalWeight = boxWeight + productWeight;
    const maxStacks = Math.floor(bct / totalWeight);
    
    return {
      maxStacks,
      totalWeight: totalWeight * maxStacks,
      safetyMargin: (bct - (totalWeight * maxStacks)) / bct * 100
    };
  }

  /**
   * Get humidity adjustment factor
   */
  getHumidityFactor(humidity) {
    const humidityKeys = Object.keys(this.HUMIDITY_FACTORS).map(Number).sort((a, b) => a - b);
    
    if (humidity <= humidityKeys[0]) return this.HUMIDITY_FACTORS[humidityKeys[0]];
    if (humidity >= humidityKeys[humidityKeys.length - 1]) return this.HUMIDITY_FACTORS[humidityKeys[humidityKeys.length - 1]];
    
    // Linear interpolation
    for (let i = 0; i < humidityKeys.length - 1; i++) {
      const lower = humidityKeys[i];
      const upper = humidityKeys[i + 1];
      
      if (humidity >= lower && humidity <= upper) {
        const ratio = (humidity - lower) / (upper - lower);
        return this.HUMIDITY_FACTORS[lower] + ratio * (this.HUMIDITY_FACTORS[upper] - this.HUMIDITY_FACTORS[lower]);
      }
    }
    
    return 1.0;
  }

  /**
   * Get creep factor for long-term stacking
   */
  getCreepFactor(days) {
    const dayKeys = Object.keys(this.CREEP_FACTORS).map(Number).sort((a, b) => a - b);
    
    if (days <= dayKeys[0]) return this.CREEP_FACTORS[dayKeys[0]];
    if (days >= dayKeys[dayKeys.length - 1]) return this.CREEP_FACTORS[dayKeys[dayKeys.length - 1]];
    
    // Linear interpolation
    for (let i = 0; i < dayKeys.length - 1; i++) {
      const lower = dayKeys[i];
      const upper = dayKeys[i + 1];
      
      if (days >= lower && days <= upper) {
        const ratio = (days - lower) / (upper - lower);
        return this.CREEP_FACTORS[lower] + ratio * (this.CREEP_FACTORS[upper] - this.CREEP_FACTORS[lower]);
      }
    }
    
    return 1.0;
  }

  /**
   * Generate recommendations based on calculation results
   */
  generateRecommendations(params, calculatedBCT) {
    const recommendations = [];
    const { length, width, height, productWeight = 0, stacking = {} } = params;
    
    // Box aspect ratio recommendations
    const aspectRatio = Math.max(length, width) / Math.min(length, width);
    if (aspectRatio > 2) {
      recommendations.push({
        type: 'design',
        priority: 'medium',
        message: 'Proporção da caixa muito alongada pode reduzir resistência. Considere ajustar dimensões.'
      });
    }
    
    // Height to perimeter ratio
    const perimeter = 2 * (length + width);
    const heightRatio = height / perimeter;
    if (heightRatio < 0.1) {
      recommendations.push({
        type: 'design',
        priority: 'low',
        message: 'Caixa muito baixa. Considere aumentar altura para melhor resistência.'
      });
    }
    
    // Stacking recommendations
    const requiredBCT = stacking.requiredBCT || (productWeight * (stacking.height || 1));
    if (calculatedBCT < requiredBCT) {
      recommendations.push({
        type: 'material',
        priority: 'high',
        message: 'Material atual pode não suportar empilhamento requerido. Considere material com ECT maior.'
      });
    }
    
    // Environmental recommendations
    if (params.environmental?.humidity > 70) {
      recommendations.push({
        type: 'storage',
        priority: 'medium',
        message: 'Alta umidade reduz significativamente a resistência. Considere controle ambiental.'
      });
    }
    
    return recommendations;
  }

  /**
   * Validate calculation inputs
   */
  validateInputs(params) {
    const errors = [];
    
    if (!params.ect || params.ect <= 0) {
      errors.push('ECT (Edge Crush Test) deve ser maior que zero');
    }
    
    if (!params.thickness || params.thickness <= 0) {
      errors.push('Espessura do material deve ser maior que zero');
    }
    
    if (!params.length || params.length <= 0) {
      errors.push('Comprimento da caixa deve ser maior que zero');
    }
    
    if (!params.width || params.width <= 0) {
      errors.push('Largura da caixa deve ser maior que zero');
    }
    
    if (!params.height || params.height <= 0) {
      errors.push('Altura da caixa deve ser maior que zero');
    }
    
    if (params.environmental?.humidity && (params.environmental.humidity < 0 || params.environmental.humidity > 100)) {
      errors.push('Umidade deve estar entre 0 e 100%');
    }
    
    return errors;
  }
}

// Export singleton instance
export const mckeeEngine = new McKeeCalculationEngine();

/**
 * Convenience function for simple BCT calculation
 */
export function calculateBCT(ect, thickness, length, width, height, options = {}) {
  const params = {
    ect,
    thickness,
    length,
    width,
    height,
    environmental: options.environmental || {},
    stacking: options.stacking || {}
  };
  
  const errors = mckeeEngine.validateInputs(params);
  if (errors.length > 0) {
    throw new Error(`Parâmetros inválidos: ${errors.join(', ')}`);
  }
  
  return mckeeEngine.calculateSimplifiedMcKee(params);
}