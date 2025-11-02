'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalculatorIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CubeIcon,
  XMarkIcon
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

interface McKeeInputs {
  length: number;
  width: number;
  height: number;
  paperWeight: number;
  fluteType: 'BC' | 'EB' | 'ECT32' | 'ECT44';
  humidity: number;
  temperature: number;
  storageTime: number;
  loadType: 'static' | 'dynamic' | 'stacking';
  safetyFactor: number;
}

interface McKeeResults {
  ect: number;
  bct: number;
  stackingStrength: number;
  compressionStrength: number;
  safetyMargin: number;
  recommendation: string;
  status: 'safe' | 'warning' | 'danger';
}

const fluteTypes = {
  'BC': { thickness: 6.0, ect: 32, description: 'BC - Dupla face (padrão)' },
  'EB': { thickness: 4.0, ect: 26, description: 'EB - Dupla face (fino)' },
  'ECT32': { thickness: 4.0, ect: 32, description: 'ECT32 - Alta resistência' },
  'ECT44': { thickness: 6.0, ect: 44, description: 'ECT44 - Extra resistente' }
};

export default function McKeePage() {
  const [inputs, setInputs] = useState<McKeeInputs>({
    length: 400,
    width: 300,
    height: 250,
    paperWeight: 125,
    fluteType: 'BC',
    humidity: 65,
    temperature: 23,
    storageTime: 30,
    loadType: 'stacking',
    safetyFactor: 2.5
  });

  const [results, setResults] = useState<McKeeResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
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

  const calculateMcKee = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const fluteData = fluteTypes[inputs.fluteType];
      
      // McKee Formula calculations (simplified)
      const perimeter = 2 * (inputs.length + inputs.width);
      const area = inputs.length * inputs.width;
      
      // Environmental factors
      const humidityFactor = inputs.humidity > 70 ? 0.85 : inputs.humidity > 50 ? 0.95 : 1.0;
      const tempFactor = inputs.temperature > 30 ? 0.9 : 1.0;
      const timeFactor = inputs.storageTime > 60 ? 0.8 : inputs.storageTime > 30 ? 0.9 : 1.0;
      
      // Load type multiplier
      const loadMultiplier = inputs.loadType === 'dynamic' ? 1.3 : inputs.loadType === 'stacking' ? 1.5 : 1.0;
      
      // Base calculations
      const baseECT = fluteData.ect * (inputs.paperWeight / 125);
      const adjustedECT = baseECT * humidityFactor * tempFactor * timeFactor;
      
      // BCT calculation using McKee formula
      const bct = adjustedECT * Math.pow(perimeter, 1.5) * Math.sqrt(fluteData.thickness);
      
      // Stacking strength
      const stackingStrength = bct * loadMultiplier;
      
      // Compression strength
      const compressionStrength = stackingStrength / inputs.safetyFactor;
      
      // Safety margin
      const safetyMargin = (compressionStrength / (stackingStrength * 0.7)) * 100;
      
      // Status determination
      let status: 'safe' | 'warning' | 'danger';
      let recommendation: string;
      
      if (safetyMargin >= 100) {
        status = 'safe';
        recommendation = 'Caixa adequada para o uso pretendido. Boa resistência e margem de segurança.';
      } else if (safetyMargin >= 70) {
        status = 'warning';
        recommendation = 'Caixa com resistência limitada. Considere aumentar a gramatura ou mudar o tipo de flauta.';
      } else {
        status = 'danger';
        recommendation = 'Caixa inadequada para o uso. Necessário redesign com materiais mais resistentes.';
      }
      
      setResults({
        ect: Math.round(adjustedECT * 100) / 100,
        bct: Math.round(bct),
        stackingStrength: Math.round(stackingStrength),
        compressionStrength: Math.round(compressionStrength),
        safetyMargin: Math.round(safetyMargin * 100) / 100,
        recommendation,
        status
      });
      
      setIsCalculating(false);
    }, 1500);
  };

  useEffect(() => {
    if (inputs.length > 0 && inputs.width > 0 && inputs.height > 0) {
      calculateMcKee();
    }
  }, [inputs]);

  const handleInputChange = (field: keyof McKeeInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-700 bg-green-100 border-green-200';
      case 'warning': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'danger': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'danger': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default: return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    setToast({ isOpen: true, type, title, message });
  };

  const handle3DView = () => {
    setIs3DModalOpen(true);
  };

  const handleExportPDF = () => {
    if (!results) {
      showToast('warning', 'Cálculo necessário', 'Execute o cálculo McKee antes de exportar o PDF.');
      return;
    }

    // Create PDF content
    const pdfContent = `
      RELATÓRIO DE CÁLCULO McKEE
      ===========================
      
      PARÂMETROS DA CAIXA:
      - Dimensões: ${inputs.length}×${inputs.width}×${inputs.height}mm
      - Gramatura: ${inputs.paperWeight}g/m²
      - Tipo de Flauta: ${fluteTypes[inputs.fluteType].description}
      
      CONDIÇÕES AMBIENTAIS:
      - Umidade: ${inputs.humidity}%
      - Temperatura: ${inputs.temperature}°C
      - Tempo de Armazenamento: ${inputs.storageTime} dias
      - Tipo de Carga: ${inputs.loadType}
      - Fator de Segurança: ${inputs.safetyFactor}x
      
      RESULTADOS:
      - ECT Ajustado: ${results.ect} N⋅m/m
      - BCT: ${results.bct} N
      - Resistência ao Empilhamento: ${results.stackingStrength} N
      - Resistência à Compressão: ${results.compressionStrength} N
      - Margem de Segurança: ${results.safetyMargin}%
      
      AVALIAÇÃO: ${results.recommendation}
      Status: ${results.status.toUpperCase()}
      
      Data do Cálculo: ${new Date().toLocaleDateString('pt-BR')}
    `;

    // Create and download blob
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-mckee-${inputs.length}x${inputs.width}x${inputs.height}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('success', 'PDF Exportado', 'Relatório McKee foi baixado com sucesso.');
  };

  const handleCreateQuote = () => {
    if (!results) {
      showToast('warning', 'Cálculo necessário', 'Execute o cálculo McKee antes de criar uma cotação.');
      return;
    }

    // Navigate to advanced quote page with pre-filled data
    const quoteData = {
      length: inputs.length,
      width: inputs.width,
      height: inputs.height,
      corrugatedType: inputs.fluteType === 'BC' ? 'BC' : 'C',
      gramatura: inputs.paperWeight,
      resistanceLevel: results.status === 'safe' ? 'high' : results.status === 'warning' ? 'medium' : 'light',
      mckeeResults: results
    };
    
    // Store data in localStorage for the quote page
    localStorage.setItem('mckeeQuoteData', JSON.stringify(quoteData));
    
    showToast('success', 'Redirecionando', 'Criando orçamento com base nos cálculos McKee...');
    
    setTimeout(() => {
      router.push('/comercial/orcamento-avancado');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calculadora McKee</h1>
          <p className="text-gray-600 mt-1">
            Cálculo de resistência à compressão para caixas de papelão ondulado
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Gerar Relatório
          </button>
          <button 
            onClick={calculateMcKee}
            disabled={isCalculating}
            className="btn-primary"
          >
            <CalculatorIcon className="w-4 h-4 mr-2" />
            {isCalculating ? 'Calculando...' : 'Recalcular'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dimensions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dimensões da Caixa</h3>
              <p className="card-description">Medidas internas em milímetros</p>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comprimento (mm)
                  </label>
                  <input
                    type="number"
                    value={inputs.length}
                    onChange={(e) => handleInputChange('length', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="50"
                    max="2000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Largura (mm)
                  </label>
                  <input
                    type="number"
                    value={inputs.width}
                    onChange={(e) => handleInputChange('width', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="50"
                    max="2000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (mm)
                  </label>
                  <input
                    type="number"
                    value={inputs.height}
                    onChange={(e) => handleInputChange('height', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="20"
                    max="1000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Material Properties */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Propriedades do Material</h3>
              <p className="card-description">Especificações do papelão ondulado</p>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gramatura (g/m²)
                  </label>
                  <input
                    type="number"
                    value={inputs.paperWeight}
                    onChange={(e) => handleInputChange('paperWeight', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="80"
                    max="400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Flauta
                  </label>
                  <select
                    value={inputs.fluteType}
                    onChange={(e) => handleInputChange('fluteType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(fluteTypes).map(([key, value]) => (
                      <option key={key} value={key}>{value.description}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Condições Ambientais</h3>
              <p className="card-description">Fatores que afetam a resistência</p>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Umidade Relativa (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.humidity}
                    onChange={(e) => handleInputChange('humidity', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="30"
                    max="95"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperatura (°C)
                  </label>
                  <input
                    type="number"
                    value={inputs.temperature}
                    onChange={(e) => handleInputChange('temperature', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="5"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempo de Armazenamento (dias)
                  </label>
                  <input
                    type="number"
                    value={inputs.storageTime}
                    onChange={(e) => handleInputChange('storageTime', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="365"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Carga
                  </label>
                  <select
                    value={inputs.loadType}
                    onChange={(e) => handleInputChange('loadType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="static">Estática</option>
                    <option value="dynamic">Dinâmica</option>
                    <option value="stacking">Empilhamento</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results && (
            <>
              {/* Status Card */}
              <div className={`card border-2 ${getStatusColor(results.status)}`}>
                <div className="card-content">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Status da Análise</h3>
                    {getStatusIcon(results.status)}
                  </div>
                  
                  <div className="text-sm leading-relaxed">
                    {results.recommendation}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                    <div className="text-sm font-medium">
                      Margem de Segurança: {results.safetyMargin}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Details */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Resultados do Cálculo</h3>
                  <p className="card-description">Valores segundo fórmula McKee</p>
                </div>
                <div className="card-content">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">ECT Ajustado:</span>
                      <span className="font-semibold">{results.ect} N⋅m/m</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">BCT:</span>
                      <span className="font-semibold">{results.bct} N</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Resistência Empilhamento:</span>
                      <span className="font-semibold">{results.stackingStrength} N</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Resistência Compressão:</span>
                      <span className="font-semibold">{results.compressionStrength} N</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600">Fator de Segurança:</span>
                      <span className="font-semibold">{inputs.safetyFactor}x</span>
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
                      Ver em 3D
                    </button>
                    <button 
                      onClick={handleExportPDF}
                      className="w-full btn-outline text-sm py-2"
                    >
                      <DocumentTextIcon className="w-4 h-4 mr-2" />
                      Exportar PDF
                    </button>
                    <button 
                      onClick={handleCreateQuote}
                      className="w-full btn-primary text-sm py-2"
                    >
                      <ChartBarIcon className="w-4 h-4 mr-2" />
                      Criar Cotação
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {isCalculating && (
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Calculando resistência...</span>
                </div>
              </div>
            </div>
          )}
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
            length={inputs.length}
            width={inputs.width}
            height={inputs.height}
            thickness={fluteTypes[inputs.fluteType].thickness}
            fluteType={inputs.fluteType}
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
          
          {/* Dimensions Display */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-white border rounded-lg p-3 text-center">
              <div className="text-gray-600">Comprimento</div>
              <div className="font-semibold text-blue-600 text-lg">{inputs.length}mm</div>
            </div>
            <div className="bg-white border rounded-lg p-3 text-center">
              <div className="text-gray-600">Largura</div>
              <div className="font-semibold text-blue-600 text-lg">{inputs.width}mm</div>
            </div>
            <div className="bg-white border rounded-lg p-3 text-center">
              <div className="text-gray-600">Altura</div>
              <div className="font-semibold text-blue-600 text-lg">{inputs.height}mm</div>
            </div>
          </div>
          
          {/* Material and Results Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">Material</h4>
              <div className="text-sm text-amber-800">
                <div>Tipo: {fluteTypes[inputs.fluteType].description}</div>
                <div>Espessura: {fluteTypes[inputs.fluteType].thickness}mm</div>
                <div>Gramatura: {inputs.paperWeight}g/m²</div>
              </div>
            </div>
            
            {results && (
              <div className={`border rounded-lg p-4 ${
                results.status === 'safe' ? 'bg-green-50 border-green-200' :
                results.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  results.status === 'safe' ? 'text-green-900' :
                  results.status === 'warning' ? 'text-yellow-900' :
                  'text-red-900'
                }`}>Resistência McKee</h4>
                <div className={`text-sm ${
                  results.status === 'safe' ? 'text-green-800' :
                  results.status === 'warning' ? 'text-yellow-800' :
                  'text-red-800'
                }`}>
                  <div>BCT: {results.bct}N</div>
                  <div>Compressão: {results.compressionStrength}N</div>
                  <div>Segurança: {results.safetyMargin}%</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            🎯 Modelo 3D gerado automaticamente com base nos cálculos McKee
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