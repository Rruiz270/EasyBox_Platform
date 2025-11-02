'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalculatorIcon,
  CubeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import dynamic from 'next/dynamic';

// Dynamically import 3D component to avoid SSR issues
const Box3D = dynamic(() => import('@/components/3d/Box3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando visualização 3D...</p>
      </div>
    </div>
  )
});

export default function CalculadoraPage() {
  const [dimensions, setDimensions] = useState({
    length: 400,
    width: 300,
    height: 250
  });
  
  const [quantity, setQuantity] = useState(1000);
  const [materialCost, setMaterialCost] = useState(2.50);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });
  
  const router = useRouter();

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
  
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    setToast({ isOpen: true, type, title, message });
  };

  const handle3DView = () => {
    setIs3DModalOpen(true);
  };

  const handleMcKeeCalculation = () => {
    // Store current dimensions in localStorage for McKee calculator
    const mckeeData = {
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height,
      fromCalculator: true
    };
    
    localStorage.setItem('calculatorDimensions', JSON.stringify(mckeeData));
    showToast('info', 'Redirecionando', 'Carregando calculadora McKee com suas dimensões...');
    
    setTimeout(() => {
      router.push('/mckee');
    }, 1500);
  };

  const handleCreateQuote = () => {
    // Store data for advanced quote
    const quoteData = {
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height,
      quantity: quantity,
      materialCost: materialCost,
      totalArea: totalArea,
      totalCost: totalCost,
      fromCalculator: true
    };
    
    localStorage.setItem('calculatorQuoteData', JSON.stringify(quoteData));
    showToast('success', 'Redirecionando', 'Criando orçamento avançado com seus cálculos...');
    
    setTimeout(() => {
      router.push('/comercial/orcamento-avancado');
    }, 1500);
  };

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
                <button 
                  onClick={handle3DView}
                  className="w-full btn-outline text-sm py-2"
                >
                  <CubeIcon className="w-4 h-4 mr-2" />
                  Visualizar em 3D
                </button>
                <button 
                  onClick={handleMcKeeCalculation}
                  className="w-full btn-outline text-sm py-2"
                >
                  <CalculatorIcon className="w-4 h-4 mr-2" />
                  Calcular McKee
                </button>
                <button 
                  onClick={handleCreateQuote}
                  className="w-full btn-primary text-sm py-2"
                >
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Criar Orçamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Visualization Modal */}
      <Modal 
        isOpen={is3DModalOpen} 
        onClose={() => setIs3DModalOpen(false)}
        title="Visualização 3D da Caixa"
        size="xl"
      >
        <div className="space-y-4">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Visualização 3D Interativa</h3>
            <p className="text-gray-600">Use o mouse para rotacionar, zoom e navegar pela caixa</p>
          </div>
          
          {/* 3D Box Component */}
          <Box3D 
            length={dimensions.length}
            width={dimensions.width}
            height={dimensions.height}
            thickness={4}
            fluteType="BC"
            isOpen={false}
          />
          
          {/* Control Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Controles:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>🖱️ <strong>Clique e arraste:</strong> Rotacionar</div>
              <div>🔍 <strong>Scroll:</strong> Zoom in/out</div>
              <div>👆 <strong>Clique direito:</strong> Mover</div>
              <div>📱 <strong>Touch:</strong> Gestos nativos</div>
            </div>
          </div>
          
          {/* Dimensions and Cost Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Dimensões</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div>Comprimento: {dimensions.length}mm</div>
                <div>Largura: {dimensions.width}mm</div>
                <div>Altura: {dimensions.height}mm</div>
                <div>Área: {totalArea.toFixed(4)}m²</div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Custos</h4>
              <div className="space-y-1 text-sm text-green-800">
                <div>Quantidade: {quantity.toLocaleString()} un</div>
                <div>Custo por unidade: R$ {(totalCost / quantity).toFixed(4)}</div>
                <div>Custo total: R$ {totalCost.toFixed(2)}</div>
                <div>Com margem 40%: R$ {(totalCost * 1.4).toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            💡 Modelo 3D baseado nas suas dimensões de cálculo
          </div>
        </div>
      </Modal>

      {/* Toast */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
        type={toast.type}
        title={toast.title}
        message={toast.message}
      />
    </div>
  );
}