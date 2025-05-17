import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Nav } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/financialUtils';
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
import { 
  FaRegMoneyBillAlt, FaChartLine, FaFileInvoice, 
  FaChartBar, FaBalanceScale, FaWallet,
  FaCreditCard, FaPlus, FaMoneyBill, FaMoneyBillAlt, FaChartPie
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

const FinancialDashboard = () => {
  const [timeframe, setTimeframe] = useState('monthly');
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
    
    // New mock data for unpaid invoices, upcoming payments, etc.
    unpaidInvoices: [
      { id: 'INV-2023-058', customer: 'ABC Logistics', amount: 3200, dueDate: '2025-05-10' },
      { id: 'INV-2023-059', customer: 'Tech Solutions Inc.', amount: 1850, dueDate: '2025-05-15' },
      { id: 'INV-2023-060', customer: 'XYZ Retail', amount: 4500, dueDate: '2025-05-20' }
    ],
    upcomingPayments: [
      { id: 'PAY-0045', vendor: 'Vehicle Lease Co.', amount: 5800, dueDate: '2025-05-08' },
      { id: 'PAY-0046', vendor: 'Insurance Provider', amount: 2400, dueDate: '2025-05-15' },
      { id: 'PAY-0047', vendor: 'Fuel Services Inc.', amount: 3600, dueDate: '2025-05-18' }
    ],
    cashBalance: 155000,
    accountsReceivable: 42500,
    accountsPayable: 38700
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

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    cashFlow: [],
    recentTransactions: []
  });
  
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      // Mock data for cash flow (last 6 months)
      const mockCashFlow = [
        { month: 'Dec', income: 145000, expenses: 115000 },
        { month: 'Jan', income: 158000, expenses: 118000 },
        { month: 'Feb', income: 152000, expenses: 120000 },
        { month: 'Mar', income: 165000, expenses: 125000 },
        { month: 'Apr', income: 172000, expenses: 128000 },
        { month: 'May', income: 178000, expenses: 130000 }
      ];
      
      // Mock data for recent transactions
      const mockRecentTransactions = [
        { id: 'TRX-10011', type: 'expense', description: 'Fuel payment', amount: 1250.00, date: new Date() },
        { id: 'TRX-10010', type: 'revenue', description: 'Monthly subscription fee', amount: 3500.00, date: new Date(Date.now() - 86400000) },
        { id: 'TRX-10009', type: 'expense', description: 'Office supplies', amount: 450.00, date: new Date(Date.now() - 172800000) }
      ];
      
      setDashboardStats({
        cashFlow: mockCashFlow,
        recentTransactions: mockRecentTransactions
      });
      setIsDataLoading(false);
    }, 1000);
  }, []);
  
  // Format currency for display
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

return (
  <Container fluid className="py-4">
    <PageTitle 
      title="Financial Dashboard"
      backButton={false}
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
      <Link to="/financial/reports" className="btn btn-primary">
        Full Financial Reports
      </Link>
    </div>

      {/* Navigation Links */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <h5 className="mb-3">Financial Management</h5>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/financial/transactions" className="btn btn-outline-primary">
                  <FaRegMoneyBillAlt className="me-2" /> Transactions
                </Link>
                <Link to="/financial/budget" className="btn btn-outline-primary">
                  <FaBalanceScale className="me-2" /> Budget Planner
                </Link>
                <Link to="/financial/reports" className="btn btn-outline-primary">
                  <FaChartBar className="me-2" /> Reports
                </Link>
                <Link to="/financial/invoices" className="btn btn-outline-primary">
                  <FaFileInvoice className="me-2" /> Invoices
                </Link>
                <Link to="/financial/expenses" className="btn btn-outline-primary">
                  <FaCreditCard className="me-2" /> Expenses
                </Link>
                <Link to="/financial/accounts" className="btn btn-outline-primary">
                  <FaWallet className="me-2" /> Accounts
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
      
<Row className="mb-4">
  <Col md={12}>
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-0 pt-3 pb-3 d-flex justify-content-between">
        <h5 className="mb-0">Quick Actions</h5>
      </Card.Header>
      <Card.Body className="p-3">
        <div className="d-flex flex-wrap gap-2">
          <Link to="/financial/transactions/new" className="btn btn-primary me-2">
            <FaPlus className="me-1" /> Record Transaction
          </Link>
          <Link to="/financial/invoices/new" className="btn btn-outline-primary me-2">
            <FaFileInvoice className="me-1" /> Create Invoice
          </Link>
          <Link to="/financial/expenses/new" className="btn btn-outline-primary me-2">
            <FaMoneyBillAlt className="me-1" /> Add Expense
          </Link>
          <Link to="/financial/accounts" className="btn btn-outline-primary me-2">
            <FaWallet className="me-1" /> View Accounts
          </Link>
          <Link to="/financial/budget" className="btn btn-outline-primary">
            <FaBalanceScale className="me-1" /> Budget Planning
          </Link>
        </div>
      </Card.Body>
    </Card>
  </Col>
</Row>

{/* Recent Transactions */}
<Row>
  <Col md={6}>
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-white border-0 pt-3 pb-0 d-flex justify-content-between">
        <h5 className="mb-0">Recent Transactions</h5>
        <Link to="/financial/transactions" className="text-primary small">View All</Link>
      </Card.Header>
      <Card.Body className="p-0">
        {isDataLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Table className="mb-0">
            <tbody>
              {dashboardStats.recentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>
                    <div className="fw-bold">{transaction.id}</div>
                    <div className="small text-muted">{transaction.description}</div>
                  </td>
                  <td className="text-end">
                    <div className={transaction.type === 'expense' ? 'text-danger' : 'text-success'}>
                      {transaction.type === 'expense' ? '- ' : '+ '}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="small text-muted">
                      {formatDate(transaction.date)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  </Col>
  
  {/* Continue with your other components... */}
</Row>
      {/* Cash Position */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 pt-3 pb-0 d-flex justify-content-between">
              <h5 className="mb-0">Cash Position</h5>
              <Link to="/financial/accounts" className="text-primary small">View All</Link>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center my-3">
                <div className="text-center">
                  <FaMoneyBill size={36} className="text-success mb-2" />
                  <h3 className="mb-0">{formatCurrency(financialData.cashBalance)}</h3>
                  <div className="text-muted small">Available Cash</div>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <div className="text-start">
                  <h6 className="mb-0 text-primary">{formatCurrency(financialData.accountsReceivable)}</h6>
                  <div className="text-muted small">Accounts Receivable</div>
                </div>
                <div className="text-end">
                  <h6 className="mb-0 text-danger">{formatCurrency(financialData.accountsPayable)}</h6>
                  <div className="text-muted small">Accounts Payable</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 pt-3 pb-0 d-flex justify-content-between">
              <h5 className="mb-0">Unpaid Invoices</h5>
              <Link to="/financial/invoices" className="text-primary small">View All</Link>
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0">
                <tbody>
                  {financialData.unpaidInvoices.map((invoice, index) => (
                    <tr key={index}>
                      <td>
                        <div className="fw-bold">{invoice.id}</div>
                        <div className="small text-muted">{invoice.customer}</div>
                      </td>
                      <td className="text-end">
                        <div className="fw-bold">{formatCurrency(invoice.amount)}</div>
                        <div className="small text-muted">Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 pt-3 pb-0 d-flex justify-content-between">
              <h5 className="mb-0">Upcoming Payments</h5>
              <Link to="/financial/expenses" className="text-primary small">View All</Link>
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0">
                <tbody>
                  {financialData.upcomingPayments.map((payment, index) => (
                    <tr key={index}>
                      <td>
                        <div className="fw-bold">{payment.id}</div>
                        <div className="small text-muted">{payment.vendor}</div>
                      </td>
                      <td className="text-end">
                        <div className="fw-bold text-danger">{formatCurrency(payment.amount)}</div>
                        <div className="small text-muted">Due: {new Date(payment.dueDate).toLocaleDateString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Revenue vs Costs Chart */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between">
              <h5 className="mb-0">Revenue vs Costs Trend</h5>
              <Link to="/financial/reports" className="text-primary small">Detailed Reports</Link>
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
            <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between">
              <h5 className="mb-0">Revenue Breakdown</h5>
              <Link to="/financial/reports?type=revenueBreakdown" className="text-primary small">View Details</Link>
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
            <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between">
              <h5 className="mb-0">Cost Breakdown</h5>
              <Link to="/financial/reports?type=expenseBreakdown" className="text-primary small">View Details</Link>
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
    </Container>
  );
};

export default FinancialDashboard;