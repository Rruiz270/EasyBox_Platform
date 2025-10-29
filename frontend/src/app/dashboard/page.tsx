'use client';

import React from 'react';
import {
  CubeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import {
  CubeIcon as CubeSolidIcon,
  DocumentTextIcon as DocumentSolidIcon,
  UserGroupIcon as UserGroupSolidIcon,
  ChartBarIcon as ChartBarSolidIcon
} from '@heroicons/react/24/solid';

export default function DashboardPage() {
  // Mock data - in real app this would come from API
  const stats = [
    {
      name: 'Cotações Ativas',
      value: '127',
      change: '+12%',
      changeType: 'increase',
      icon: DocumentTextIcon,
      iconSolid: DocumentSolidIcon,
      color: 'blue'
    },
    {
      name: 'Clientes Ativos',
      value: '89',
      change: '+5%',
      changeType: 'increase',
      icon: UserGroupIcon,
      iconSolid: UserGroupSolidIcon,
      color: 'green'
    },
    {
      name: 'Ordens em Produção',
      value: '23',
      change: '-2%',
      changeType: 'decrease',
      icon: CubeIcon,
      iconSolid: CubeSolidIcon,
      color: 'purple'
    },
    {
      name: 'Faturamento Mensal',
      value: 'R$ 284.5K',
      change: '+18%',
      changeType: 'increase',
      icon: ChartBarIcon,
      iconSolid: ChartBarSolidIcon,
      color: 'orange'
    }
  ];

  const recentQuotes = [
    {
      id: '2024-001',
      client: 'ACME Corp',
      product: 'Caixa FEFCO 0201 - 400x300x250mm',
      value: 'R$ 12.450,00',
      status: 'pending',
      date: '2024-10-29'
    },
    {
      id: '2024-002',
      client: 'Distribuidora XYZ',
      product: 'Caixa Personalizada - 500x400x300mm',
      value: 'R$ 8.750,00',
      status: 'approved',
      date: '2024-10-28'
    },
    {
      id: '2024-003',
      client: 'Indústria ABC',
      product: 'Caixa FEFCO 0301 - 350x250x200mm',
      value: 'R$ 15.200,00',
      status: 'sent',
      date: '2024-10-27'
    },
    {
      id: '2024-004',
      client: 'Empresa DEF',
      product: 'Caixa FEFCO 0201 - 600x400x350mm',
      value: 'R$ 22.100,00',
      status: 'draft',
      date: '2024-10-26'
    }
  ];

  const productionOrders = [
    {
      id: 'OP-2024-045',
      client: 'ACME Corp',
      product: 'FEFCO 0201 - BC Flute',
      quantity: '1,000 un',
      progress: 85,
      status: 'in_production',
      dueDate: '2024-11-02'
    },
    {
      id: 'OP-2024-046',
      client: 'Distribuidora XYZ',
      product: 'Caixa Personalizada',
      quantity: '500 un',
      progress: 45,
      status: 'in_production',
      dueDate: '2024-11-05'
    },
    {
      id: 'OP-2024-047',
      client: 'Indústria ABC',
      product: 'FEFCO 0301 - EB Flute',
      quantity: '2,000 un',
      progress: 100,
      status: 'completed',
      dueDate: '2024-10-30'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Material em estoque baixo',
      message: 'Papelão BC Flute - Estoque: 150m² (Mín: 500m²)',
      time: '2 horas atrás'
    },
    {
      id: 2,
      type: 'info',
      title: 'Manutenção programada',
      message: 'FFG-01 agendada para manutenção em 15/11/2024',
      time: '1 dia atrás'
    },
    {
      id: 3,
      type: 'success',
      title: 'Meta de produção atingida',
      message: 'Outubro: 15,234 caixas produzidas (Meta: 15,000)',
      time: '2 dias atrás'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'sent': return 'text-blue-700 bg-blue-100';
      case 'draft': return 'text-gray-700 bg-gray-100';
      case 'completed': return 'text-green-700 bg-green-100';
      case 'in_production': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovada';
      case 'pending': return 'Pendente';
      case 'sent': return 'Enviada';
      case 'draft': return 'Rascunho';
      case 'completed': return 'Concluída';
      case 'in_production': return 'Em Produção';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visão geral do sistema - {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <EyeIcon className="w-4 h-4 mr-2" />
            Relatórios
          </button>
          <button className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Cotação
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'increase' ? (
                      <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.iconSolid className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Cotações Recentes</h3>
            <p className="card-description">Últimas cotações criadas no sistema</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">#{quote.id}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {getStatusText(quote.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{quote.client}</p>
                    <p className="text-sm text-gray-500">{quote.product}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-green-600">{quote.value}</span>
                      <span className="text-xs text-gray-500">{quote.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Ver todas as cotações →
              </button>
            </div>
          </div>
        </div>

        {/* Production Orders */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Ordens de Produção</h3>
            <p className="card-description">Status das ordens em andamento</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {productionOrders.map((order) => (
                <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">#{order.id}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{order.client}</p>
                  <p className="text-sm text-gray-500 mb-3">{order.product} - {order.quantity}</p>
                  
                  {order.status === 'in_production' && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-medium">{order.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      Entrega: {order.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Ver todas as ordens →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Alertas e Notificações</h3>
          <p className="card-description">Informações importantes que requerem atenção</p>
        </div>
        <div className="card-content">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200">
                <div className="flex-shrink-0">
                  {alert.type === 'warning' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                  )}
                  {alert.type === 'info' && (
                    <CubeIcon className="w-5 h-5 text-blue-500" />
                  )}
                  {alert.type === 'success' && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}