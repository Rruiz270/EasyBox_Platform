'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  TruckIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { useCRUD } from '@/hooks/useCRUD';

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  
  // Material specifications
  corrugatedType: 'B' | 'C' | 'BC' | 'BB' | 'T' | 'TB';
  gramatura: number; // g/m²
  quantity: number; // m² or sheets
  quantityUnit: 'm2' | 'sheets';
  
  // Dimensions (for sheets)
  sheetLength?: number; // mm
  sheetWidth?: number; // mm
  
  // Creasing specifications
  creasings: string; // vincos details
  
  // Delivery
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  
  // Pricing
  unitPrice: number; // R$ per m² or sheet
  totalValue: number; // R$
  
  // Status tracking
  status: 'draft' | 'sent' | 'approved' | 'in_production' | 'delivered' | 'cancelled';
  
  // System fields
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  approvedAt?: string;
  
  // Quality notes
  qualityNotes?: string;
  deliveryNotes?: string;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  specialties: string[];
  qualityRating: number; // 1-5
  deliveryRating: number; // 1-5
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Papelão Sul Ltda',
    email: 'vendas@papelaosul.com.br',
    phone: '(11) 3333-4444',
    address: 'Rua Industrial, 100 - São Paulo/SP',
    specialties: ['BC', 'BB', 'Ondulado duplo'],
    qualityRating: 4.5,
    deliveryRating: 4.2
  },
  {
    id: '2',
    name: 'Ondulados Premium S.A.',
    email: 'compras@onduladospremium.com.br',
    phone: '(11) 2222-3333',
    address: 'Av. das Embalagens, 500 - Guarulhos/SP',
    specialties: ['B', 'C', 'T', 'TB'],
    qualityRating: 4.8,
    deliveryRating: 4.0
  }
];

const mockOrders: PurchaseOrder[] = [
  {
    id: 'OC-001',
    supplierId: '1',
    supplierName: 'Papelão Sul Ltda',
    corrugatedType: 'BC',
    gramatura: 150,
    quantity: 500,
    quantityUnit: 'm2',
    sheetLength: 1000,
    sheetWidth: 700,
    creasings: 'Vinco longitudinal a 350mm',
    expectedDeliveryDate: '2024-11-10',
    unitPrice: 12.50,
    totalValue: 6250,
    status: 'approved',
    createdAt: '2024-11-01',
    updatedAt: '2024-11-02',
    sentAt: '2024-11-01',
    approvedAt: '2024-11-02'
  },
  {
    id: 'OC-002',
    supplierId: '2',
    supplierName: 'Ondulados Premium S.A.',
    corrugatedType: 'B',
    gramatura: 120,
    quantity: 300,
    quantityUnit: 'm2',
    sheetLength: 800,
    sheetWidth: 600,
    creasings: 'Sem vincos',
    expectedDeliveryDate: '2024-11-12',
    unitPrice: 10.80,
    totalValue: 3240,
    status: 'sent',
    createdAt: '2024-11-02',
    updatedAt: '2024-11-02',
    sentAt: '2024-11-02'
  }
];

export default function OrdemCompraPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [suppliers] = useState<Supplier[]>(mockSuppliers);

  const initialFormData: Partial<PurchaseOrder> = {
    corrugatedType: 'BC',
    gramatura: 150,
    quantityUnit: 'm2',
    status: 'draft',
    creasings: 'Sem vincos'
  };

  const crud = useCRUD<PurchaseOrder>(mockOrders, initialFormData);

  const statusOptions = ['todos', 'draft', 'sent', 'approved', 'in_production', 'delivered', 'cancelled'];
  const corrugatedTypes = ['B', 'C', 'BC', 'BB', 'T', 'TB'];

  const filteredOrders = crud.items.filter(order => {
    const matchesSearch = order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-700 bg-gray-100';
      case 'sent': return 'text-blue-700 bg-blue-100';
      case 'approved': return 'text-green-700 bg-green-100';
      case 'in_production': return 'text-yellow-700 bg-yellow-100';
      case 'delivered': return 'text-purple-700 bg-purple-100';
      case 'cancelled': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'sent': return 'Enviada';
      case 'approved': return 'Aprovada';
      case 'in_production': return 'Em Produção';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSendOrder = (order: PurchaseOrder) => {
    crud.setItems(prev => prev.map(o => 
      o.id === order.id 
        ? { ...o, status: 'sent', sentAt: new Date().toISOString().split('T')[0] }
        : o
    ));
    crud.showToast('success', 'Ordem enviada', `OC ${order.id} enviada para ${order.supplierName}`);
  };

  const handleApproveOrder = (order: PurchaseOrder) => {
    crud.setItems(prev => prev.map(o => 
      o.id === order.id 
        ? { ...o, status: 'approved', approvedAt: new Date().toISOString().split('T')[0] }
        : o
    ));
    crud.showToast('success', 'Ordem aprovada', `OC ${order.id} aprovada pelo fornecedor`);
  };

  const generatePDF = (order: PurchaseOrder) => {
    crud.showToast('info', 'PDF em geração', 'O PDF da ordem de compra está sendo gerado...');
    // Here you would integrate with PDF generation library
  };

  const sendEmail = (order: PurchaseOrder) => {
    crud.showToast('info', 'Email enviado', `Ordem enviada para ${order.supplierName}`);
    // Here you would integrate with email service
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ordem de Compra - Matéria Prima</h1>
          <p className="text-gray-600 mt-1">
            Gestão de pedidos de chapas onduladas e materiais
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => crud.exportToCSV(
              filteredOrders, 
              'ordens-compra', 
              (order) => `${order.id},${order.supplierName},${order.corrugatedType},${order.gramatura}g/m²,${order.quantity}${order.quantityUnit},${formatCurrency(order.totalValue)},${getStatusText(order.status)},${order.expectedDeliveryDate}`,
              'ID,Fornecedor,Tipo,Gramatura,Quantidade,Valor Total,Status,Entrega Prevista'
            )}
            className="btn-outline"
          >
            📊 Exportar Dados
          </button>
          <button onClick={crud.handleCreate} className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Ordem
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Ordens</p>
                <p className="text-2xl font-bold text-gray-900">{crud.items.length}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Produção</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crud.items.filter(o => o.status === 'in_production').length}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entregues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crud.items.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(crud.items.filter(o => ['approved', 'in_production', 'delivered'].includes(o.status)).reduce((sum, o) => sum + o.totalValue, 0))}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <div className="w-6 h-6 text-green-600">💰</div>
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
                <input
                  type="text"
                  placeholder="Buscar por fornecedor ou ID da ordem..."
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

      {/* Orders Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Ordens de Compra</h3>
          <p className="card-description">
            {filteredOrders.length} ordem{filteredOrders.length !== 1 ? 'ns' : ''} encontrada{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrega
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">Criada: {order.createdAt}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.supplierName}</div>
                          <div className="text-sm text-gray-500">ID: {order.supplierId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.corrugatedType} {order.gramatura}g/m²
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.sheetLength}×{order.sheetWidth}mm
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.quantity} {order.quantityUnit}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(order.unitPrice)}/{order.quantityUnit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.expectedDeliveryDate}</div>
                      {order.actualDeliveryDate && (
                        <div className="text-sm text-green-600">
                          Real: {order.actualDeliveryDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => crud.handleView(order)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Visualizar"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => crud.handleEdit(order)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => generatePDF(order)}
                          className="p-1 text-gray-400 hover:text-purple-600"
                          title="Gerar PDF"
                        >
                          📄
                        </button>
                        <button 
                          onClick={() => sendEmail(order)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Enviar Email"
                        >
                          📧
                        </button>
                        {order.status === 'draft' && (
                          <button 
                            onClick={() => handleSendOrder(order)}
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Enviar"
                          >
                            ✈️
                          </button>
                        )}
                        {order.status === 'sent' && (
                          <button 
                            onClick={() => handleApproveOrder(order)}
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Marcar como Aprovada"
                          >
                            ✅
                          </button>
                        )}
                        <button 
                          onClick={() => crud.handleDelete(order, (o) => o.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Excluir"
                        >
                          🗑️
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
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma ordem encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou criar uma nova ordem
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={crud.isCreateModalOpen || crud.isEditModalOpen} 
        onClose={() => {
          crud.setIsCreateModalOpen(false);
          crud.setIsEditModalOpen(false);
        }}
        title={crud.isCreateModalOpen ? "Nova Ordem de Compra" : "Editar Ordem"}
        size="xl"
      >
        <div className="space-y-6">
          {/* Supplier Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🏢 Fornecedor</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fornecedor *
                </label>
                <select
                  value={crud.formData.supplierId || ''}
                  onChange={(e) => {
                    const supplier = suppliers.find(s => s.id === e.target.value);
                    crud.setFormData(prev => ({ 
                      ...prev, 
                      supplierId: e.target.value,
                      supplierName: supplier?.name || ''
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um fornecedor</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.specialties.join(', ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Material Specifications */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📦 Especificações do Material</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Onda *
                </label>
                <select
                  value={crud.formData.corrugatedType || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, corrugatedType: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {corrugatedTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gramatura (g/m²) *
                </label>
                <input
                  type="number"
                  value={crud.formData.gramatura || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, gramatura: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade
                </label>
                <select
                  value={crud.formData.quantityUnit || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, quantityUnit: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="m2">m²</option>
                  <option value="sheets">Chapas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dimensions and Quantity */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📏 Dimensões e Quantidade</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comprimento (mm)
                </label>
                <input
                  type="number"
                  value={crud.formData.sheetLength || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, sheetLength: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Largura (mm)
                </label>
                <input
                  type="number"
                  value={crud.formData.sheetWidth || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, sheetWidth: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade *
                </label>
                <input
                  type="number"
                  value={crud.formData.quantity || ''}
                  onChange={(e) => {
                    const quantity = parseInt(e.target.value);
                    const unitPrice = crud.formData.unitPrice || 0;
                    crud.setFormData(prev => ({ 
                      ...prev, 
                      quantity,
                      totalValue: quantity * unitPrice
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Unitário *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={crud.formData.unitPrice || ''}
                  onChange={(e) => {
                    const unitPrice = parseFloat(e.target.value);
                    const quantity = crud.formData.quantity || 0;
                    crud.setFormData(prev => ({ 
                      ...prev, 
                      unitPrice,
                      totalValue: quantity * unitPrice
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Creasing and Delivery */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🎯 Vincos e Entrega</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especificação de Vincos
                </label>
                <textarea
                  value={crud.formData.creasings || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, creasings: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Ex: Vinco longitudinal a 350mm da borda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Prevista de Entrega *
                </label>
                <input
                  type="date"
                  value={crud.formData.expectedDeliveryDate || ''}
                  onChange={(e) => crud.setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Total Value Display */}
          <div className="card bg-green-50">
            <div className="card-content">
              <div className="text-center">
                <p className="text-sm text-gray-600">Valor Total da Ordem</p>
                <p className="text-3xl font-bold text-green-900">
                  {formatCurrency(crud.formData.totalValue || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              onClick={() => {
                crud.setIsCreateModalOpen(false);
                crud.setIsEditModalOpen(false);
              }}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                const validate = () => {
                  if (!crud.formData.supplierId || !crud.formData.corrugatedType || 
                      !crud.formData.gramatura || !crud.formData.quantity || 
                      !crud.formData.unitPrice || !crud.formData.expectedDeliveryDate) {
                    crud.showToast('error', 'Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
                    return false;
                  }
                  return true;
                };
                
                if (crud.isCreateModalOpen) {
                  crud.handleSubmitCreate(() => `OC-${String(crud.items.length + 1).padStart(3, '0')}`, validate);
                } else {
                  crud.handleSubmitEdit(validate);
                }
              }}
              className="btn-primary"
            >
              {crud.isCreateModalOpen ? 'Criar Ordem' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal 
        isOpen={crud.isViewModalOpen} 
        onClose={() => crud.setIsViewModalOpen(false)}
        title="Detalhes da Ordem de Compra"
        size="xl"
      >
        {crud.selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Fornecedor</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Nome:</span>
                    <p className="font-medium">{crud.selectedItem.supplierName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ID:</span>
                    <p className="font-medium">{crud.selectedItem.supplierId}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Material</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Tipo:</span>
                    <p className="font-medium">{crud.selectedItem.corrugatedType} {crud.selectedItem.gramatura}g/m²</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Quantidade:</span>
                    <p className="font-medium">{crud.selectedItem.quantity} {crud.selectedItem.quantityUnit}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Dimensões:</span>
                    <p className="font-medium">{crud.selectedItem.sheetLength}×{crud.selectedItem.sheetWidth}mm</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Valores e Prazos</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(crud.selectedItem.unitPrice)}</p>
                  <p className="text-sm text-gray-600">Preço Unitário</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(crud.selectedItem.totalValue)}</p>
                  <p className="text-sm text-gray-600">Valor Total</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{crud.selectedItem.expectedDeliveryDate}</p>
                  <p className="text-sm text-gray-600">Entrega Prevista</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast */}
      <Toast
        isOpen={crud.toast.isOpen}
        onClose={() => crud.setToast(prev => ({ ...prev, isOpen: false }))}
        type={crud.toast.type}
        title={crud.toast.title}
        message={crud.toast.message}
      />
    </div>
  );
}