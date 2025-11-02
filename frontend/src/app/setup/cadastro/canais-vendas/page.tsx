'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface SalesChannel {
  id: string;
  name: string;
  type: 'online' | 'physical' | 'phone' | 'distributor' | 'wholesale';
  manager: string;
  commission: number;
  status: 'active' | 'inactive';
  totalSales: number;
  totalRevenue: number;
  createdAt: string;
}

const mockChannels: SalesChannel[] = [
  {
    id: '1',
    name: 'Loja Online',
    type: 'online',
    manager: 'Maria Santos',
    commission: 5.0,
    status: 'active',
    totalSales: 125,
    totalRevenue: 285000,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Vendas Diretas',
    type: 'phone',
    manager: 'João Silva',
    commission: 8.0,
    status: 'active',
    totalSales: 89,
    totalRevenue: 420000,
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Distribuidores',
    type: 'distributor',
    manager: 'Carlos Oliveira',
    commission: 12.0,
    status: 'active',
    totalSales: 234,
    totalRevenue: 680000,
    createdAt: '2024-03-10'
  }
];

export default function CanaisVendasPage() {
  const [channels] = useState<SalesChannel[]>(mockChannels);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  const types = ['todos', 'online', 'physical', 'phone', 'distributor', 'wholesale'];

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.manager.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'todos' || channel.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100';
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'online': return 'Online';
      case 'physical': return 'Físico';
      case 'phone': return 'Telefone';
      case 'distributor': return 'Distribuidor';
      case 'wholesale': return 'Atacado';
      default: return type;
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
          <h1 className="text-3xl font-bold text-gray-900">Canais de Vendas</h1>
          <p className="text-gray-600 mt-1">
            Gestão de canais e estratégias de vendas
          </p>
        </div>
        
        <button className="btn-primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Canal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Canais</p>
                <p className="text-2xl font-bold text-gray-900">{channels.length}</p>
              </div>
              <PhoneIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Canais Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {channels.filter(c => c.status === 'active').length}
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {channels.reduce((sum, channel) => sum + channel.totalSales, 0)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <div className="w-6 h-6 text-purple-600">📦</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(channels.reduce((sum, channel) => sum + channel.totalRevenue, 0))}
                </p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-orange-600" />
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
                  placeholder="Buscar por nome do canal ou gerente..."
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

      {/* Channels Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Canais</h3>
          <p className="card-description">
            {filteredChannels.length} canal{filteredChannels.length !== 1 ? 'is' : ''} encontrado{filteredChannels.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Canal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gerente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comissão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receita
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
                {filteredChannels.map((channel) => (
                  <tr key={channel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{channel.name}</div>
                        <div className="text-xs text-gray-500">Criado: {channel.createdAt}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getTypeText(channel.type)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{channel.manager}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{channel.commission}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{channel.totalSales}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(channel.totalRevenue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(channel.status)}`}>
                        {channel.status === 'active' ? 'Ativo' : 'Inativo'}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}