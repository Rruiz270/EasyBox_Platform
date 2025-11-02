'use client';

import React, { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  CubeIcon,
  InformationCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface FEFCOCode {
  code: string;
  name: string;
  description: string;
  category: string;
  type: 'regular' | 'die_cut' | 'folder_gluer';
  complexity: 'simples' | 'medio' | 'complexo';
  applications: string[];
  minDimensions: {
    length: number;
    width: number;
    height: number;
  };
  materialEfficiency: number;
  image?: string;
}

const fefcoCodes: FEFCOCode[] = [
  {
    code: '0201',
    name: 'Caixa Regular com Tampa Sobreposta',
    description: 'Caixa de papelão ondulado com tampa que se sobrepõe às laterais. Ideal para produtos médios e pesados.',
    category: 'Caixas Regulares',
    type: 'regular',
    complexity: 'simples',
    applications: ['E-commerce', 'Eletrônicos', 'Livros', 'Produtos Gerais'],
    minDimensions: { length: 100, width: 80, height: 50 },
    materialEfficiency: 85
  },
  {
    code: '0301',
    name: 'Caixa com Tampa Totalmente Sobreposta',
    description: 'Caixa com tampa que cobre completamente a base. Oferece melhor proteção e acabamento.',
    category: 'Caixas Regulares',
    type: 'regular',
    complexity: 'simples',
    applications: ['Presentes', 'Produtos Premium', 'Cosméticos', 'Eletrônicos'],
    minDimensions: { length: 120, width: 100, height: 60 },
    materialEfficiency: 82
  },
  {
    code: '0401',
    name: 'Caixa com Tampa e Base Separadas',
    description: 'Caixa composta por duas peças independentes. Ideal para produtos que requerem apresentação especial.',
    category: 'Caixas Regulares',
    type: 'regular',
    complexity: 'medio',
    applications: ['Produtos Luxo', 'Presentes Especiais', 'Joias', 'Produtos Frágeis'],
    minDimensions: { length: 150, width: 120, height: 80 },
    materialEfficiency: 78
  },
  {
    code: '0711',
    name: 'Caixa Automontável com Travamento',
    description: 'Caixa que se monta automaticamente com sistema de travamento interno. Ideal para automação.',
    category: 'Caixas Automontáveis',
    type: 'folder_gluer',
    complexity: 'complexo',
    applications: ['Linha de Produção', 'Fast Food', 'Delivery', 'Produtos Rápidos'],
    minDimensions: { length: 80, width: 60, height: 40 },
    materialEfficiency: 90
  },
  {
    code: '0427',
    name: 'Caixa Display com Frente Aberta',
    description: 'Caixa especial para exposição de produtos com frente totalmente aberta para visualização.',
    category: 'Displays',
    type: 'die_cut',
    complexity: 'complexo',
    applications: ['Varejo', 'Supermercados', 'Exposição', 'Produtos de Impulso'],
    minDimensions: { length: 200, width: 150, height: 100 },
    materialEfficiency: 75
  },
  {
    code: '0215',
    name: 'Caixa Wraparound',
    description: 'Caixa que envolve o produto em formato cilíndrico. Ideal para garrafas e produtos longos.',
    category: 'Caixas Especiais',
    type: 'folder_gluer',
    complexity: 'medio',
    applications: ['Bebidas', 'Tubos', 'Produtos Cilíndricos', 'Vinhos'],
    minDimensions: { length: 250, width: 100, height: 100 },
    materialEfficiency: 88
  },
  {
    code: '0751',
    name: 'Bandeja com Divisórias',
    description: 'Bandeja estrutural com compartimentos para organização de produtos múltiplos.',
    category: 'Bandejas',
    type: 'die_cut',
    complexity: 'complexo',
    applications: ['Ovos', 'Frutas', 'Produtos Múltiplos', 'Organização'],
    minDimensions: { length: 300, width: 200, height: 50 },
    materialEfficiency: 70
  },
  {
    code: '0203',
    name: 'Caixa Telescópica',
    description: 'Sistema de caixas que se encaixam telescopicamente. Ideal para produtos de diferentes tamanhos.',
    category: 'Caixas Regulares',
    type: 'regular',
    complexity: 'medio',
    applications: ['Produtos Variáveis', 'Kits', 'Conjuntos', 'Produtos Modulares'],
    minDimensions: { length: 180, width: 140, height: 100 },
    materialEfficiency: 80
  }
];

const categories = ['Todas', ...Array.from(new Set(fefcoCodes.map(code => code.category)))];
const complexities = ['Todas', 'simples', 'medio', 'complexo'];
const types = ['Todos', 'regular', 'die_cut', 'folder_gluer'];

export default function FEFCOCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedComplexity, setSelectedComplexity] = useState('Todas');
  const [selectedType, setSelectedType] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCodes = useMemo(() => {
    return fefcoCodes.filter(code => {
      const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           code.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Todas' || code.category === selectedCategory;
      const matchesComplexity = selectedComplexity === 'Todas' || code.complexity === selectedComplexity;
      const matchesType = selectedType === 'Todos' || code.type === selectedType;

      return matchesSearch && matchesCategory && matchesComplexity && matchesType;
    });
  }, [searchTerm, selectedCategory, selectedComplexity, selectedType]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simples': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'complexo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'regular': return '📦';
      case 'die_cut': return '✂️';
      case 'folder_gluer': return '🔧';
      default: return '📦';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo FEFCO</h1>
          <p className="text-gray-600 mt-1">
            Códigos internacionais para embalagens de papelão ondulado
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Exportar Catálogo
          </button>
          <button className="btn-primary">
            <CubeIcon className="w-4 h-4 mr-2" />
            Calcular Dimensões
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Códigos</p>
                <p className="text-2xl font-bold text-gray-900">{fefcoCodes.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <CubeIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categorias</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <FunnelIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resultados</p>
                <p className="text-2xl font-bold text-gray-900">{filteredCodes.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100">
                <MagnifyingGlassIcon className="w-6 h-6 text-purple-600" />
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
                  {Math.round(fefcoCodes.reduce((acc, code) => acc + code.materialEfficiency, 0) / fefcoCodes.length)}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-100">
                <InformationCircleIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por código, nome ou descrição..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-outline ${showFilters ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complexidade</label>
                  <select
                    value={selectedComplexity}
                    onChange={(e) => setSelectedComplexity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {complexities.map(complexity => (
                      <option key={complexity} value={complexity}>
                        {complexity === 'Todas' ? 'Todas' : 
                         complexity === 'simples' ? 'Simples' :
                         complexity === 'medio' ? 'Médio' : 'Complexo'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Produção</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>
                        {type === 'Todos' ? 'Todos' :
                         type === 'regular' ? 'Regular' :
                         type === 'die_cut' ? 'Faca Especial' : 'Pasta Cola'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FEFCO Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCodes.map((code) => (
          <div key={code.code} className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="card-content">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getTypeIcon(code.type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">FEFCO {code.code}</h3>
                    <p className="text-sm text-gray-600">{code.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplexityColor(code.complexity)}`}>
                    {code.complexity === 'simples' ? 'Simples' :
                     code.complexity === 'medio' ? 'Médio' : 'Complexo'}
                  </span>
                </div>
              </div>

              {/* Name and Description */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{code.name}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{code.description}</p>
              </div>

              {/* Specifications */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Eficiência Material:</span>
                  <span className="font-medium text-gray-900">{code.materialEfficiency}%</span>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Dimensões Mínimas:</span>
                  <div className="mt-1 text-gray-900 font-mono text-xs">
                    {code.minDimensions.length} × {code.minDimensions.width} × {code.minDimensions.height} mm
                  </div>
                </div>
              </div>

              {/* Applications */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Aplicações:</div>
                <div className="flex flex-wrap gap-1">
                  {code.applications.slice(0, 3).map((app, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {app}
                    </span>
                  ))}
                  {code.applications.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      +{code.applications.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button className="flex-1 btn-outline text-sm py-2">
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Ver Detalhes
                </button>
                <button className="flex-1 btn-primary text-sm py-2">
                  <CubeIcon className="w-4 h-4 mr-1" />
                  Calcular
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCodes.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum código encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
}