import React from 'react';
import Link from 'next/link';
import { CubeIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const features = [
    {
      title: 'Catálogo FEFCO Completo',
      description: '200+ códigos FEFCO com validação automática e cálculo de dimensões',
      icon: '📦'
    },
    {
      title: 'Fórmula McKee Integrada',
      description: 'Cálculo automático de resistência com fatores ambientais e de segurança',
      icon: '🧮'
    },
    {
      title: 'Visualização 3D',
      description: 'Preview em tempo real com animações de dobra passo-a-passo',
      icon: '🎯'
    },
    {
      title: 'Gestão Completa',
      description: 'Do orçamento à produção com controle total do processo',
      icon: '🏭'
    },
    {
      title: 'Multi-tenant',
      description: 'Sistema preparado para múltiplas empresas com isolamento total',
      icon: '🏢'
    },
    {
      title: 'WhatsApp Integration',
      description: 'Envio automático de cotações via WhatsApp Business API',
      icon: '📱'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <CubeIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EasyBox Platform</h1>
                <p className="text-sm text-gray-600">Sistema de Papelão Ondulado Brasil</p>
              </div>
            </div>
            
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Acessar Sistema
              <ArrowRightIcon className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Revolucione sua Indústria de 
              <span className="text-blue-600"> Papelão Ondulado</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Sistema completo com FEFCO, McKee, visualização 3D, gestão de produção e muito mais.
              Desenvolvido especificamente para a indústria brasileira de embalagens.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
              >
                Começar Agora
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors text-lg">
                Ver Demonstração
              </button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-100 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Recursos Avançados
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tecnologia de ponta para automatizar e otimizar todos os aspectos da sua produção
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Módulos Completos
            </h3>
            <p className="text-lg text-gray-600">
              Gestão integrada de todo o processo produtivo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Setup & Cadastro', items: ['Clientes', 'Usuários', 'Produtos', 'Fornecedores'] },
              { name: 'Orçamentos', items: ['Calculadora', 'Parâmetros', 'Status', 'Aprovações'] },
              { name: 'Desenvolvimento', items: ['Projetos', 'Clichês', 'Facas', 'Processos'] },
              { name: 'Produção', items: ['Ordens', 'Qualidade', 'Materiais', 'Métricas'] }
            ].map((module, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {module.name}
                </h4>
                <ul className="space-y-2">
                  {module.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">
              Pronto para Revolucionar sua Produção?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Junte-se às empresas que já estão transformando sua indústria com nossa plataforma
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-lg"
            >
              Começar Gratuitamente
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CubeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">EasyBox Platform</div>
                <div className="text-gray-400 text-sm">Sistema de Papelão Ondulado Brasil</div>
              </div>
            </div>
            
            <div className="text-gray-400 text-sm">
              © 2024 EasyBox Platform. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}