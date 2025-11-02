'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface CostCenter {
  id: string;
  code: string;
  name: string;
  department: string;
  manager: string;
  budget: number;
  spent: number;
  status: 'active' | 'inactive';
  type: 'production' | 'administrative' | 'sales' | 'maintenance';
  createdAt: string;
}

const mockCostCenters: CostCenter[] = [
  {
    id: '1',
    code: 'CC001',
    name: 'Produção Principal',
    department: 'Produção',
    manager: 'Carlos Oliveira',
    budget: 150000,
    spent: 127500,
    status: 'active',
    type: 'production',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    code: 'CC002',
    name: 'Administração',
    department: 'Administrativo',
    manager: 'Maria Santos',
    budget: 85000,
    spent: 62300,
    status: 'active',
    type: 'administrative',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    code: 'CC003',
    name: 'Vendas e Marketing',
    department: 'Comercial',
    manager: 'João Silva',
    budget: 120000,
    spent: 95400,
    status: 'active',
    type: 'sales',
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    code: 'CC004',
    name: 'Manutenção',
    department: 'Técnico',
    manager: 'Ana Costa',
    budget: 45000,
    spent: 38200,
    status: 'active',
    type: 'maintenance',
    createdAt: '2024-04-05'
  }
];

export default function CentrosCustoPage() {
  const [costCenters] = useState<CostCenter[]>(mockCostCenters);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  const types = ['todos', 'production', 'administrative', 'sales', 'maintenance'];

  const filteredCostCenters = costCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.manager.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'todos' || center.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100';
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'production': return 'Produção';
      case 'administrative': return 'Administrativo';
      case 'sales': return 'Vendas';
      case 'maintenance': return 'Manutenção';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'production': return 'text-blue-700 bg-blue-100';
      case 'administrative': return 'text-gray-700 bg-gray-100';
      case 'sales': return 'text-green-700 bg-green-100';
      case 'maintenance': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getBudgetUsage = (spent: number, budget: number) => {
    return budget > 0 ? (spent / budget) * 100 : 0;
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
          <h1 className="text-3xl font-bold text-gray-900">Centros de Custo</h1>
          <p className="text-gray-600 mt-1">
            Gestão e controle de centros de custo da empresa
          </p>
        </div>
        
        <button className="btn-primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Centro de Custo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Centros</p>
                <p className="text-2xl font-bold text-gray-900">{costCenters.length}</p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orçamento Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(costCenters.reduce((sum, center) => sum + center.budget, 0))}
                </p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gasto Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(costCenters.reduce((sum, center) => sum + center.spent, 0))}
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilização Média</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(costCenters.reduce((sum, center) => sum + getBudgetUsage(center.spent, center.budget), 0) / costCenters.length)}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <div className="w-6 h-6 text-purple-600">📊</div>
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
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, código ou gerente..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'todos' ? 'Todos os Tipos' : getTypeText(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Centers Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Centros de Custo</h3>
          <p className="card-description">
            {filteredCostCenters.length} centro{filteredCostCenters.length !== 1 ? 's' : ''} encontrado{filteredCostCenters.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Centro de Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gerente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orçamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gasto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilização
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
                {filteredCostCenters.map((center) => {
                  const usage = getBudgetUsage(center.spent, center.budget);
                  return (
                    <tr key={center.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{center.name}</div>
                          <div className="text-sm text-gray-500">{center.code}</div>
                          <div className="text-xs text-gray-400">{center.department}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(center.type)}`}>
                          {getTypeText(center.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{center.manager}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(center.budget)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-orange-600">
                          {formatCurrency(center.spent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${usage > 90 ? 'bg-red-500' : usage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(usage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{usage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(center.status)}`}>
                          {center.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
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
    </div>
  );
}