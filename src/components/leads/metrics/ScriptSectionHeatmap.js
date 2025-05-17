import React from 'react';
import { Table } from 'react-bootstrap';

const ScriptSectionHeatmap = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4 border rounded">
        <p className="text-muted">No script section data available</p>
      </div>
    );
  }
  
  // Get all metrics (excluding the section name)
  const metrics = Object.keys(data[0]).filter(key => key !== 'section');
  
  // Helper function for cell color based on value
  const getCellColor = (value) => {
    if (value >= 90) return 'bg-success text-white';
    if (value >= 75) return 'bg-info text-white';
    if (value >= 60) return 'bg-primary text-white';
    if (value >= 40) return 'bg-warning';
    return 'bg-danger text-white';
  };
  
  return (
    <div className="script-section-heatmap">
      <div className="table-responsive">
        <Table bordered hover size="sm">
          <thead>
            <tr>
              <th>Script Section</th>
              {metrics.map(metric => (
                <th key={metric}>{metric}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td><strong>{row.section}</strong></td>
                {metrics.map(metric => (
                  <td
                    key={`${rowIndex}-${metric}`}
                    className={getCellColor(row[metric])}
                    style={{ textAlign: 'center' }}
                  >
                    {row[metric]}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ScriptSectionHeatmap;