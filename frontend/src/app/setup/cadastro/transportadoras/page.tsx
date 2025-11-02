'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Carrier {
  id: string;
  name: string;
  cnpj: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  serviceType: 'express' | 'standard' | 'freight' | 'local';
  averageDeliveryTime: number;
  costPerKm: number;
  minimumCost: number;
  rating: number;
  status: 'active' | 'inactive';
  totalDeliveries: number;
  createdAt: string;
}

const mockCarriers: Carrier[] = [
  {
    id: '1',
    name: 'TransLog Expressa',
    cnpj: '12.345.678/0001-90',
    contact: 'Carlos Santos',
    phone: '(11) 3333-4444',
    email: 'carlos@translog.com',
    address: 'Rua dos Transportes, 123',
    city: 'São Paulo',
    state: 'SP',
    serviceType: 'express',
    averageDeliveryTime: 2,
    costPerKm: 3.50,
    minimumCost: 75.00,
    rating: 4.5,
    status: 'active',
    totalDeliveries: 245,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Rápido Cargo',
    cnpj: '98.765.432/0001-10',
    contact: 'Maria Silva',
    phone: '(11) 2222-3333',
    email: 'contato@rapidocargo.com',
    address: 'Av. Logística, 500',
    city: 'Guarulhos',
    state: 'SP',
    serviceType: 'standard',
    averageDeliveryTime: 5,
    costPerKm: 2.80,
    minimumCost: 50.00,
    rating: 4.2,
    status: 'active',
    totalDeliveries: 189,
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Frete Fácil',
    cnpj: '11.222.333/0001-44',
    contact: 'João Oliveira',
    phone: '(11) 4444-5555',
    email: 'joao@fretefacil.com',
    address: 'Rua da Entrega, 789',
    city: 'Osasco',
    state: 'SP',
    serviceType: 'freight',
    averageDeliveryTime: 7,
    costPerKm: 2.20,
    minimumCost: 40.00,
    rating: 3.8,
    status: 'active',
    totalDeliveries: 156,
    createdAt: '2024-03-10'
  }
];

export default function TransportadorasPage() {
  const [carriers] = useState<Carrier[]>(mockCarriers);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('todos');

  const serviceTypes = ['todos', 'express', 'standard', 'freight', 'local'];

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carrier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carrier.cnpj.includes(searchTerm);
    
    const matchesService = serviceFilter === 'todos' || carrier.serviceType === serviceFilter;
    
    return matchesSearch && matchesService;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100';
  };

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case 'express': return 'Expresso';
      case 'standard': return 'Padrão';
      case 'freight': return 'Cargas';
      case 'local': return 'Local';
      default: return type;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'express': return 'text-red-700 bg-red-100';
      case 'standard': return 'text-blue-700 bg-blue-100';
      case 'freight': return 'text-green-700 bg-green-100';
      case 'local': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
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
          <h1 className="text-3xl font-bold text-gray-900">Transportadoras</h1>
          <p className="text-gray-600 mt-1">
            Gestão de parceiros de transporte e logística
          </p>
        </div>
        
        <button className="btn-primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Nova Transportadora
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transportadoras</p>
                <p className="text-2xl font-bold text-gray-900">{carriers.length}</p>
              </div>
              <TruckIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {carriers.filter(c => c.status === 'active').length}
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
                <p className="text-sm font-medium text-gray-600">Total Entregas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {carriers.reduce((sum, carrier) => sum + carrier.totalDeliveries, 0)}
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
                <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(carriers.reduce((sum, carrier) => sum + carrier.rating, 0) / carriers.length).toFixed(1)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-100">
                <div className="w-6 h-6 text-yellow-600">⭐</div>
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
                  placeholder="Buscar por nome, contato ou CNPJ..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {serviceTypes.map(service => (
                  <option key={service} value={service}>
                    {service === 'todos' ? 'Todos os Serviços' : getServiceTypeText(service)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Carriers Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Transportadoras</h3>
          <p className="card-description">
            {filteredCarriers.length} transportadora{filteredCarriers.length !== 1 ? 's' : ''} encontrada{filteredCarriers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transportadora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prazo/Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avaliação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entregas
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
                {filteredCarriers.map((carrier) => (
                  <tr key={carrier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{carrier.name}</div>
                        <div className="text-sm text-gray-500">{carrier.cnpj}</div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <MapPinIcon className="w-3 h-3 mr-1" />
                          {carrier.city}, {carrier.state}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">{carrier.contact}</div>
                        <div className="flex items-center text-xs text-gray-600">
                          <PhoneIcon className="w-3 h-3 mr-1" />
                          {carrier.phone}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <EnvelopeIcon className="w-3 h-3 mr-1" />
                          {carrier.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getServiceTypeColor(carrier.serviceType)}`}>
                        {getServiceTypeText(carrier.serviceType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center text-sm text-gray-900">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {carrier.averageDeliveryTime} dias
                        </div>
                        <div className="text-sm text-gray-600">{formatCurrency(carrier.costPerKm)}/km</div>
                        <div className="text-xs text-gray-500">Mín: {formatCurrency(carrier.minimumCost)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {getRatingStars(carrier.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{carrier.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{carrier.totalDeliveries}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(carrier.status)}`}>
                        {carrier.status === 'active' ? 'Ativa' : 'Inativa'}
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