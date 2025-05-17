import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Nav, Dropdown, Modal } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Link } from 'react-router-dom';
import { 
  FaRegMoneyBillAlt, FaChartLine, FaFileInvoice, 
  FaChartBar, FaBalanceScale, FaWallet,
  FaCreditCard, FaMoneyBill, FaChartPie,
  FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaTimes
} from 'react-icons/fa';
import PageTitle from '../common/PageTitle';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FinancialReports = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [reportType, setReportType] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportInProgress, setExportInProgress] = useState(false);
  const [financialData, setFinancialData] = useState({
    revenue: {
      total: 1245000,
      previousPeriod: 1180000,
      byPeriod: [85000, 92000, 102000, 98000, 110000, 115000, 108000, 117000, 125000, 123000, 130000, 140000],
      byType: {
        deliveryFees: 725000,
        setupFees: 180000,
        subscriptions: 340000,
      }
    },
    costs: {
      total: 825000,
      previousPeriod: 795000,
      byPeriod: [65000, 68000, 72000, 70000, 73000, 75000, 70000, 76000, 78000, 80000, 83000, 85000],
      byType: {
        driverWages: 420000,
        vehicleMaintenance: 125000,
        fuel: 180000,
        insurance: 60000,
        officeExpenses: 40000,
      }
    },
    // Cash flow data
    cashFlow: [
      { month: 'Dec', income: 145000, expenses: 115000, netFlow: 30000 },
      { month: 'Jan', income: 158000, expenses: 118000, netFlow: 40000 },
      { month: 'Feb', income: 152000, expenses: 120000, netFlow: 32000 },
      { month: 'Mar', income: 165000, expenses: 125000, netFlow: 40000 },
      { month: 'Apr', income: 172000, expenses: 128000, netFlow: 44000 },
      { month: 'May', income: 178000, expenses: 130000, netFlow: 48000 }
    ]
  });

  // Calculate profit
  const profit = financialData.revenue.total - financialData.costs.total;
  const previousProfit = financialData.revenue.previousPeriod - financialData.costs.previousPeriod;
  const profitChange = ((profit - previousProfit) / previousProfit) * 100;

  // Prepare chart data
  const periods = timeframe === 'monthly' 
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'];

  const revenueVsCostsData = {
    labels: periods,
    datasets: [
      {
        label: 'Revenue',
        data: financialData.revenue.byPeriod,
        borderColor: 'rgba(39, 174, 96, 1)',
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Costs',
        data: financialData.costs.byPeriod,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Add profit dataset to trends data
  const profitTrendsData = {
    labels: periods,
    datasets: [
      {
        label: 'Profit',
        data: financialData.revenue.byPeriod.map((rev, i) => rev - financialData.costs.byPeriod[i]),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Prepare revenue breakdown data
  const revenueBreakdownData = {
    labels: Object.keys(financialData.revenue.byType).map(key => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())),
    datasets: [
      {
        label: 'Revenue Sources',
        data: Object.values(financialData.revenue.byType),
        backgroundColor: [
          'rgba(39, 174, 96, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare cost breakdown data
  const costsBreakdownData = {
    labels: Object.keys(financialData.costs.byType).map(key => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())),
    datasets: [
      {
        label: 'Cost Categories',
        data: Object.values(financialData.costs.byType),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(201, 203, 207, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Cash flow chart data
  const cashFlowData = {
    labels: financialData.cashFlow.map(flow => flow.month),
    datasets: [
      {
        label: 'Income',
        data: financialData.cashFlow.map(flow => flow.income),
        backgroundColor: 'rgba(39, 174, 96, 0.6)',
        borderColor: 'rgba(39, 174, 96, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: financialData.cashFlow.map(flow => flow.expenses),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Net Flow',
        data: financialData.cashFlow.map(flow => flow.netFlow),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle export
  const handleExport = () => {
    setExportInProgress(true);
    
    // Simulate processing
    setTimeout(() => {
      let exportData = [];
      let fileName = '';
      
      // Prepare data based on report type
      switch (reportType) {
        case 'overview':
          exportData = [
            ['Financial Overview Report'],
            ['Generated on', new Date().toLocaleDateString()],
            [''],
            ['Key Performance Indicators'],
            ['Metric', 'Current', 'Previous', 'Change (%)'],
            ['Revenue', financialData.revenue.total, financialData.revenue.previousPeriod, ((financialData.revenue.total - financialData.revenue.previousPeriod) / financialData.revenue.previousPeriod * 100).toFixed(1) + '%'],
            ['Costs', financialData.costs.total, financialData.costs.previousPeriod, ((financialData.costs.total - financialData.costs.previousPeriod) / financialData.costs.previousPeriod * 100).toFixed(1) + '%'],
            ['Profit', profit, previousProfit, profitChange.toFixed(1) + '%'],
            [''],
            ['Revenue Breakdown'],
            ['Category', 'Amount', 'Percentage'],
          ];
          
          // Add revenue breakdown
          Object.entries(financialData.revenue.byType).forEach(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const percentage = (value / financialData.revenue.total * 100).toFixed(1) + '%';
            exportData.push([label, value, percentage]);
          });
          
          exportData.push(['']);
          exportData.push(['Cost Breakdown']);
          exportData.push(['Category', 'Amount', 'Percentage']);
          
          // Add cost breakdown
          Object.entries(financialData.costs.byType).forEach(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const percentage = (value / financialData.costs.total * 100).toFixed(1) + '%';
            exportData.push([label, value, percentage]);
          });
          
          fileName = 'financial_overview_report';
          break;
          
        case 'revenue':
          exportData = [
            ['Revenue Report'],
            ['Generated on', new Date().toLocaleDateString()],
            [''],
            ['Revenue Trends'],
            ['Period', 'Amount'],
          ];
          
          // Add revenue by period
          periods.forEach((period, index) => {
            exportData.push([period, financialData.revenue.byPeriod[index]]);
          });
          
          exportData.push(['']);
          exportData.push(['Revenue Breakdown']);
          exportData.push(['Category', 'Amount', 'Percentage']);
          
          // Add revenue breakdown
          Object.entries(financialData.revenue.byType).forEach(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const percentage = (value / financialData.revenue.total * 100).toFixed(1) + '%';
            exportData.push([label, value, percentage]);
          });
          
          fileName = 'revenue_report';
          break;
          
        case 'expenses':
          exportData = [
            ['Expense Report'],
            ['Generated on', new Date().toLocaleDateString()],
            [''],
            ['Expense Trends'],
            ['Period', 'Amount'],
          ];
          
          // Add costs by period
          periods.forEach((period, index) => {
            exportData.push([period, financialData.costs.byPeriod[index]]);
          });
          
          exportData.push(['']);
          exportData.push(['Expense Breakdown']);
          exportData.push(['Category', 'Amount', 'Percentage']);
          
          // Add cost breakdown
          Object.entries(financialData.costs.byType).forEach(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const percentage = (value / financialData.costs.total * 100).toFixed(1) + '%';
            exportData.push([label, value, percentage]);
          });
          
          fileName = 'expense_report';
          break;
          
        case 'cashflow':
          exportData = [
            ['Cash Flow Report'],
            ['Generated on', new Date().toLocaleDateString()],
            [''],
            ['Monthly Cash Flow'],
            ['Month', 'Income', 'Expenses', 'Net Flow'],
          ];
          
          // Add cash flow data
          financialData.cashFlow.forEach(flow => {
            exportData.push([flow.month, flow.income, flow.expenses, flow.netFlow]);
          });
          
          fileName = 'cash_flow_report';
          break;
          
        default:
          exportData = [['No data available']];
          fileName = 'financial_report';
      }
      
      // Add timestamp to filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      fileName = `${fileName}_${timestamp}`;
      
      // Export based on selected format
      switch (exportFormat) {
        case 'csv':
          exportAsCSV(exportData, fileName);
          break;
        case 'excel':
          // In a real app, you'd use a library like xlsx
          alert('Excel export would be implemented with a library like SheetJS/xlsx in a real application.');
          break;
        case 'pdf':
          // In a real app, you'd use a library like jspdf
          alert('PDF export would be implemented with a library like jsPDF in a real application.');
          break;
        default:
          exportAsCSV(exportData, fileName);
      }
      
      setExportInProgress(false);
      setShowExportModal(false);
    }, 1000);
  };
  
  // Export as CSV
  const exportAsCSV = (data, fileName) => {
    // Convert 2D array to CSV
    const csvContent = data.map(row => 
      row.map(cell => {
        // Handle cells that might contain commas
        if (typeof cell === 'string' && cell.includes(',')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    ).join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render different report sections based on type
  const renderReportContent = () => {
    switch (reportType) {
      case 'overview':
        return renderOverviewReport();
      case 'revenue':
        return renderRevenueReport();
      case 'expenses':
        return renderExpenseReport();
      case 'cashflow':
        return renderCashFlowReport();
      default:
        return renderOverviewReport();
    }
  };

  // Render overview report
  const renderOverviewReport = () => {
    return (
      <>
        {/* KPI Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Revenue</h6>
                    <h3 className="mb-0">${(financialData.revenue.total / 1000).toFixed(1)}k</h3>
                  </div>
                  <div className={`badge bg-${financialData.revenue.total > financialData.revenue.previousPeriod ? 'success' : 'danger'} h-50`}>
                    {((financialData.revenue.total - financialData.revenue.previousPeriod) / financialData.revenue.previousPeriod * 100).toFixed(1)}%
                  </div>
                </div>
                <small className="text-muted mt-2">
                  vs ${(financialData.revenue.previousPeriod / 1000).toFixed(1)}k last period
                </small>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Costs</h6>
                    <h3 className="mb-0">${(financialData.costs.total / 1000).toFixed(1)}k</h3>
                  </div>
                  <div className={`badge bg-${financialData.costs.total < financialData.costs.previousPeriod ? 'success' : 'danger'} h-50`}>
                    {((financialData.costs.total - financialData.costs.previousPeriod) / financialData.costs.previousPeriod * 100).toFixed(1)}%
                  </div>
                </div>
                <small className="text-muted mt-2">
                  vs ${(financialData.costs.previousPeriod / 1000).toFixed(1)}k last period
                </small>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Profit</h6>
                    <h3 className="mb-0">${(profit / 1000).toFixed(1)}k</h3>
                  </div>
                  <div className={`badge bg-${profitChange > 0 ? 'success' : 'danger'} h-50`}>
                    {profitChange.toFixed(1)}%
                  </div>
                </div>
                <small className="text-muted mt-2">
                  vs ${(previousProfit / 1000).toFixed(1)}k last period
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Revenue vs Costs Chart */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <h5 className="mb-0">Revenue vs Costs Trend</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '400px' }}>
                  <Line 
                    data={revenueVsCostsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toLocaleString();
                            }
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
                                }).format(context.parsed.y);
                              }
                              return label;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Breakdown Charts */}
        <Row>
          <Col md={6}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <h5 className="mb-0">Revenue Breakdown</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Doughnut 
                    data={revenueBreakdownData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.label || '';
                              const value = context.raw;
                              const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <h5 className="mb-0">Cost Breakdown</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Doughnut 
                    data={costsBreakdownData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.label || '';
                              const value = context.raw;
                              const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  // Render revenue report
  const renderRevenueReport = () => {
    return (
      <>
        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-white border-0 pt-3 pb-0">
                <h5 className="mb-0">Revenue Summary</h5>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between mb-3">
                  <h3 className="text-success">{formatCurrency(financialData.revenue.total)}</h3>
                  <div className={`badge bg-${financialData.revenue.total > financialData.revenue.previousPeriod ? 'success' : 'danger'} h-50 align-self-center`}>
                    {((financialData.revenue.total - financialData.revenue.previousPeriod) / financialData.revenue.previousPeriod * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-muted">
                  vs {formatCurrency(financialData.revenue.previousPeriod)} last period
                </div>
                <div className="mt-3">
                  <h6>Revenue Distribution</h6>
                  {Object.entries(financialData.revenue.byType).map(([key, value], index) => {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    const percentage = (value / financialData.revenue.total * 100).toFixed(1);
                    return (
                      <div key={index} className="mb-2">
                        <div className="d-flex justify-content-between">
                          <span>{label}</span>
                          <span>{formatCurrency(value)} ({percentage}%)</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${percentage}%` }}
                            aria-valuenow={percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-white border-0 pt-3 pb-0">
                <h5 className="mb-0">Revenue Breakdown</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Doughnut 
                    data={revenueBreakdownData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.label || '';
                              const value = context.raw;
                              const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col md={12}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 pt-3 pb-0">
                <h5 className="mb-0">Revenue Trends</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '400px' }}>
                  <Line 
                    data={{
                      labels: periods,
                      datasets: [
                        {
                          label: 'Revenue',
                          data: financialData.revenue.byPeriod,
                          borderColor: 'rgba(39, 174, 96, 1)',
                          backgroundColor: 'rgba(39, 174, 96, 0.2)',
                          fill: true,
                          tension: 0.4,
                        }
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toLocaleString();
                            }
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
                                }).format(context.parsed.y);
                              }
                              return label;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  // Render expense report
  const renderExpenseReport = () => {
    return (
      <>
        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-white border-0 pt-3 pb-0">
                <h5 className="mb-0">Expense Summary</h5>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between mb-3">
                  <h3 className="text-danger">{formatCurrency(financialData.costs.total)}</h3>
                  <div className={`badge bg-${financialData.costs.total < financialData.costs.previousPeriod ? 'success' : 'danger'} h-50 align-self-center`}>
                    {((financialData.costs.total - financialData.costs.previousPeriod) / financialData.costs.previousPeriod * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-muted">
                  vs {formatCurrency(financialData.costs.previousPeriod)} last period
                </div>
                <div className="mt-3">
                  <h6>Expense Distribution</h6>
                  {Object.entries(financialData.costs.byType).map(([key, value], index) => {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    const percentage = (value / financialData.costs.total * 100).toFixed(1);
                    return (
                      <div key={index} className="mb-2">
                        <div className="d-flex justify-content-between">
                          <span>{label}</span>
                          <span>{formatCurrency(value)} ({percentage}%)</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: `${percentage}%` }}
                            aria-valuenow={percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-white border-0 pt-3 pb-0">
                <h5 className="mb-0">Expense Breakdown</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Doughnut 
                    data={costsBreakdownData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.label || '';
                              const value = context.raw;
                              const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col md={12}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 pt-3 pb-0">
                <h5 className="mb-0">Expense Trends</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '400px' }}>
                  <Line 
                    data={{
                      labels: periods,
                      datasets: [
                        {
                          label: 'Expenses',
                          data: financialData.costs.byPeriod,
                          borderColor: 'rgba(255, 99, 132, 1)',
                          backgroundColor: 'rgba(255, 99, 132, 0.2)',
                          fill: true,
                          tension: 0.4,
                        }
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toLocaleString();
                            }
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
                                }).format(context.parsed.y);
                              }
                              return label;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  // Render cash flow report
  const renderCashFlowReport = () => {
    return (
      <>
        <Row className="mb-4">
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 pt-3 pb-0">
                <h5 className="mb-0">Cash Flow Summary</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '400px' }}>
                  <Bar 
                    data={cashFlowData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          stacked: false,
                        },
                        y: {
                          stacked: false,
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toLocaleString();
                            }
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
                                }).format(context.parsed.y);
                              }
                              return label;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col md={12}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 pt-3 pb-0">
                <h5 className="mb-0">Cash Flow Details</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th className="text-end">Income</th>
                      <th className="text-end">Expenses</th>
                      <th className="text-end">Net Flow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.cashFlow.map((flow, index) => (
                      <tr key={index}>
                        <td>{flow.month}</td>
                        <td className="text-end text-success">{formatCurrency(flow.income)}</td>
                        <td className="text-end text-danger">{formatCurrency(flow.expenses)}</td>
                        <td className="text-end fw-bold">{formatCurrency(flow.netFlow)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="fw-bold">
                      <td>Total</td>
                      <td className="text-end text-success">
                        {formatCurrency(financialData.cashFlow.reduce((sum, flow) => sum + flow.income, 0))}
                      </td>
                      <td className="text-end text-danger">
                        {formatCurrency(financialData.cashFlow.reduce((sum, flow) => sum + flow.expenses, 0))}
                      </td>
                      <td className="text-end">
                        {formatCurrency(financialData.cashFlow.reduce((sum, flow) => sum + flow.netFlow, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col md={12}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 pt-3 pb-0">
                <h5 className="mb-0">Profit Trend</h5>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '400px' }}>
                  <Line 
                    data={profitTrendsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toLocaleString();
                            }
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD'
                                }).format(context.parsed.y);
                              }
                              return label;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <Container fluid className="py-4">
      <PageTitle 
        title="Financial Reports"
        backButton={true}
      />
      
      <div className="d-flex justify-content-end mb-4">
        <Form.Select 
          style={{ width: 'auto' }} 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="me-2"
        >
          <option value="monthly">Monthly View</option>
          <option value="weekly">Weekly View</option>
        </Form.Select>
        <Button 
          variant="outline-success"
          className="me-2"
          onClick={() => setShowExportModal(true)}
        >
          <FaDownload className="me-1" /> Export
        </Button>
        <Link to="/financial" className="btn btn-outline-primary">
          Back to Dashboard
        </Link>
      </div>

      {/* Report Navigation */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <Nav className="report-nav" variant="pills">
                <Nav.Item>
                  <Nav.Link 
                    active={reportType === 'overview'} 
                    onClick={() => setReportType('overview')}
                    className="d-flex align-items-center"
                  >
                    <FaChartBar className="me-2" /> Overview
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={reportType === 'revenue'} 
                    onClick={() => setReportType('revenue')}
                    className="d-flex align-items-center"
                  >
                    <FaMoneyBill className="me-2" /> Revenue
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={reportType === 'expenses'} 
                    onClick={() => setReportType('expenses')}
                    className="d-flex align-items-center"
                  >
                    <FaCreditCard className="me-2" /> Expenses
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={reportType === 'cashflow'} 
                    onClick={() => setReportType('cashflow')}
                    className="d-flex align-items-center"
                  >
                    <FaChartLine className="me-2" /> Cash Flow
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Report Content */}
      {renderReportContent()}

      {/* Export Modal */}
      <Modal
        show={showExportModal}
        onHide={() => setShowExportModal(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Export Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Export Format</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label={<><FaFileCsv className="me-1" /> CSV</>}
                name="exportFormat"
                id="export-csv"
                checked={exportFormat === 'csv'}
                onChange={() => setExportFormat('csv')}
              />
              <Form.Check
                inline
                type="radio"
                label={<><FaFileExcel className="me-1" /> Excel</>}
                name="exportFormat"
                id="export-excel"
                checked={exportFormat === 'excel'}
                onChange={() => setExportFormat('excel')}
              />
              <Form.Check
                inline
                type="radio"
                label={<><FaFilePdf className="me-1" /> PDF</>}
                name="exportFormat"
                id="export-pdf"
                checked={exportFormat === 'pdf'}
                onChange={() => setExportFormat('pdf')}
              />
            </div>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Report Content</Form.Label>
            <Form.Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="overview">Overview Report</option>
              <option value="revenue">Revenue Report</option>
              <option value="expenses">Expense Report</option>
              <option value="cashflow">Cash Flow Report</option>
            </Form.Select>
          </Form.Group>
          
          <div className="py-2">
            <h6>What will be included:</h6>
            <ul className="mb-0">
              {reportType === 'overview' && (
                <>
                  <li>KPI Summary (Revenue, Costs, Profit)</li>
                  <li>Revenue & Cost Breakdown</li>
                  <li>Revenue vs Costs Trend</li>
                </>
              )}
              {reportType === 'revenue' && (
                <>
                  <li>Revenue Summary</li>
                  <li>Revenue by Category</li>
                  <li>Revenue Trends</li>
                </>
              )}
              {reportType === 'expenses' && (
                <>
                  <li>Expense Summary</li>
                  <li>Expense by Category</li>
                  <li>Expense Trends</li>
                </>
              )}
              {reportType === 'cashflow' && (
                <>
                  <li>Cash Flow Summary</li>
                  <li>Monthly Cash Flow Details</li>
                  <li>Profit Trend</li>
                </>
              )}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowExportModal(false)}>
            <FaTimes className="me-1" /> Cancel
          </Button>
          <Button variant="success" onClick={handleExport} disabled={exportInProgress}>
            {exportInProgress ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Exporting...
              </>
            ) : (
              <>
                <FaDownload className="me-1" /> Export Report
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FinancialReports;