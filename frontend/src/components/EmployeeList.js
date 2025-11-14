import React from 'react';

function EmployeeList({ employees, loading, onEdit, onDelete }) {
  if (loading) {
    return <div className="no-employees">Loading employees...</div>;
  }

  if (employees.length === 0) {
    return (
      <div className="no-employees">
        <p>No employees found. Click "Add Employee" to get started!</p>
      </div>
    );
  }

  return (
    <table className="employee-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Position</th>
          <th>Department</th>
          <th>Salary</th>
          <th>Join Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.name}</td>
            <td>{employee.email}</td>
            <td>{employee.phone}</td>
            <td>{employee.position}</td>
            <td>{employee.department}</td>
            <td>₹{parseFloat(employee.salary).toLocaleString()}</td>
            <td>{new Date(employee.join_date).toLocaleDateString()}</td>
            <td>
              <div className="action-buttons">
                <button 
                  className="btn-edit"
                  onClick={() => onEdit(employee)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => onDelete(employee.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EmployeeList;