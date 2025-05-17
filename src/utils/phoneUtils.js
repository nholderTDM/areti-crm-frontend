import appConfig from "../config/appConfig";

export const formatPhoneForDisplay = (phoneNumber) => {
    // Clean the phone number (remove any non-numeric characters)
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Format for display
    if (cleanNumber.length === 10) {
      return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
    }
    return phoneNumber; // Return original if not valid
  };
  
  // This function will create the 'tel:' URL that redirects through your Grasshopper number
  export const getCallRedirectUrl = (phoneNumber) => {
    if (!phoneNumber) return '#';
    
    const grasshopperNumber = appConfig.company.grasshopperNumber.replace(/\D/g, '');
    const cleanNumber = phoneNumber.toString().replace(/\D/g, '');
    
    return `tel:${grasshopperNumber},${cleanNumber}`;
  };
  
  export const getSmsRedirectUrl = (phoneNumber, message = '') => {
    if (!phoneNumber) return '#';
    
    const grasshopperNumber = appConfig.company.grasshopperNumber.replace(/\D/g, '');
    const cleanNumber = phoneNumber.toString().replace(/\D/g, '');
    
    const encodedMessage = encodeURIComponent(message || 'Hello from Areti Alliance!');
    
    return `sms:${grasshopperNumber}?body=${encodedMessage}&address=${cleanNumber}`;
  };