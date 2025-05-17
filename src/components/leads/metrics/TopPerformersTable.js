import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const TopPerformersTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4 border rounded">
        <p className="text-muted">No top performers data available</p>
      </div>
    );
  }
  
  return (
    <div className="top-performers-table">
      <Table hover size="sm">
        <thead>
          <tr>
            <th>Rep</th>
            <th>Conv. Rate</th>
            <th>Calls</th>
          </tr>
        </thead>
        <tbody>
          {data.map((performer, index) => (
            <tr key={index}>
              <td>
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                    style={{ width: '28px', height: '28px', fontSize: '0.8em' }}
                  >
                    {performer.avatar}
                  </div>
                  {performer.name}
                </div>
              </td>
              <td>
                <Badge bg={performer.conversionRate >= 75 ? 'success' : performer.conversionRate >= 60 ? 'primary' : 'warning'}>
                  {performer.conversionRate}%
                </Badge>
              </td>
              <td>{performer.callsCompleted}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TopPerformersTable;