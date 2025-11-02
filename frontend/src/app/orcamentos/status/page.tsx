'use client';

import React, { useState } from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface StatusData {
  period: string;
  total: number;
  draft: number;
  sent: number;
  approved: number;
  rejected: number;
  expired: number;
  conversionRate: number;
  averageValue: number;
}

const mockStatusData: StatusData[] = [
  {
    period: 'Novembro 2024',
    total: 45,
    draft: 8,
    sent: 12,
    approved: 18,
    rejected: 5,
    expired: 2,
    conversionRate: 72.0,
    averageValue: 2850
  },
  {
    period: 'Outubro 2024',
    total: 52,
    draft: 6,
    sent: 8,
    approved: 28,
    rejected: 7,
    expired: 3,
    conversionRate: 75.7,
    averageValue: 3150
  },
  {
    period: 'Setembro 2024',
    total: 38,
    draft: 4,
    sent: 6,
    approved: 22,
    rejected: 4,
    expired: 2,
    conversionRate: 78.6,
    averageValue: 2680
  }
];

interface StatusMetric {
  status: string;
  count: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

export default function StatusPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('Novembro 2024');
  const currentData = mockStatusData.find(d => d.period === selectedPeriod) || mockStatusData[0];

  const statusMetrics: StatusMetric[] = [
    {
      status: 'Rascunho',
      count: currentData.draft,
      percentage: (currentData.draft / currentData.total) * 100,
      color: 'bg-gray-500',
      icon: <DocumentTextIcon className="w-5 h-5 text-white" />,
      description: 'Orçamentos em elaboração'
    },
    {
      status: 'Enviado',
      count: currentData.sent,
      percentage: (currentData.sent / currentData.total) * 100,
      color: 'bg-blue-500',
      icon: <ClockIcon className="w-5 h-5 text-white" />,
      description: 'Aguardando resposta do cliente'
    },
    {
      status: 'Aprovado',
      count: currentData.approved,
      percentage: (currentData.approved / currentData.total) * 100,
      color: 'bg-green-500',
      icon: <CheckCircleIcon className="w-5 h-5 text-white" />,
      description: 'Orçamentos aceitos pelo cliente'
    },
    {
      status: 'Rejeitado',
      count: currentData.rejected,
      percentage: (currentData.rejected / currentData.total) * 100,
      color: 'bg-red-500',
      icon: <ExclamationCircleIcon className="w-5 h-5 text-white" />,
      description: 'Orçamentos recusados'
    },
    {
      status: 'Expirado',
      count: currentData.expired,
      percentage: (currentData.expired / currentData.total) * 100,
      color: 'bg-orange-500',
      icon: <CalendarIcon className="w-5 h-5 text-white" />,
      description: 'Orçamentos vencidos'
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Status dos Orçamentos</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe o desempenho e conversão dos orçamentos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {mockStatusData.map(data => (
              <option key={data.period} value={data.period}>
                {data.period}
              </option>
            ))}
          </select>
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Orçamentos</p>
                <p className="text-2xl font-bold text-gray-900">{currentData.total}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-green-600">{currentData.conversionRate}%</p>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.averageValue)}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <div className="w-6 h-6 text-purple-600">💰</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{currentData.sent}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Distribuição por Status</h3>
          <p className="card-description">
            Análise detalhada do status dos orçamentos no período selecionado
          </p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statusMetrics.map((metric, index) => (
              <div key={metric.status} className="text-center">
                <div className={`w-16 h-16 ${metric.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  {metric.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.count}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">
                  {metric.status}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {metric.percentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Progresso Visual</h3>
          <p className="card-description">
            Representação gráfica da distribuição de status
          </p>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {statusMetrics.map((metric) => (
              <div key={metric.status}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${metric.color} rounded-full mr-2`}></div>
                    <span className="text-sm font-medium text-gray-700">{metric.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{metric.count}</span>
                    <span className="text-xs text-gray-500">({metric.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metric.color}`}
                    style={{ width: `${metric.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Comparison */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Comparativo Histórico</h3>
          <p className="card-description">
            Evolução dos orçamentos nos últimos períodos
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aprovados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa Conversão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Médio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockStatusData.map((data, index) => (
                  <tr key={data.period} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{data.period}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{data.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">{data.approved}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{data.conversionRate}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(data.averageValue)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <EyeIcon className="w-4 h-4" />
                      </button>
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