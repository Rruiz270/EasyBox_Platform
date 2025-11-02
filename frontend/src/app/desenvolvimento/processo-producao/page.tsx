'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface ProductionProcess {
  id: string;
  code: string;
  name: string;
  product: string;
  fefcoCode: string;
  version: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  steps: ProductionStep[];
  totalTime: number;
  estimatedCost: number;
  actualCost: number;
  efficiency: number;
  quality: number;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  notes: string;
}

interface ProductionStep {
  id: string;
  order: number;
  name: string;
  description: string;
  machine: string;
  operator: string;
  estimatedTime: number;
  actualTime: number;
  materials: string[];
  tools: string[];
  qualityChecks: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
}

const mockProcesses: ProductionProcess[] = [
  {
    id: '1',
    code: 'PROC-0201-V1',
    name: 'Processo FEFCO 0201 Padrão',
    product: 'Caixa FEFCO 0201',
    fefcoCode: '0201',
    version: '1.0',
    status: 'active',
    steps: [
      {
        id: '1',
        order: 1,
        name: 'Preparação da Chapa',
        description: 'Corte da chapa de papelão ondulado nas dimensões especificadas',
        machine: 'Cortadeira Automática',
        operator: 'João Silva',
        estimatedTime: 15,
        actualTime: 12,
        materials: ['Papelão BC 125g/m²'],
        tools: ['Faca de corte', 'Régua'],
        qualityChecks: ['Verificação dimensional', 'Integridade do material'],
        status: 'completed'
      },
      {
        id: '2',
        order: 2,
        name: 'Vinco e Dobra',
        description: 'Aplicação de vincos para facilitar a montagem',
        machine: 'Vincadeira',
        operator: 'Maria Santos',
        estimatedTime: 20,
        actualTime: 18,
        materials: [],
        tools: ['Régua de vinco', 'Dobradeira'],
        qualityChecks: ['Qualidade dos vincos', 'Ângulos de dobra'],
        status: 'completed'
      },
      {
        id: '3',
        order: 3,
        name: 'Colagem',
        description: 'Aplicação de cola nas abas de união',
        machine: 'Coladeir Automática',
        operator: 'Carlos Oliveira',
        estimatedTime: 10,
        actualTime: 8,
        materials: ['Cola PVA'],
        tools: ['Aplicador de cola'],
        qualityChecks: ['Resistência da colagem', 'Tempo de secagem'],
        status: 'in_progress'
      },
      {
        id: '4',
        order: 4,
        name: 'Controle de Qualidade',
        description: 'Inspeção final do produto acabado',
        machine: 'Mesa de Inspeção',
        operator: 'Ana Costa',
        estimatedTime: 5,
        actualTime: 0,
        materials: [],
        tools: ['Gabarito', 'Trena'],
        qualityChecks: ['Dimensões finais', 'Acabamento', 'Resistência'],
        status: 'pending'
      }
    ],
    totalTime: 50,
    estimatedCost: 2.45,
    actualCost: 2.28,
    efficiency: 85.2,
    quality: 96.5,
    createdBy: 'Engenheiro de Processos',
    createdAt: '2024-01-15',
    lastModified: '2024-10-20',
    notes: 'Processo otimizado para produção em larga escala'
  },
  {
    id: '2',
    code: 'PROC-0301-V2',
    name: 'Processo FEFCO 0301 com Impressão',
    product: 'Caixa Personalizada',
    fefcoCode: '0301',
    version: '2.1',
    status: 'active',
    steps: [
      {
        id: '5',
        order: 1,
        name: 'Impressão',
        description: 'Impressão flexográfica 2 cores',
        machine: 'Impressora Flexográfica',
        operator: 'Pedro Lima',
        estimatedTime: 30,
        actualTime: 28,
        materials: ['Tinta flexográfica', 'Papelão BC 150g/m²'],
        tools: ['Clichê CL-002-XYZ', 'Rodo'],
        qualityChecks: ['Registro de cores', 'Densidade de tinta'],
        status: 'completed'
      },
      {
        id: '6',
        order: 2,
        name: 'Secagem',
        description: 'Secagem da impressão',
        machine: 'Estufa de Secagem',
        operator: 'Automático',
        estimatedTime: 15,
        actualTime: 15,
        materials: [],
        tools: [],
        qualityChecks: ['Aderência da tinta'],
        status: 'completed'
      },
      {
        id: '7',
        order: 3,
        name: 'Corte e Vinco',
        description: 'Corte com faca e aplicação de vincos',
        machine: 'Cortadeira/Vincadeira',
        operator: 'Roberto Santos',
        estimatedTime: 25,
        actualTime: 0,
        materials: [],
        tools: ['Faca FAC-002-XYZ'],
        qualityChecks: ['Precisão do corte', 'Qualidade dos vincos'],
        status: 'pending'
      }
    ],
    totalTime: 70,
    estimatedCost: 4.20,
    actualCost: 3.85,
    efficiency: 92.1,
    quality: 94.8,
    createdBy: 'Especialista em Impressão',
    createdAt: '2024-02-20',
    lastModified: '2024-11-01',
    notes: 'Processo para produtos com impressão personalizada'
  }
];

export default function ProcessoProducaoPage() {
  const [processes] = useState<ProductionProcess[]>(mockProcesses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const statusOptions = ['todos', 'active', 'inactive', 'draft', 'archived'];

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || process.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-gray-700 bg-gray-100';
      case 'draft': return 'text-yellow-700 bg-yellow-100';
      case 'archived': return 'text-purple-700 bg-purple-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'draft': return 'Rascunho';
      case 'archived': return 'Arquivado';
      default: return status;
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100';
      case 'in_progress': return 'text-blue-700 bg-blue-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'skipped': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'in_progress': return <PlayIcon className="w-4 h-4" />;
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'skipped': return <PauseIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
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

  const getCompletedSteps = (steps: ProductionStep[]) => {
    return steps.filter(step => step.status === 'completed').length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Processos de Produção</h1>
          <p className="text-gray-600 mt-1">
            Gestão de fluxos e procedimentos de produção
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Exportar Processos
          </button>
          <button className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Processo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Processos</p>
                <p className="text-2xl font-bold text-gray-900">{processes.length}</p>
              </div>
              <ClipboardDocumentListIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {processes.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <div className="w-6 h-6 text-green-600">✓</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eficiência Média</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(processes.reduce((sum, p) => sum + p.efficiency, 0) / processes.length).toFixed(1)}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <div className="w-6 h-6 text-blue-600">📊</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualidade Média</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(processes.reduce((sum, p) => sum + p.quality, 0) / processes.length).toFixed(1)}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <div className="w-6 h-6 text-purple-600">⭐</div>
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
                  placeholder="Buscar por nome, código ou produto..."
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

      {/* Processes List */}
      {filteredProcesses.map((process) => (
        <div key={process.id} className="card">
          <div className="card-header">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="card-title">{process.name}</h3>
                <p className="card-description">
                  {process.code} - {process.product} (FEFCO {process.fefcoCode}) - Versão {process.version}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(process.status)}`}>
                  {getStatusText(process.status)}
                </span>
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
              </div>
            </div>
          </div>
          
          <div className="card-content">
            {/* Process Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{process.totalTime}</div>
                <div className="text-sm text-gray-600">min totais</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{process.efficiency}%</div>
                <div className="text-sm text-gray-600">eficiência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{process.quality}%</div>
                <div className="text-sm text-gray-600">qualidade</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(process.actualCost)}</div>
                <div className="text-sm text-gray-600">custo real</div>
              </div>
            </div>

            {/* Process Steps */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">
                  Etapas do Processo ({getCompletedSteps(process.steps)}/{process.steps.length} concluídas)
                </h4>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(getCompletedSteps(process.steps) / process.steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-3">
                {process.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-600 mr-4">
                      {step.order}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-sm font-medium text-gray-900">{step.name}</h5>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStepStatusColor(step.status)}`}>
                          <span className="mr-1">{getStepStatusIcon(step.status)}</span>
                          {step.status === 'completed' ? 'Concluído' : 
                           step.status === 'in_progress' ? 'Em Andamento' :
                           step.status === 'pending' ? 'Pendente' : 'Pulado'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Máquina:</span> {step.machine}
                        </div>
                        <div>
                          <span className="font-medium">Operador:</span> {step.operator}
                        </div>
                        <div>
                          <span className="font-medium">Tempo Est.:</span> {step.estimatedTime}min
                        </div>
                        <div>
                          <span className="font-medium">Tempo Real:</span> {step.actualTime || 0}min
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Notes */}
            {process.notes && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-900 mb-1">Observações</h5>
                <p className="text-sm text-gray-600">{process.notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* No Results */}
      {filteredProcesses.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum processo encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
}