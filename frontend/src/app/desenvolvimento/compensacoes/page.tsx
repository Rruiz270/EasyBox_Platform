'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BeakerIcon,
  CalculatorIcon,
  DocumentTextIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

interface Compensation {
  id: string;
  name: string;
  fefcoCode: string;
  materialType: string;
  thickness: number;
  compressionFactor: number;
  elasticityFactor: number;
  humidityCompensation: number;
  temperatureCompensation: number;
  ageingCompensation: number;
  status: 'active' | 'inactive' | 'testing';
  createdBy: string;
  createdAt: string;
  lastModified: string;
  applications: string[];
}

const mockCompensations: Compensation[] = [
  {
    id: '1',
    name: 'Compensação BC Padrão',
    fefcoCode: '0201',
    materialType: 'Ondulado BC 125g/m²',
    thickness: 3.5,
    compressionFactor: 0.92,
    elasticityFactor: 0.88,
    humidityCompensation: 0.15,
    temperatureCompensation: 0.08,
    ageingCompensation: 0.12,
    status: 'active',
    createdBy: 'Carlos Oliveira',
    createdAt: '2024-01-15',
    lastModified: '2024-10-20',
    applications: ['Caixas padrão', 'Embalagens leves', 'E-commerce']
  },
  {
    id: '2',
    name: 'Compensação EB Resistente',
    fefcoCode: '0301',
    materialType: 'Ondulado EB 150g/m²',
    thickness: 4.2,
    compressionFactor: 0.95,
    elasticityFactor: 0.91,
    humidityCompensation: 0.12,
    temperatureCompensation: 0.06,
    ageingCompensation: 0.10,
    status: 'active',
    createdBy: 'Maria Santos',
    createdAt: '2024-02-20',
    lastModified: '2024-11-01',
    applications: ['Produtos pesados', 'Embalagens industriais', 'Exportação']
  },
  {
    id: '3',
    name: 'Compensação ECT44 Especial',
    fefcoCode: '0401',
    materialType: 'Ondulado ECT44 200g/m²',
    thickness: 6.8,
    compressionFactor: 0.98,
    elasticityFactor: 0.94,
    humidityCompensation: 0.08,
    temperatureCompensation: 0.04,
    ageingCompensation: 0.07,
    status: 'testing',
    createdBy: 'Ana Costa',
    createdAt: '2024-10-15',
    lastModified: '2024-11-02',
    applications: ['Alta resistência', 'Produtos frágeis', 'Cargas pesadas']
  },
  {
    id: '4',
    name: 'Compensação Climática',
    fefcoCode: '0215',
    materialType: 'Ondulado BC 100g/m²',
    thickness: 3.2,
    compressionFactor: 0.89,
    elasticityFactor: 0.85,
    humidityCompensation: 0.25,
    temperatureCompensation: 0.18,
    ageingCompensation: 0.20,
    status: 'inactive',
    createdBy: 'João Silva',
    createdAt: '2023-12-01',
    lastModified: '2024-08-15',
    applications: ['Climas úmidos', 'Armazenamento longo', 'Regiões tropicais']
  }
];

export default function CompensacoesPage() {
  const [compensations] = useState<Compensation[]>(mockCompensations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const statusOptions = ['todos', 'active', 'inactive', 'testing'];

  const filteredCompensations = compensations.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.fefcoCode.includes(searchTerm) ||
                         comp.materialType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || comp.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-red-700 bg-red-100';
      case 'testing': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'testing': return 'Em Teste';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getEfficiencyRating = (compressionFactor: number, elasticityFactor: number) => {
    const average = (compressionFactor + elasticityFactor) / 2;
    if (average >= 0.95) return { rating: 'Excelente', color: 'text-green-600' };
    if (average >= 0.90) return { rating: 'Boa', color: 'text-blue-600' };
    if (average >= 0.85) return { rating: 'Regular', color: 'text-yellow-600' };
    return { rating: 'Baixa', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compensações de Material</h1>
          <p className="text-gray-600 mt-1">
            Configuração de fatores de compensação para cálculos precisos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Exportar Dados
          </button>
          <button className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Compensação
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{compensations.length}</p>
              </div>
              <BeakerIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        {['active', 'testing', 'inactive'].map(status => (
          <div key={status} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{getStatusText(status)}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {compensations.filter(c => c.status === status).length}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getStatusColor(status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                  <div className="w-6 h-6">
                    {status === 'active' && '✓'}
                    {status === 'testing' && '🧪'}
                    {status === 'inactive' && '⏸️'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Materiais Únicos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(compensations.map(c => c.materialType)).size}
                </p>
              </div>
              <CubeIcon className="w-8 h-8 text-purple-600" />
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
                  placeholder="Buscar por nome, FEFCO ou tipo de material..."
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

      {/* Compensations Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Compensações</h3>
          <p className="card-description">
            {filteredCompensations.length} compensaç{filteredCompensations.length !== 1 ? 'ões' : 'ão'} encontrada{filteredCompensations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compensação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fatores Principais
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compensações Ambientais
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eficiência
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
                {filteredCompensations.map((compensation) => {
                  const efficiency = getEfficiencyRating(compensation.compressionFactor, compensation.elasticityFactor);
                  return (
                    <tr key={compensation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{compensation.name}</div>
                          <div className="text-sm text-gray-500">FEFCO {compensation.fefcoCode}</div>
                          <div className="text-xs text-gray-400">Por: {compensation.createdBy}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{compensation.materialType}</div>
                          <div className="text-xs text-gray-500">Espessura: {compensation.thickness}mm</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            Compressão: {(compensation.compressionFactor * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">
                            Elasticidade: {(compensation.elasticityFactor * 100).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600">
                            Umidade: {(compensation.humidityCompensation * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600">
                            Temperatura: {(compensation.temperatureCompensation * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600">
                            Envelhecimento: {(compensation.ageingCompensation * 100).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${efficiency.color}`}>
                            {efficiency.rating}
                          </div>
                          <div className="text-xs text-gray-500">
                            Média: {((compensation.compressionFactor + compensation.elasticityFactor) / 2 * 100).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(compensation.status)}`}>
                          {getStatusText(compensation.status)}
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
                          <button className="p-1 text-gray-400 hover:text-purple-600" title="Testar">
                            <CalculatorIcon className="w-4 h-4" />
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

      {/* Usage Information */}
      <div className="card border-l-4 border-blue-500">
        <div className="card-content">
          <h4 className="font-medium text-gray-900 mb-2">💡 Sobre Compensações</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Fator de Compressão:</strong> Redução de resistência devido à compressão do material</p>
            <p>• <strong>Fator de Elasticidade:</strong> Capacidade de recuperação após deformação</p>
            <p>• <strong>Compensação de Umidade:</strong> Perda de resistência em ambientes úmidos</p>
            <p>• <strong>Compensação de Temperatura:</strong> Variação de propriedades com temperatura</p>
            <p>• <strong>Compensação de Envelhecimento:</strong> Degradação ao longo do tempo</p>
          </div>
        </div>
      </div>
    </div>
  );
}