import React, { createContext, useState, useContext } from 'react';

const mockCategories = [
  { _id: '1', name: 'Food', type: 'expense' },
  { _id: '2', name: 'Transport', type: 'expense' },
  { _id: '3', name: 'Salary', type: 'income' },
  { _id: '4', name: 'Freelance', type: 'income' }
];

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(mockCategories);
  const [loading, setLoading] = useState(false);

  // Add category
  const addCategory = async (name, type) => {
    const newCategory = { _id: Date.now().toString(), name, type };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  // Update category
  const updateCategory = async (id, name, type) => {
    setCategories(categories.map(cat =>
      cat._id === id ? { ...cat, name, type } : cat
    ));
    return { _id: id, name, type };
  };

  // Delete category
  const deleteCategory = async (id) => {
    setCategories(categories.filter(cat => cat._id !== id));
  };

  // Mock fetchCategories
  const fetchCategories = async () => {
    setLoading(false);
  };

  return (
    <CategoryContext.Provider value={{
      categories,
      loading,
      addCategory,
      updateCategory,
      deleteCategory,
      fetchCategories
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext); 