'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface CuttingDie {
  id: string;
  code: string;
  name: string;
  client: string;
  product: string;
  fefcoCode: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  dieType: 'rotary' | 'flat' | 'semi_rotary';
  material: string;
  bladeLength: number;
  creaseLength: number;
  perforationLength: number;
  status: 'active' | 'inactive' | 'maintenance' | 'damaged' | 'worn';
  sharpness: number;
  totalCuts: number;
  estimatedLife: number;
  lastMaintenance: string;
  nextMaintenance: string;
  storageLocation: string;
  manufacturer: string;
  acquisitionDate: string;
  acquisitionCost: number;
  notes: string;
}

const mockCuttingDies: CuttingDie[] = [
  {
    id: '1',
    code: 'FAC-001-ACME',
    name: 'Faca FEFCO 0201 - ACME',
    client: 'ACME Distribuidora Ltda',
    product: 'Caixa FEFCO 0201',
    fefcoCode: '0201',
    dimensions: { length: 400, width: 300, height: 250 },
    dieType: 'flat',
    material: 'Aço carbono',
    bladeLength: 2840,
    creaseLength: 1680,
    perforationLength: 0,
    status: 'active',
    sharpness: 95,
    totalCuts: 15000,
    estimatedLife: 100000,
    lastMaintenance: '2024-09-15',
    nextMaintenance: '2024-12-15',
    storageLocation: 'Setor B - Rack 1',
    manufacturer: 'Facas Premium Ltda',
    acquisitionDate: '2024-01-15',
    acquisitionCost: 2850.00,
    notes: 'Faca em excelente estado, afiação recente'
  },
  {
    id: '2',
    code: 'FAC-002-XYZ',
    name: 'Faca Personalizada XYZ',
    client: 'Distribuidora XYZ S.A.',
    product: 'Caixa Personalizada',
    fefcoCode: '0301',
    dimensions: { length: 500, width: 400, height: 300 },
    dieType: 'rotary',
    material: 'Aço inox',
    bladeLength: 3520,
    creaseLength: 2100,
    perforationLength: 450,
    status: 'active',
    sharpness: 88,
    totalCuts: 28500,
    estimatedLife: 150000,
    lastMaintenance: '2024-08-20',
    nextMaintenance: '2024-11-20',
    storageLocation: 'Setor B - Rack 3',
    manufacturer: 'Industrial Blades Inc',
    acquisitionDate: '2024-02-20',
    acquisitionCost: 4200.00,
    notes: 'Faca rotativa com perfurações especiais'
  },
  {
    id: '3',
    code: 'FAC-003-ABC',
    name: 'Faca Industrial ABC',
    client: 'Indústria ABC Ltda',
    product: 'Caixa Industrial',
    fefcoCode: '0401',
    dimensions: { length: 600, width: 500, height: 400 },
    dieType: 'flat',
    material: 'Aço carbono',
    bladeLength: 4200,
    creaseLength: 2800,
    perforationLength: 0,
    status: 'maintenance',
    sharpness: 72,
    totalCuts: 45000,
    estimatedLife: 120000,
    lastMaintenance: '2024-06-10',
    nextMaintenance: '2024-11-05',
    storageLocation: 'Oficina - Bancada 1',
    manufacturer: 'Facas Premium Ltda',
    acquisitionDate: '2024-03-10',
    acquisitionCost: 3650.00,
    notes: 'Em manutenção - requer afiação e ajustes'
  },
  {
    id: '4',
    code: 'FAC-004-DISPLAY',
    name: 'Faca Display Promocional',
    client: 'Marketing Plus',
    product: 'Display FEFCO 0751',
    fefcoCode: '0751',
    dimensions: { length: 800, width: 600, height: 1200 },
    dieType: 'semi_rotary',
    material: 'Aço especial',
    bladeLength: 6800,
    creaseLength: 4200,
    perforationLength: 1200,
    status: 'worn',
    sharpness: 45,
    totalCuts: 78000,
    estimatedLife: 80000,
    lastMaintenance: '2024-04-15',
    nextMaintenance: '2024-10-15',
    storageLocation: 'Setor C - Área Especial',
    manufacturer: 'Advanced Dies Co.',
    acquisitionDate: '2023-08-01',
    acquisitionCost: 8500.00,
    notes: 'Faca desgastada, próxima ao fim da vida útil'
  }
];

export default function FacaPage() {
  const [cuttingDies] = useState<CuttingDie[]>(mockCuttingDies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');

  const statusOptions = ['todos', 'active', 'inactive', 'maintenance', 'damaged', 'worn'];
  const typeOptions = ['todos', 'rotary', 'flat', 'semi_rotary'];

  const filteredCuttingDies = cuttingDies.filter(die => {
    const matchesSearch = die.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         die.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         die.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || die.status === statusFilter;
    const matchesType = typeFilter === 'todos' || die.dieType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-gray-700 bg-gray-100';
      case 'maintenance': return 'text-yellow-700 bg-yellow-100';
      case 'damaged': return 'text-red-700 bg-red-100';
      case 'worn': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'maintenance': return 'Manutenção';
      case 'damaged': return 'Danificado';
      case 'worn': return 'Desgastado';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'rotary': return 'Rotativa';
      case 'flat': return 'Plana';
      case 'semi_rotary': return 'Semi-Rotativa';
      default: return type;
    }
  };

  const getSharpnessColor = (sharpness: number) => {
    if (sharpness >= 90) return 'text-green-600';
    if (sharpness >= 70) return 'text-yellow-600';
    if (sharpness >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getUsagePercentage = (totalCuts: number, estimatedLife: number) => {
    return estimatedLife > 0 ? (totalCuts / estimatedLife) * 100 : 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isMaintenanceOverdue = (nextMaintenance: string) => {
    return new Date(nextMaintenance) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Facas de Corte</h1>
          <p className="text-gray-600 mt-1">
            Controle de facas, manutenção e vida útil
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Relatório Manutenção
          </button>
          <button className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Faca
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{cuttingDies.length}</p>
              </div>
              <CogIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        {['active', 'maintenance', 'worn', 'damaged'].map(status => (
          <div key={status} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{getStatusText(status)}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cuttingDies.filter(d => d.status === status).length}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getStatusColor(status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                  <div className="w-6 h-6">
                    {status === 'active' && '✓'}
                    {status === 'maintenance' && '🔧'}
                    {status === 'worn' && '⚠️'}
                    {status === 'damaged' && '❌'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, código ou cliente..."
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

            <div className="w-full lg:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {typeOptions.map(type => (
                  <option key={type} value={type}>
                    {type === 'todos' ? 'Todos os Tipos' : getTypeText(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cutting Dies Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Facas</h3>
          <p className="card-description">
            {filteredCuttingDies.length} faca{filteredCuttingDies.length !== 1 ? 's' : ''} encontrada{filteredCuttingDies.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente/Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especificações
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso/Vida Útil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Afiação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manutenção
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
                {filteredCuttingDies.map((die) => {
                  const usagePercentage = getUsagePercentage(die.totalCuts, die.estimatedLife);
                  const isOverdue = isMaintenanceOverdue(die.nextMaintenance);
                  return (
                    <tr key={die.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{die.name}</div>
                          <div className="text-sm text-gray-500">{die.code}</div>
                          <div className="text-xs text-gray-400">FEFCO {die.fefcoCode}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{die.client}</div>
                          <div className="text-sm text-gray-500">{die.product}</div>
                          <div className="text-xs text-gray-400">{die.storageLocation}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {die.dimensions.length}×{die.dimensions.width}×{die.dimensions.height}mm
                          </div>
                          <div className="text-sm text-gray-600">{getTypeText(die.dieType)}</div>
                          <div className="text-xs text-gray-500">
                            Corte: {die.bladeLength}mm | Vinco: {die.creaseLength}mm
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {die.totalCuts.toLocaleString('pt-BR')}/{die.estimatedLife.toLocaleString('pt-BR')}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {usagePercentage.toFixed(1)}% usado
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${getSharpnessColor(die.sharpness)}`}>
                            {die.sharpness}%
                          </div>
                          <div className="text-xs text-gray-500">afiação</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {formatDate(die.nextMaintenance)}
                          </div>
                          {isOverdue && (
                            <div className="flex items-center text-xs text-red-600">
                              <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                              Atrasada
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(die.status)}`}>
                          {getStatusText(die.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600" title="Visualizar">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600" title="Editar">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-yellow-600" title="Manutenção">
                            <WrenchScrewdriverIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600" title="Excluir">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="card border-l-4 border-orange-500">
        <div className="card-content">
          <h4 className="font-medium text-gray-900 mb-2">🔧 Gestão de Facas</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Afiação:</strong> Percentual de qualidade do corte (0-100%)</p>
            <p>• <strong>Vida Útil:</strong> Número de cortes realizados vs estimativa total</p>
            <p>• <strong>Manutenção:</strong> Agendamento preventivo e corretivo</p>
            <p>• <strong>Desgaste:</strong> Facas próximas ao fim da vida útil</p>
          </div>
        </div>
      </div>
    </div>
  );
}