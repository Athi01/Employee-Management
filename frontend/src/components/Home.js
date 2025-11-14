import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';

const API_URL = 'http://localhost:8000/api';

function Home({ user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/employees.php?user_id=${user.id}`);
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/employees.php?id=${employeeId}&user_id=${user.id}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        fetchEmployees();
        alert('Employee deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Failed to delete employee');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const method = editingEmployee ? 'PUT' : 'POST';
      const data = editingEmployee
        ? { ...formData, id: editingEmployee.id, user_id: user.id }
        : { ...formData, user_id: user.id };

      const response = await fetch(`${API_URL}/employees.php`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setShowModal(false);
        fetchEmployees();
        alert(editingEmployee ? 'Employee updated successfully!' : 'Employee created successfully!');
      }
    } catch (err) {
      console.error('Error saving employee:', err);
      alert('Failed to save employee');
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="container">
        <div className="home">
          <div className="home-header">
            <h1>Employee Directory</h1>
            <button className="btn-add" onClick={handleAddEmployee}>
              + Add Employee
            </button>
          </div>

          <EmployeeList
            employees={employees}
            loading={loading}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
        </div>
      </div>

      {showModal && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleFormSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default Home;