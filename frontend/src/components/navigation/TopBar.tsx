'use client';

import React, { useState } from 'react';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface TopBarProps {
  onSidebarToggle: () => void;
  sidebarCollapsed: boolean;
}

export default function TopBar({ onSidebarToggle, sidebarCollapsed }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user data - in real app this would come from auth context
  const currentUser = {
    name: 'João Silva',
    email: 'joao@empresa.com.br',
    role: 'Administrador',
    company: 'Empresa Demo',
    avatar: null
  };

  const notifications = [
    {
      id: 1,
      title: 'Nova cotação recebida',
      message: 'Cliente ACME Corp solicitou cotação #2024-001',
      time: '2 min atrás',
      unread: true
    },
    {
      id: 2,
      title: 'Produção concluída',
      message: 'Ordem #OP-2024-045 foi finalizada com sucesso',
      time: '15 min atrás',
      unread: true
    },
    {
      id: 3,
      title: 'Manutenção programada',
      message: 'Máquina FFG-01 precisa de manutenção preventiva',
      time: '1 hora atrás',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar clientes, cotações, produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <BellIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-50 mt-2 w-80 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                      {({ active }) => (
                        <div className={`p-4 border-b border-gray-100 ${active ? 'bg-gray-50' : ''} ${notification.unread ? 'bg-blue-50' : ''}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
                <div className="p-4 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Ver todas as notificações
                  </button>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-gray-600" />
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-600">{currentUser.role}</p>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-50 mt-2 w-64 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-12 h-12 text-gray-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-600">{currentUser.email}</p>
                      <p className="text-xs text-gray-500">{currentUser.company}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}>
                        <UserCircleIcon className="w-4 h-4 mr-3 text-gray-400" />
                        Meu Perfil
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}>
                        <Cog6ToothIcon className="w-4 h-4 mr-3 text-gray-400" />
                        Configurações
                      </button>
                    )}
                  </Menu.Item>
                </div>

                <div className="py-2 border-t border-gray-200">
                  <Menu.Item>
                    {({ active }) => (
                      <button className={`flex items-center w-full px-4 py-2 text-sm text-red-700 ${active ? 'bg-red-50' : ''}`}>
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-red-500" />
                        Sair
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}