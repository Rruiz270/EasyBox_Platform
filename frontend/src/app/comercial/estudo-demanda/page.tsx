'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  DocumentArrowUpIcon,
  CalculatorIcon,
  ClipboardDocumentCheckIcon,
  CubeIcon,
  ScaleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { useCRUD } from '@/hooks/useCRUD';

interface DemandStudy {
  id: string;
  clientId: string;
  clientName: string;
  currentBoxUsage: 'yes' | 'no';
  currentBoxType?: string;
  currentBoxMeasures?: string;
  currentSupplier?: string;
  hasOwnProject: 'yes' | 'no';
  technicalFile?: string;
  fefcoCode?: string;
  // Primary measurements
  length: number;
  width: number;
  height: number;
  measurementOrder: 'understands' | 'needs_clarification';
  // Product details
  totalInternalWeight: number;
  productType: 'loose' | 'grouped';
  productStructure: 'self_structured' | 'bulk';
  productDescription: string;
  // Stacking
  willBeStacked: 'yes' | 'no';
  stackingHeight?: number;
  storageCondition: 'pallet' | 'shelf' | 'transport' | 'other';
  // Resistance
  resistanceLevel: 'light' | 'medium' | 'high';
  handlingType: 'manual' | 'forklift' | 'conveyor' | 'other';
  handlingObservations?: string;
  // System fields
  status: 'draft' | 'analyzing' | 'quote_ready' | 'completed';
  createdAt: string;
  updatedAt: string;
}

const mockStudies: DemandStudy[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'ACME Distribuidora Ltda',
    currentBoxUsage: 'yes',
    currentBoxType: 'Papelão simples',
    currentBoxMeasures: '40x30x25cm',
    currentSupplier: 'Fornecedor ABC',
    hasOwnProject: 'no',
    fefcoCode: '0201',
    length: 400,
    width: 300,
    height: 250,
    measurementOrder: 'understands',
    totalInternalWeight: 5.5,
    productType: 'grouped',
    productStructure: 'self_structured',
    productDescription: 'Livros empacotados',
    willBeStacked: 'yes',
    stackingHeight: 150,
    storageCondition: 'pallet',
    resistanceLevel: 'medium',
    handlingType: 'forklift',
    handlingObservations: 'Empilhadeira padrão',
    status: 'analyzing',
    createdAt: '2024-11-01',
    updatedAt: '2024-11-02'
  }
];

export default function EstudoDemandaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const initialFormData: Partial<DemandStudy> = {
    currentBoxUsage: 'no',
    hasOwnProject: 'no',
    measurementOrder: 'understands',
    productType: 'loose',
    productStructure: 'self_structured',
    willBeStacked: 'no',
    storageCondition: 'pallet',
    resistanceLevel: 'medium',
    handlingType: 'manual',
    status: 'draft'
  };

  const crud = useCRUD<DemandStudy>(mockStudies, initialFormData);

  const statusOptions = ['todos', 'draft', 'analyzing', 'quote_ready', 'completed'];

  const filteredStudies = crud.items.filter(study => {
    const matchesSearch = study.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || study.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-700 bg-gray-100';
      case 'analyzing': return 'text-yellow-700 bg-yellow-100';
      case 'quote_ready': return 'text-blue-700 bg-blue-100';
      case 'completed': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'analyzing': return 'Analisando';
      case 'quote_ready': return 'Pronto p/ Orçar';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estudo de Demanda</h1>
          <p className="text-gray-600 mt-1">
            Análise técnica e operacional para pré-orçamento
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => crud.exportToCSV(
              filteredStudies, 
              'estudos-demanda', 
              (study) => `${study.clientName},${study.length}x${study.width}x${study.height},${study.totalInternalWeight}kg,${getStatusText(study.status)},${study.createdAt}`,
              'Cliente,Medidas,Peso Total,Status,Data'
            )}
            className="btn-outline"
          >
            📊 Exportar Dados
          </button>
          <button onClick={crud.handleCreate} className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Estudo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Estudos</p>
                <p className="text-2xl font-bold text-gray-900">{crud.items.length}</p>
              </div>
              <ClipboardDocumentCheckIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crud.items.filter(s => s.status === 'analyzing').length}
                </p>
              </div>
              <CalculatorIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prontos p/ Orçar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crud.items.filter(s => s.status === 'quote_ready').length}
                </p>
              </div>
              <CubeIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crud.items.filter(s => s.status === 'completed').length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <div className="w-6 h-6 text-green-600">✅</div>
              </div>
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
                  placeholder="Buscar por cliente ou ID do estudo..."
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

      {/* Studies Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Estudos de Demanda</h3>
          <p className="card-description">
            {filteredStudies.length} estudo{filteredStudies.length !== 1 ? 's' : ''} encontrado{filteredStudies.length !== 1 ? 's' : ''}
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
                    Medidas (C×L×A)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peso/Resistência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FEFCO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudies.map((study) => (
                  <tr key={study.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{study.clientName}</div>
                        <div className="text-sm text-gray-500">ID: {study.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {study.length}×{study.width}×{study.height}mm
                      </div>
                      <div className="text-sm text-gray-500">{study.productType === 'grouped' ? 'Agrupado' : 'Solto'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{study.totalInternalWeight}kg</div>
                      <div className="text-sm text-gray-500">{study.resistanceLevel === 'light' ? 'Leve' : study.resistanceLevel === 'medium' ? 'Média' : 'Alta'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{study.fefcoCode || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(study.status)}`}>
                        {getStatusText(study.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{study.createdAt}</div>
                      <div className="text-xs text-gray-500">Atualizado: {study.updatedAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => crud.handleView(study)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Visualizar"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => crud.handleEdit(study)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-purple-600"
                          title="Gerar Orçamento"
                        >
                          🧮
                        </button>
                        <button 
                          onClick={() => crud.handleDelete(study, (s) => s.clientName)}
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
      {filteredStudies.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum estudo encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou criar um novo estudo
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
        title={crud.isCreateModalOpen ? "Novo Estudo de Demanda" : "Editar Estudo"}
        size="xl"
      >
        <div className="space-y-6">
          {/* Cliente Section */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🧑‍💼 Informações do Cliente</h4>
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
            </div>
          </div>

          {/* Current Box Usage */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📦 Uso Atual de Caixas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente utiliza caixa atualmente? *
                </label>
                <select
                  value={crud.formData.currentBoxUsage || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, currentBoxUsage: e.target.value as 'yes' | 'no' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="no">Não</option>
                  <option value="yes">Sim</option>
                </select>
              </div>
              
              {crud.formData.currentBoxUsage === 'yes' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo atual
                    </label>
                    <input
                      type="text"
                      value={crud.formData.currentBoxType || ''}
                      onChange={(e) => crud.setFormData(prev => ({ ...prev, currentBoxType: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Papelão simples"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medidas atuais
                    </label>
                    <input
                      type="text"
                      value={crud.formData.currentBoxMeasures || ''}
                      onChange={(e) => crud.setFormData(prev => ({ ...prev, currentBoxMeasures: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 40x30x25cm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fornecedor atual
                    </label>
                    <input
                      type="text"
                      value={crud.formData.currentSupplier || ''}
                      onChange={(e) => crud.setFormData(prev => ({ ...prev, currentSupplier: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Project Section */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📋 Projeto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente possui projeto próprio? *
                </label>
                <select
                  value={crud.formData.hasOwnProject || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, hasOwnProject: e.target.value as 'yes' | 'no' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="no">Não</option>
                  <option value="yes">Sim</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código FEFCO
                </label>
                <input
                  type="text"
                  value={crud.formData.fefcoCode || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, fefcoCode: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 0201"
                />
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📏 Medidas Primárias</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comprimento (mm) *
                </label>
                <input
                  type="number"
                  value={crud.formData.length || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, length: parseInt(e.target.value) }))}
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
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, width: parseInt(e.target.value) }))}
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
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente entende sequência?
                </label>
                <select
                  value={crud.formData.measurementOrder || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, measurementOrder: e.target.value as 'understands' | 'needs_clarification' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="understands">Sim</option>
                  <option value="needs_clarification">Não</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📦 Detalhes do Produto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso interno total (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={crud.formData.totalInternalWeight || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, totalInternalWeight: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produto solto ou agrupado? *
                </label>
                <select
                  value={crud.formData.productType || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, productType: e.target.value as 'loose' | 'grouped' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="loose">Solto</option>
                  <option value="grouped">Agrupado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estrutura do produto *
                </label>
                <select
                  value={crud.formData.productStructure || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, productStructure: e.target.value as 'self_structured' | 'bulk' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="self_structured">Autoestruturado (ex: latas)</option>
                  <option value="bulk">A granel (ex: cápsulas)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do produto
                </label>
                <input
                  type="text"
                  value={crud.formData.productDescription || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, productDescription: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Livros empacotados"
                />
              </div>
            </div>
          </div>

          {/* Stacking */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📚 Empilhamento</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Será empilhada? *
                </label>
                <select
                  value={crud.formData.willBeStacked || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, willBeStacked: e.target.value as 'yes' | 'no' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="no">Não</option>
                  <option value="yes">Sim</option>
                </select>
              </div>
              
              {crud.formData.willBeStacked === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Altura total empilhamento (cm)
                  </label>
                  <input
                    type="number"
                    value={crud.formData.stackingHeight || ''}
                    onChange={(e) => crud.setFormData(prev => ({ ...prev, stackingHeight: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condição de armazenamento *
                </label>
                <select
                  value={crud.formData.storageCondition || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, storageCondition: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pallet">Palete</option>
                  <option value="shelf">Prateleira</option>
                  <option value="transport">Transporte</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resistance */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">💪 Resistência</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resistência necessária *
                </label>
                <select
                  value={crud.formData.resistanceLevel || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, resistanceLevel: e.target.value as 'light' | 'medium' | 'high' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">Leve</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de manuseio *
                </label>
                <select
                  value={crud.formData.handlingType || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, handlingType: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="manual">Manual</option>
                  <option value="forklift">Empilhadeira</option>
                  <option value="conveyor">Correia</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações sobre manuseio
                </label>
                <textarea
                  value={crud.formData.handlingObservations || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, handlingObservations: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Observações adicionais sobre o manuseio..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
                      !crud.formData.height || !crud.formData.totalInternalWeight) {
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
              {crud.isCreateModalOpen ? 'Criar Estudo' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal 
        isOpen={crud.isViewModalOpen} 
        onClose={() => crud.setIsViewModalOpen(false)}
        title="Detalhes do Estudo de Demanda"
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
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Medidas</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Dimensões:</span>
                    <p className="font-medium">{crud.selectedItem.length}×{crud.selectedItem.width}×{crud.selectedItem.height}mm</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Peso total:</span>
                    <p className="font-medium">{crud.selectedItem.totalInternalWeight}kg</p>
                  </div>
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