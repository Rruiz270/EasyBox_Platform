'use client';

import React, { useState } from 'react';
import {
  CogIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  TruckIcon,
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Parameter {
  id: string;
  category: string;
  name: string;
  value: string | number;
  unit: string;
  description: string;
}

const mockParameters: Parameter[] = [
  {
    id: '1',
    category: 'Margens',
    name: 'Margem de Lucro Padrão',
    value: 40,
    unit: '%',
    description: 'Margem de lucro aplicada automaticamente nos orçamentos'
  },
  {
    id: '2',
    category: 'Margens',
    name: 'Margem Mínima',
    value: 15,
    unit: '%',
    description: 'Margem mínima permitida para aprovação'
  },
  {
    id: '3',
    category: 'Custos',
    name: 'Custo por Setup',
    value: 250,
    unit: 'R$',
    description: 'Custo fixo para preparação de máquina'
  },
  {
    id: '4',
    category: 'Custos',
    name: 'Custo Hora/Máquina',
    value: 85,
    unit: 'R$/h',
    description: 'Custo operacional por hora de máquina'
  },
  {
    id: '5',
    category: 'Transporte',
    name: 'Frete Mínimo',
    value: 50,
    unit: 'R$',
    description: 'Valor mínimo de frete cobrado'
  },
  {
    id: '6',
    category: 'Transporte',
    name: 'Km Rodado',
    value: 2.5,
    unit: 'R$/km',
    description: 'Custo por quilômetro para entrega'
  },
  {
    id: '7',
    category: 'Prazos',
    name: 'Prazo Padrão Produção',
    value: 7,
    unit: 'dias',
    description: 'Prazo padrão para produção de pedidos'
  },
  {
    id: '8',
    category: 'Prazos',
    name: 'Validade Orçamento',
    value: 15,
    unit: 'dias',
    description: 'Período de validade dos orçamentos'
  }
];

export default function ParametrosPage() {
  const [parameters, setParameters] = useState<Parameter[]>(mockParameters);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const categories = Array.from(new Set(parameters.map(p => p.category)));

  const startEdit = (parameter: Parameter) => {
    setEditingId(parameter.id);
    setEditValue(parameter.value.toString());
  };

  const saveEdit = (id: string) => {
    setParameters(prev => prev.map(p => 
      p.id === id ? { ...p, value: isNaN(Number(editValue)) ? editValue : Number(editValue) } : p
    ));
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Margens': return <CurrencyDollarIcon className="w-5 h-5" />;
      case 'Custos': return <CalculatorIcon className="w-5 h-5" />;
      case 'Transporte': return <TruckIcon className="w-5 h-5" />;
      case 'Prazos': return <ClockIcon className="w-5 h-5" />;
      default: return <TagIcon className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Margens': return 'text-green-600 bg-green-100';
      case 'Custos': return 'text-blue-600 bg-blue-100';
      case 'Transporte': return 'text-purple-600 bg-purple-100';
      case 'Prazos': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parâmetros de Orçamento</h1>
          <p className="text-gray-600 mt-1">
            Configure margens, custos e prazos para cálculos automáticos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-outline">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Exportar Configuração
          </button>
          <button className="btn-primary">
            <CogIcon className="w-4 h-4 mr-2" />
            Backup Parâmetros
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map(category => {
          const categoryParams = parameters.filter(p => p.category === category);
          return (
            <div key={category} className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{category}</p>
                    <p className="text-2xl font-bold text-gray-900">{categoryParams.length}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                    {getCategoryIcon(category)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Parameters by Category */}
      {categories.map(category => (
        <div key={category} className="card">
          <div className="card-header">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${getCategoryColor(category)}`}>
                {getCategoryIcon(category)}
              </div>
              <div>
                <h3 className="card-title">{category}</h3>
                <p className="card-description">
                  Parâmetros da categoria {category.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
          <div className="card-content p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parâmetro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Atual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parameters
                    .filter(p => p.category === category)
                    .map((parameter) => (
                      <tr key={parameter.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {parameter.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === parameter.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-24 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                              />
                              <span className="text-sm text-gray-500">{parameter.unit}</span>
                            </div>
                          ) : (
                            <div className="text-sm font-semibold text-gray-900">
                              {parameter.value} {parameter.unit}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {parameter.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === parameter.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => saveEdit(parameter.id)}
                                className="text-green-600 hover:text-green-900 text-sm font-medium"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(parameter)}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      {/* Help Section */}
      <div className="card border-l-4 border-blue-500">
        <div className="card-content">
          <h4 className="font-medium text-gray-900 mb-2">💡 Dicas de Configuração</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Margens:</strong> Ajuste conforme a estratégia comercial e competitividade do mercado</p>
            <p>• <strong>Custos:</strong> Revise mensalmente baseado nos custos reais de produção</p>
            <p>• <strong>Transporte:</strong> Considere variações de combustível e distância média de entrega</p>
            <p>• <strong>Prazos:</strong> Equilibre entre capacidade produtiva e expectativas do cliente</p>
          </div>
        </div>
      </div>
    </div>
  );
}