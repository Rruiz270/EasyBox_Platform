'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';

interface Client {
  id: string;
  name: string;
  companyName: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  segment: string;
  status: 'active' | 'inactive';
  totalOrders: number;
  totalValue: number;
  lastOrder: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    companyName: 'ACME Distribuidora Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'joao@acme.com.br',
    phone: '(11) 99999-8888',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    segment: 'E-commerce',
    status: 'active',
    totalOrders: 45,
    totalValue: 125000,
    lastOrder: '2024-10-28'
  },
  {
    id: '2',
    name: 'Maria Santos',
    companyName: 'Distribuidora XYZ S.A.',
    cnpj: '98.765.432/0001-10',
    email: 'maria@xyz.com.br',
    phone: '(11) 88888-7777',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    segment: 'Varejo',
    status: 'active',
    totalOrders: 32,
    totalValue: 89000,
    lastOrder: '2024-10-25'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    companyName: 'Indústria ABC Ltda',
    cnpj: '11.222.333/0001-44',
    email: 'carlos@abc.com.br',
    phone: '(11) 77777-6666',
    address: 'Rua Industrial, 500',
    city: 'Santo André',
    state: 'SP',
    segment: 'Industrial',
    status: 'inactive',
    totalOrders: 18,
    totalValue: 156000,
    lastOrder: '2024-09-15'
  }
];

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('todos');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Toast states
  const [toast, setToast] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Form state
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    companyName: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'SP',
    segment: 'E-commerce',
    status: 'active',
    totalOrders: 0,
    totalValue: 0,
    lastOrder: new Date().toISOString().split('T')[0]
  });

  const segments = ['todos', 'E-commerce', 'Varejo', 'Industrial', 'Atacado'];

  // Handler functions
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    setToast({ isOpen: true, type, title, message });
  };

  const handleCreateClient = () => {
    setFormData({
      name: '',
      companyName: '',
      cnpj: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: 'SP',
      segment: 'E-commerce',
      status: 'active',
      totalOrders: 0,
      totalValue: 0,
      lastOrder: new Date().toISOString().split('T')[0]
    });
    setIsCreateModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setFormData(client);
    setIsEditModalOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    if (confirm(`Tem certeza que deseja excluir o cliente "${client.name}"?`)) {
      setClients(prev => prev.filter(c => c.id !== client.id));
      showToast('success', 'Cliente excluído', `${client.name} foi removido com sucesso.`);
    }
  };

  const handleSubmitCreate = () => {
    if (!formData.name || !formData.companyName || !formData.cnpj) {
      showToast('error', 'Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const newClient: Client = {
      ...formData as Client,
      id: (clients.length + 1).toString()
    };

    setClients(prev => [...prev, newClient]);
    setIsCreateModalOpen(false);
    showToast('success', 'Cliente criado', `${newClient.name} foi criado com sucesso.`);
  };

  const handleSubmitEdit = () => {
    if (!formData.name || !formData.companyName || !formData.cnpj || !selectedClient) {
      showToast('error', 'Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setClients(prev => prev.map(c => 
      c.id === selectedClient.id ? { ...formData as Client, id: selectedClient.id } : c
    ));
    setIsEditModalOpen(false);
    showToast('success', 'Cliente atualizado', `${formData.name} foi atualizado com sucesso.`);
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nome,Empresa,CNPJ,Email,Telefone,Cidade,Estado,Segmento,Status\n"
      + filteredClients.map(client => 
          `${client.name},${client.companyName},${client.cnpj},${client.email},${client.phone},${client.city},${client.state},${client.segment},${client.status}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Dados exportados', 'Lista de clientes exportada com sucesso.');
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.cnpj.includes(searchTerm);
    
    const matchesSegment = selectedSegment === 'todos' || client.segment === selectedSegment;
    
    return matchesSearch && matchesSegment;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100';
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
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
          <p className="text-gray-600 mt-1">
            Cadastro e controle de clientes da empresa
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button onClick={handleExportData} className="btn-outline">
            📊 Exportar Dados
          </button>
          <button onClick={handleCreateClient} className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter(c => c.status === 'active').length}
                </p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((sum, client) => sum + client.totalOrders, 0)}
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
                <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(clients.reduce((sum, client) => sum + client.totalValue, 0))}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-100">
                <div className="w-6 h-6 text-orange-600">💰</div>
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
                  placeholder="Buscar por nome, empresa ou CNPJ..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {segments.map(segment => (
                  <option key={segment} value={segment}>
                    {segment === 'todos' ? 'Todos os Segmentos' : segment}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Clientes</h3>
          <p className="card-description">
            {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado{filteredClients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedidos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faturamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.companyName}</div>
                        <div className="text-xs text-gray-400">{client.cnpj}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <EnvelopeIcon className="w-4 h-4 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="w-4 h-4 mr-2" />
                          {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.city}, {client.state}</div>
                      <div className="text-sm text-gray-500">{client.segment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.totalOrders}</div>
                      <div className="text-xs text-gray-500">Último: {client.lastOrder}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(client.totalValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewClient(client)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Visualizar"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClient(client)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Editar"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClient(client)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Excluir"
                        >
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

      {/* No Results */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}

      {/* Create Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Cliente"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Responsável *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Empresa *
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: ACME Distribuidora Ltda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ *
              </label>
              <input
                type="text"
                value={formData.cnpj || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 12.345.678/0001-90"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: contato@empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: (11) 99999-8888"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segmento
              </label>
              <select
                value={formData.segment || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, segment: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {segments.filter(s => s !== 'todos').map(segment => (
                  <option key={segment} value={segment}>{segment}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: São Paulo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.state || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="PR">Paraná</option>
                <option value="SC">Santa Catarina</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Rua das Flores, 123"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmitCreate}
              className="btn-primary"
            >
              Criar Cliente
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Cliente"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Responsável *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Empresa *
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ *
              </label>
              <input
                type="text"
                value={formData.cnpj || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmitEdit}
              className="btn-primary"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Detalhes do Cliente"
        size="lg"
      >
        {selectedClient && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informações Básicas</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Nome:</span>
                    <p className="font-medium">{selectedClient.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Empresa:</span>
                    <p className="font-medium">{selectedClient.companyName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">CNPJ:</span>
                    <p className="font-medium">{selectedClient.cnpj}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Segmento:</span>
                    <p className="font-medium">{selectedClient.segment}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contato & Localização</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="font-medium">{selectedClient.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Telefone:</span>
                    <p className="font-medium">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Endereço:</span>
                    <p className="font-medium">{selectedClient.address}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Cidade/Estado:</span>
                    <p className="font-medium">{selectedClient.city}, {selectedClient.state}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Histórico Comercial</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedClient.totalOrders}</p>
                  <p className="text-sm text-gray-600">Total de Pedidos</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedClient.totalValue)}</p>
                  <p className="text-sm text-gray-600">Faturamento Total</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{selectedClient.lastOrder}</p>
                  <p className="text-sm text-gray-600">Último Pedido</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
        type={toast.type}
        title={toast.title}
        message={toast.message}
      />
    </div>
  );
}