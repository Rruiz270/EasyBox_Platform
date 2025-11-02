import { useState } from 'react';

export interface CRUDHook<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  selectedItem: T | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<T | null>>;
  formData: Partial<T>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<T>>>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isViewModalOpen: boolean;
  setIsViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toast: {
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  };
  setToast: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  }>>;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
  handleCreate: () => void;
  handleEdit: (item: T) => void;
  handleView: (item: T) => void;
  handleDelete: (item: T, getItemName: (item: T) => string) => void;
  handleSubmitCreate: (getNewId: () => string, validate?: () => boolean) => void;
  handleSubmitEdit: (validate?: () => boolean) => void;
  exportToCSV: (filteredItems: T[], filename: string, getCSVRow: (item: T) => string, headers: string) => void;
}

export function useCRUD<T extends { id: string }>(
  initialItems: T[],
  initialFormData: Partial<T>
): CRUDHook<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Partial<T>>(initialFormData);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Toast state
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

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    setToast({ isOpen: true, type, title, message });
  };

  const handleCreate = () => {
    setFormData(initialFormData);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (item: T) => {
    setSelectedItem(item);
    setFormData(item);
    setIsEditModalOpen(true);
  };

  const handleView = (item: T) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleDelete = (item: T, getItemName: (item: T) => string) => {
    if (confirm(`Tem certeza que deseja excluir "${getItemName(item)}"?`)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast('success', 'Item excluído', `${getItemName(item)} foi removido com sucesso.`);
    }
  };

  const handleSubmitCreate = (getNewId: () => string, validate?: () => boolean) => {
    if (validate && !validate()) {
      return;
    }

    const newItem: T = {
      ...formData as T,
      id: getNewId()
    };

    setItems(prev => [...prev, newItem]);
    setIsCreateModalOpen(false);
    showToast('success', 'Item criado', 'Item criado com sucesso.');
  };

  const handleSubmitEdit = (validate?: () => boolean) => {
    if (validate && !validate()) {
      return;
    }

    if (!selectedItem) return;

    setItems(prev => prev.map(i => 
      i.id === selectedItem.id ? { ...formData as T, id: selectedItem.id } : i
    ));
    setIsEditModalOpen(false);
    showToast('success', 'Item atualizado', 'Item atualizado com sucesso.');
  };

  const exportToCSV = (filteredItems: T[], filename: string, getCSVRow: (item: T) => string, headers: string) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers + "\n"
      + filteredItems.map(getCSVRow).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Dados exportados', `${filename} exportado com sucesso.`);
  };

  return {
    items,
    setItems,
    selectedItem,
    setSelectedItem,
    formData,
    setFormData,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    toast,
    setToast,
    showToast,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleSubmitCreate,
    handleSubmitEdit,
    exportToCSV
  };
}