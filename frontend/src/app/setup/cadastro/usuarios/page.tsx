'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { useCRUD } from '@/hooks/useCRUD';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    phone: '(11) 99999-1111',
    role: 'admin',
    department: 'TI',
    status: 'active',
    lastLogin: '2024-11-02',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    phone: '(11) 99999-2222',
    role: 'manager',
    department: 'Vendas',
    status: 'active',
    lastLogin: '2024-11-01',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@empresa.com',
    phone: '(11) 99999-3333',
    role: 'operator',
    department: 'Produção',
    status: 'inactive',
    lastLogin: '2024-10-25',
    createdAt: '2024-03-10'
  }
];

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');

  const roles = ['todos', 'admin', 'manager', 'operator', 'viewer'];
  
  const initialFormData: Partial<User> = {
    name: '',
    email: '',
    phone: '',
    role: 'viewer',
    department: '',
    status: 'active',
    lastLogin: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  const crud = useCRUD<User>(mockUsers, initialFormData);

  const filteredUsers = crud.items.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'todos' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-700 bg-purple-100';
      case 'manager': return 'text-blue-700 bg-blue-100';
      case 'operator': return 'text-green-700 bg-green-100';
      case 'viewer': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'operator': return 'Operador';
      case 'viewer': return 'Visualizador';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-600 mt-1">
            Cadastro e controle de usuários do sistema
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => crud.exportToCSV(
              filteredUsers, 
              'usuarios', 
              (user) => `${user.name},${user.email},${user.phone},${getRoleText(user.role)},${user.department},${user.status === 'active' ? 'Ativo' : 'Inativo'},${user.lastLogin}`,
              'Nome,Email,Telefone,Perfil,Departamento,Status,Último Acesso'
            )}
            className="btn-outline"
          >
            📊 Exportar Dados
          </button>
          <button onClick={crud.handleCreate} className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{crud.items.length}</p>
              </div>
              <UserIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crud.items.filter(u => u.status === 'active').length}
                </p>
              </div>
              <ShieldCheckIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crud.items.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <div className="w-6 h-6 text-purple-600">👑</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departamentos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.from(new Set(crud.items.map(u => u.department))).length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-100">
                <div className="w-6 h-6 text-orange-600">🏢</div>
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
                  placeholder="Buscar por nome, email ou departamento..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role === 'todos' ? 'Todos os Perfis' : getRoleText(role)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Usuários</h3>
          <p className="card-description">
            {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acesso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <EnvelopeIcon className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="w-4 h-4 mr-2" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.lastLogin}</div>
                      <div className="text-xs text-gray-500">Criado: {user.createdAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => crud.handleView(user)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Visualizar"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => crud.handleEdit(user)}
                          className="p-1 text-gray-400 hover:text-green-600"
                          title="Editar"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => crud.handleDelete(user, (u) => u.name)}
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
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}

      {/* Create Modal */}
      <Modal 
        isOpen={crud.isCreateModalOpen} 
        onClose={() => crud.setIsCreateModalOpen(false)}
        title="Novo Usuário"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                value={crud.formData.name || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={crud.formData.email || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: joao@empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={crud.formData.phone || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: (11) 99999-1111"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perfil de Acesso *
              </label>
              <select
                value={crud.formData.role || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {roles.filter(r => r !== 'todos').map(role => (
                  <option key={role} value={role}>{getRoleText(role)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <input
                type="text"
                value={crud.formData.department || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: TI, Vendas, Produção"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={crud.formData.status || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, status: e.target.value as User['status'] }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              onClick={() => crud.setIsCreateModalOpen(false)}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                const validate = () => {
                  if (!crud.formData.name || !crud.formData.email || !crud.formData.role || !crud.formData.department) {
                    crud.showToast('error', 'Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
                    return false;
                  }
                  return true;
                };
                crud.handleSubmitCreate(() => (crud.items.length + 1).toString(), validate);
              }}
              className="btn-primary"
            >
              Criar Usuário
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={crud.isEditModalOpen} 
        onClose={() => crud.setIsEditModalOpen(false)}
        title="Editar Usuário"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                value={crud.formData.name || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={crud.formData.email || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={crud.formData.phone || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perfil de Acesso *
              </label>
              <select
                value={crud.formData.role || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {roles.filter(r => r !== 'todos').map(role => (
                  <option key={role} value={role}>{getRoleText(role)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <input
                type="text"
                value={crud.formData.department || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={crud.formData.status || ''}
                onChange={(e) => crud.setFormData(prev => ({ ...prev, status: e.target.value as User['status'] }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              onClick={() => crud.setIsEditModalOpen(false)}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                const validate = () => {
                  if (!crud.formData.name || !crud.formData.email || !crud.formData.role || !crud.formData.department) {
                    crud.showToast('error', 'Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
                    return false;
                  }
                  return true;
                };
                crud.handleSubmitEdit(validate);
              }}
              className="btn-primary"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal 
        isOpen={crud.isViewModalOpen} 
        onClose={() => crud.setIsViewModalOpen(false)}
        title="Detalhes do Usuário"
        size="lg"
      >
        {crud.selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informações Pessoais</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Nome:</span>
                    <p className="font-medium">{crud.selectedItem.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="font-medium">{crud.selectedItem.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Telefone:</span>
                    <p className="font-medium">{crud.selectedItem.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Departamento:</span>
                    <p className="font-medium">{crud.selectedItem.department}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informações do Sistema</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Perfil:</span>
                    <p className="font-medium">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(crud.selectedItem.role)}`}>
                        {getRoleText(crud.selectedItem.role)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <p className="font-medium">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(crud.selectedItem.status)}`}>
                        {crud.selectedItem.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Último Acesso:</span>
                    <p className="font-medium">{crud.selectedItem.lastLogin}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Data de Criação:</span>
                    <p className="font-medium">{crud.selectedItem.createdAt}</p>
                  </div>
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