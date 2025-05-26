import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Current token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        console.error('No authentication token found');
        setLoading(false);
        return;
      }

      const res = await api.get('/categories');
      console.log('Categories API response:', res.data);
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err.response || err);
      setLoading(false);
    }
  };

  // Add category
  const addCategory = async (name, type) => {
    try {
      const res = await api.post('/categories', { name, type });
      setCategories([...categories, res.data]);
      return res.data;
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  // Update category
  const updateCategory = async (id, name, type) => {
    try {
      const res = await api.put(`/categories/${id}`, { name, type });
      setCategories(categories.map(cat => 
        cat._id === id ? res.data : cat
      ));
      return res.data;
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

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