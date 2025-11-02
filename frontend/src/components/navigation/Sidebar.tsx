'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CogIcon,
  UserGroupIcon,
  DocumentIcon,
  WrenchScrewdriverIcon,
  PlayIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  TruckIcon,
  TagIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  CubeIcon,
  PhoneIcon as ContactIcon,
  DocumentTextIcon,
  CalculatorIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  RectangleStackIcon,
  CogIcon as CogWheelIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: MenuItem[];
}

const navigationItems: MenuItem[] = [
  {
    id: 'inicio',
    title: 'Início',
    icon: HomeIcon,
    href: '/dashboard'
  },
  {
    id: 'fefco',
    title: 'Catálogo FEFCO',
    icon: CubeIcon,
    href: '/fefco'
  },
  {
    id: 'mckee',
    title: 'Calculadora McKee',
    icon: CalculatorIcon,
    href: '/mckee'
  },
  {
    id: 'setup',
    title: 'SETUP',
    icon: CogIcon,
    children: [
      {
        id: 'cadastro',
        title: 'Cadastro',
        icon: Squares2X2Icon,
        children: [
          { id: 'cliente', title: 'Cliente', icon: UserGroupIcon, href: '/setup/cadastro/clientes' },
          { id: 'usuario', title: 'Usuário', icon: UserIcon, href: '/setup/cadastro/usuarios' },
          { id: 'canal-vendas', title: 'Canal de vendas', icon: PhoneIcon, href: '/setup/cadastro/canais-vendas' },
          { id: 'centro-custo', title: 'Centro de custo', icon: CurrencyDollarIcon, href: '/setup/cadastro/centros-custo' },
          { id: 'transportadora', title: 'Transportadora', icon: TruckIcon, href: '/setup/cadastro/transportadoras' },
          { id: 'segmento', title: 'Segmento', icon: TagIcon, href: '/setup/cadastro/segmentos' },
          { id: 'forma-pagamento', title: 'Forma de pagamento', icon: CreditCardIcon, href: '/setup/cadastro/formas-pagamento' },
          { id: 'fabricante', title: 'Fabricante', icon: BuildingOfficeIcon, href: '/setup/cadastro/fabricantes' },
          { id: 'produto', title: 'Produto', icon: CubeIcon, href: '/setup/cadastro/produtos' },
          { id: 'tipo-contato', title: 'Tipo contato', icon: ContactIcon, href: '/setup/cadastro/tipos-contato' }
        ]
      }
    ]
  },
  {
    id: 'orcamentos',
    title: 'Orçamentos',
    icon: DocumentTextIcon,
    children: [
      { id: 'orcamentos-lista', title: 'Lista', icon: ListBulletIcon, href: '/orcamentos/lista' },
      { id: 'orcamentos-parametros', title: 'Parâmetros', icon: CogIcon, href: '/orcamentos/parametros' },
      { id: 'orcamentos-status', title: 'Status', icon: ChartBarIcon, href: '/orcamentos/status' },
      { id: 'orcamentos-calculadora', title: 'Calculadora', icon: CalculatorIcon, href: '/orcamentos/calculadora' }
    ]
  },
  {
    id: 'desenvolvimento',
    title: 'Desenvolvimento',
    icon: WrenchScrewdriverIcon,
    children: [
      { id: 'desenvolvimento-lista', title: 'Lista', icon: ListBulletIcon, href: '/desenvolvimento/lista' },
      { id: 'compensacoes', title: 'Compensações', icon: BeakerIcon, href: '/desenvolvimento/compensacoes' },
      { id: 'cliche', title: 'Clichê', icon: RectangleStackIcon, href: '/desenvolvimento/cliche' },
      { id: 'faca', title: 'Faca', icon: CogWheelIcon, href: '/desenvolvimento/faca' },
      { id: 'processo-producao', title: 'Processo produção', icon: ClipboardDocumentListIcon, href: '/desenvolvimento/processo-producao' }
    ]
  },
  {
    id: 'producao',
    title: 'Produção',
    icon: PlayIcon,
    children: [
      { id: 'producao-lista', title: 'Lista', icon: ListBulletIcon, href: '/producao/lista' }
    ]
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    icon: ShieldCheckIcon,
    href: '/seguranca'
  }
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['setup', 'orcamentos', 'desenvolvimento']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => isItemActive(child));
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isItemActive(item);
    const hasChildren = item.children && item.children.length > 0;

    const paddingLeft = `${1 + level * 1.5}rem`;

    if (level === 0 && item.title === 'SETUP') {
      return (
        <div key={item.id} className="mt-6">
          <div className="px-3 mb-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {item.title}
            </h3>
          </div>
          {item.children?.map(child => renderMenuItem(child, level + 1))}
        </div>
      );
    }

    return (
      <div key={item.id} className="relative">
        {item.href ? (
          <Link
            href={item.href}
            className={`
              w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${isActive 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
            style={{ paddingLeft }}
          >
            <div className="flex items-center">
              <item.icon 
                className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} 
              />
              {!isCollapsed && (
                <span className="truncate">{item.title}</span>
              )}
            </div>
          </Link>
        ) : (
          <button
            onClick={() => {
              if (hasChildren) {
                toggleExpanded(item.id);
              }
            }}
            className={`
              w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${isActive 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
            style={{ paddingLeft }}
          >
            <div className="flex items-center">
              <item.icon 
                className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} 
              />
              {!isCollapsed && (
                <span className="truncate">{item.title}</span>
              )}
            </div>
            
            {!isCollapsed && hasChildren && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              </motion.div>
            )}
          </button>
        )}

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="py-1">
                {item.children?.map(child => renderMenuItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={`
      flex flex-col bg-white border-r border-gray-200 transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">BoxSystem</h1>
              <p className="text-xs text-gray-500">Papelão Ondulado</p>
            </div>
          </div>
        )}
        
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-xs text-gray-500">
            <p>Sistema v1.0.0</p>
            <p>© 2024 Sua Empresa</p>
          </div>
        )}
      </div>
    </div>
  );
}