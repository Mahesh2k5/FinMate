import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories', config);
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setLoading(false);
    }
  };

  // Add category
  const addCategory = async (name, type) => {
    try {
      const res = await axios.post('/api/categories', { name, type }, config);
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
      const res = await axios.put(`/api/categories/${id}`, { name, type }, config);
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
      await axios.delete(`/api/categories/${id}`, config);
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