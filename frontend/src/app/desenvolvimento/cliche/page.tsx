'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  RectangleStackIcon,
  DocumentTextIcon,
  PhotoIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

interface Cliche {
  id: string;
  code: string;
  name: string;
  client: string;
  product: string;
  dimensions: {
    width: number;
    height: number;
  };
  colors: number;
  printType: 'flexography' | 'offset' | 'digital' | 'screen';
  resolution: number;
  status: 'active' | 'inactive' | 'maintenance' | 'damaged';
  createdDate: string;
  lastUsed: string;
  totalUses: number;
  estimatedLife: number;
  currentCondition: number;
  storageLocation: string;
  notes: string;
}

const mockCliches: Cliche[] = [
  {
    id: '1',
    code: 'CL-001-ACME',
    name: 'Logo ACME + Textos',
    client: 'ACME Distribuidora Ltda',
    product: 'Caixa FEFCO 0201',
    dimensions: { width: 380, height: 280 },
    colors: 2,
    printType: 'flexography',
    resolution: 150,
    status: 'active',
    createdDate: '2024-01-15',
    lastUsed: '2024-10-28',
    totalUses: 45,
    estimatedLife: 1000,
    currentCondition: 92,
    storageLocation: 'Setor A - Prateleira 3',
    notes: 'Clichê em excelente estado, última revisão em 15/10/2024'
  },
  {
    id: '2',
    code: 'CL-002-XYZ',
    name: 'Design Personalizado XYZ',
    client: 'Distribuidora XYZ S.A.',
    product: 'Caixa Personalizada',
    dimensions: { width: 480, height: 380 },
    colors: 4,
    printType: 'flexography',
    resolution: 175,
    status: 'active',
    createdDate: '2024-02-20',
    lastUsed: '2024-11-01',
    totalUses: 28,
    estimatedLife: 800,
    currentCondition: 88,
    storageLocation: 'Setor A - Prateleira 5',
    notes: 'Clichê com 4 cores, requer cuidado especial no manuseio'
  },
  {
    id: '3',
    code: 'CL-003-ABC',
    name: 'Marca Industrial ABC',
    client: 'Indústria ABC Ltda',
    product: 'Caixa Industrial',
    dimensions: { width: 580, height: 480 },
    colors: 1,
    printType: 'flexography',
    resolution: 120,
    status: 'maintenance',
    createdDate: '2024-03-10',
    lastUsed: '2024-10-15',
    totalUses: 67,
    estimatedLife: 1200,
    currentCondition: 75,
    storageLocation: 'Oficina - Bancada 2',
    notes: 'Em manutenção - pequenos ajustes necessários'
  },
  {
    id: '4',
    code: 'CL-004-PHARMA',
    name: 'Clichê Farmacêutico',
    client: 'Pharma Plus',
    product: 'Embalagem Farmacêutica',
    dimensions: { width: 280, height: 180 },
    colors: 3,
    printType: 'offset',
    resolution: 200,
    status: 'damaged',
    createdDate: '2023-11-05',
    lastUsed: '2024-09-20',
    totalUses: 156,
    estimatedLife: 600,
    currentCondition: 35,
    storageLocation: 'Descarte - Pendente',
    notes: 'Danificado durante última produção, avaliar possibilidade de reparo'
  }
];

export default function ClichePage() {
  const [cliches] = useState<Cliche[]>(mockCliches);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [printTypeFilter, setPrintTypeFilter] = useState('todos');

  const statusOptions = ['todos', 'active', 'inactive', 'maintenance', 'damaged'];
  const printTypes = ['todos', 'flexography', 'offset', 'digital', 'screen'];

  const filteredCliches = cliches.filter(cliche => {
    const matchesSearch = cliche.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliche.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliche.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || cliche.status === statusFilter;
    const matchesPrintType = printTypeFilter === 'todos' || cliche.printType === printTypeFilter;
    
    return matchesSearch && matchesStatus && matchesPrintType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-gray-700 bg-gray-100';
      case 'maintenance': return 'text-yellow-700 bg-yellow-100';
      case 'damaged': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'maintenance': return 'Manutenção';
      case 'damaged': return 'Danificado';
      default: return status;
    }
  };

  const getPrintTypeText = (type: string) => {
    switch (type) {
      case 'flexography': return 'Flexografia';
      case 'offset': return 'Offset';
      case 'digital': return 'Digital';
      case 'screen': return 'Serigrafia';
      default: return type;
    }
  };

  const getConditionColor = (condition: number) => {
    if (condition >= 90) return 'text-green-600';
    if (condition >= 70) return 'text-yellow-600';
    if (condition >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getUsagePercentage = (totalUses: number, estimatedLife: number) => {
    return estimatedLife > 0 ? (totalUses / estimatedLife) * 100 : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Clichês</h1>
          <p className="text-gray-600 mt-1">
            Controle de clichês de impressão e vida útil
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Relatório Uso
          </button>
          <button className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Clichê
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
                <p className="text-2xl font-bold text-gray-900">{cliches.length}</p>
              </div>
              <RectangleStackIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        {['active', 'maintenance', 'damaged', 'inactive'].map(status => (
          <div key={status} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{getStatusText(status)}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cliches.filter(c => c.status === status).length}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getStatusColor(status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                  <div className="w-6 h-6">
                    {status === 'active' && '✓'}
                    {status === 'maintenance' && '🔧'}
                    {status === 'damaged' && '⚠️'}
                    {status === 'inactive' && '⏸️'}
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
                value={printTypeFilter}
                onChange={(e) => setPrintTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {printTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'todos' ? 'Todos os Tipos' : getPrintTypeText(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cliches Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Clichês</h3>
          <p className="card-description">
            {filteredCliches.length} clichê{filteredCliches.length !== 1 ? 's' : ''} encontrado{filteredCliches.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clichê
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
                    Condição
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
                {filteredCliches.map((cliche) => {
                  const usagePercentage = getUsagePercentage(cliche.totalUses, cliche.estimatedLife);
                  return (
                    <tr key={cliche.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{cliche.name}</div>
                          <div className="text-sm text-gray-500">{cliche.code}</div>
                          <div className="text-xs text-gray-400">{cliche.storageLocation}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{cliche.client}</div>
                          <div className="text-sm text-gray-500">{cliche.product}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {cliche.dimensions.width}×{cliche.dimensions.height}mm
                          </div>
                          <div className="text-sm text-gray-600">
                            {cliche.colors} cor{cliche.colors !== 1 ? 'es' : ''}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getPrintTypeText(cliche.printType)} - {cliche.resolution}dpi
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cliche.totalUses}/{cliche.estimatedLife} usos
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {usagePercentage.toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${getConditionColor(cliche.currentCondition)}`}>
                            {cliche.currentCondition}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Último uso: {formatDate(cliche.lastUsed)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cliche.status)}`}>
                          {getStatusText(cliche.status)}
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
                          <button className="p-1 text-gray-400 hover:text-purple-600" title="Imprimir Teste">
                            <PrinterIcon className="w-4 h-4" />
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
      <div className="card border-l-4 border-purple-500">
        <div className="card-content">
          <h4 className="font-medium text-gray-900 mb-2">🖨️ Gestão de Clichês</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Condição:</strong> Percentual do estado físico do clichê (0-100%)</p>
            <p>• <strong>Vida Útil:</strong> Número estimado vs real de impressões possíveis</p>
            <p>• <strong>Manutenção:</strong> Clichês que necessitam reparo ou ajuste</p>
            <p>• <strong>Armazenamento:</strong> Localização física para controle de estoque</p>
          </div>
        </div>
      </div>
    </div>
  );
}