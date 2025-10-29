/**
 * FEFCO Code Catalog
 * Complete database of FEFCO corrugated box codes with dieline specifications
 * Based on FEFCO 12th Edition standards
 */

export const fefcoCatalog = {
  // 01 Series - Rolls and Sheets
  "0100": {
    code: "0100",
    series: "01",
    name: "Folha Plana",
    description: "Folha plana de papelão ondulado cortada em tamanho específico",
    category: "Folhas e Bobinas",
    isStandard: true,
    constraints: {
      minLength: 100,
      minWidth: 100,
      maxLength: 3000,
      maxWidth: 2000,
      aspectRatio: { min: 0.1, max: 10 }
    },
    machineCompatibility: ["all"],
    dieline: {
      type: "rectangle",
      parameters: ["length", "width"]
    }
  },

  "0110": {
    code: "0110",
    series: "01", 
    name: "Bobina",
    description: "Bobina de papelão ondulado",
    category: "Folhas e Bobinas",
    isStandard: true,
    constraints: {
      minWidth: 200,
      maxWidth: 2500
    },
    machineCompatibility: ["flexo_folder_gluer", "printer_slotter"]
  },

  // 02 Series - Slotted Type Boxes (Most Common)
  "0200": {
    code: "0200",
    series: "02",
    name: "Caixa com Abas Sobrepostas",
    description: "Caixa padrão com abas que se sobrepõem no fundo",
    category: "Caixas com Fendas",
    isStandard: true,
    constraints: {
      minLength: 50,
      minWidth: 50,
      minHeight: 20,
      maxLength: 1500,
      maxWidth: 1200,
      maxHeight: 800,
      glueLap: { min: 15, max: 25 }
    },
    machineCompatibility: ["flexo_folder_gluer", "printer_slotter", "stitcher"],
    dieline: {
      type: "rsc_overlap",
      blankWidth: "2 * (length + width) + glueLap",
      blankHeight: "height + width",
      cutLines: ["outer_perimeter", "flap_cuts"],
      scoreLines: ["side_scores", "flap_scores"],
      glueLap: true
    },
    foldingSequence: [
      { step: 1, action: "fold_side_panels", angle: 90 },
      { step: 2, action: "fold_bottom_flaps", angle: 90 },
      { step: 3, action: "overlap_bottom_flaps" },
      { step: 4, action: "apply_glue_to_lap" },
      { step: 5, action: "close_bottom" }
    ]
  },

  "0201": {
    code: "0201",
    series: "02",
    name: "Caixa Padrão Regular (RSC)",
    description: "Caixa mais comum na indústria - Regular Slotted Container",
    category: "Caixas com Fendas",
    isStandard: true,
    constraints: {
      minLength: 50,
      minWidth: 50, 
      minHeight: 20,
      maxLength: 1500,
      maxWidth: 1200,
      maxHeight: 800,
      glueLap: { min: 15, max: 25 }
    },
    machineCompatibility: ["flexo_folder_gluer", "printer_slotter", "stitcher"],
    dieline: {
      type: "rsc_standard",
      blankWidth: "2 * (length + width) + glueLap",
      blankHeight: "height + width",
      flapLength: "width / 2",
      cutLines: ["outer_perimeter", "flap_cuts", "side_cuts"],
      scoreLines: ["side_scores", "flap_scores"],
      glueLap: true
    },
    foldingSequence: [
      { step: 1, action: "fold_side_panels", angle: 90 },
      { step: 2, action: "fold_bottom_flaps", angle: 90 },
      { step: 3, action: "interlock_bottom_flaps" },
      { step: 4, action: "apply_glue_to_lap" },
      { step: 5, action: "close_side_seam" }
    ]
  },

  "0202": {
    code: "0202",
    series: "02",
    name: "Caixa com Abas Reduzidas",
    description: "Similar ao 0201 mas com abas menores para economia de material",
    category: "Caixas com Fendas",
    isStandard: true,
    constraints: {
      minLength: 100,
      minWidth: 100,
      minHeight: 50,
      maxLength: 1200,
      maxWidth: 1000,
      maxHeight: 600,
      glueLap: { min: 15, max: 25 },
      flapReduction: { min: 10, max: 30 }
    },
    machineCompatibility: ["flexo_folder_gluer", "printer_slotter"],
    dieline: {
      type: "rsc_reduced_flaps",
      blankWidth: "2 * (length + width) + glueLap",
      blankHeight: "height + (width / 2) - flapReduction",
      flapLength: "(width / 2) - flapReduction"
    }
  },

  "0203": {
    code: "0203",
    series: "02",
    name: "Caixa com Uma Aba",
    description: "Caixa com apenas uma aba em cada extremidade",
    category: "Caixas com Fendas",
    isStandard: true,
    constraints: {
      minLength: 200,
      minWidth: 100,
      minHeight: 50,
      maxLength: 1000,
      maxWidth: 800,
      maxHeight: 400
    },
    machineCompatibility: ["flexo_folder_gluer", "printer_slotter"]
  },

  "0204": {
    code: "0204", 
    series: "02",
    name: "Caixa com Abas Assimétricas",
    description: "Caixas com abas de tamanhos diferentes",
    category: "Caixas com Fendas",
    isStandard: true,
    machineCompatibility: ["flexo_folder_gluer", "printer_slotter"]
  },

  // 03 Series - Telescope Type Boxes
  "0300": {
    code: "0300",
    series: "03",
    name: "Caixa Telescópica Completa",
    description: "Caixa com tampa e fundo separados que se encaixam",
    category: "Caixas Telescópicas",
    isStandard: true,
    constraints: {
      minLength: 100,
      minWidth: 100,
      minHeight: 50,
      maxLength: 800,
      maxWidth: 600,
      maxHeight: 400,
      overlap: { min: 15, max: 50 }
    },
    machineCompatibility: ["flatbed_die_cutter", "rotary_die_cutter"],
    dieline: {
      type: "telescope_full",
      components: ["base", "lid"],
      base: {
        blankWidth: "2 * (length + width) + glueLap",
        blankHeight: "height + width"
      },
      lid: {
        blankWidth: "2 * (length + tolerance + width + tolerance) + glueLap", 
        blankHeight: "overlap + width + tolerance"
      }
    }
  },

  "0301": {
    code: "0301",
    series: "03",
    name: "Caixa Telescópica Parcial",
    description: "Caixa com tampa parcial telescópica",
    category: "Caixas Telescópicas", 
    isStandard: true,
    machineCompatibility: ["flatbed_die_cutter", "rotary_die_cutter"]
  },

  // 04 Series - Folder Type Boxes
  "0400": {
    code: "0400",
    series: "04",
    name: "Caixa Dobrável com Fundo Automático",
    description: "Caixa que se monta automaticamente quando aberta",
    category: "Caixas Dobráveis",
    isStandard: true,
    constraints: {
      minLength: 150,
      minWidth: 100,
      minHeight: 30,
      maxLength: 500,
      maxWidth: 400,
      maxHeight: 200
    },
    machineCompatibility: ["flatbed_die_cutter", "rotary_die_cutter"]
  },

  // 05 Series - Slide Boxes
  "0500": {
    code: "0500",
    series: "05", 
    name: "Caixa Deslizante Simples",
    description: "Caixa com mecanismo deslizante para abertura",
    category: "Caixas Deslizantes",
    isStandard: true,
    machineCompatibility: ["flatbed_die_cutter"]
  },

  // 06 Series - Rigid Boxes
  "0600": {
    code: "0600",
    series: "06",
    name: "Caixa Rígida com Tampa",
    description: "Caixa rígida de alta qualidade com tampa removível", 
    category: "Caixas Rígidas",
    isStandard: true,
    machineCompatibility: ["flatbed_die_cutter"]
  },

  // 07 Series - Ready Glued Boxes
  "0700": {
    code: "0700",
    series: "07",
    name: "Caixa Pré-Colada Dobrável",
    description: "Caixa já colada que pode ser dobrada plana para transporte",
    category: "Caixas Pré-Coladas",
    isStandard: true,
    machineCompatibility: ["flexo_folder_gluer", "stitcher"]
  },

  // 09 Series - Interior Fitments
  "0900": {
    code: "0900",
    series: "09",
    name: "Divisória Simples",
    description: "Divisória interna para separar produtos",
    category: "Acessórios Internos",
    isStandard: true,
    machineCompatibility: ["flatbed_die_cutter", "rotary_die_cutter"]
  },

  "0901": {
    code: "0901", 
    series: "09",
    name: "Divisória em Cruz",
    description: "Divisória que forma compartimentos cruzados",
    category: "Acessórios Internos",
    isStandard: true,
    machineCompatibility: ["flatbed_die_cutter", "rotary_die_cutter"]
  },

  "0902": {
    code: "0902",
    series: "09", 
    name: "Grade de Separação",
    description: "Grade com múltiplas divisões para garrafas/produtos pequenos",
    category: "Acessórios Internos",
    isStandard: true,
    machineCompatibility: ["flatbed_die_cutter"]
  }
};

/**
 * Get FEFCO codes by series
 */
export function getFefcoCodesBySeries(series) {
  return Object.values(fefcoCatalog).filter(code => code.series === series);
}

/**
 * Get FEFCO codes by category
 */
export function getFefcoCodesByCategory(category) {
  return Object.values(fefcoCatalog).filter(code => code.category === category);
}

/**
 * Get FEFCO codes compatible with specific machine
 */
export function getFefcoCodesByMachine(machineType) {
  return Object.values(fefcoCatalog).filter(code => 
    code.machineCompatibility.includes(machineType) || 
    code.machineCompatibility.includes('all')
  );
}

/**
 * Search FEFCO codes by name or description
 */
export function searchFefcoCodes(query) {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(fefcoCatalog).filter(code => 
    code.name.toLowerCase().includes(lowercaseQuery) ||
    code.description.toLowerCase().includes(lowercaseQuery) ||
    code.code.includes(query)
  );
}

/**
 * Validate dimensions against FEFCO constraints
 */
export function validateDimensions(fefcoCode, dimensions) {
  const code = fefcoCatalog[fefcoCode];
  if (!code || !code.constraints) return { valid: true };
  
  const { length, width, height } = dimensions;
  const constraints = code.constraints;
  const errors = [];
  
  if (constraints.minLength && length < constraints.minLength) {
    errors.push(`Comprimento mínimo: ${constraints.minLength}mm`);
  }
  if (constraints.maxLength && length > constraints.maxLength) {
    errors.push(`Comprimento máximo: ${constraints.maxLength}mm`);
  }
  if (constraints.minWidth && width < constraints.minWidth) {
    errors.push(`Largura mínima: ${constraints.minWidth}mm`);
  }
  if (constraints.maxWidth && width > constraints.maxWidth) {
    errors.push(`Largura máxima: ${constraints.maxWidth}mm`);
  }
  if (constraints.minHeight && height < constraints.minHeight) {
    errors.push(`Altura mínima: ${constraints.minHeight}mm`);
  }
  if (constraints.maxHeight && height > constraints.maxHeight) {
    errors.push(`Altura máxima: ${constraints.maxHeight}mm`);
  }
  
  // Check aspect ratio
  if (constraints.aspectRatio) {
    const aspectRatio = Math.max(length, width) / Math.min(length, width);
    if (aspectRatio < constraints.aspectRatio.min || aspectRatio > constraints.aspectRatio.max) {
      errors.push(`Proporção deve estar entre ${constraints.aspectRatio.min} e ${constraints.aspectRatio.max}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculate blank dimensions for FEFCO code
 */
export function calculateBlankDimensions(fefcoCode, dimensions, options = {}) {
  const code = fefcoCatalog[fefcoCode];
  if (!code || !code.dieline) {
    throw new Error(`FEFCO code ${fefcoCode} not found or no dieline available`);
  }
  
  const { length, width, height } = dimensions;
  const glueLap = options.glueLap || 20;
  const tolerance = options.tolerance || 2;
  
  switch (code.dieline.type) {
    case 'rsc_standard':
    case 'rsc_overlap':
      return {
        width: 2 * (length + width) + glueLap,
        height: height + width,
        area: (2 * (length + width) + glueLap) * (height + width)
      };
      
    case 'rsc_reduced_flaps':
      const flapReduction = options.flapReduction || 15;
      return {
        width: 2 * (length + width) + glueLap,
        height: height + (width / 2) - flapReduction,
        area: (2 * (length + width) + glueLap) * (height + (width / 2) - flapReduction)
      };
      
    case 'telescope_full':
      const overlap = options.overlap || 25;
      return {
        base: {
          width: 2 * (length + width) + glueLap,
          height: height + width,
          area: (2 * (length + width) + glueLap) * (height + width)
        },
        lid: {
          width: 2 * (length + tolerance + width + tolerance) + glueLap,
          height: overlap + width + tolerance,
          area: (2 * (length + tolerance + width + tolerance) + glueLap) * (overlap + width + tolerance)
        }
      };
      
    default:
      // Generic calculation for unknown dieline types
      return {
        width: 2 * (length + width) + glueLap,
        height: height + width,
        area: (2 * (length + width) + glueLap) * (height + width)
      };
  }
}

export default fefcoCatalog;