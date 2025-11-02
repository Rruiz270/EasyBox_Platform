'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Quote {
  id: string;
  number: string;
  client: string;
  product: string;
  fefcoCode: string;
  dimensions: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  createdAt: string;
  validUntil: string;
  salesPerson: string;
}

const mockQuotes: Quote[] = [
  {
    id: '1',
    number: 'ORC-2024-001',
    client: 'ACME Distribuidora Ltda',
    product: 'Caixa FEFCO 0201',
    fefcoCode: '0201',
    dimensions: '400×300×250mm',
    quantity: 1000,
    unitPrice: 2.45,
    totalValue: 2450,
    status: 'sent',
    createdAt: '2024-10-28',
    validUntil: '2024-11-15',
    salesPerson: 'João Silva'
  },
  {
    id: '2',
    number: 'ORC-2024-002',
    client: 'Distribuidora XYZ S.A.',
    product: 'Caixa Personalizada',
    fefcoCode: '0301',
    dimensions: '500×400×300mm',
    quantity: 500,
    unitPrice: 3.20,
    totalValue: 1600,
    status: 'approved',
    createdAt: '2024-10-25',
    validUntil: '2024-11-12',
    salesPerson: 'Maria Santos'
  },
  {
    id: '3',
    number: 'ORC-2024-003',
    client: 'Indústria ABC Ltda',
    product: 'Caixa FEFCO 0401',
    fefcoCode: '0401',
    dimensions: '350×250×200mm',
    quantity: 2000,
    unitPrice: 1.85,
    totalValue: 3700,
    status: 'draft',
    createdAt: '2024-10-30',
    validUntil: '2024-11-20',
    salesPerson: 'Carlos Oliveira'
  },
  {
    id: '4',
    number: 'ORC-2024-004',
    client: 'E-commerce Plus',
    product: 'Caixa FEFCO 0215',
    fefcoCode: '0215',
    dimensions: '600×400×350mm',
    quantity: 750,
    unitPrice: 4.15,
    totalValue: 3112.50,
    status: 'expired',
    createdAt: '2024-10-10',
    validUntil: '2024-10-25',
    salesPerson: 'Ana Costa'
  }
];

export default function OrcamentosListaPage() {
  const [quotes] = useState<Quote[]>(mockQuotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const statusOptions = ['todos', 'draft', 'sent', 'approved', 'rejected', 'expired'];

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-100';
      case 'sent': return 'text-blue-700 bg-blue-100';
      case 'draft': return 'text-gray-700 bg-gray-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      case 'expired': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="w-4 h-4" />;
      case 'sent': return <ClockIcon className="w-4 h-4" />;
      case 'draft': return <PencilIcon className="w-4 h-4" />;
      case 'rejected': return <ExclamationCircleIcon className="w-4 h-4" />;
      case 'expired': return <ExclamationCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'sent': return 'Enviado';
      case 'draft': return 'Rascunho';
      case 'rejected': return 'Rejeitado';
      case 'expired': return 'Expirado';
      default: return status;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lista de Orçamentos</h1>
          <p className="text-gray-600 mt-1">
            Gestão completa de cotações e orçamentos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Exportar
          </button>
          <button className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Orçamento
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
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <div className="w-6 h-6 text-blue-600">📋</div>
              </div>
            </div>
          </div>
        </div>
        
        {['approved', 'sent', 'draft', 'expired'].map(status => (
          <div key={status} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{getStatusText(status)}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quotes.filter(q => q.status === status).length}
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
                  placeholder="Buscar por número, cliente ou produto..."
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

      {/* Quotes Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Orçamentos</h3>
          <p className="card-description">
            {filteredQuotes.length} orçamento{filteredQuotes.length !== 1 ? 's' : ''} encontrado{filteredQuotes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orçamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quote.number}</div>
                        <div className="text-sm text-gray-500">Por: {quote.salesPerson}</div>
                        <div className="text-xs text-gray-400">{formatDate(quote.createdAt)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quote.client}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quote.product}</div>
                        <div className="text-sm text-gray-500">FEFCO {quote.fefcoCode}</div>
                        <div className="text-xs text-gray-400">{quote.dimensions}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.quantity.toLocaleString('pt-BR')} un
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(quote.unitPrice)}/un
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(quote.totalValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        <span className="mr-1">{getStatusIcon(quote.status)}</span>
                        {getStatusText(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(quote.validUntil)}</div>
                      <div className={`text-xs ${new Date(quote.validUntil) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>
                        {new Date(quote.validUntil) < new Date() ? 'Expirado' : 'Válido'}
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
                        <button className="p-1 text-gray-400 hover:text-purple-600" title="Exportar PDF">
                          <DocumentArrowDownIcon className="w-4 h-4" />
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
      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <DocumentArrowDownIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum orçamento encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
}