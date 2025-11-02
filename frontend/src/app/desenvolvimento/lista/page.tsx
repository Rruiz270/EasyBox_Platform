'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CubeIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface DevelopmentProject {
  id: string;
  projectNumber: string;
  name: string;
  client: string;
  productType: string;
  fefcoCode: string;
  dimensions: string;
  status: 'planning' | 'development' | 'testing' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  expectedEnd: string;
  actualEnd?: string;
  designer: string;
  progress: number;
  estimatedCost: number;
  actualCost: number;
  requirements: string[];
}

const mockProjects: DevelopmentProject[] = [
  {
    id: '1',
    projectNumber: 'DEV-2024-001',
    name: 'Caixa Especial E-commerce',
    client: 'ACME Distribuidora Ltda',
    productType: 'Caixa Personalizada',
    fefcoCode: '0201',
    dimensions: '400×300×250mm',
    status: 'development',
    priority: 'high',
    startDate: '2024-10-15',
    expectedEnd: '2024-11-15',
    designer: 'Carlos Oliveira',
    progress: 75,
    estimatedCost: 15000,
    actualCost: 12500,
    requirements: ['Impressão 4 cores', 'Verniz UV', 'Corte especial']
  },
  {
    id: '2',
    projectNumber: 'DEV-2024-002',
    name: 'Embalagem Industrial Resistente',
    client: 'Indústria XYZ S.A.',
    productType: 'Caixa Industrial',
    fefcoCode: '0301',
    dimensions: '600×500×400mm',
    status: 'testing',
    priority: 'medium',
    startDate: '2024-09-20',
    expectedEnd: '2024-11-30',
    designer: 'Maria Santos',
    progress: 90,
    estimatedCost: 25000,
    actualCost: 23800,
    requirements: ['Alta resistência', 'Teste McKee', 'Certificação ISO']
  },
  {
    id: '3',
    projectNumber: 'DEV-2024-003',
    name: 'Caixa Farmacêutica',
    client: 'Pharma ABC',
    productType: 'Caixa Especializada',
    fefcoCode: '0427',
    dimensions: '300×200×150mm',
    status: 'planning',
    priority: 'urgent',
    startDate: '2024-11-01',
    expectedEnd: '2024-12-15',
    designer: 'Ana Costa',
    progress: 25,
    estimatedCost: 18000,
    actualCost: 4500,
    requirements: ['Material atóxico', 'Selagem especial', 'Rastreabilidade']
  },
  {
    id: '4',
    projectNumber: 'DEV-2024-004',
    name: 'Display Promocional',
    client: 'Marketing Plus',
    productType: 'Display',
    fefcoCode: '0751',
    dimensions: '800×600×1200mm',
    status: 'completed',
    priority: 'medium',
    startDate: '2024-08-01',
    expectedEnd: '2024-10-01',
    actualEnd: '2024-09-28',
    designer: 'João Silva',
    progress: 100,
    estimatedCost: 12000,
    actualCost: 11200,
    requirements: ['Montagem fácil', 'Impressão digital', 'Durabilidade']
  }
];

export default function DesenvolvimentoListaPage() {
  const [projects] = useState<DevelopmentProject[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [priorityFilter, setPriorityFilter] = useState('todas');

  const statusOptions = ['todos', 'planning', 'development', 'testing', 'completed', 'on_hold'];
  const priorityOptions = ['todas', 'low', 'medium', 'high', 'urgent'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'todas' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100';
      case 'development': return 'text-blue-700 bg-blue-100';
      case 'testing': return 'text-purple-700 bg-purple-100';
      case 'planning': return 'text-yellow-700 bg-yellow-100';
      case 'on_hold': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'development': return <CubeIcon className="w-4 h-4" />;
      case 'testing': return <BeakerIcon className="w-4 h-4" />;
      case 'planning': return <DocumentTextIcon className="w-4 h-4" />;
      case 'on_hold': return <ExclamationTriangleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'development': return 'Desenvolvimento';
      case 'testing': return 'Testes';
      case 'planning': return 'Planejamento';
      case 'on_hold': return 'Pausado';
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = (expectedEnd: string, status: string) => {
    return status !== 'completed' && new Date(expectedEnd) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos de Desenvolvimento</h1>
          <p className="text-gray-600 mt-1">
            Gestão de projetos de desenvolvimento de produtos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Relatório Projetos
          </button>
          <button className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Projeto
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
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <CubeIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        {['development', 'testing', 'planning', 'completed'].map(status => (
          <div key={status} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{getStatusText(status)}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.filter(p => p.status === status).length}
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
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por projeto, cliente ou número..."
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

      {/* Projects Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Projetos</h3>
          <p className="card-description">
            {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projeto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente/Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prazos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.projectNumber}</div>
                        <div className="text-xs text-gray-400">FEFCO {project.fefcoCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.client}</div>
                        <div className="text-sm text-gray-500">{project.productType}</div>
                        <div className="text-xs text-gray-400">{project.dimensions}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        <span className="mr-1">{getStatusIcon(project.status)}</span>
                        {getStatusText(project.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {getPriorityText(project.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Custo: {formatCurrency(project.actualCost)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          Prazo: {formatDate(project.expectedEnd)}
                        </div>
                        {project.actualEnd && (
                          <div className="text-xs text-green-600">
                            Finalizado: {formatDate(project.actualEnd)}
                          </div>
                        )}
                        {isOverdue(project.expectedEnd, project.status) && (
                          <div className="text-xs text-red-500">Em atraso</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.designer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600" title="Visualizar">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600" title="Editar">
                          <PencilIcon className="w-4 h-4" />
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

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum projeto encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
}