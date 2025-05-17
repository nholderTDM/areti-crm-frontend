import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Tabs, Tab, Alert, Badge, ListGroup, Nav, Spinner, Dropdown, Modal } from 'react-bootstrap';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { 
  FaDownload, FaShareAlt, FaCalendarAlt, FaFilter, FaChartLine, 
  FaChartBar, FaChartPie, FaCog, FaInfoCircle, FaPrint,
  FaFileExcel, FaFilePdf, FaTable, FaMapMarkerAlt, FaTruck,
  FaMoneyBillAlt, FaUsers, FaFileExport, FaUserCircle, FaSave,
  FaTimes, FaClock, FaRoute, FaStar, FaExclamationTriangle
} from 'react-icons/fa';
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
  Filler
} from 'chart.js';
import BackButton from '../common/BackButton';

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
  Legend,
  Filler
);

const ReportingDashboard = () => {
  // State variables
  const [activeReportTab, setActiveReportTab] = useState('generator');
  const [reportType, setReportType] = useState('deliveryPerformance');
  const [dateRange, setDateRange] = useState('month');
  const [chartType, setChartType] = useState('bar');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [compareWithPrevious, setCompareWithPrevious] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    regions: ['All Regions'],
    drivers: ['All Drivers'],
    customers: ['All Customers'],
    status: ['All Statuses']
  });
  const [selectedFilters, setSelectedFilters] = useState({
    region: 'All Regions',
    driver: 'All Drivers',
    customer: 'All Customers',
    status: 'All Statuses'
  });
  const [savedReports, setSavedReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [reportName, setReportName] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState({
    name: '',
    frequency: 'weekly',
    day: 'monday',
    time: '09:00',
    recipients: '',
    format: 'pdf'
  });
  const [newEmail, setNewEmail] = useState('');
  const [defaultRecipients, setDefaultRecipients] = useState('fgill@aretialliance.com, nholder@aretialliance.com, info@aretialliance.com');
  
  const chartRef = useRef(null);

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add new email to recipients list
  const handleAddEmail = () => {
    if (!newEmail || !isValidEmail(newEmail)) return;
    
    // Check if email already exists in the list
    if (defaultRecipients.toLowerCase().includes(newEmail.toLowerCase())) {
      alert('This email is already in the recipients list.');
      return;
    }
    
    // Add email to the list
    const updatedRecipients = defaultRecipients 
      ? `${defaultRecipients}, ${newEmail}` 
      : newEmail;
    
    setDefaultRecipients(updatedRecipients);
    setNewEmail(''); // Clear the input field
  };

  // Load filter options and saved reports on mount
  useEffect(() => {
    // In a real app, these would be loaded from an API
    setFilterOptions({
      regions: ['All Regions', 'North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'],
      drivers: ['All Drivers', 'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Wilson'],
      customers: ['All Customers', 'ABC Corp', 'XYZ Inc', 'Acme LLC', 'Global Tech', 'Metro Electronics'],
      status: ['All Statuses', 'Completed', 'In Progress', 'Delayed', 'Cancelled', 'Failed']
    });
    
    setSavedReports([
      { id: 1, name: 'Q1 2025 Financial Review', type: 'financialSummary', date: '2025-04-05', createdBy: 'Admin User' },
      { id: 2, name: 'March 2025 Driver Analysis', type: 'driverPerformance', date: '2025-04-02', createdBy: 'Admin User' },
      { id: 3, name: 'Customer Retention Analysis', type: 'customerAnalysis', date: '2025-04-10', createdBy: 'Admin User' },
      { id: 4, name: 'Delivery Time Analysis by Region', type: 'deliveryPerformance', date: '2025-04-15', createdBy: 'Admin User' }
    ]);
    
    setScheduledReports([
      { id: 1, name: 'Weekly Delivery Report', type: 'deliveryPerformance', frequency: 'Weekly (Monday)', recipients: 'Management Team', lastRun: '2025-04-29', status: 'active' },
      { id: 2, name: 'Monthly Financial Summary', type: 'financialSummary', frequency: 'Monthly (1st)', recipients: 'Finance Department', lastRun: '2025-04-01', status: 'active' },
      { id: 3, name: 'Driver Performance Review', type: 'driverPerformance', frequency: 'Bi-weekly', recipients: 'Operations Team', lastRun: '2025-04-15', status: 'active' }
    ]);
  }, []);

  // Generate report data when needed
  const generateReport = () => {
    setIsGenerating(true);
    
    // In a real app, this would be an API call with the selected parameters
    setTimeout(() => {
      const mockData = getMockReportData();
      setReportData(mockData);
      setIsGenerating(false);
      setShowReport(true);
    }, 1500);
  };

  // Get mock report data based on report type
  const getMockReportData = () => {
    // Mock data structure based on report type
    const reportDataMap = {
      deliveryPerformance: getDeliveryPerformanceData(),
      financialSummary: getFinancialSummaryData(),
      driverPerformance: getDriverPerformanceData(),
      customerAnalysis: getCustomerAnalysisData(),
      routeOptimization: getRouteOptimizationData(),
      deliveryIssues: getDeliveryIssuesData()
    };
    
    return reportDataMap[reportType];
  };

  // Get delivery performance mock data
  const getDeliveryPerformanceData = () => {
    const dateLabels = {
      week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      quarter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      custom: ['Period 1', 'Period 2', 'Period 3', 'Period 4']
    };
    
    const data = {
      title: 'Delivery Performance Report',
      description: 'Overview of delivery times, success rates, and issues.',
      date: new Date().toLocaleDateString(),
      summary: {
        totalDeliveries: 590,
        onTimeRate: '91.5%',
        avgDeliveryTime: '39 mins',
        completionRate: '98.8%'
      },
      charts: {
        main: {
          labels: dateLabels[dateRange],
          datasets: [
            {
              label: 'On-Time Deliveries',
              data: dateRange === 'week' 
                ? [32, 29, 35, 38, 41, 27, 18] 
                : dateRange === 'month' 
                ? [120, 145, 135, 140] 
                : dateRange === 'quarter' 
                ? [520, 580, 610, 590, 605, 625] 
                : [520, 580, 610, 590, 605, 625, 640, 630, 650, 670, 690, 710],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
            },
            {
              label: 'Delayed Deliveries',
              data: dateRange === 'week' 
                ? [4, 3, 2, 5, 3, 2, 1] 
                : dateRange === 'month' 
                ? [15, 10, 13, 12] 
                : dateRange === 'quarter' 
                ? [45, 50, 55, 48, 52, 49] 
                : [45, 50, 55, 48, 52, 49, 51, 53, 48, 47, 45, 43],
              backgroundColor: 'rgba(255, 159, 64, 0.6)',
              borderColor: 'rgba(255, 159, 64, 1)',
            }
          ]
        },
        secondary: {
          labels: ['< 30 mins', '30-45 mins', '45-60 mins', '60-90 mins', '> 90 mins'],
          datasets: [
            {
              data: [35, 42, 15, 6, 2],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(153, 102, 255, 0.6)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)'
              ],
            }
          ]
        }
      },
      tableData: dateRange === 'week' ? [
        { period: 'Monday', total: 36, onTime: 32, delayed: 4, cancelled: 0 },
        { period: 'Tuesday', total: 32, onTime: 29, delayed: 3, cancelled: 0 },
        { period: 'Wednesday', total: 38, onTime: 35, delayed: 2, cancelled: 1 },
        { period: 'Thursday', total: 43, onTime: 38, delayed: 5, cancelled: 0 },
        { period: 'Friday', total: 44, onTime: 41, delayed: 3, cancelled: 0 },
        { period: 'Saturday', total: 30, onTime: 27, delayed: 2, cancelled: 1 },
        { period: 'Sunday', total: 19, onTime: 18, delayed: 1, cancelled: 0 }
      ] : dateRange === 'month' ? [
        { period: 'Week 1', total: 135, onTime: 120, delayed: 15, cancelled: 0 },
        { period: 'Week 2', total: 155, onTime: 145, delayed: 10, cancelled: 0 },
        { period: 'Week 3', total: 148, onTime: 135, delayed: 13, cancelled: 0 },
        { period: 'Week 4', total: 152, onTime: 140, delayed: 12, cancelled: 0 }
      ] : [
        { period: 'January', total: 565, onTime: 520, delayed: 45, cancelled: 0 },
        { period: 'February', total: 630, onTime: 580, delayed: 50, cancelled: 0 },
        { period: 'March', total: 665, onTime: 610, delayed: 55, cancelled: 0 },
        { period: 'April', total: 638, onTime: 590, delayed: 48, cancelled: 0 },
        { period: 'May', total: 657, onTime: 605, delayed: 52, cancelled: 0 },
        { period: 'June', total: 674, onTime: 625, delayed: 49, cancelled: 0 }
      ],
      insights: [
        "On-time delivery rate is highest on Fridays (93.2%) and lowest on Thursdays (88.4%).",
        "The average delivery time has improved by 5.2% compared to the previous period.",
        "Delivery issues are most commonly related to traffic delays (45%) and weather conditions (22%).",
        "Customer satisfaction is strongly correlated with on-time delivery performance (r=0.87)."
      ]
    };
    
    return data;
  };

  // Get financial summary mock data
  const getFinancialSummaryData = () => {
    const dateLabels = {
      week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      quarter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      custom: ['Period 1', 'Period 2', 'Period 3', 'Period 4']
    };
    
    const data = {
      title: 'Financial Summary Report',
      description: 'Overview of revenue, expenses, and profit metrics.',
      date: new Date().toLocaleDateString(),
      summary: {
        totalRevenue: '$285,000',
        totalExpenses: '$189,000',
        profit: '$96,000',
        marginRate: '33.7%'
      },
      charts: {
        main: {
          labels: dateLabels[dateRange],
          datasets: [
            {
              label: 'Revenue',
              data: dateRange === 'week' 
                ? [3200, 2900, 3500, 3800, 4100, 2700, 1800] 
                : dateRange === 'month' 
                ? [21000, 24500, 23000, 22500] 
                : dateRange === 'quarter' 
                ? [85000, 95000, 105000, 95000, 97000, 98000] 
                : [85000, 95000, 105000, 95000, 97000, 98000, 99000, 102000, 108000, 112000, 115000, 120000],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
            },
            {
              label: 'Expenses',
              data: dateRange === 'week' 
                ? [2100, 1900, 2300, 2500, 2700, 1800, 1200] 
                : dateRange === 'month' 
                ? [13500, 16000, 15000, 14500] 
                : dateRange === 'quarter' 
                ? [56000, 63000, 70000, 63000, 64000, 65000] 
                : [56000, 63000, 70000, 63000, 64000, 65000, 66000, 68000, 72000, 74000, 76000, 79000],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
            }
          ]
        },
        secondary: {
          labels: ['Driver Wages', 'Fuel', 'Vehicle Maintenance', 'Insurance', 'Administrative'],
          datasets: [
            {
              data: [45, 25, 12, 8, 10],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(153, 102, 255, 0.6)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)'
              ],
            }
          ]
        }
      },
      tableData: dateRange === 'week' ? [
        { period: 'Monday', revenue: '$3,200', expenses: '$2,100', profit: '$1,100', margin: '34.4%' },
        { period: 'Tuesday', revenue: '$2,900', expenses: '$1,900', profit: '$1,000', margin: '34.5%' },
        { period: 'Wednesday', revenue: '$3,500', expenses: '$2,300', profit: '$1,200', margin: '34.3%' },
        { period: 'Thursday', revenue: '$3,800', expenses: '$2,500', profit: '$1,300', margin: '34.2%' },
        { period: 'Friday', revenue: '$4,100', expenses: '$2,700', profit: '$1,400', margin: '34.1%' },
        { period: 'Saturday', revenue: '$2,700', expenses: '$1,800', profit: '$900', margin: '33.3%' },
        { period: 'Sunday', revenue: '$1,800', expenses: '$1,200', profit: '$600', margin: '33.3%' }
      ] : dateRange === 'month' ? [
        { period: 'Week 1', revenue: '$21,000', expenses: '$13,500', profit: '$7,500', margin: '35.7%' },
        { period: 'Week 2', revenue: '$24,500', expenses: '$16,000', profit: '$8,500', margin: '34.7%' },
        { period: 'Week 3', revenue: '$23,000', expenses: '$15,000', profit: '$8,000', margin: '34.8%' },
        { period: 'Week 4', revenue: '$22,500', expenses: '$14,500', profit: '$8,000', margin: '35.6%' }
      ] : [
        { period: 'January', revenue: '$85,000', expenses: '$56,000', profit: '$29,000', margin: '34.1%' },
        { period: 'February', revenue: '$95,000', expenses: '$63,000', profit: '$32,000', margin: '33.7%' },
        { period: 'March', revenue: '$105,000', expenses: '$70,000', profit: '$35,000', margin: '33.3%' },
        { period: 'April', revenue: '$95,000', expenses: '$63,000', profit: '$32,000', margin: '33.7%' },
        { period: 'May', revenue: '$97,000', expenses: '$64,000', profit: '$33,000', margin: '34.0%' },
        { period: 'June', revenue: '$98,000', expenses: '$65,000', profit: '$33,000', margin: '33.7%' }
      ],
      insights: [
        "Profit margins have remained stable at around 34% throughout the period.",
        "Fuel costs have increased by 3.5% compared to the previous period.",
        "Revenue per delivery is highest for express deliveries ($42.50) compared to standard deliveries ($28.75).",
        "Administrative costs have decreased by 5.2% due to recent process improvements."
      ]
    };
    
    return data;
  };

  // Get driver performance mock data
  const getDriverPerformanceData = () => {
    const data = {
      title: 'Driver Performance Report',
      description: 'Analysis of driver metrics, ratings, and efficiency.',
      date: new Date().toLocaleDateString(),
      summary: {
        totalDeliveries: 1758,
        avgRating: '4.5',
        topDriver: 'Jane Smith',
        avgTimePerDelivery: '40 mins'
      },
      charts: {
        main: {
          labels: ['John D.', 'Jane S.', 'Mike T.', 'Sarah W.', 'Bob J.'],
          datasets: [
            {
              label: 'Deliveries Completed',
              data: [148, 155, 89, 112, 78],
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
            },
            {
              label: 'Customer Rating (x10)',
              data: [48, 49, 45, 46, 37],
              backgroundColor: 'rgba(255, 206, 86, 0.6)',
              borderColor: 'rgba(255, 206, 86, 1)',
            }
          ]
        },
        secondary: {
          labels: ['On-Time', 'Customer Rating', 'Route Efficiency', 'Fuel Efficiency', 'Cost Per Delivery'],
          datasets: [
            {
              label: 'Jane Smith',
              data: [98, 96, 94, 90, 92],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: true
            },
            {
              label: 'John Doe',
              data: [95, 92, 90, 88, 89],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              fill: true
            }
          ]
        }
      },
      tableData: [
        { driver: 'Jane Smith', deliveries: 155, rating: '4.9', onTimeRate: '97.4%', efficiency: '94.2%' },
        { driver: 'John Doe', deliveries: 148, rating: '4.8', onTimeRate: '95.9%', efficiency: '92.8%' },
        { driver: 'Sarah Williams', deliveries: 112, rating: '4.6', onTimeRate: '96.1%', efficiency: '90.5%' },
        { driver: 'Mike Turner', deliveries: 89, rating: '4.5', onTimeRate: '94.3%', efficiency: '89.7%' },
        { driver: 'Bob Johnson', deliveries: 78, rating: '3.7', onTimeRate: '88.5%', efficiency: '82.3%' }
      ],
      insights: [
        "Jane Smith demonstrates the highest overall performance with excellent customer ratings (4.9/5) and on-time delivery rate (97.4%).",
        "Bob Johnson has the lowest performance metrics and may benefit from additional training and support.",
        "On-time delivery rates are strongly correlated with customer satisfaction ratings (r=0.92).",
        "Drivers who follow optimized routes have 15% better fuel efficiency than those who deviate from suggested routes."
      ]
    };
    
    return data;
  };

  // Get customer analysis mock data
  const getCustomerAnalysisData = () => {
    const dateLabels = {
      week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      quarter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      custom: ['Period 1', 'Period 2', 'Period 3', 'Period 4']
    };
    
    const data = {
      title: 'Customer Analysis Report',
      description: 'Analysis of customer behavior, retention, and demographics.',
      date: new Date().toLocaleDateString(),
      summary: {
        totalCustomers: 647,
        newCustomers: 85,
        returnRate: '86.9%',
        avgOrderValue: '$183'
      },
      charts: {
        main: {
          labels: ['New', 'Returning', '30+ Orders', '10+ Orders', 'First-Time'],
          datasets: [
            {
              label: 'Customer Segments',
              data: [85, 245, 125, 107, 85],
              backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)'
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)'
              ],
            }
          ]
        },
        secondary: {
          labels: dateLabels[dateRange],
          datasets: [
            {
              label: 'Customer Satisfaction',
              data: dateRange === 'week' 
                ? [4.6, 4.7, 4.5, 4.6, 4.8, 4.7, 4.6] 
                : dateRange === 'month' 
                ? [4.6, 4.7, 4.6, 4.7] 
                : [4.5, 4.6, 4.7, 4.6, 4.7, 4.8],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              tension: 0.4
            }
          ]
        }
      },
      tableData: [
        { segment: 'New Customers', count: 85, percentage: '13.1%', avgOrderValue: '$132', satisfaction: '4.3' },
        { segment: 'Returning Customers', count: 245, percentage: '37.9%', avgOrderValue: '$178', satisfaction: '4.7' },
        { segment: '30+ Orders', count: 125, percentage: '19.3%', avgOrderValue: '$215', satisfaction: '4.9' },
        { segment: '10+ Orders', count: 107, percentage: '16.5%', avgOrderValue: '$195', satisfaction: '4.8' },
        { segment: 'First-Time', count: 85, percentage: '13.1%', avgOrderValue: '$132', satisfaction: '4.3' }
      ],
      insights: [
        "Returning customers (3+ orders) have a 31.8% higher average order value than new customers.",
        "Customer satisfaction ratings increase with the number of completed orders.",
        "Highest customer retention rates are in the Central Zone (92.4%) and lowest in the East Zone (81.2%).",
        "Business customers have a 40% higher average order value compared to individual customers."
      ]
    };
    
    return data;
  };

  // Get route optimization mock data
  const getRouteOptimizationData = () => {
    const data = {
      title: 'Route Optimization Report',
      description: 'Analysis of delivery routes, time efficiency, and fuel usage.',
      date: new Date().toLocaleDateString(),
      summary: {
        avgRouteEfficiency: '88.7%',
        fuelSavings: '15.3%',
        timeReduction: '22.5%',
        avgStopsPerRoute: '8.4'
      },
      charts: {
        main: {
          labels: ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'],
          datasets: [
            {
              label: 'Route Efficiency',
              data: [92, 87, 85, 89, 93],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
            },
            {
              label: 'Fuel Efficiency',
              data: [90, 86, 82, 87, 91],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
            }
          ]
        },
        secondary: {
          labels: ['1-3 Stops', '4-6 Stops', '7-10 Stops', '11-15 Stops', '16+ Stops'],
          datasets: [
            {
              data: [15, 25, 35, 20, 5],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(153, 102, 255, 0.6)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)'
              ],
            }
          ]
        }
      },
      tableData: [
        { region: 'North Zone', efficiency: '92%', fuelUsage: '8.2 mpg', avgTime: '35 min', costPerMile: '$0.42' },
        { region: 'South Zone', efficiency: '87%', fuelUsage: '7.8 mpg', avgTime: '42 min', costPerMile: '$0.48' },
        { region: 'East Zone', efficiency: '85%', fuelUsage: '7.5 mpg', avgTime: '44 min', costPerMile: '$0.51' },
        { region: 'West Zone', efficiency: '89%', fuelUsage: '8.0 mpg', avgTime: '38 min', costPerMile: '$0.45' },
        { region: 'Central Zone', efficiency: '93%', fuelUsage: '8.5 mpg', avgTime: '32 min', costPerMile: '$0.40' }
      ],
      insights: [
        "Optimized routes have reduced average delivery times by 22.5% compared to previous routing methods.",
        "Central Zone has the highest route efficiency (93%) due to denser delivery clusters.",
        "Each additional stop on a route increases average delivery time by approximately 12 minutes.",
        "Implementing dynamic routing has reduced fuel consumption by 15.3% compared to fixed routes."
      ]
    };
    
    return data;
  };

  // Get delivery issues mock data
  const getDeliveryIssuesData = () => {
    const dateLabels = {
      week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      quarter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      custom: ['Period 1', 'Period 2', 'Period 3', 'Period 4']
    };
    
    const data = {
      title: 'Delivery Issues Analysis',
      description: 'Detailed breakdown of delivery problems, delays, and resolutions.',
      date: new Date().toLocaleDateString(),
      summary: {
        totalIssues: 87,
        issueRate: '3.2%',
        avgResolutionTime: '2.4 hours',
        customerImpact: 'Minimal'
      },
      charts: {
        main: {
          labels: ['Traffic Delays', 'Weather', 'Vehicle Issues', 'Address Problems', 'Package Damage', 'Other'],
          datasets: [
            {
              data: [42, 18, 15, 12, 8, 5],
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
            }
          ]
        },
        secondary: {
          labels: dateLabels[dateRange],
          datasets: [
            {
              label: 'Issue Count',
              data: dateRange === 'week' 
                ? [15, 12, 14, 18, 10, 8, 10] 
                : dateRange === 'month' 
                ? [42, 38, 45, 35] 
                : [28, 32, 27, 24, 29, 30],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              tension: 0.4
            }
          ]
        }
      },
      tableData: [
        { issueType: 'Traffic Delays', count: 42, percentage: '48.3%', avgImpact: '52 min delay', resolution: 'Route replanning' },
        { issueType: 'Weather Conditions', count: 18, percentage: '20.7%', avgImpact: '78 min delay', resolution: 'Customer notification' },
        { issueType: 'Vehicle Problems', count: 15, percentage: '17.2%', avgImpact: '105 min delay', resolution: 'Vehicle replacement' },
        { issueType: 'Address Issues', count: 12, percentage: '13.8%', avgImpact: '35 min delay', resolution: 'Customer contact' },
        { issueType: 'Package Damage', count: 8, percentage: '9.2%', avgImpact: 'Redelivery', resolution: 'Replacement' },
        { issueType: 'Other Issues', count: 5, percentage: '5.7%', avgImpact: 'Various', resolution: 'Case-by-case' }
      ],
      insights: [
        "Traffic delays account for nearly half (48.3%) of all delivery issues, with highest impact during rush hours (4-6 PM).",
        "Weather-related issues increase by 320% during rainy or snowy conditions.",
        "Average resolution time for delivery issues has improved by 18% compared to the previous period.",
        "Implementing proactive customer notifications for delays has improved satisfaction ratings by 1.2 points for affected deliveries."
      ]
    };
    
    return data;
  };

  // Save current report
  const handleSaveReport = () => {
    if (!reportName.trim()) return;
    
    // In a real app, this would be an API call
    const newReport = {
      id: savedReports.length + 1,
      name: reportName,
      type: reportType,
      date: new Date().toISOString().split('T')[0],
      createdBy: 'Admin User'
    };
    
    setSavedReports([...savedReports, newReport]);
    setShowSaveModal(false);
    setReportName('');
  };

  // Schedule a report
  const handleScheduleReport = () => {
    if (!scheduleConfig.name.trim() || !scheduleConfig.recipients.trim()) return;
    
    // In a real app, this would be an API call
    const newSchedule = {
      id: scheduledReports.length + 1,
      name: scheduleConfig.name,
      type: reportType,
      frequency: `${scheduleConfig.frequency === 'daily' ? 'Daily' :
                 scheduleConfig.frequency === 'weekly' ? `Weekly (${scheduleConfig.day.charAt(0).toUpperCase() + scheduleConfig.day.slice(1)})` :
                 scheduleConfig.frequency === 'monthly' ? 'Monthly' : 'Custom'}`,
      recipients: scheduleConfig.recipients,
      lastRun: 'Not yet run',
      status: 'active'
    };
    
    setScheduledReports([...scheduledReports, newSchedule]);
    setShowScheduleModal(false);
    setScheduleConfig({
      name: '',
      frequency: 'weekly',
      day: 'monday',
      time: '09:00',
      recipients: '',
      format: 'pdf'
    });
  };

  // Delete a saved report
  const handleDeleteSavedReport = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setSavedReports(savedReports.filter(report => report.id !== id));
    }
  };

  // Delete a scheduled report
  const handleDeleteScheduledReport = (id) => {
    if (window.confirm('Are you sure you want to delete this scheduled report?')) {
      setScheduledReports(scheduledReports.filter(report => report.id !== id));
    }
  };

  // Export report to various formats
  const handleExport = (format) => {
    // In a real app, this would trigger an export process
    alert(`Exporting report as ${format.toUpperCase()}`);
  };

  // Render different chart types
  const renderChart = (chartData, chartOptions) => {
    if (!chartData) return null;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      ...chartOptions
    };
    
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={options} ref={chartRef} />;
      case 'line':
        return <Line data={chartData} options={options} ref={chartRef} />;
      case 'pie':
        return <Pie data={chartData} options={options} ref={chartRef} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} ref={chartRef} />;
      default:
        return <Bar data={chartData} options={options} ref={chartRef} />;
    }
  };

  // Get report type display name
  const getReportTypeDisplayName = (type) => {
    const reportTypes = {
      deliveryPerformance: 'Delivery Performance',
      financialSummary: 'Financial Summary',
      driverPerformance: 'Driver Performance',
      customerAnalysis: 'Customer Analysis',
      routeOptimization: 'Route Optimization',
      deliveryIssues: 'Delivery Issues Analysis'
    };
    
    return reportTypes[type] || type;
  };

  // Helper function to render KPI card
  const renderKpiCard = (title, value) => {
    return (
      <Card className="border h-100">
        <Card.Body className="p-3">
          <div className="text-muted mb-1">{title}</div>
          <h3 className="mb-0">{value}</h3>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Reports</h1>
      
      <Tab.Container activeKey={activeReportTab} onSelect={(k) => setActiveReportTab(k)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="generator">
              <FaChartLine className="me-1" /> Report Generator
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="saved">
              <FaFileExport className="me-1" /> Saved Reports
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="scheduled">
              <FaCalendarAlt className="me-1" /> Scheduled Reports
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          {/* Report Generator Tab */}
          <Tab.Pane eventKey="generator">
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-3">Generate Report</h5>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Report Type</Form.Label>
                      <Form.Select 
                        value={reportType}
                        onChange={(e) => {
                          setReportType(e.target.value);
                          setShowReport(false);
                        }}
                      >
                        <option value="deliveryPerformance">Delivery Performance</option>
                        <option value="financialSummary">Financial Summary</option>
                        <option value="driverPerformance">Driver Performance</option>
                        <option value="customerAnalysis">Customer Analysis</option>
                        <option value="routeOptimization">Route Optimization</option>
                        <option value="deliveryIssues">Delivery Issues Analysis</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date Range</Form.Label>
                      <Form.Select 
                        value={dateRange}
                        onChange={(e) => {
                          setDateRange(e.target.value);
                          setShowReport(false);
                        }}
                      >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="quarter">Last 90 Days</option>
                        <option value="year">Last 12 Months</option>
                        <option value="custom">Custom Range</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Chart Type</Form.Label>
                      <Form.Select 
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                      >
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="pie">Pie Chart</option>
                        <option value="doughnut">Doughnut Chart</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={2} className="d-flex align-items-end">
                    <Button 
                      variant="primary" 
                      className="w-100 mb-3"
                      onClick={generateReport}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Generating...
                        </>
                      ) : (
                        'Generate Report'
                      )}
                    </Button>
                  </Col>
                </Row>
                
                {dateRange === 'custom' && (
                  <Row className="mt-2">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control 
                          type="date" 
                          value={customDateRange.start}
                          onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control 
                          type="date" 
                          value={customDateRange.end}
                          onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}
                
                <Row className="mt-2">
                  <Col md={12}>
                    <Form.Check 
                      type="checkbox"
                      id="compare-previous"
                      label="Compare with previous period"
                      checked={compareWithPrevious}
                      onChange={(e) => setCompareWithPrevious(e.target.checked)}
                      className="mb-3"
                    />
                  </Col>
                </Row>
                
                <div className="mt-2">
                  <Button 
                    variant="link" 
                    className="text-decoration-none p-0" 
                    onClick={() => document.getElementById('advanced-filters').classList.toggle('d-none')}
                  >
                    <FaFilter className="me-1" /> Advanced Filters
                  </Button>
                  
                  <div id="advanced-filters" className="d-none mt-3">
                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Region</Form.Label>
                          <Form.Select
                            value={selectedFilters.region}
                            onChange={(e) => setSelectedFilters({...selectedFilters, region: e.target.value})}
                          >
                            {filterOptions.regions.map((region, idx) => (
                              <option key={idx} value={region}>{region}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Driver</Form.Label>
                          <Form.Select
                            value={selectedFilters.driver}
                            onChange={(e) => setSelectedFilters({...selectedFilters, driver: e.target.value})}
                          >
                            {filterOptions.drivers.map((driver, idx) => (
                              <option key={idx} value={driver}>{driver}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Customer</Form.Label>
                          <Form.Select
                            value={selectedFilters.customer}
                            onChange={(e) => setSelectedFilters({...selectedFilters, customer: e.target.value})}
                          >
                            {filterOptions.customers.map((customer, idx) => (
                              <option key={idx} value={customer}>{customer}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            value={selectedFilters.status}
                            onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
                          >
                            {filterOptions.status.map((status, idx) => (
                              <option key={idx} value={status}>{status}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            {showReport && reportData && (
              <>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h4 className="mb-1">{reportData.title}</h4>
                        <p className="text-muted mb-0">{reportData.description}</p>
                      </div>
                      <div className="d-flex">
                        <Dropdown className="me-2">
                          <Dropdown.Toggle variant="outline-secondary" id="dropdown-export">
                            <FaDownload className="me-1" /> Export
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleExport('pdf')}>
                              <FaFilePdf className="me-2" /> PDF
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleExport('csv')}>
                              <FaTable className="me-2" /> CSV
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleExport('excel')}>
                              <FaFileExcel className="me-2" /> Excel
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Button variant="outline-secondary" className="me-2" onClick={() => setShowSaveModal(true)}>
                          <FaSave className="me-1" /> Save
                        </Button>
                        <Button variant="outline-primary" onClick={() => setShowScheduleModal(true)}>
                          <FaCalendarAlt className="me-1" /> Schedule
                        </Button>
                      </div>
                    </div>
                    
                    {/* Summary Cards */}
                    <Row className="mb-4">
                      {Object.entries(reportData.summary).map(([key, value], idx) => (
                        <Col md={3} key={idx}>
                          {renderKpiCard(
                            key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, str => str.toUpperCase())
                              .replace(/([a-z])([A-Z])/g, '$1 $2'),
                            value
                          )}
                        </Col>
                      ))}
                    </Row>
                    
                    {/* Main Chart */}
                    <Row className="mb-4">
                      <Col md={8}>
                        <Card className="border">
                          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                              {reportType === 'deliveryPerformance' ? 'Delivery Performance Trend' :
                               reportType === 'financialSummary' ? 'Revenue vs. Expenses' :
                               reportType === 'driverPerformance' ? 'Driver Performance Comparison' :
                               reportType === 'customerAnalysis' ? 'Customer Segments' :
                               reportType === 'routeOptimization' ? 'Route Efficiency by Region' :
                               'Issue Types Distribution'}
                            </h5>
                            <div>
                              <Button 
                                variant={chartType === 'bar' ? 'primary' : 'outline-secondary'} 
                                size="sm" 
                                className="me-1"
                                onClick={() => setChartType('bar')}
                              >
                                <FaChartBar />
                              </Button>
                              <Button 
                                variant={chartType === 'line' ? 'primary' : 'outline-secondary'} 
                                size="sm" 
                                className="me-1"
                                onClick={() => setChartType('line')}
                              >
                                <FaChartLine />
                              </Button>
                              <Button 
                                variant={chartType === 'pie' || chartType === 'doughnut' ? 'primary' : 'outline-secondary'} 
                                size="sm"
                                onClick={() => setChartType('doughnut')}
                              >
                                <FaChartPie />
                              </Button>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <div style={{ height: '400px' }}>
                              {renderChart(reportData.charts.main)}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="border h-100">
                          <Card.Header className="bg-white">
                            <h5 className="mb-0">
                              {reportType === 'deliveryPerformance' ? 'Delivery Time Distribution' :
                               reportType === 'financialSummary' ? 'Expense Breakdown' :
                               reportType === 'driverPerformance' ? 'Performance Radar' :
                               reportType === 'customerAnalysis' ? 'Satisfaction Trend' :
                               reportType === 'routeOptimization' ? 'Stops per Route' :
                               'Issues Over Time'}
                            </h5>
                          </Card.Header>
                          <Card.Body>
                            <div style={{ height: '400px' }}>
                              {renderChart(reportData.charts.secondary, { 
                                plugins: { 
                                  legend: { 
                                    position: reportType === 'driverPerformance' ? 'right' : 'bottom' 
                                  } 
                                } 
                              })}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    
                    {/* Data Table */}
                    <Card className="border mb-4">
                      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Detailed Data</h5>
                        <Button variant="outline-secondary" size="sm" onClick={() => handleExport('csv')}>
                          <FaTable className="me-1" /> Export Data
                        </Button>
                      </Card.Header>
                      <Card.Body>
                        <Table responsive hover>
                          <thead className="bg-light">
                            <tr>
                              {reportData.tableData.length > 0 && Object.keys(reportData.tableData[0]).map((header, idx) => (
                                <th key={idx}>{
                                  header
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, str => str.toUpperCase())
                                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                                }</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.tableData.map((row, rowIdx) => (
                              <tr key={rowIdx}>
                                {Object.values(row).map((cell, cellIdx) => (
                                  <td key={cellIdx}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                    
                    {/* Key Insights */}
                    <Card className="border">
                      <Card.Header className="bg-white">
                        <h5 className="mb-0">Key Insights</h5>
                      </Card.Header>
                      <Card.Body>
                        <ListGroup variant="flush">
                          {reportData.insights.map((insight, idx) => (
                            <ListGroup.Item key={idx} className="d-flex align-items-start">
                              <FaInfoCircle className="me-2 mt-1 text-primary" />
                              <div>{insight}</div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Card.Body>
                </Card>
              </>
            )}
          </Tab.Pane>
          
          {/* Saved Reports Tab */}
          <Tab.Pane eventKey="saved">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Saved Reports</h5>
              </Card.Header>
              <Card.Body>
                {savedReports.length > 0 ? (
                  <Table hover responsive>
                    <thead className="bg-light">
                      <tr>
                        <th>Report Name</th>
                        <th>Type</th>
                        <th>Created On</th>
                        <th>Created By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedReports.map(report => (
                        <tr key={report.id}>
                          <td>{report.name}</td>
                          <td>{getReportTypeDisplayName(report.type)}</td>
                          <td>{report.date}</td>
                          <td>{report.createdBy}</td>
                          <td>
                            <Button variant="link" size="sm" className="p-0 me-2">View</Button>
                            <Button variant="link" size="sm" className="p-0 me-2">
                              <FaDownload className="me-1" /> Download
                            </Button>
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 text-danger"
                              onClick={() => handleDeleteSavedReport(report.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    No saved reports found. Generate and save reports from the Report Generator tab.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>
          
          {/* Scheduled Reports Tab */}
          <Tab.Pane eventKey="scheduled">
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Scheduled Reports</h5>
              </Card.Header>
              <Card.Body>
                {scheduledReports.length > 0 ? (
                  <Table hover responsive>
                    <thead className="bg-light">
                      <tr>
                        <th>Report Name</th>
                        <th>Type</th>
                        <th>Frequency</th>
                        <th>Recipients</th>
                        <th>Last Run</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledReports.map(report => (
                        <tr key={report.id}>
                          <td>{report.name}</td>
                          <td>{getReportTypeDisplayName(report.type)}</td>
                          <td>{report.frequency}</td>
                          <td>{report.recipients}</td>
                          <td>{report.lastRun}</td>
                          <td>
                            <Badge bg={report.status === 'active' ? 'success' : 'secondary'}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="link" size="sm" className="p-0 me-2">Edit</Button>
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-0 text-danger"
                              onClick={() => handleDeleteScheduledReport(report.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    No scheduled reports found. Create scheduled reports from the Report Generator tab.
                  </Alert>
                )}
                
                <Button variant="outline-primary" size="sm" onClick={() => setShowScheduleModal(true)}>
                  + Schedule New Report
                </Button>
              </Card.Body>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Report Delivery Settings</h5>
              </Card.Header>
              <Card.Body>
              <Form>
                 <Form.Group className="mb-3">
                   <Form.Label>Default Recipients</Form.Label>
                   <Form.Control
                     type="text"
                     placeholder="Enter email addresses separated by commas"
                     value={defaultRecipients}
                     onChange={(e) => setDefaultRecipients(e.target.value)}
                   />
                   <Form.Text className="text-muted">
                     These recipients will be added by default to all scheduled reports.
                   </Form.Text>
                 </Form.Group>
                 
                 {/* New Email Field */}
                 <Form.Group className="mb-3">
                   <Form.Label>Add Recipient</Form.Label>
                   <Row>
                     <Col md={8}>
                       <Form.Control
                         type="email"
                         placeholder="Enter email address"
                         value={newEmail}
                         onChange={(e) => setNewEmail(e.target.value)}
                       />
                     </Col>
                     <Col md={4}>
                       <Button 
                         variant="outline-primary" 
                         className="w-100"
                         onClick={handleAddEmail}
                         disabled={!newEmail || !isValidEmail(newEmail)}
                       >
                         Add Recipient
                       </Button>
                     </Col>
                   </Row>
                   <Form.Text className="text-muted">
                     Add a new email recipient to the default list.
                   </Form.Text>
                 </Form.Group>
                 
                 <Form.Group className="mb-3">
                   <Form.Label>Default Report Format</Form.Label>
                   <Form.Select defaultValue="pdf">
                     <option value="pdf">PDF</option>
                     <option value="excel">Excel</option>
                     <option value="csv">CSV</option>
                   </Form.Select>
                 </Form.Group>
                 
                 <Button variant="primary">Save Settings</Button>
               </Form>
             </Card.Body>
           </Card>
         </Tab.Pane>
       </Tab.Content>
     </Tab.Container>
     
     {/* Save Report Modal */}
     <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
       <Modal.Header closeButton>
         <Modal.Title>Save Report</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <Form>
           <Form.Group className="mb-3">
             <Form.Label>Report Name</Form.Label>
             <Form.Control
               type="text"
               placeholder="Enter a name for this report"
               value={reportName}
               onChange={(e) => setReportName(e.target.value)}
               autoFocus
             />
           </Form.Group>
           <Form.Group className="mb-3">
             <Form.Label>Report Type</Form.Label>
             <Form.Control
               type="text"
               value={getReportTypeDisplayName(reportType)}
               disabled
             />
           </Form.Group>
         </Form>
       </Modal.Body>
       <Modal.Footer>
         <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
           Cancel
         </Button>
         <Button 
           variant="primary" 
           onClick={handleSaveReport}
           disabled={!reportName.trim()}
         >
           Save Report
         </Button>
       </Modal.Footer>
     </Modal>
     
     {/* Schedule Report Modal */}
     <Modal 
       show={showScheduleModal} 
       onHide={() => setShowScheduleModal(false)}
       size="lg"
     >
       <Modal.Header closeButton>
         <Modal.Title>Schedule Report</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <Form>
           <Row>
             <Col md={6}>
               <Form.Group className="mb-3">
                 <Form.Label>Report Name</Form.Label>
                 <Form.Control
                   type="text"
                   placeholder="Enter a name for this scheduled report"
                   value={scheduleConfig.name}
                   onChange={(e) => setScheduleConfig({...scheduleConfig, name: e.target.value})}
                   autoFocus
                 />
               </Form.Group>
             </Col>
             <Col md={6}>
               <Form.Group className="mb-3">
                 <Form.Label>Report Type</Form.Label>
                 <Form.Control
                   type="text"
                   value={getReportTypeDisplayName(reportType)}
                   disabled
                 />
               </Form.Group>
             </Col>
           </Row>
           
           <Row>
             <Col md={4}>
               <Form.Group className="mb-3">
                 <Form.Label>Frequency</Form.Label>
                 <Form.Select
                   value={scheduleConfig.frequency}
                   onChange={(e) => setScheduleConfig({...scheduleConfig, frequency: e.target.value})}
                 >
                   <option value="daily">Daily</option>
                   <option value="weekly">Weekly</option>
                   <option value="monthly">Monthly</option>
                   <option value="custom">Custom</option>
                 </Form.Select>
               </Form.Group>
             </Col>
             
             {scheduleConfig.frequency === 'weekly' && (
               <Col md={4}>
                 <Form.Group className="mb-3">
                   <Form.Label>Day</Form.Label>
                   <Form.Select
                     value={scheduleConfig.day}
                     onChange={(e) => setScheduleConfig({...scheduleConfig, day: e.target.value})}
                   >
                     <option value="monday">Monday</option>
                     <option value="tuesday">Tuesday</option>
                     <option value="wednesday">Wednesday</option>
                     <option value="thursday">Thursday</option>
                     <option value="friday">Friday</option>
                     <option value="saturday">Saturday</option>
                     <option value="sunday">Sunday</option>
                   </Form.Select>
                 </Form.Group>
               </Col>
             )}
             
             {scheduleConfig.frequency === 'monthly' && (
               <Col md={4}>
                 <Form.Group className="mb-3">
                   <Form.Label>Day of Month</Form.Label>
                   <Form.Select
                     value={scheduleConfig.day}
                     onChange={(e) => setScheduleConfig({...scheduleConfig, day: e.target.value})}
                   >
                     {[...Array(31)].map((_, idx) => (
                       <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                     ))}
                     <option value="last">Last Day</option>
                   </Form.Select>
                 </Form.Group>
               </Col>
             )}
             
             <Col md={4}>
               <Form.Group className="mb-3">
                 <Form.Label>Time</Form.Label>
                 <Form.Control
                   type="time"
                   value={scheduleConfig.time}
                   onChange={(e) => setScheduleConfig({...scheduleConfig, time: e.target.value})}
                 />
               </Form.Group>
             </Col>
           </Row>
           
           <Form.Group className="mb-3">
             <Form.Label>Recipients</Form.Label>
             <Form.Control
               type="text"
               placeholder="Enter email addresses separated by commas"
               value={scheduleConfig.recipients}
               onChange={(e) => setScheduleConfig({...scheduleConfig, recipients: e.target.value})}
             />
             <Form.Text className="text-muted">
               Enter the email addresses of users who should receive this report.
             </Form.Text>
           </Form.Group>
           
           <Form.Group className="mb-3">
             <Form.Label>Format</Form.Label>
             <Form.Select
               value={scheduleConfig.format}
               onChange={(e) => setScheduleConfig({...scheduleConfig, format: e.target.value})}
             >
               <option value="pdf">PDF</option>
               <option value="excel">Excel</option>
               <option value="csv">CSV</option>
             </Form.Select>
           </Form.Group>
         </Form>
       </Modal.Body>
       <Modal.Footer>
         <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
           Cancel
         </Button>
         <Button 
           variant="primary" 
           onClick={handleScheduleReport}
           disabled={!scheduleConfig.name.trim() || !scheduleConfig.recipients.trim()}
         >
           Schedule Report
         </Button>
       </Modal.Footer>
     </Modal>
   </Container>
 );
};

export default ReportingDashboard;