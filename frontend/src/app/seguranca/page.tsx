'use client';

import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  UserIcon,
  KeyIcon,
  EyeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CogIcon,
  LockClosedIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface SecurityLog {
  id: string;
  type: 'login' | 'logout' | 'access_denied' | 'password_change' | 'data_export' | 'config_change';
  user: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  status: 'success' | 'failed' | 'warning';
}

interface SecurityMetric {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const mockSecurityLogs: SecurityLog[] = [
  {
    id: '1',
    type: 'login',
    user: 'João Silva',
    description: 'Login realizado com sucesso',
    timestamp: '2024-11-02T09:15:00',
    ipAddress: '192.168.1.10',
    device: 'Chrome/Windows',
    status: 'success'
  },
  {
    id: '2',
    type: 'access_denied',
    user: 'Maria Santos',
    description: 'Tentativa de acesso negado - área restrita',
    timestamp: '2024-11-02T08:45:00',
    ipAddress: '192.168.1.25',
    device: 'Firefox/MacOS',
    status: 'failed'
  },
  {
    id: '3',
    type: 'data_export',
    user: 'Carlos Oliveira',
    description: 'Exportação de relatório de clientes',
    timestamp: '2024-11-01T16:30:00',
    ipAddress: '192.168.1.15',
    device: 'Chrome/Windows',
    status: 'warning'
  },
  {
    id: '4',
    type: 'password_change',
    user: 'Ana Costa',
    description: 'Alteração de senha realizada',
    timestamp: '2024-11-01T14:20:00',
    ipAddress: '192.168.1.33',
    device: 'Safari/iOS',
    status: 'success'
  },
  {
    id: '5',
    type: 'config_change',
    user: 'João Silva',
    description: 'Configurações de sistema alteradas',
    timestamp: '2024-11-01T10:15:00',
    ipAddress: '192.168.1.10',
    device: 'Chrome/Windows',
    status: 'warning'
  }
];

export default function SegurancaPage() {
  const [logs] = useState<SecurityLog[]>(mockSecurityLogs);
  const [selectedType, setSelectedType] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState('todos');

  const logTypes = ['todos', 'login', 'logout', 'access_denied', 'password_change', 'data_export', 'config_change'];
  const statusTypes = ['todos', 'success', 'failed', 'warning'];

  const filteredLogs = logs.filter(log => {
    const matchesType = selectedType === 'todos' || log.type === selectedType;
    const matchesStatus = selectedStatus === 'todos' || log.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const securityMetrics: SecurityMetric[] = [
    {
      title: 'Logins Hoje',
      value: logs.filter(l => l.type === 'login' && l.timestamp.startsWith('2024-11-02')).length,
      change: 12,
      icon: <UserIcon className="w-6 h-6 text-white" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Tentativas Negadas',
      value: logs.filter(l => l.status === 'failed').length,
      change: -25,
      icon: <ExclamationTriangleIcon className="w-6 h-6 text-white" />,
      color: 'bg-red-500'
    },
    {
      title: 'Alterações Config',
      value: logs.filter(l => l.type === 'config_change').length,
      change: 0,
      icon: <CogIcon className="w-6 h-6 text-white" />,
      color: 'bg-orange-500'
    },
    {
      title: 'Exportações',
      value: logs.filter(l => l.type === 'data_export').length,
      change: 8,
      icon: <DocumentTextIcon className="w-6 h-6 text-white" />,
      color: 'bg-purple-500'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login': return <UserIcon className="w-4 h-4" />;
      case 'logout': return <UserIcon className="w-4 h-4" />;
      case 'access_denied': return <LockClosedIcon className="w-4 h-4" />;
      case 'password_change': return <KeyIcon className="w-4 h-4" />;
      case 'data_export': return <DocumentTextIcon className="w-4 h-4" />;
      case 'config_change': return <CogIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'login': return 'Login';
      case 'logout': return 'Logout';
      case 'access_denied': return 'Acesso Negado';
      case 'password_change': return 'Alteração Senha';
      case 'data_export': return 'Exportação';
      case 'config_change': return 'Config. Sistema';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-700 bg-green-100';
      case 'failed': return 'text-red-700 bg-red-100';
      case 'warning': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Sucesso';
      case 'failed': return 'Falhou';
      case 'warning': return 'Atenção';
      default: return status;
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Segurança</h1>
          <p className="text-gray-600 mt-1">
            Monitoramento de atividades e logs de segurança do sistema
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Exportar Logs
          </button>
          <button className="btn-primary">
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            Auditoria Completa
          </button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => (
          <div key={index} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs ontem</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Status de Segurança</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Firewall</span>
                </div>
                <span className="text-sm font-medium text-green-600">Ativo</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LockClosedIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">SSL/TLS</span>
                </div>
                <span className="text-sm font-medium text-green-600">Configurado</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <KeyIcon className="w-5 h-5 text-yellow-500 mr-3" />
                  <span className="text-sm">2FA</span>
                </div>
                <span className="text-sm font-medium text-yellow-600">Parcial</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ComputerDesktopIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm">Backup</span>
                </div>
                <span className="text-sm font-medium text-green-600">Diário</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Últimas Atividades</h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${getStatusColor(log.status)}`}>
                    {getTypeIcon(log.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{log.user}</p>
                    <p className="text-xs text-gray-500">{log.description}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Alertas de Segurança</h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">
                    Tentativas de login suspeitas
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  3 tentativas falharam nos últimos 30 min
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Backup agendado
                  </span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Próximo backup em 2 horas
                </p>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    Sistema atualizado
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Patches de segurança aplicados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-64">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {logTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'todos' ? 'Todos os Tipos' : getTypeText(type)}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusTypes.map(status => (
                  <option key={status} value={status}>
                    {status === 'todos' ? 'Todos Status' : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Security Logs Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Logs de Segurança</h3>
          <p className="card-description">
            {filteredLogs.length} evento{filteredLogs.length !== 1 ? 's' : ''} encontrado{filteredLogs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP/Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${getStatusColor(log.status)}`}>
                          {getTypeIcon(log.type)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {getTypeText(log.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.user}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{log.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        {getStatusText(log.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDateTime(log.timestamp)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{log.ipAddress}</div>
                        <div className="text-xs text-gray-500">{log.device}</div>
                      </div>
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