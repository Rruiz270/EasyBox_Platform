'use client';

import React, { useState } from 'react';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  DocumentTextIcon,
  CubeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface ProductionOrder {
  id: string;
  orderNumber: string;
  client: string;
  product: string;
  fefcoCode: string;
  quantity: number;
  produced: number;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  expectedEnd: string;
  actualEnd?: string;
  operator: string;
  machine: string;
  efficiency: number;
}

const mockOrders: ProductionOrder[] = [
  {
    id: '1',
    orderNumber: 'PROD-2024-001',
    client: 'ACME Distribuidora Ltda',
    product: 'Caixa FEFCO 0201',
    fefcoCode: '0201',
    quantity: 1000,
    produced: 750,
    status: 'in_progress',
    priority: 'high',
    startDate: '2024-11-01',
    expectedEnd: '2024-11-03',
    operator: 'José Silva',
    machine: 'Máquina 01',
    efficiency: 85.5
  },
  {
    id: '2',
    orderNumber: 'PROD-2024-002',
    client: 'Distribuidora XYZ S.A.',
    product: 'Caixa Personalizada',
    fefcoCode: '0301',
    quantity: 500,
    produced: 500,
    status: 'completed',
    priority: 'medium',
    startDate: '2024-10-28',
    expectedEnd: '2024-10-30',
    actualEnd: '2024-10-30',
    operator: 'Maria Santos',
    machine: 'Máquina 02',
    efficiency: 92.3
  },
  {
    id: '3',
    orderNumber: 'PROD-2024-003',
    client: 'Indústria ABC Ltda',
    product: 'Caixa FEFCO 0401',
    fefcoCode: '0401',
    quantity: 2000,
    produced: 0,
    status: 'pending',
    priority: 'medium',
    startDate: '2024-11-04',
    expectedEnd: '2024-11-07',
    operator: 'Carlos Oliveira',
    machine: 'Máquina 01',
    efficiency: 0
  },
  {
    id: '4',
    orderNumber: 'PROD-2024-004',
    client: 'E-commerce Plus',
    product: 'Caixa FEFCO 0215',
    fefcoCode: '0215',
    quantity: 750,
    produced: 300,
    status: 'paused',
    priority: 'urgent',
    startDate: '2024-11-02',
    expectedEnd: '2024-11-04',
    operator: 'Ana Costa',
    machine: 'Máquina 03',
    efficiency: 68.2
  }
];

export default function ProducaoListaPage() {
  const [orders] = useState<ProductionOrder[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [priorityFilter, setPriorityFilter] = useState('todas');

  const statusOptions = ['todos', 'pending', 'in_progress', 'paused', 'completed', 'cancelled'];
  const priorityOptions = ['todas', 'low', 'medium', 'high', 'urgent'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'todas' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100';
      case 'in_progress': return 'text-blue-700 bg-blue-100';
      case 'paused': return 'text-yellow-700 bg-yellow-100';
      case 'pending': return 'text-gray-700 bg-gray-100';
      case 'cancelled': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'in_progress': return <PlayIcon className="w-4 h-4" />;
      case 'paused': return <PauseIcon className="w-4 h-4" />;
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'cancelled': return <StopIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em Produção';
      case 'paused': return 'Pausado';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const getProgressPercentage = (produced: number, quantity: number) => {
    return quantity > 0 ? (produced / quantity) * 100 : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Controle de Produção</h1>
          <p className="text-gray-600 mt-1">
            Acompanhamento de ordens de produção e eficiência
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Relatório Produção
          </button>
          <button className="btn-primary">
            <PlayIcon className="w-4 h-4 mr-2" />
            Nova Ordem
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
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <CubeIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        {['in_progress', 'pending', 'completed', 'paused'].map(status => (
          <div key={status} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{getStatusText(status)}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === status).length}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getStatusColor(status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                  {getStatusIcon(status)}
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
              <input
                type="text"
                placeholder="Buscar por ordem, cliente ou produto..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorityOptions.map(priority => (
                  <option key={priority} value={priority}>
                    {priority === 'todas' ? 'Todas Prioridades' : getPriorityText(priority)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Production Orders Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Ordens de Produção</h3>
          <p className="card-description">
            {filteredOrders.length} ordem{filteredOrders.length !== 1 ? 'ns' : ''} encontrada{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente/Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prazo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operador/Máquina
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const progress = getProgressPercentage(order.produced, order.quantity);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                          <div className="text-xs text-gray-500">FEFCO {order.fefcoCode}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.client}</div>
                          <div className="text-sm text-gray-500">{order.product}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.produced.toLocaleString('pt-BR')} / {order.quantity.toLocaleString('pt-BR')}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}%</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          {getPriorityText(order.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(order.expectedEnd)}</div>
                        {order.actualEnd && (
                          <div className="text-xs text-green-600">Finalizado: {formatDate(order.actualEnd)}</div>
                        )}
                        {!order.actualEnd && new Date(order.expectedEnd) < new Date() && (
                          <div className="text-xs text-red-500">Em atraso</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.operator}</div>
                          <div className="text-sm text-gray-500">{order.machine}</div>
                          {order.efficiency > 0 && (
                            <div className="text-xs text-blue-600">Efic: {order.efficiency}%</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600" title="Visualizar">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600" title="Editar">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          {order.status === 'pending' && (
                            <button className="p-1 text-gray-400 hover:text-green-600" title="Iniciar">
                              <PlayIcon className="w-4 h-4" />
                            </button>
                          )}
                          {order.status === 'in_progress' && (
                            <button className="p-1 text-gray-400 hover:text-yellow-600" title="Pausar">
                              <PauseIcon className="w-4 h-4" />
                            </button>
                          )}
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

      {/* No Results */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma ordem encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
}