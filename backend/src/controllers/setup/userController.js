import express from 'express';

export const createUser = async (req, res) => {
  try {
    res.json({ message: 'Create user - coming soon' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    res.json({ message: 'Get users - coming soon' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    res.json({ message: `Get user ${req.params.id} - coming soon` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    res.json({ message: `Update user ${req.params.id} - coming soon` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    res.json({ message: `Delete user ${req.params.id} - coming soon` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};