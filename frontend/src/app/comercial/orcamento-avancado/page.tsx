'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  CalculatorIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CubeIcon,
  ScaleIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { useCRUD } from '@/hooks/useCRUD';

interface AdvancedQuote {
  id: string;
  demandStudyId?: string;
  clientName: string;
  
  // Product specifications
  length: number;
  width: number;
  height: number;
  totalInternalWeight: number;
  stackingHeight?: number;
  resistanceLevel: 'light' | 'medium' | 'high';
  
  // Corrugated board specifications
  corrugatedType: 'B' | 'C' | 'BC' | 'BB' | 'T' | 'TB';
  thickness: 2 | 3 | 4 | 6; // mm
  gramatura: number; // g/m²
  columnResistance: number; // kgf
  
  // Calculations
  estimatedBoxWeight: number; // kg
  materialConsumptionM2: number; // m²
  materialConsumptionKg: number; // kg
  unitCost: number; // R$
  costPerKg: number; // R$/kg
  sellingPrice: number; // R$
  margin: number; // %
  quantity: number;
  totalValue: number; // R$
  
  // System fields
  status: 'draft' | 'calculating' | 'ready' | 'sent' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  validUntil: string;
}

const mockQuotes: AdvancedQuote[] = [
  {
    id: '1',
    demandStudyId: '1',
    clientName: 'ACME Distribuidora Ltda',
    length: 400,
    width: 300,
    height: 250,
    totalInternalWeight: 5.5,
    stackingHeight: 150,
    resistanceLevel: 'medium',
    corrugatedType: 'BC',
    thickness: 4,
    gramatura: 150,
    columnResistance: 4.2,
    estimatedBoxWeight: 0.75,
    materialConsumptionM2: 0.42,
    materialConsumptionKg: 0.063,
    unitCost: 2.85,
    costPerKg: 45.24,
    sellingPrice: 3.95,
    margin: 38.6,
    quantity: 1000,
    totalValue: 3950,
    status: 'ready',
    createdAt: '2024-11-02',
    updatedAt: '2024-11-02',
    validUntil: '2024-11-16'
  }
];

export default function OrcamentoAvancadoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const initialFormData: Partial<AdvancedQuote> = {
    corrugatedType: 'BC',
    thickness: 4,
    gramatura: 150,
    resistanceLevel: 'medium',
    margin: 35,
    quantity: 1000,
    status: 'draft'
  };

  const crud = useCRUD<AdvancedQuote>(mockQuotes, initialFormData);

  const statusOptions = ['todos', 'draft', 'calculating', 'ready', 'sent', 'approved', 'rejected'];
  const corrugatedTypes = ['B', 'C', 'BC', 'BB', 'T', 'TB'];
  const thicknessOptions = [2, 3, 4, 6];

  const filteredQuotes = crud.items.filter(quote => {
    const matchesSearch = quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculation functions based on industry standards
  const calculateMaterialConsumption = (length: number, width: number, height: number) => {
    // FEFCO 0201 calculation with waste factor
    const perimeterLength = (length + width) * 2 + 40; // 40mm for overlap
    const totalHeight = height + 20; // 20mm for flaps
    const areaM2 = (perimeterLength * totalHeight) / 1000000;
    const wasteFactorArea = areaM2 * 1.08; // 8% waste
    return parseFloat(wasteFactorArea.toFixed(4));
  };

  const calculateColumnResistance = (corrugatedType: string, gramatura: number, stackingHeight?: number) => {
    const baseResistance = {
      'B': gramatura * 0.025,
      'C': gramatura * 0.035,
      'BC': gramatura * 0.042,
      'BB': gramatura * 0.038,
      'T': gramatura * 0.048,
      'TB': gramatura * 0.055
    };
    
    let resistance = baseResistance[corrugatedType as keyof typeof baseResistance] || gramatura * 0.035;
    
    // Adjust for stacking height
    if (stackingHeight && stackingHeight > 100) {
      resistance *= (1 + (stackingHeight - 100) / 1000);
    }
    
    return parseFloat(resistance.toFixed(2));
  };

  const calculateBoxWeight = (materialM2: number, gramatura: number) => {
    return parseFloat((materialM2 * gramatura / 1000).toFixed(3));
  };

  const calculateCosts = (materialKg: number, basePrice: number = 3.5, margin: number = 35) => {
    const materialCost = materialKg * basePrice; // R$/kg base price
    const productionCost = materialCost * 1.25; // 25% production cost
    const unitCost = productionCost * 1.15; // 15% overhead
    const sellingPrice = unitCost * (1 + margin / 100);
    const costPerKg = unitCost / materialKg;
    
    return {
      unitCost: parseFloat(unitCost.toFixed(3)),
      sellingPrice: parseFloat(sellingPrice.toFixed(3)),
      costPerKg: parseFloat(costPerKg.toFixed(2))
    };
  };

  const recalculateQuote = () => {
    if (crud.formData.length && crud.formData.width && crud.formData.height && 
        crud.formData.gramatura && crud.formData.corrugatedType) {
      
      const materialM2 = calculateMaterialConsumption(
        crud.formData.length || 0, 
        crud.formData.width || 0, 
        crud.formData.height || 0
      );
      
      const materialKg = calculateBoxWeight(materialM2, crud.formData.gramatura || 150);
      
      const columnResistance = calculateColumnResistance(
        crud.formData.corrugatedType || 'BC',
        crud.formData.gramatura || 150,
        crud.formData.stackingHeight
      );
      
      const costs = calculateCosts(materialKg, 3.5, crud.formData.margin || 35);
      
      const totalValue = costs.sellingPrice * (crud.formData.quantity || 1);
      
      crud.setFormData(prev => ({
        ...prev,
        materialConsumptionM2: materialM2,
        materialConsumptionKg: materialKg,
        columnResistance,
        estimatedBoxWeight: materialKg,
        unitCost: costs.unitCost,
        sellingPrice: costs.sellingPrice,
        costPerKg: costs.costPerKg,
        totalValue: parseFloat(totalValue.toFixed(2))
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-700 bg-gray-100';
      case 'calculating': return 'text-yellow-700 bg-yellow-100';
      case 'ready': return 'text-blue-700 bg-blue-100';
      case 'sent': return 'text-purple-700 bg-purple-100';
      case 'approved': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'calculating': return 'Calculando';
      case 'ready': return 'Pronto';
      case 'sent': return 'Enviado';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orçamento Avançado</h1>
          <p className="text-gray-600 mt-1">
            Geração de orçamentos com cálculos técnicos detalhados
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => crud.exportToCSV(
              filteredQuotes, 
              'orcamentos-avancados', 
              (quote) => `${quote.clientName},${quote.corrugatedType},${quote.thickness}mm,${quote.gramatura}g/m²,${formatCurrency(quote.sellingPrice)},${quote.quantity},${formatCurrency(quote.totalValue)},${getStatusText(quote.status)}`,
              'Cliente,Tipo Onda,Espessura,Gramatura,Preço Unit.,Quantidade,Total,Status'
            )}
            className="btn-outline"
          >
            📊 Exportar Dados
          </button>
          <button onClick={crud.handleCreate} className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Orçamento
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Orçamentos</p>
                <p className="text-2xl font-bold text-gray-900">{crud.items.length}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aguardando Aprovação</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crud.items.filter(q => q.status === 'sent').length}
                </p>
              </div>
              <ClipboardDocumentCheckIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crud.items.filter(q => q.status === 'approved').length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <div className="w-6 h-6 text-green-600">✅</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(crud.items.filter(q => q.status === 'approved').reduce((sum, q) => sum + q.totalValue, 0))}
                </p>
              </div>
              <BanknotesIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por cliente ou ID do orçamento..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'todos' ? 'Todos os Status' : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Orçamentos Avançados</h3>
          <p className="card-description">
            {filteredQuotes.length} orçamento{filteredQuotes.length !== 1 ? 's' : ''} encontrado{filteredQuotes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especificações
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medidas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valores
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quote.clientName}</div>
                        <div className="text-sm text-gray-500">ID: {quote.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quote.corrugatedType} {quote.thickness}mm
                      </div>
                      <div className="text-sm text-gray-500">{quote.gramatura}g/m² - {quote.columnResistance}kgf</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quote.length}×{quote.width}×{quote.height}mm
                      </div>
                      <div className="text-sm text-gray-500">{quote.materialConsumptionM2}m² | {quote.estimatedBoxWeight}kg</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(quote.sellingPrice)}</div>
                      <div className="text-sm text-gray-500">
                        {quote.quantity}un = {formatCurrency(quote.totalValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {getStatusText(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => crud.handleView(quote)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Visualizar"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => crud.handleEdit(quote)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-purple-600"
                          title="Gerar PDF"
                        >
                          📄
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Enviar por Email"
                        >
                          📧
                        </button>
                        <button 
                          onClick={() => crud.handleDelete(quote, (q) => `${q.clientName} - ${q.id}`)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* No Results */}
      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum orçamento encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou criar um novo orçamento
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={crud.isCreateModalOpen || crud.isEditModalOpen} 
        onClose={() => {
          crud.setIsCreateModalOpen(false);
          crud.setIsEditModalOpen(false);
        }}
        title={crud.isCreateModalOpen ? "Novo Orçamento Avançado" : "Editar Orçamento"}
        size="xl"
      >
        <div className="space-y-6">
          {/* Cliente Section */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🧑‍💼 Cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <input
                  type="text"
                  value={crud.formData.clientName || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade *
                </label>
                <input
                  type="number"
                  value={crud.formData.quantity || ''}
                  onChange={(e) => {
                    crud.setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }));
                    setTimeout(recalculateQuote, 100);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📏 Medidas da Caixa</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comprimento (mm) *
                </label>
                <input
                  type="number"
                  value={crud.formData.length || ''}
                  onChange={(e) => {
                    crud.setFormData(prev => ({ ...prev, length: parseInt(e.target.value) }));
                    setTimeout(recalculateQuote, 100);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Largura (mm) *
                </label>
                <input
                  type="number"
                  value={crud.formData.width || ''}
                  onChange={(e) => {
                    crud.setFormData(prev => ({ ...prev, width: parseInt(e.target.value) }));
                    setTimeout(recalculateQuote, 100);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (mm) *
                </label>
                <input
                  type="number"
                  value={crud.formData.height || ''}
                  onChange={(e) => {
                    crud.setFormData(prev => ({ ...prev, height: parseInt(e.target.value) }));
                    setTimeout(recalculateQuote, 100);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso interno (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={crud.formData.totalInternalWeight || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, totalInternalWeight: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Corrugated Specifications */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🥞 Especificações do Ondulado</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Onda *
                </label>
                <select
                  value={crud.formData.corrugatedType || ''}
                  onChange={(e) => {
                    crud.setFormData(prev => ({ ...prev, corrugatedType: e.target.value as any }));
                    setTimeout(recalculateQuote, 100);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {corrugatedTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Espessura (mm) *
                </label>
                <select
                  value={crud.formData.thickness || ''}
                  onChange={(e) => {
                    crud.setFormData(prev => ({ ...prev, thickness: parseInt(e.target.value) as any }));
                    setTimeout(recalculateQuote, 100);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {thicknessOptions.map(thickness => (
                    <option key={thickness} value={thickness}>{thickness}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gramatura (g/m²) *
                </label>
                <input
                  type="number"
                  value={crud.formData.gramatura || ''}
                  onChange={(e) => {
                    crud.setFormData(prev => ({ ...prev, gramatura: parseInt(e.target.value) }));
                    setTimeout(recalculateQuote, 100);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura empilhamento (cm)
                </label>
                <input
                  type="number"
                  value={crud.formData.stackingHeight || ''}
                  onChange={(e) => {
                    crud.setFormData(prev => ({ ...prev, stackingHeight: parseInt(e.target.value) }));
                    setTimeout(recalculateQuote, 100);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Calculated Results */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🧮 Resultados dos Cálculos</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-blue-50">
                <div className="card-content">
                  <div className="text-center">
                    <ScaleIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Resistência de Coluna</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {crud.formData.columnResistance?.toFixed(2) || '0.00'} kgf
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card bg-green-50">
                <div className="card-content">
                  <div className="text-center">
                    <CubeIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Consumo de Material</p>
                    <p className="text-lg font-bold text-green-900">
                      {crud.formData.materialConsumptionM2?.toFixed(4) || '0.0000'} m²
                    </p>
                    <p className="text-sm text-green-700">
                      {crud.formData.materialConsumptionKg?.toFixed(3) || '0.000'} kg
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card bg-purple-50">
                <div className="card-content">
                  <div className="text-center">
                    <BanknotesIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Preço Unitário</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatCurrency(crud.formData.sellingPrice || 0)}
                    </p>
                    <p className="text-sm text-purple-700">
                      Custo: {formatCurrency(crud.formData.unitCost || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">💰 Precificação</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margem de Lucro (%) *
                </label>
                <input
                  type="number"
                  value={crud.formData.margin || ''}
                  onChange={(e) => {
                    crud.setFormData(prev => ({ ...prev, margin: parseFloat(e.target.value) }));
                    setTimeout(recalculateQuote, 100);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Total
                </label>
                <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(crud.formData.totalValue || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button 
              onClick={recalculateQuote}
              className="btn-secondary"
            >
              <CalculatorIcon className="w-4 h-4 mr-2" />
              Recalcular
            </button>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  crud.setIsCreateModalOpen(false);
                  crud.setIsEditModalOpen(false);
                }}
                className="btn-outline"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  const validate = () => {
                    if (!crud.formData.clientName || !crud.formData.length || !crud.formData.width || 
                        !crud.formData.height || !crud.formData.gramatura || !crud.formData.quantity) {
                      crud.showToast('error', 'Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
                      return false;
                    }
                    return true;
                  };
                  
                  if (crud.isCreateModalOpen) {
                    crud.handleSubmitCreate(() => (crud.items.length + 1).toString(), validate);
                  } else {
                    crud.handleSubmitEdit(validate);
                  }
                }}
                className="btn-primary"
              >
                {crud.isCreateModalOpen ? 'Criar Orçamento' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal 
        isOpen={crud.isViewModalOpen} 
        onClose={() => crud.setIsViewModalOpen(false)}
        title="Detalhes do Orçamento"
        size="xl"
      >
        {crud.selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Cliente</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Nome:</span>
                    <p className="font-medium">{crud.selectedItem.clientName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Quantidade:</span>
                    <p className="font-medium">{crud.selectedItem.quantity} unidades</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Especificações Técnicas</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Tipo:</span>
                    <p className="font-medium">{crud.selectedItem.corrugatedType} {crud.selectedItem.thickness}mm</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Gramatura:</span>
                    <p className="font-medium">{crud.selectedItem.gramatura}g/m²</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Resistência:</span>
                    <p className="font-medium">{crud.selectedItem.columnResistance}kgf</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Valores</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(crud.selectedItem.sellingPrice)}</p>
                  <p className="text-sm text-gray-600">Preço Unitário</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{crud.selectedItem.margin}%</p>
                  <p className="text-sm text-gray-600">Margem</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(crud.selectedItem.totalValue)}</p>
                  <p className="text-sm text-gray-600">Valor Total</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast */}
      <Toast
        isOpen={crud.toast.isOpen}
        onClose={() => crud.setToast(prev => ({ ...prev, isOpen: false }))}
        type={crud.toast.type}
        title={crud.toast.title}
        message={crud.toast.message}
      />
    </div>
  );
}