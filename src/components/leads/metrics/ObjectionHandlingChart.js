import React from 'react';
import { Table, ProgressBar } from 'react-bootstrap';

const ObjectionHandlingChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4 border rounded">
        <p className="text-muted">No objection handling data available</p>
      </div>
    );
  }
  
  return (
    <div className="objection-handling-chart">
      <Table hover size="sm">
        <thead>
          <tr>
            <th>Objection</th>
            <th>Success Rate</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((objection, index) => (
            <tr key={index}>
              <td>{objection.name}</td>
              <td style={{ width: '40%' }}>
                <ProgressBar 
                  variant={objection.successRate >= 70 ? 'success' : objection.successRate >= 50 ? 'info' : 'warning'} 
                  now={objection.successRate} 
                  max={100}
                  label={`${objection.successRate}%`}
                />
              </td>
              <td>{objection.overcame} / {objection.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ObjectionHandlingChart;