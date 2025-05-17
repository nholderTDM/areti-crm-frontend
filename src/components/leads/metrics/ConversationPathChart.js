import React from 'react';

// Simple table-based visualization as an alternative to recharts
const ConversationPathChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4 border rounded">
        <p className="text-muted">No conversation path data available</p>
      </div>
    );
  }
  
  return (
    <div className="conversation-path-chart">
      <div className="alert alert-info">
        <h6>Conversation Path Visualization</h6>
        <p className="mb-0">Shows how calls flow through different script sections and objection points.</p>
      </div>
      
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {data.map((link, index) => (
              <tr key={index}>
                <td>{link.from}</td>
                <td>{link.to}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="me-2">{link.value}</div>
                    <div 
                      className="bg-primary" 
                      style={{ 
                        height: '10px', 
                        width: `${Math.min(100, link.value * 2)}px`,
                        borderRadius: '5px'
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConversationPathChart;