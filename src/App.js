// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Dashboard from './components/layout/Dashboard';
import DashboardHome from './components/dashboard/DashboardHome';
import PrivateRoute from './components/common/PrivateRoute';
import { isLoggedIn } from './services/authService';

// Leads Components
import LeadList from './components/leads/LeadList';
import LeadDetail from './components/leads/LeadDetail';
import LeadForm from './components/leads/LeadForm';
import LeadScriptNavigator from './components/leads/LeadScriptNavigator';
import LeadGenerator from './components/leadGenerator/LeadGenerator';

// Task Components
import TaskList from './components/tasks/TasksList';
import TaskDetail from './components/tasks/TaskDetail';
import TaskForm from './components/tasks/TaskForm';
import TasksKanban from './components/tasks/TasksKanban';
import TaskCalendar from './components/tasks/TaskCalendar';

// Contact Components
import ContactList from './components/contacts/ContactList';
import ContactDetail from './components/contacts/ContactDetail';
import ContactForm from './components/contacts/ContactForm';
import ContactImport from './components/contacts/ContactImport';

// Company Components
import CompanyList from './components/companies/CompanyList';
import CompanyDetail from './components/companies/CompanyDetail';
import CompanyForm from './components/companies/CompanyForm';
import CompanyImport from './components/companies/CompanyImport';

// Deliveries Components
import DeliveryList from './components/deliveries/DeliveryList';
import DeliveryDetail from './components/deliveries/DeliveryDetail';
import DeliveryForm from './components/deliveries/DeliveryForm';    
import DeliveryTracking from './components/deliveries/DeliveryTracking';

// Financial Dashboard Components
import FinancialDashboard from './components/financial/FinancialDashboard';
import TransactionList from './components/financial/TransactionList';
import TransactionForm from './components/financial/TransactionForm';
import FinancialReports from './components/financial/FinancialReports';
import BudgetPlanner from './components/financial/BudgetPlanner';
import InvoiceList from './components/financial/InvoiceList';
import InvoiceForm from './components/financial/InvoiceForm';
import ExpenseList from './components/financial/ExpenseList';
import AccountsList from './components/financial/AccountsList';
import ExpenseForm from './components/financial/ExpenseForm';
import AccountTransactionHistory from './components/financial/AccountTransactionHistory';

// Drivers Components
import DriversList from './components/drivers/DriversList';
import DriverDetail from './components/drivers/DriverDetail';
import DriverForm from './components/drivers/DriverForm';
import DriverSchedule from './components/drivers/DriverSchedule';
import DriverImport from './components/drivers/DriverImport';

// Routes Components
import RouteDetail from './components/routes/RouteDetail';
import RouteForm from './components/routes/RouteForm';
import RoutesList from './components/routes/RoutesList';


// Other Components
import PerformanceDashboard from './components/performance/PerformanceDashboard';
import ReportingDashboard from './components/reporting/ReportingDashboard';
import Settings from './components/settings/Settings';
import setupTokenPersistence from './services/setupTokenPersistence';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  // Global auth check for debugging
  useEffect(() => {
    // Cache tokens in session storage as backup
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const appAuth = localStorage.getItem('app:auth');
    
    if (token) sessionStorage.setItem('backup_token', token);
    if (user) sessionStorage.setItem('backup_user', user);
    if (appAuth) sessionStorage.setItem('backup_appAuth', appAuth);
    
    // Set up a listener to restore from backup if tokens are cleared
    const checkAndRestoreFromBackup = () => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        const backupToken = sessionStorage.getItem('backup_token');
        const backupUser = sessionStorage.getItem('backup_user');
        const backupAppAuth = sessionStorage.getItem('backup_appAuth');
        
        if (backupToken) localStorage.setItem('token', backupToken);
        if (backupUser) localStorage.setItem('user', backupUser);
        if (backupAppAuth) localStorage.setItem('app:auth', backupAppAuth);
        
        console.log('Restored auth from backup cache');
      }
    };
    
    // Run this check periodically
    const intervalId = setInterval(checkAndRestoreFromBackup, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Set up token persistence
  setupTokenPersistence();
  
  // Root path handler component to ensure login first
  const RootPathHandler = () => {
    const authenticated = isLoggedIn();
    return authenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Root path handler */}
          <Route path="/" element={<RootPathHandler />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />
              
              {/* Lead Routes */}
              <Route path="leads" element={<LeadList />} />
              <Route path="leads/new" element={<LeadForm />} />
              <Route path="leads/:id" element={<LeadDetail />} />
              <Route path="leads/:id/edit" element={<LeadForm />} />
              <Route path="leads/script" element={
                <div className="container-fluid py-4">
                  <h1 className="mb-4">Lead Script Navigator</h1>
                  <LeadScriptNavigator />
                </div>
              } />
              <Route path="lead-generator" element={<LeadGenerator />} />
              
              {/* Task Routes */}
              <Route path="tasks" element={<TaskList />} />
              <Route path="tasks/new" element={<TaskForm />} />
              <Route path="tasks/:id" element={<TaskDetail />} />
              <Route path="tasks/:id/edit" element={<TaskForm />} />
              <Route path="tasks/kanban" element={<TasksKanban />} />
              <Route path="tasks/calendar" element={<TaskCalendar />} />

              {/* Contact Routes */}
              <Route path="contacts" element={<ContactList />} />
              <Route path="contacts/new" element={<ContactForm />} />
              <Route path="contacts/:id" element={<ContactDetail />} />
              <Route path="contacts/:id/edit" element={<ContactForm />} />
              <Route path="contacts/import" element={<ContactImport />} />
              
              {/* Company Routes */}
              <Route path="companies" element={<CompanyList />} />
              <Route path="companies/new" element={<CompanyForm />} />
              <Route path="companies/:id" element={<CompanyDetail />} />
              <Route path="companies/:id/edit" element={<CompanyForm />} />
              <Route path="companies/import" element={<CompanyImport />} />
              
              {/* Financial Dashboard */}
              <Route path="financial" element={<FinancialDashboard />} />
              <Route path="financial/transactions" element={<TransactionList />} />
              <Route path="financial/transactions/new" element={<TransactionForm />} />
              <Route path="financial/transactions/:id" element={<TransactionForm />} />
              <Route path="financial/transactions/:id/edit" element={<TransactionForm />} />
              <Route path="financial/budget" element={<BudgetPlanner />} />
              <Route path="financial/reports" element={<FinancialReports />} />
              <Route path="financial/invoices" element={<InvoiceList />} />
              <Route path="financial/invoices/new" element={<InvoiceForm />} />
              <Route path="financial/invoices/:id" element={<InvoiceForm />} />
              <Route path="financial/invoices/:id/edit" element={<InvoiceForm />} />
              <Route path="financial/expenses" element={<ExpenseList />} />
              <Route path="financial/accounts" element={<AccountsList />} />
              <Route path="financial/expenses/new" element={<ExpenseForm />} />
              <Route path="financial/expenses/:id/edit" element={<ExpenseForm />} />
              <Route path="financial/accounts/:id/transactions" element={<AccountTransactionHistory />} />  
                            
              {/* Drivers */}
              <Route path="drivers" element={<DriversList />} />
              <Route path="drivers/new" element={<DriverForm />} />
              <Route path="drivers/:id" element={<DriverDetail />} />
              <Route path="drivers/:id/edit" element={<DriverForm />} />
              <Route path="drivers/:id/schedule" element={<DriverSchedule />} />
              <Route path="drivers/import" element={<DriverImport />} />

              {/* Routes for Routes */}
<Route path="routes" element={<RoutesList />} />
<Route path="routes/new" element={<RouteForm />} />
<Route path="routes/:id" element={<RouteDetail />} />
<Route path="routes/:id/edit" element={<RouteForm />} />
              
              {/* Performance */}
              <Route path="performance" element={<PerformanceDashboard />} />
              
              {/* Reporting */}
              <Route path="reporting" element={<ReportingDashboard />} />
              
              {/* Settings */}
              <Route path="settings" element={<Settings />} />
              
              {/* Delivery Routes */}
              <Route path="deliveries" element={<DeliveryList />} />
              <Route path="deliveries/new" element={<DeliveryForm />} />
              <Route path="deliveries/:id" element={<DeliveryDetail />} />
              <Route path="deliveries/:id/edit" element={<DeliveryForm />} />
              <Route path="deliveries/:id/track" element={<DeliveryTracking />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;