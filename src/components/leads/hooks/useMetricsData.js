import { useState, useEffect } from 'react';

// Check if we should use API or mock data based on environment
const isProduction = process.env.NODE_ENV === 'production';

export const useMetricsData = ({ startDate, endDate, leadId, timeframe }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isProduction) {
        // In production, fetch from real API
        const response = await fetch('/api/metrics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate,
            endDate,
            leadId,
            timeframe
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const apiData = await response.json();
        setData(apiData);
      } else {
        // In development, use mock data
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock data for each section
        const mockData = {
          // Core metrics
          ...generateMockMetricsData(timeframe),
          
          // Conversation path data
          conversationPathData: generateConversationPathData(),
          
          // Script section performance
          scriptSectionData: generateScriptSectionData(),
          
          // Top performers
          topPerformers: generateTopPerformers(),
          
          // Objection handling
          objectionHandlingData: generateObjectionHandlingData(),
          
          // Drop-off points
          dropOffPoints: generateDropOffPoints(),
          
          // Best responses
          bestResponses: generateBestResponses()
        };
        
        setData(mockData);
      }
    } catch (err) {
      console.error('Error fetching metrics data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [startDate, endDate, leadId, timeframe]);
  
  // Return data, loading state, error, and refresh function
  return {
    data,
    isLoading,
    error,
    refresh: fetchData
  };
};

// Generate main metrics data
const generateMockMetricsData = (timeframe) => {
  // Adjust the values based on the selected timeframe for more realistic data
  let multiplier = 1;
  
  switch(timeframe) {
    case 'today':
      multiplier = 0.6;
      break;
    case 'week':
      multiplier = 0.8;
      break;
    case 'month':
      multiplier = 1;
      break;
    case 'quarter':
      multiplier = 1.1;
      break;
    case 'year':
      multiplier = 1.2;
      break;
    default:
      multiplier = 1;
  }
  
  return {
    conversionRate: Math.round(22 * multiplier * (1 + (Math.random() * 0.3))),
    scriptAdherence: Math.round(86 * multiplier * (1 + (Math.random() * 0.15))),
    avgCallDuration: Math.round(12 * multiplier * (1 + (Math.random() * 0.3))) / 2,
    keyPointsCovered: Math.round(82 * multiplier * (1 + (Math.random() * 0.2))),
    
    // Trends (positive or negative percentage)
    conversionTrend: Math.round((Math.random() * 20) - 5),
    adherenceTrend: Math.round((Math.random() * 15) - 2),
    durationTrend: Math.round((Math.random() * 10) - 8),
    keyPointsTrend: Math.round((Math.random() * 12) - 1),
  };
};

// Generate conversation path data
const generateConversationPathData = () => {
  // This would represent a tree/flow of conversation paths
  return [
    { from: "Introduction", to: "Needs Assessment", value: 68 },
    { from: "Introduction", to: "Objection: Not Interested", value: 15 },
    { from: "Introduction", to: "Objection: Bad Timing", value: 17 },
    { from: "Needs Assessment", to: "Solution Presentation", value: 52 },
    { from: "Needs Assessment", to: "Objection: No Budget", value: 8 },
    { from: "Needs Assessment", to: "End Call", value: 8 },
    { from: "Solution Presentation", to: "Price Discussion", value: 38 },
    { from: "Solution Presentation", to: "Objection: Need Approval", value: 9 },
    { from: "Solution Presentation", to: "End Call", value: 5 },
    { from: "Price Discussion", to: "Close", value: 25 },
    { from: "Price Discussion", to: "Objection: Too Expensive", value: 13 },
    { from: "Objection: Not Interested", to: "End Call", value: 10 },
    { from: "Objection: Not Interested", to: "Needs Assessment", value: 5 },
    { from: "Objection: Bad Timing", to: "Schedule Follow-up", value: 12 },
    { from: "Objection: Bad Timing", to: "End Call", value: 5 },
    { from: "Objection: No Budget", to: "Solution Presentation", value: 3 },
    { from: "Objection: No Budget", to: "End Call", value: 5 },
    { from: "Objection: Need Approval", to: "Schedule Follow-up", value: 7 },
    { from: "Objection: Need Approval", to: "End Call", value: 2 },
    { from: "Objection: Too Expensive", to: "Close", value: 6 },
    { from: "Objection: Too Expensive", to: "Schedule Follow-up", value: 4 },
    { from: "Objection: Too Expensive", to: "End Call", value: 3 },
    { from: "Close", to: "End Call", value: 25 },
    { from: "Schedule Follow-up", to: "End Call", value: 23 }
  ];
};

// Generate script section performance data for heatmap
const generateScriptSectionData = () => {
  const sections = [
    "Introduction", 
    "Needs Assessment", 
    "Value Proposition", 
    "Product Demo", 
    "ROI Discussion", 
    "Pricing", 
    "Objection Handling", 
    "Close"
  ];
  
  const metrics = ["Engagement", "Completion", "Success Rate", "Time Spent"];
  
  return sections.map(section => {
    const sectionData = {
      section: section
    };
    
    metrics.forEach(metric => {
      sectionData[metric] = Math.round(50 + (Math.random() * 50));
    });
    
    return sectionData;
  });
};

// Generate top performers data
const generateTopPerformers = () => {
  const performers = [
    { name: "John Davis", avatar: "JD" },
    { name: "Sarah Miller", avatar: "SM" },
    { name: "David Wilson", avatar: "DW" },
    { name: "Emma Thompson", avatar: "ET" },
    { name: "Michael Brown", avatar: "MB" }
  ];
  
  return performers.map(performer => ({
    ...performer,
    conversionRate: Math.round(60 + (Math.random() * 30)),
    scriptAdherence: Math.round(75 + (Math.random() * 20)),
    avgCallDuration: Math.round((5 + (Math.random() * 7)) * 10) / 10,
    callsCompleted: Math.round(10 + (Math.random() * 40))
  })).sort((a, b) => b.conversionRate - a.conversionRate);
};

// Generate objection handling data
const generateObjectionHandlingData = () => {
  const objectionTypes = [
    "Not Interested",
    "Too Expensive",
    "Need Approval",
    "Bad Timing",
    "Current Provider",
    "No Need"
  ];
  
  return objectionTypes.map(type => ({
    name: type,
    total: Math.round(10 + (Math.random() * 40)),
    overcame: Math.round(5 + (Math.random() * 25)),
    successRate: Math.round(30 + (Math.random() * 60))
  }));
};

// Generate drop-off points
const generateDropOffPoints = () => {
  return [
    { name: "Initial Objection: Not Interested", count: 32 },
    { name: "Pricing Discussion", count: 27 },
    { name: "Need Approval Objection", count: 18 },
    { name: "Initial Greeting", count: 12 },
    { name: "Close Attempt", count: 9 }
  ];
};

// Generate best responses data
const generateBestResponses = () => {
  return [
    { 
      objectionType: "Not Interested", 
      responseTitle: "Value Proposition", 
      successRate: 68 
    },
    { 
      objectionType: "Too Expensive", 
      responseTitle: "ROI Calculation", 
      successRate: 72 
    },
    { 
      objectionType: "Need Approval", 
      responseTitle: "Decision Maker Strategy", 
      successRate: 65 
    },
    { 
      objectionType: "Current Provider", 
      responseTitle: "Competitive Advantage", 
      successRate: 58 
    },
    { 
      objectionType: "Bad Timing", 
      responseTitle: "Future Planning", 
      successRate: 83 
    }
  ];
};