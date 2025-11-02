'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  TagIcon,
  CalculatorIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { useCRUD } from '@/hooks/useCRUD';

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  fefcoCode: string;
  category: 'standard' | 'custom' | 'special';
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  materialType: string;
  weight: number;
  unitCost: number;
  sellingPrice: number;
  margin: number;
  stock: number;
  minStock: number;
  status: 'active' | 'inactive' | 'discontinued';
  totalSold: number;
  createdAt: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    code: 'CX-0201-001',
    name: 'Caixa FEFCO 0201 - Padrão',
    description: 'Caixa de papelão ondulado padrão FEFCO 0201',
    fefcoCode: '0201',
    category: 'standard',
    dimensions: { length: 400, width: 300, height: 250 },
    materialType: 'Ondulado BC 125g/m²',
    weight: 0.8,
    unitCost: 2.45,
    sellingPrice: 3.92,
    margin: 60,
    stock: 1250,
    minStock: 200,
    status: 'active',
    totalSold: 2450,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    code: 'CX-0301-002',
    name: 'Caixa FEFCO 0301 - Personalizada',
    description: 'Caixa personalizada com impressão 2 cores',
    fefcoCode: '0301',
    category: 'custom',
    dimensions: { length: 500, width: 400, height: 300 },
    materialType: 'Ondulado BC 150g/m²',
    weight: 1.2,
    unitCost: 4.20,
    sellingPrice: 7.56,
    margin: 80,
    stock: 850,
    minStock: 150,
    status: 'active',
    totalSold: 1890,
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    code: 'CX-0401-003',
    name: 'Caixa FEFCO 0401 - Industrial',
    description: 'Caixa para produtos industriais alta resistência',
    fefcoCode: '0401',
    category: 'special',
    dimensions: { length: 600, width: 500, height: 400 },
    materialType: 'Ondulado ECT44 200g/m²',
    weight: 2.1,
    unitCost: 6.80,
    sellingPrice: 11.56,
    margin: 70,
    stock: 420,
    minStock: 100,
    status: 'active',
    totalSold: 980,
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    code: 'CX-0215-004',
    name: 'Caixa FEFCO 0215 - Descontinuada',
    description: 'Modelo antigo descontinuado',
    fefcoCode: '0215',
    category: 'standard',
    dimensions: { length: 350, width: 250, height: 200 },
    materialType: 'Ondulado BC 100g/m²',
    weight: 0.6,
    unitCost: 1.85,
    sellingPrice: 2.96,
    margin: 60,
    stock: 45,
    minStock: 0,
    status: 'discontinued',
    totalSold: 1250,
    createdAt: '2023-12-01'
  }
];

export default function ProdutosPage() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('todos');

  const categories = ['todas', 'standard', 'custom', 'special'];
  const statusTypes = ['todos', 'active', 'inactive', 'discontinued'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.fefcoCode.includes(searchTerm);
    
    const matchesCategory = categoryFilter === 'todas' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'todos' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-yellow-700 bg-yellow-100';
      case 'discontinued': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'discontinued': return 'Descontinuado';
      default: return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'standard': return 'Padrão';
      case 'custom': return 'Personalizada';
      case 'special': return 'Especial';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'standard': return 'text-blue-700 bg-blue-100';
      case 'custom': return 'text-purple-700 bg-purple-100';
      case 'special': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDimensions = (dimensions: { length: number; width: number; height: number }) => {
    return `${dimensions.length}×${dimensions.width}×${dimensions.height}mm`;
  };

  const isLowStock = (stock: number, minStock: number) => {
    return stock <= minStock;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-1">
            Catálogo de produtos e embalagens
          </p>
        </div>
        
        <button className="btn-primary">
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Produto
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <CubeIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.status === 'active').length}
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
                <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter(p => isLowStock(p.stock, p.minStock)).length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-red-100">
                <div className="w-6 h-6 text-red-600">⚠️</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendas Totais</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.reduce((sum, product) => sum + product.totalSold, 0).toLocaleString('pt-BR')}
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
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
                  placeholder="Buscar por nome, código ou FEFCO..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'todas' ? 'Todas Categorias' : getCategoryText(category)}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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

      {/* Products Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Produtos</h3>
          <p className="card-description">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dimensões
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preços
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.code}</div>
                        <div className="text-xs text-gray-400">FEFCO {product.fefcoCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                        {getCategoryText(product.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{formatDimensions(product.dimensions)}</div>
                        <div className="text-xs text-gray-500">{product.materialType}</div>
                        <div className="text-xs text-gray-400">Peso: {product.weight}kg</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(product.sellingPrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Custo: {formatCurrency(product.unitCost)}
                        </div>
                        <div className="text-xs text-blue-600">
                          Margem: {product.margin}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className={`text-sm font-medium ${isLowStock(product.stock, product.minStock) ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock} un
                        </div>
                        <div className="text-xs text-gray-500">
                          Mín: {product.minStock}
                        </div>
                        <div className="text-xs text-purple-600">
                          Vendido: {product.totalSold}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusText(product.status)}
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
                        <button className="p-1 text-gray-400 hover:text-purple-600">
                          <CalculatorIcon className="w-4 h-4" />
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