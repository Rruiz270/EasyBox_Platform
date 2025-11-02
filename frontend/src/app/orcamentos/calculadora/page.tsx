'use client';

import React, { useState } from 'react';
import {
  CalculatorIcon,
  CubeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

export default function CalculadoraPage() {
  const [dimensions, setDimensions] = useState({
    length: 400,
    width: 300,
    height: 250
  });
  
  const [quantity, setQuantity] = useState(1000);
  const [materialCost, setMaterialCost] = useState(2.50);

  const calculateArea = () => {
    const l = dimensions.length / 1000; // Convert to meters
    const w = dimensions.width / 1000;
    const h = dimensions.height / 1000;
    
    // Calculate development area (unfolded box)
    const area = (2 * (l * w)) + (2 * (l * h)) + (2 * (w * h));
    return area;
  };

  const totalArea = calculateArea();
  const totalCost = totalArea * materialCost * quantity;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calculadora de Orçamentos</h1>
          <p className="text-gray-600 mt-1">
            Calcule custos e preços para caixas de papelão ondulado
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Salvar Cálculo
          </button>
          <button className="btn-primary">
            <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
            Gerar Orçamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="space-y-6">
          {/* Dimensions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dimensões da Caixa</h3>
              <p className="card-description">Medidas internas em milímetros</p>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comprimento (mm)
                  </label>
                  <input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => setDimensions(prev => ({ ...prev, length: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Largura (mm)
                  </label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (mm)
                  </label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Production Details */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Detalhes da Produção</h3>
              <p className="card-description">Quantidade e custos de material</p>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade (unidades)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custo do Material (R$/m²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Calculation Results */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Resultados do Cálculo</h3>
              <p className="card-description">Área e custos calculados</p>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Área por Caixa:</span>
                  <span className="font-semibold">{totalArea.toFixed(4)} m²</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Área Total:</span>
                  <span className="font-semibold">{(totalArea * quantity).toFixed(2)} m²</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Custo de Material:</span>
                  <span className="font-semibold text-green-600">
                    R$ {totalCost.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Custo por Unidade:</span>
                  <span className="font-semibold">R$ {(totalCost / quantity).toFixed(4)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">Margem Sugerida (40%):</span>
                  <span className="font-semibold text-blue-600">
                    R$ {(totalCost * 1.4).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-content">
              <h4 className="font-medium text-gray-900 mb-3">Ações Rápidas</h4>
              <div className="space-y-2">
                <button className="w-full btn-outline text-sm py-2">
                  <CubeIcon className="w-4 h-4 mr-2" />
                  Visualizar em 3D
                </button>
                <button className="w-full btn-outline text-sm py-2">
                  <CalculatorIcon className="w-4 h-4 mr-2" />
                  Calcular McKee
                </button>
                <button className="w-full btn-primary text-sm py-2">
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Criar Orçamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}