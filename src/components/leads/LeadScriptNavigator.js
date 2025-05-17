import React, { useState, useEffect } from 'react';
import { Card, Nav, Tab, Accordion, Button, Form, ListGroup, Row, Col, Modal, Badge, Table, ProgressBar, ButtonGroup } from 'react-bootstrap';
import { FaChevronRight, FaChevronLeft, FaBookmark, FaNotesMedical, FaSave, FaUserPlus, FaEdit, FaTrash, FaPlus, FaStepBackward, FaStepForward, FaSearch, FaHome, FaCalendarAlt, FaArrowDown, FaArrowUp, FaChartLine, FaBullseye } from 'react-icons/fa';
import LeadScriptNavigatorMetrics from './LeadScriptNavigatorMetrics'; // Import metrics 
import BackButton from '../common/BackButton';
// import PageTitle from '../common/PageTitle';
import PhoneContact from '../common/PhoneContact';
import { getAllLeads, updateLead, createLead, deleteLead, getAllLeadsFromLocalStorage, saveLeadsToLocalStorage } from '../../services/leadService';
 
// Define the scripts array that was missing
const scripts = [
  {
    id: 1,
    title: "Introduction",
    content: "Hello, my name is [Your Name] from [Your Company]. We help businesses like yours to [brief value proposition]. Do you have a few minutes to chat?\n\nI noticed that your company is [observation about prospect's business]. I'd love to learn more about your [relevant department] operations.",
    responseOptions: [
      { id: 1, label: "Yes, I have time to talk", nextScript: 2 },
      { id: 2, label: "What is this regarding?", nextScript: "clarify" },
      { id: 3, label: "I'm not interested", nextScript: "objection" },
      { id: 4, label: "Call me back later", nextScript: "callback" }
    ]
  },
  {
    id: "clarify",
    title: "Clarify Purpose",
    content: "I'm calling because we've helped companies similar to yours [specific result] by [how you achieve it]. I'd love to see if we could do the same for you.\n\nWould you be open to a brief conversation about your current [relevant process/challenge]?",
    responseOptions: [
      { id: 1, label: "Yes, let's talk", nextScript: 2 },
      { id: 2, label: "Still not interested", nextScript: "close" },
      { id: 3, label: "Tell me more first", nextScript: "more_info" }
    ]
  },
  {
    id: "more_info",
    title: "Provide More Information",
    content: "Certainly! Our [product/service] has helped companies in your industry with [specific pain point] by [unique solution approach]. For example, [brief customer success story].\n\nUnlike other solutions, we [key differentiator]. Would you be interested in learning how this could work specifically for your situation?",
    responseOptions: [
      { id: 1, label: "Yes, now I'm interested", nextScript: 2 },
      { id: 2, label: "Need more specific examples", nextScript: "case_studies" },
      { id: 3, label: "Still not a good fit", nextScript: "close" }
    ]
  },
  {
    id: "case_studies",
    title: "Share Case Studies",
    content: "I'd be happy to share more specific examples. [Company A] in your industry was struggling with [specific problem]. After implementing our solution, they saw [specific measurable result] within [timeframe].\n\nSimilarly, [Company B] was able to [achievement] which resulted in [business impact].\n\nBased on these examples, do you see potential value for your company?",
    responseOptions: [
      { id: 1, label: "Yes, sounds applicable to us", nextScript: 2 },
      { id: 2, label: "Somewhat interested", nextScript: "email_info" },
      { id: 3, label: "Not convinced", nextScript: "close" }
    ]
  },
  {
    id: 2,
    title: "Needs Assessment",
    content: "Great! To make this conversation valuable for you, I'd love to learn about your current situation.\n\n1. What are your biggest challenges with [relevant process]?\n2. How are you currently handling [specific task/challenge]?\n3. What would be most helpful for you to improve in this area?",
    responseOptions: [
      { id: 1, label: "Shares challenges openly", nextScript: 3 },
      { id: 2, label: "Minimal sharing", nextScript: "probing" },
      { id: 3, label: "Not experiencing challenges", nextScript: "create_need" }
    ]
  },
  {
    id: "probing",
    title: "Probing Questions",
    content: "I understand you might be hesitant to share too much detail. Let me ask more specifically:\n\n• What tools or systems are you currently using for [specific process]?\n• How much time does your team typically spend on [related task]?\n• Have you considered how [industry trend] might affect your operations in the coming year?",
    responseOptions: [
      { id: 1, label: "Opens up more", nextScript: 3 },
      { id: 2, label: "Acknowledges some pain points", nextScript: "pain_exploration" },
      { id: 3, label: "Still reserved", nextScript: "build_trust" }
    ]
  },
  {
    id: "pain_exploration",
    title: "Pain Point Exploration",
    content: "Thank you for sharing that. It sounds like [paraphrase their challenge] is creating some difficulties. Many businesses we work with find that this leads to [consequent problems]. Has your team experienced any of these downstream effects?\n\nOn a scale of 1-10, how urgent is finding a solution to this challenge?",
    responseOptions: [
      { id: 1, label: "High urgency (7-10)", nextScript: 3 },
      { id: 2, label: "Moderate urgency (4-6)", nextScript: "roi_discussion" },
      { id: 3, label: "Low urgency (1-3)", nextScript: "future_planning" }
    ]
  },
  {
    id: "build_trust",
    title: "Build Trust",
    content: "I understand your caution. Building trust is important to us, and I appreciate your time today. Perhaps I can share how we've helped similar businesses without requiring detailed information from you first.\n\n[Share brief industry insights or anonymized case study]\n\nWould you be comfortable sharing just one area where you think there might be room for improvement?",
    responseOptions: [
      { id: 1, label: "Shares one pain point", nextScript: "focused_solution" },
      { id: 2, label: "Requests more information first", nextScript: "competitor_comparison" },
      { id: 3, label: "Not ready to share", nextScript: "nurture" }
    ]
  },
  {
    id: "create_need",
    title: "Create Awareness of Need",
    content: "I appreciate your confidence in your current processes. Many businesses we speak with initially feel the same way until they discover the potential improvements they hadn't considered.\n\nFor example, did you know that [industry statistic or insight]? Or that [relevant trend] is affecting companies like yours?\n\nHave you ever wondered if there might be opportunities to [potential benefit] that you haven't explored yet?",
    responseOptions: [
      { id: 1, label: "Shows interest in possibilities", nextScript: 3 },
      { id: 2, label: "Acknowledges some curiosity", nextScript: "roi_discussion" },
      { id: 3, label: "Firmly satisfied with status quo", nextScript: "plant_seed" }
    ]
  },
  {
    id: "plant_seed",
    title: "Plant Seed for Future",
    content: "I respect that you're satisfied with your current approach. That's certainly a good position to be in. If I may, I'd like to leave you with something to consider.\n\nMany of our current clients were initially in similar situations, but found that [unexpected benefit] made exploring options worthwhile.\n\nWould it be alright if I reached out in a few months to check in? Industry needs evolve quickly, and I'd value staying connected.",
    responseOptions: [
      { id: 1, label: "Agrees to future contact", nextScript: "schedule_followup" },
      { id: 2, label: "Requests information by email", nextScript: "email_info" },
      { id: 3, label: "Not interested in future contact", nextScript: "close" }
    ]
  },
  {
    id: 3,
    title: "Solution Overview",
    content: "Based on what you've shared, I think we can help in a few specific ways:\n\n1. [Benefit 1] which addresses your challenge of [mentioned challenge]\n2. [Benefit 2] which would improve your [mentioned area]\n3. [Benefit 3] which many of our clients have found valuable for [common pain point]\n\nDoes this sound like something that would be valuable to you?",
    responseOptions: [
      { id: 1, label: "Yes, sounds valuable", nextScript: 4 },
      { id: 2, label: "Maybe, need more details", nextScript: "details" },
      { id: 3, label: "Not sure if it's a fit", nextScript: "objection_fit" }
    ]
  },
  {
    id: "details",
    title: "Provide Solution Details",
    content: "I'd be happy to go into more detail. Here's specifically how our solution addresses your needs:\n\nFor [mentioned challenge 1], our [specific feature] allows you to [specific benefit], which results in [tangible outcome].\n\nRegarding [mentioned challenge 2], you'll be able to [capability], which typically improves [relevant metric] by [percentage or value].\n\nDoes that clarify how we could help your specific situation?",
    responseOptions: [
      { id: 1, label: "Yes, that's helpful", nextScript: 4 },
      { id: 2, label: "Questions about implementation", nextScript: "implementation" },
      { id: 3, label: "Concerns about adoption", nextScript: "adoption" }
    ]
  },
  {
    id: "implementation",
    title: "Implementation Process",
    content: "That's a great question about implementation. Our process is designed to be minimally disruptive to your operations. Here's how it typically works:\n\n1. Initial setup and configuration: [timeframe and requirements]\n2. Data migration and integration: [approach and timeline]\n3. Training and onboarding: [process and support provided]\n4. Ongoing support: [what's included]\n\nThe entire process usually takes [timeframe], and we assign a dedicated implementation specialist to guide you through each step. Does this address your concerns about implementation?",
    responseOptions: [
      { id: 1, label: "Yes, sounds manageable", nextScript: 4 },
      { id: 2, label: "Concerns about timeline", nextScript: "timeline_discussion" },
      { id: 3, label: "Concerns about resources needed", nextScript: "resource_discussion" }
    ]
  },
  {
    id: "adoption",
    title: "Address Adoption Concerns",
    content: "I understand your concerns about team adoption. This is something many of our clients initially worry about, but we've developed a proven approach to ensure successful adoption:\n\n• Intuitive user interface designed for minimal training\n• Role-based training sessions tailored to different user needs\n• Champions program to build internal expertise and advocacy\n• Ready-made communication templates to announce and explain changes\n• 24/7 support during the transition period\n\nOn average, our clients see [X]% adoption within [timeframe]. Does this help address your concerns?",
    responseOptions: [
      { id: 1, label: "Yes, that's reassuring", nextScript: 4 },
      { id: 2, label: "Request customer references", nextScript: "references" },
      { id: 3, label: "Still concerned", nextScript: "pilot_program" }
    ]
  },
  {
    id: "objection_fit",
    title: "Address Fit Concerns",
    content: "I understand your hesitation about whether this is the right fit. That's a valid concern.\n\nBased on what you've shared about [specific situation], here's why I believe we could be a good match: [specific reasons tailored to their business].\n\nWe've worked with companies that [similar characteristic] and were able to [specific achievement].\n\nWhat specific aspect makes you unsure about the fit?",
    responseOptions: [
      { id: 1, label: "Shares specific concerns", nextScript: "address_specific_concerns" },
      { id: 2, label: "Industry-specific requirements", nextScript: "industry_solution" },
      { id: 3, label: "Too small/large for solution", nextScript: "scale_discussion" }
    ]
  },
  {
    id: 4,
    title: "Pricing & Proposal",
    content: "Great! Based on your needs, our [appropriate package/solution] would be the best fit, which is an investment of [price range].\n\nThis includes:\n- [Feature 1]\n- [Feature 2]\n- [Feature 3]\n\nMany of our clients see ROI within [timeframe] through [specific outcome].",
    responseOptions: [
      { id: 1, label: "Sounds reasonable", nextScript: "schedule" },
      { id: 2, label: "That's more than expected", nextScript: "objection_price" },
      { id: 3, label: "Need to think about it", nextScript: "stall" }
    ]
  },
  {
    id: "objection_price",
    title: "Handle Price Objection",
    content: "I understand that the investment is an important consideration. When looking at pricing, many of our clients find it helpful to consider the ROI rather than just the upfront cost.\n\nFor example, [customer example] invested [amount] and saw [specific return] within [timeframe], which meant a [X]% return on their investment.\n\nWe also offer [payment options/tiers] which might better align with your budget while still delivering key value. What kind of investment range were you expecting?",
    responseOptions: [
      { id: 1, label: "Shares budget expectations", nextScript: "value_justification" },
      { id: 2, label: "Interested in payment options", nextScript: "payment_flexibility" },
      { id: 3, label: "Still too expensive", nextScript: "downsell" }
    ]
  },
  {
    id: "value_justification",
    title: "Justify Value Proposition",
    content: "Thank you for sharing your budget expectations. Let me show you how our solution provides value that justifies the investment:\n\n1. Direct cost savings: [specific calculation]\n2. Productivity improvements: [specific calculation]\n3. Revenue opportunity: [specific calculation]\n\nWhen you factor in these benefits, the effective cost is actually [adjusted figure], which I believe aligns more closely with your expectations. How does that sound?",
    responseOptions: [
      { id: 1, label: "Value proposition makes sense", nextScript: "schedule" },
      { id: 2, label: "Request written ROI analysis", nextScript: "send_roi" },
      { id: 3, label: "Still not convinced", nextScript: "escalate_decision" }
    ]
  },
  {
    id: "stall",
    title: "Handle Stalling",
    content: "I completely understand the need to give this proper consideration. It's an important decision. To help you in your decision-making process:\n\n1. What additional information would be helpful?\n2. Are there specific concerns you'd like me to address?\n3. Who else will be involved in making this decision?\n\nMany clients find it helpful to schedule a follow-up call after they've had time to review the information. Would it make sense to schedule that now?",
    responseOptions: [
      { id: 1, label: "Agrees to scheduled follow-up", nextScript: "confirm_callback" },
      { id: 2, label: "Needs to discuss with team", nextScript: "team_discussion" },
      { id: 3, label: "Wants additional materials", nextScript: "send_materials" }
    ]
  },
  {
    id: "schedule",
    title: "Schedule Next Steps",
    content: "I'm glad to hear this sounds like a good fit! Let's schedule a [demo/follow-up meeting] to go deeper into how this would work for your specific situation.\n\nHow does [propose date/time] work for you? I'll send a calendar invite with all the details.",
    responseOptions: [
      { id: 1, label: "Agrees to meeting", nextScript: 6 },
      { id: 2, label: "Suggests alternate time", nextScript: "reschedule" },
      { id: 3, label: "Not ready to meet yet", nextScript: "nurture" }
    ]
  },
  {
    id: "reschedule",
    title: "Reschedule Meeting",
    content: "I appreciate you suggesting an alternative time. Let's make sure we find a slot that works well for you.\n\nYou suggested [their suggested time]. That [works/doesn't work] for me. [If doesn't work: How about [alternative time/date]?]\n\nI'll make sure to send over a calendar invitation with all the details, and I'll include some preliminary information for you to review before our conversation.",
    responseOptions: [
      { id: 1, label: "Confirms rescheduled time", nextScript: 6 },
      { id: 2, label: "Needs to check calendar", nextScript: "follow_up_later" },
      { id: 3, label: "Wants to push meeting further out", nextScript: "long_term_nurture" }
    ]
  },
  {
    id: 6,
    title: "Close and Next Steps",
    content: "Excellent! I've scheduled our [meeting type] for [confirmed date/time]. You'll receive a calendar invitation shortly with all the details.\n\nBefore we wrap up, do you have any other questions I can answer for you today?",
    responseOptions: [
      { id: 1, label: "No questions, all set", nextScript: "success" },
      { id: 2, label: "Has specific questions", nextScript: "questions" }
    ]
  },
  {
    id: "questions",
    title: "Address Questions",
    content: "I'm happy to address your questions.\n\n[For each question, provide a clear, concise answer]\n\nDoes that help clarify things? Is there anything else you'd like to know before our scheduled meeting?",
    responseOptions: [
      { id: 1, label: "All questions answered", nextScript: "success" },
      { id: 2, label: "Has more questions", nextScript: "more_questions" },
      { id: 3, label: "Raises new concern", nextScript: "new_objection" }
    ]
  },
  {
    id: "objection",
    title: "Handle Objection - Not Interested",
    content: "I understand. Many of our current clients initially felt the same way until they learned how we [unique value proposition].\n\nMay I ask what specifically makes you feel this isn't a good fit right now?",
    responseOptions: [
      { id: 1, label: "Shares specific concern", nextScript: "address_concern" },
      { id: 2, label: "No budget/resources now", nextScript: "future_follow_up" },
      { id: 3, label: "Using competitor", nextScript: "competitor" },
      { id: 4, label: "Still not interested", nextScript: "close" }
    ]
  },
  {
    id: "address_concern",
    title: "Address Specific Concern",
    content: "Thank you for sharing that concern. It's completely valid.\n\n[Acknowledge their specific concern and provide a thoughtful response that addresses it directly]\n\nMany of our clients had similar concerns before working with us, but found that [how the concern was resolved in practice].\n\nDoes that help address your concern, or is there another aspect you'd like me to elaborate on?",
    responseOptions: [
      { id: 1, label: "Concern addressed, more open now", nextScript: "clarify" },
      { id: 2, label: "Partially addressed", nextScript: "additional_information" },
      { id: 3, label: "Still concerned", nextScript: "suggest_alternative" }
    ]
  },
  {
    id: "competitor",
    title: "Handle Competitor Objection",
    content: "I appreciate you letting me know you're working with [competitor if mentioned, or 'another provider']. They offer a good solution as well.\n\nIf you don't mind me asking, what aspects of their service have worked well for you? And are there any areas where you'd like to see improvements?\n\nThe reason I ask is that our solution specifically excels at [key differentiators], which some [competitor] customers have found valuable as a complement or alternative.",
    responseOptions: [
      { id: 1, label: "Shares pain points with competitor", nextScript: "differentiate" },
      { id: 2, label: "Happy with competitor", nextScript: "future_follow_up" },
      { id: 3, label: "Open to hearing differences", nextScript: "competitive_comparison" }
    ]
  },
  {
    id: "competitive_comparison",
    title: "Competitive Comparison",
    content: "I'd be happy to highlight some key differences between our solution and others in the market:\n\n1. [Key differentiator 1] - Unlike many competitors, we [specific advantage]\n2. [Key differentiator 2] - Our approach to [feature/aspect] provides [unique benefit]\n3. [Key differentiator 3] - Customers who switch to us often mention [specific advantage]\n\nWould any of these differences be particularly valuable for your specific needs?",
    responseOptions: [
      { id: 1, label: "Interested in specific differentiator", nextScript: "focused_solution" },
      { id: 2, label: "Interested in side-by-side comparison", nextScript: "send_comparison" },
      { id: 3, label: "Not compelling enough", nextScript: "close" }
    ]
  },
  {
    id: "callback",
    title: "Schedule Callback",
    content: "I understand you're busy right now. When would be a better time for us to have a brief conversation about how we might help with [value proposition]?",
    responseOptions: [
      { id: 1, label: "Provides specific time", nextScript: "confirm_callback" },
      { id: 2, label: "Suggests email instead", nextScript: "email_info" },
      { id: 3, label: "Not interested", nextScript: "close" }
    ]
  },
  {
    id: "confirm_callback",
    title: "Confirm Callback Time",
    content: "Perfect! I've noted [specific time/date] for our follow-up conversation. I'll give you a call then to discuss how we can [value proposition].\n\nIn the meantime, would it be helpful if I sent over some brief information about how we've helped similar businesses in your industry?",
    responseOptions: [
      { id: 1, label: "Yes, send information", nextScript: "send_materials" },
      { id: 2, label: "No additional information needed", nextScript: "simple_callback" }
    ]
  },
  {
    id: "email_info",
    title: "Send Email Information",
    content: "I'd be happy to send you information by email. Could you confirm the best email address to reach you at?\n\nI'll send over a concise overview of how we've helped businesses like yours, along with some specific results our clients have achieved. Would you be interested in any specific aspect of our [product/service] that I should make sure to include?",
    responseOptions: [
      { id: 1, label: "Provides email and preferences", nextScript: "confirm_email_followup" },
      { id: 2, label: "Just wants basic info", nextScript: "basic_email_followup" }
    ]
  },
  {
    id: "success",
    title: "Successful Close",
    content: "Wonderful! I'm looking forward to our conversation on [scheduled date]. In the meantime, I'll send you an email with a brief overview of what we discussed today and some information that might be helpful before our meeting.\n\nThank you for your time today, and please reach out if you think of any questions before our meeting.",
    responseOptions: [
      { id: 1, label: "End call successfully", nextScript: "end" }
    ]
  },
  {
    id: "close",
    title: "End Call - Not Proceeding",
    content: "I understand. Thank you for taking the time to speak with me today. If your situation changes or you'd like to learn more about how we could help with [relevant challenge], please don't hesitate to reach out.\n\nEnjoy the rest of your day!",
    responseOptions: [
      { id: 1, label: "End call", nextScript: "end" }
    ]
  },
  {
    id: "end",
    title: "Call Complete",
    content: "This call has been completed. You can now save your progress, update the lead status, or start a new call.",
    responseOptions: []
  }
];

// Script categories for navigation
const scriptCategories = [
  { key: "introduction", title: "Introduction" },
  { key: "assessment", title: "Needs Assessment" },
  { key: "solution", title: "Solution" },
  { key: "objections", title: "Objections" },
  { key: "closing", title: "Closing" }
];

// Helper function to map script IDs to categories
const getScriptCategory = (scriptId) => {
  // Simple mapping logic - could be more sophisticated
  if (scriptId === 1 || scriptId === "clarify" || scriptId === "more_info" || scriptId === "case_studies") return "introduction";
  if (scriptId === 2 || scriptId === "probing" || scriptId === "create_need" || scriptId === "pain_exploration" || scriptId === "build_trust" || scriptId === "plant_seed") return "assessment";
  if (scriptId === 3 || scriptId === 4 || scriptId === "details" || scriptId === "implementation" || scriptId === "adoption" || scriptId === "objection_fit") return "solution";
  if (scriptId === "objection" || scriptId === "objection_price" || scriptId === "address_concern" || scriptId === "competitor" || scriptId === "competitive_comparison" || scriptId === "stall" || scriptId === "value_justification") return "objections";
  if (scriptId === "schedule" || scriptId === "reschedule" || scriptId === 6 || scriptId === "success" || scriptId === "close" || scriptId === "end" || scriptId === "questions" || scriptId === "callback" || scriptId === "confirm_callback" || scriptId === "email_info") return "closing";
  return "introduction"; // Default
};
 
const LeadScriptNavigator = ({ leadData = {}, onSaveLead }) => { // Default to an empty object
  const [isEditing, setIsEditing] = useState(false); // Add isEditing state
  const [currentScriptIndex, setCurrentScriptIndex] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [userResponses, setUserResponses] = useState({});
  const [activeScript, setActiveScript] = useState('introduction'); // Default active script
  const [scriptHistory, setScriptHistory] = useState([1]); // Track script navigation history
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isActiveSession, setIsActiveSession] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [showLeadBrowser, setShowLeadBrowser] = useState(false);
  const [leadSearchFocused, setLeadSearchFocused] = useState(false);
  const [conversationMetrics, setConversationMetrics] = useState({
    pointsCovered: 0,
    totalPoints: 0,
    objections: {},
    avgResponseTime: 0,
    conversionPath: []
  });
 
  // Lead data state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [currentLead, setCurrentLead] = useState(leadData || {
    id: null,
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    title: '',
    type: 'prospect',
    source: 'cold-call',
    status: 'new',
    notes: '',
    tags: [],
    assignedTo: 'Admin User',
    lastContact: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
 
  // Lead data modification confirmation
  const [showLeadSaveConfirm, setShowLeadSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
 
  // Lead types and sources
  const leadTypes = [
    { value: 'prospect', label: 'Prospect' },
    { value: 'qualified', label: 'Qualified Lead' },
    { value: 'opportunity', label: 'Opportunity' },
    { value: 'customer', label: 'Customer' },
    { value: 'partner', label: 'Partner' }
  ];
 
  const leadSources = [
    { value: 'cold-call', label: 'Cold Call' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'event', label: 'Event' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'other', label: 'Other' }
  ];
 
  const leadStatuses = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'meeting-scheduled', label: 'Meeting Scheduled' },
    { value: 'proposal-sent', label: 'Proposal Sent' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Load all leads when the component mounts
  useEffect(() => {
    // Define refreshData function for reloading lead data
    const refreshData = async () => {
      try {
        // Use the service to get leads from API or fall back to localStorage
        let leads = [];
        try {
          leads = await getAllLeads();
        } catch (error) {
          console.warn('Error fetching leads from API, falling back to localStorage:', error);
          leads = getAllLeadsFromLocalStorage();
        }
        setAllLeads(leads);
      } catch (error) {
        console.error('Error loading leads:', error);
        setAllLeads([]);
      }
    };
    
    // Call refreshData initially
    refreshData();
    
    // Set up refresh interval (optional)
    const refreshInterval = setInterval(refreshData, 60000); // Refresh every minute
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Add this function to handle lead search
  const handleLeadSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredLeads([]);
      return;
    }
    
    const filtered = allLeads.filter(lead => {
      const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
      const company = (lead.company || '').toLowerCase();
      const email = (lead.email || '').toLowerCase();
      const searchTerm = query.toLowerCase();
      
      return fullName.includes(searchTerm) || 
             company.includes(searchTerm) || 
             email.includes(searchTerm);
    });
    
    setFilteredLeads(filtered.slice(0, 5)); // Limit to 5 results
  };

  // Load saved progress when the component mounts
  useEffect(() => {
    const savedProgress = localStorage.getItem('leadScriptProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCurrentScriptIndex(progress.currentScriptIndex);
        setNotes(progress.notes || '');
        setUserResponses(progress.userResponses || {});
        
        // Determine if this is an active session
        const isEndScript = progress.currentScriptIndex === 'end';
        setIsActiveSession(!isEndScript);

        // Load history if available
        if (progress.scriptHistory && progress.historyIndex !== undefined) {
          setScriptHistory(progress.scriptHistory);
          setHistoryIndex(progress.historyIndex);
        } else {
          // Create initial history if none exists
          setScriptHistory([progress.currentScriptIndex]);
          setHistoryIndex(0);
        }
        
        // Update the active script category based on the current script
        setActiveScript(getScriptCategory(progress.currentScriptIndex));
        
        // Load conversation metrics if available
        if (progress.conversationMetrics) {
          setConversationMetrics(progress.conversationMetrics);
        }
        
        console.log('Loaded progress from', new Date(progress.timestamp).toLocaleString());
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
    
    // Load lead data if provided
    if (leadData && leadData.id) {
      setCurrentLead(leadData);
      setNotes(leadData.notes || '');
    }
    
    // Initialize conversation metrics
    updateConversationMetrics();
  }, [leadData]); // Dependency on leadData prop

  // Function to update conversation metrics
  const updateConversationMetrics = () => {
    // Count total available script points
    const totalPoints = scripts.length;
    
    // Count covered points from history
    const uniqueScriptIds = new Set(scriptHistory);
    const pointsCovered = uniqueScriptIds.size;
    
    // Track objections encountered
    const objections = {};
    Object.entries(userResponses).forEach(([scriptId, responseId]) => {
      const script = scripts.find(s => s.id.toString() === scriptId.toString());
      if (script) {
        const response = script.responseOptions.find(r => r.nextScript.toString() === responseId.toString());
        if (response && response.label.toLowerCase().includes('not interested') || 
            response.label.toLowerCase().includes('concern') ||
            response.label.toLowerCase().includes('objection')) {
          if (!objections[scriptId]) {
            objections[scriptId] = [];
          }
          objections[scriptId].push(response.label);
        }
      }
    });
    
    // Record conversion path
    const conversionPath = scriptHistory.map(id => {
      const script = scripts.find(s => s.id.toString() === id.toString());
      return script ? script.title : 'Unknown';
    });
    
    setConversationMetrics({
      pointsCovered,
      totalPoints,
      objections,
      conversionPath,
      // Add any other metrics you want to track
    });
  };

  // Add this function to load selected lead
  const loadSelectedLead = (lead) => {
    setCurrentLead(lead);
    setSearchQuery('');
    setFilteredLeads([]);
    setLeadSearchFocused(false);
    setNotes(lead.notes || '');
  };

  // Function to handle lead form changes
  const handleLeadChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead(prevLead => ({
      ...prevLead,
      [name]: value,
      updatedAt: new Date()
    }));
  };
  
  // Function to handle lead tags input
  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',')
      .map(tag => tag.trim().toLowerCase().replace(/\s+/g, '-'))
      .filter(tag => tag !== '');
      
    setCurrentLead(prevLead => ({
      ...prevLead,
      tags,
      updatedAt: new Date()
    }));
  };
  
  // Function to save the current script navigation progress to localStorage
  const handleSaveProgress = () => {
    // Update conversation metrics before saving
    updateConversationMetrics();
    
    // Create a progress object with all the data we want to save
    const progress = {
      currentScriptIndex,        // Saves which script section the user is currently on
      notes,                     // Saves any notes taken during the conversation
      userResponses,             // Saves the history of customer responses selected
      scriptHistory,             // Save the full navigation history
      historyIndex,              // Save the current position in the history
      conversationMetrics,       // Save conversation metrics
      timestamp: new Date().toISOString()  // Records when this progress was saved
    };
    
    // Save to localStorage (in a real app, you might want to save to a database)
    localStorage.setItem('leadScriptProgress', JSON.stringify(progress));
    
    // Show a confirmation to the user
    alert('Progress saved successfully!');
  };

  // Function to save lead data
  const saveLead = async () => {
    try {
      // Update conversation metrics
      updateConversationMetrics();
      
      // Create a new lead or update existing one
      const leadToSave = {
        ...currentLead,
        notes: notes, // Include notes from the script
        lastContact: new Date(),
        updatedAt: new Date(),
        conversationMetrics // Include conversation metrics
      };
      
      let savedLead;
      
      if (leadToSave.id) {
        // Update existing lead
        savedLead = await updateLead(leadToSave.id, leadToSave);
      } else {
        // Add new lead - remove id if it's null so MongoDB will generate one
        const { id, ...newLeadData } = leadToSave;
        savedLead = await createLead(newLeadData);
      }
      
      // Refresh the leads list
      const updatedLeads = await getAllLeads();
      setAllLeads(updatedLeads);
      
      // Update current lead with saved data (including server-generated ID)
      setCurrentLead(savedLead);
      setShowLeadSaveConfirm(false);
      setShowLeadForm(false);
      
      // If props callback exists, call it
      if (onSaveLead) {
        onSaveLead(savedLead);
      }
      
      // Show feedback
      alert(`Lead ${savedLead.firstName} ${savedLead.lastName} saved successfully!`);
    } catch (error) {
      console.error('Error saving lead:', error);
      
      // Fallback to localStorage if the API fails
      try {
        console.warn('API save failed. Falling back to localStorage...');
        
        // Prepare the lead data
        const leadToSave = {
          ...currentLead,
          notes: notes,
          lastContact: new Date(),
          updatedAt: new Date(),
          conversationMetrics
        };
        
        if (!leadToSave.id) {
          leadToSave.id = Date.now(); // Simple ID generation for demo
          leadToSave.createdAt = new Date();
        }
        
        // Get current leads from localStorage
        const existingLeads = getAllLeadsFromLocalStorage();
        
        if (leadToSave.id) {
          // Update existing lead
          const leadIndex = existingLeads.findIndex(lead => lead.id === leadToSave.id);
          if (leadIndex >= 0) {
            existingLeads[leadIndex] = leadToSave;
          } else {
            existingLeads.push(leadToSave);
          }
        } else {
          // Add new lead
          existingLeads.push(leadToSave);
        }
        
        // Save back to localStorage
        saveLeadsToLocalStorage(existingLeads);
        
        // Update state
        setAllLeads(existingLeads);
        setCurrentLead(leadToSave);
        setShowLeadSaveConfirm(false);
        setShowLeadForm(false);
        
        // If props callback exists, call it
        if (onSaveLead) {
          onSaveLead(leadToSave);
        }
        
        // Show feedback
        alert(`Lead ${leadToSave.firstName} ${leadToSave.lastName} saved to localStorage (offline mode).`);
      } catch (localStorageError) {
        console.error('LocalStorage fallback also failed:', localStorageError);
        alert('Error saving lead. Please try again.');
      }
    }
  };
  
  // Function to delete lead
  const deleteLead = async () => {
    if (!currentLead.id) return;
    
    try {
      // Delete from API
      await deleteLead(currentLead.id);
      
      // Refresh the leads list
      const updatedLeads = await getAllLeads();
      setAllLeads(updatedLeads);
      
      // Reset current lead
      setCurrentLead({
        id: null,
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: '',
        title: '',
        type: 'prospect',
        source: 'cold-call',
        status: 'new',
        notes: '',
        tags: [],
        assignedTo: 'Admin User',
        lastContact: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setShowDeleteConfirm(false);
      setShowLeadForm(false);
      
      // Show feedback
      alert('Lead deleted successfully!');
    } catch (error) {
      console.error('Error deleting lead:', error);
      
      // Fallback to localStorage if the API fails
      try {
        console.warn('API delete failed. Falling back to localStorage...');
        
        // Remove from local storage
        const existingLeads = getAllLeadsFromLocalStorage();
        const updatedLeads = existingLeads.filter(lead => lead.id !== currentLead.id);
        
        // Save back to localStorage
        saveLeadsToLocalStorage(updatedLeads);
        
        // Update state
        setAllLeads(updatedLeads);
        setCurrentLead({
          id: null,
          firstName: '',
          lastName: '',
          company: '',
          email: '',
          phone: '',
          title: '',
          type: 'prospect',
          source: 'cold-call',
          status: 'new',
          notes: '',
          tags: [],
          assignedTo: 'Admin User',
          lastContact: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        setShowDeleteConfirm(false);
        setShowLeadForm(false);
        
        // Show feedback
        alert('Lead deleted from localStorage (offline mode).');
      } catch (localStorageError) {
        console.error('LocalStorage fallback also failed:', localStorageError);
        alert('Error deleting lead. Please try again.');
      }
    }
  };

  // Handle notes change and update lead
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    
    // Update lead notes if we have a lead
    if (currentLead.id) {
      setCurrentLead(prevLead => ({
        ...prevLead,
        notes: newNotes,
        updatedAt: new Date()
      }));
    }
  };

  // Get current script
  const currentScript = scripts.find(script => script.id === currentScriptIndex) || scripts[0];

  // Update activeScript when currentScriptIndex changes
  useEffect(() => {
    if (currentScript) {
      const category = getScriptCategory(currentScript.id);
      setActiveScript(category);
    }
  }, [currentScriptIndex, currentScript]);

  const handleResponseSelect = (nextScript) => {
    // Record response time for metrics
    const responseTime = new Date().getTime();
    const lastResponseTime = localStorage.getItem('lastResponseTime');
    
    if (lastResponseTime) {
      const timeDiff = responseTime - parseInt(lastResponseTime);
      // Update metrics with response time
      setConversationMetrics(prev => ({
        ...prev,
        avgResponseTime: prev.avgResponseTime ? (prev.avgResponseTime + timeDiff) / 2 : timeDiff
      }));
    }
    
    // Store current response time for next calculation
    localStorage.setItem('lastResponseTime', responseTime.toString());
    
    // If it's a number, go to that script
    let nextScriptId = nextScript;
    if (typeof nextScript === 'string') {
      // Find the script with that ID
      const scriptIndex = scripts.findIndex(script => script.id === nextScript);
      if (scriptIndex !== -1) {
        nextScriptId = scripts[scriptIndex].id;
      }
    }
    
    setCurrentScriptIndex(nextScriptId);
    
    // Add to history, removing any "future" history if we've gone back
    const newHistory = [...scriptHistory.slice(0, historyIndex + 1), nextScriptId];
    setScriptHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  
    // Store response
    setUserResponses({
      ...userResponses,
      [currentScript.id]: nextScript
    });
    
    // Update lead status based on response
    updateLeadStatus(nextScript);
    
    // Update conversation metrics
    updateConversationMetrics();
  };
  
  // Add these new navigation functions
  const goBackInHistory = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousScriptId = scriptHistory[newIndex];
      setCurrentScriptIndex(previousScriptId);
      setHistoryIndex(newIndex);
    }
  };
  
  const goForwardInHistory = () => {
    if (historyIndex < scriptHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const nextScriptId = scriptHistory[newIndex];
      setCurrentScriptIndex(nextScriptId);
      setHistoryIndex(newIndex);
    }
  };
  
  // Update lead status based on the script navigation
  const updateLeadStatus = (nextScript) => {
    if (!currentLead.id) return; // Only update if we have a lead
    
    let newStatus = currentLead.status;
    
    // Example status mapping - customize based on your script flow
    switch (nextScript) {
      case 2: // Needs Assessment
        newStatus = 'contacted';
        break;
      case "schedule":
      case "reschedule":
      case "confirm_callback":
        newStatus = 'meeting-scheduled';
        break;
      case 4: // Pricing & Proposal
      case "value_justification":
        newStatus = 'negotiation';
        break;
      case 6: // Close and Next Steps
        newStatus = 'proposal-sent';
        break;
      case "success":
        newStatus = 'won';
        break;
      case "close":
      case "close_followup":
        newStatus = 'inactive';
        break;
      default:
        // Keep current status
        break;
    }
    
    // Update lead status if changed
    if (newStatus !== currentLead.status) {
      setCurrentLead(prevLead => ({
        ...prevLead,
        status: newStatus,
        updatedAt: new Date(),
        lastContact: new Date()
      }));
    }
  };

  // Navigate to next/previous script
  const goToNextScript = () => {
    const currentIndex = scripts.findIndex(script => script.id === currentScript.id);
    if (currentIndex < scripts.length - 1) {
      handleResponseSelect(scripts[currentIndex + 1].id);
    }
  };

  const goToPrevScript = () => {
    const currentIndex = scripts.findIndex(script => script.id === currentScript.id);
    if (currentIndex > 0) {
      handleResponseSelect(scripts[currentIndex - 1].id);
    }
  };

  // Handle script category change
  const handleScriptCategoryChange = (category) => {
    setActiveScript(category);
    
    // Find the first script in this category
    const firstScriptInCategory = scripts.find(script => getScriptCategory(script.id) === category);
    if (firstScriptInCategory) {
      handleResponseSelect(firstScriptInCategory.id);
    }
  };

  return (
    <div>
      {/* Main section with repositioned back button and description */}
      <div className="d-flex align-items-center mb-2">
  <BackButton />
</div>
<div className="mb-3">
  <p className="lead-script-description text-muted mb-4">Guide your sales conversations with structured scripts</p>
</div>
      
      <LeadScriptNavigatorMetrics selectedLeadId={currentLead?.id} />

      {/* Script Category Navigation */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Header className="bg-primary text-white">
          <Nav variant="tabs" className="border-bottom-0">
            {scriptCategories.map((category) => (
              <Nav.Item key={category.key}>
                <Nav.Link 
                  className={activeScript === category.key ? "active bg-white text-primary" : "text-white"} 
                  onClick={() => handleScriptCategoryChange(category.key)}
                >
                  {category.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Card.Header>
      </Card>

      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#home" onClick={(e) => {
              e.preventDefault();
              setCurrentScriptIndex(1);
            }}>
              <FaHome /> Home
            </a>
          </li>
          <li className="breadcrumb-item">
            <a href="#category" onClick={(e) => e.preventDefault()}>
              {scriptCategories.find(cat => cat.key === activeScript)?.title || 'Script'}
            </a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {currentScript.title}
          </li>
        </ol>
      </nav>
      
      {/* Script Progress */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center py-2">
          <span className="fs-6">Script Progress</span>
          <ButtonGroup size="sm">
            <Button variant="outline-secondary" title="Move to Earlier Script" onClick={goToPrevScript} disabled={currentScript.id === 1}>
              <FaArrowUp />
            </Button>
            <Button variant="outline-secondary" title="Move to Later Script" onClick={goToNextScript} disabled={currentScript.id === 'end'}>
              <FaArrowDown />
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Body className="py-2">
          <ProgressBar 
            now={(scripts.findIndex(s => s.id === currentScript.id) / (scripts.length - 1)) * 100} 
            variant={currentScript.id === 'end' ? "success" : "primary"}
            className="mt-1"
          />
          <div className="d-flex justify-content-between mt-1">
            <small className="text-muted">Start</small>
            <small className="text-muted">
              <FaCalendarAlt className="me-1" />
              Next Follow-up: {currentLead.id ? new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'N/A'}
            </small>
            <small className="text-muted">End</small>
          </div>
        </Card.Body>
      </Card>

      {/* Add Lead Search component */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center">
            <span className="fs-6 fw-bold m-0">Lead Selection</span>
          </div>
          <Button 
            variant="outline-light" 
            size="sm"
            onClick={() => setShowLeadBrowser(true)}
          >
            <FaSearch /> Browse All Leads
          </Button>
        </Card.Header>
        <Card.Body className="py-2">
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Search leads by name, company, or email..."
              value={searchQuery}
              onChange={(e) => handleLeadSearch(e.target.value)}
              onFocus={() => setLeadSearchFocused(true)}
              onBlur={() => setTimeout(() => setLeadSearchFocused(false), 200)}
              className="border-primary"
            />
            
            {leadSearchFocused && filteredLeads.length > 0 && (
              <div className="position-absolute w-100 mt-1 shadow-sm border rounded bg-white z-index-dropdown">
                <ListGroup>
                  {filteredLeads.map(lead => (
                    <ListGroup.Item 
                      key={lead.id}
                      action
                      onClick={() => loadSelectedLead(lead)}
                      className="py-2 d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-bold">{lead.firstName} {lead.lastName}</div>
                        <small className="text-muted">
                          {lead.company} • {leadStatuses.find(s => s.value === lead.status)?.label || lead.status}
                        </small>
                      </div>
                      <Badge bg={lead.status === 'won' ? 'success' : lead.status === 'lost' ? 'danger' : 'primary'}>
                        {lead.type}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
            
            {leadSearchFocused && searchQuery && filteredLeads.length === 0 && (
              <div className="position-absolute w-100 mt-1 shadow-sm border rounded bg-white p-3 text-center">
                No leads found matching "{searchQuery}"
              </div>
            )}
          </div>
          
          {currentLead.id && (
            <div className="mt-2 d-flex justify-content-between align-items-center">
              <small>
                <span className="text-muted">Selected lead:</span> 
                <span className="fw-bold ms-1">{currentLead.firstName} {currentLead.lastName}</span>
                <span className="ms-1 text-muted">({currentLead.company || 'No company'})</span>
              </small>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => {
                  setCurrentLead({
                    id: null,
                    firstName: '',
                    lastName: '',
                    company: '',
                    email: '',
                    phone: '',
                    title: '',
                    type: 'prospect',
                    source: 'cold-call',
                    status: 'new',
                    notes: '',
                    tags: [],
                    assignedTo: 'Admin User',
                    lastContact: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                  });
                  setNotes('');
                }}
              >
                Clear Selection
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Lead Data Section - Simplified */}
      <Card className="border-0 shadow-sm mb-4">  
        <div className="d-flex justify-content-between align-items-center bg-primary text-white p-2 rounded-top">
          <span className="fw-bold">Lead Data</span>
          <div>
            {currentLead.id ? (
              <>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setIsEditing(true);
                    setShowLeadForm(true);
                  }}
                >
                  <FaEdit /> Edit
                </Button>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => setShowLeadSaveConfirm(true)}
                >
                  <FaSave /> Save
                </Button>
              </>
            ) : (
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setShowLeadForm(true);
                }}
              >
                <FaUserPlus /> Create Lead
              </Button>
            )}
          </div>
        </div>
        
        <Card.Body className="p-3">
          {currentLead.id ? (
            <Row>
              <Col md={6}>
                <p><strong>Name:</strong> {currentLead.firstName} {currentLead.lastName}</p>
                <p><strong>Company:</strong> {currentLead.company || 'Not specified'}</p>
                <p><strong>Contact:</strong> {currentLead.email || 'No email'} | {currentLead.phone || 'No phone'}</p>
              </Col>
              <Col md={6}>
                <p><strong>Status:</strong> {leadStatuses.find(s => s.value === currentLead.status)?.label || currentLead.status}</p>
                <p><strong>Type:</strong> {leadTypes.find(t => t.value === currentLead.type)?.label || currentLead.type}</p>
                <p><strong>Tags:</strong> {currentLead.tags && currentLead.tags.length > 0 ? currentLead.tags.join(', ') : 'None'}</p>
              </Col>
            </Row>
          ) : (
            <p className="text-center text-muted my-2">No lead data. Create a lead to track this conversation.</p>
          )}
        </Card.Body>
      </Card>
      
      {/* Script Navigator */}
      <Card className="border-0 shadow-sm">
        <div className="d-flex justify-content-between align-items-center bg-primary text-white p-2 rounded-top">
          <span className="fw-bold">Script Navigator</span>
          <div>
            <Button 
              variant="outline-light" 
              size="sm" 
              className="me-2" 
              onClick={() => setShowNotes(!showNotes)}
            >
              <FaNotesMedical /> {showNotes ? 'Hide Notes' : 'Show Notes'}
            </Button>
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={handleSaveProgress}
              disabled={!isActiveSession}
            >
              <FaBookmark /> Save Progress
            </Button>
          </div>
        </div>
        
        <Card.Body>
          {showNotes && (
            <Form className="mb-4">
              <Form.Group>
                <Form.Label>Call Notes</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={notes} 
                  onChange={handleNotesChange}
                  placeholder="Add notes about this call here..."
                />
              </Form.Group>
            </Form>
          )}
          
          <div className="script-navigator">
            {/* Script Title */}
            <h4 className="script-title">{currentScript.title}</h4>
            
            {/* Script Content */}
            <div className="script-content p-3 bg-light rounded mb-4">
              {currentScript.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            
            {/* Response Options */}
            {currentScript.responseOptions && currentScript.responseOptions.length > 0 && (
              <div className="response-options mb-4">
                <h6>Select Customer Response:</h6>
                <ListGroup>
                  {currentScript.responseOptions.map((option) => (
                    <ListGroup.Item 
                      key={option.id}
                      action
                      onClick={() => handleResponseSelect(option.nextScript)}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {option.label}
                      <FaChevronRight size={14} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between align-items-center">
              {/* Script History Navigation */}
              <div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="me-2"
                  onClick={goBackInHistory}
                  disabled={historyIndex <= 0}
                  title="Go back to previous script section"
                >
                  <FaStepBackward /> Back in History
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={goForwardInHistory}
                  disabled={historyIndex >= scriptHistory.length - 1}
                  title="Go forward in script history"
                >
                  <FaStepForward /> Forward in History
                </Button>
              </div>
              
              {/* Standard Navigation */}
              <div>
                <Button 
                  variant="outline-secondary" 
                  className="me-2"
                  onClick={goToPrevScript}
                  disabled={currentScript.id === 1}
                >
                  <FaChevronLeft /> Previous
                </Button>
                
                <Button 
                  variant="outline-primary" 
                  onClick={goToNextScript}
                  disabled={currentScript.id === 'end' || !currentScript.responseOptions || currentScript.responseOptions.length === 0}
                >
                  Next <FaChevronRight />
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
        
        {/* Script Navigation Accordion */}
        <Card.Footer className="bg-white">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Script Navigation</Accordion.Header>
              <Accordion.Body>
                <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {scripts.map((script) => (
                    <ListGroup.Item 
                      key={script.id}
                      action
                      active={currentScript.id === script.id}
                      onClick={() => setCurrentScriptIndex(script.id)}
                    >
                      {script.title}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Footer>
      </Card>
      
      {/* Lead Form Modal */}
      <Modal 
        show={showLeadForm} 
        onHide={() => {
          setShowLeadForm(false);
          setIsEditing(false);
        }} 
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>{currentLead.id ? 'Edit Lead' : 'Create New Lead'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name*</Form.Label>
                  <Form.Control 
                    type="text"
                    name="firstName"
                    value={currentLead.firstName}
                    onChange={handleLeadChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name*</Form.Label>
                  <Form.Control 
                    type="text"
                    name="lastName"
                    value={currentLead.lastName}
                    onChange={handleLeadChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email"
                    name="email"
                    value={currentLead.email}
                    onChange={handleLeadChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>Phone</Form.Label>
                  <Col sm={9}>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        name="phone"
                        value={currentLead.phone}
                        onChange={handleLeadChange}
                        placeholder="Enter phone number"
                      />
                      {isEditing && currentLead.phone && (
                        <div className="ms-2">
                          <PhoneContact phoneNumber={currentLead.phone} buttonVariant="outline-secondary" />
                        </div>
                      )}
                    </div>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control 
                    type="text"
                    name="company"
                    value={currentLead.company}
                    onChange={handleLeadChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control 
                    type="text"
                    name="title"
                    value={currentLead.title}
                    onChange={handleLeadChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Lead Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={currentLead.type}
                    onChange={handleLeadChange}
                  >
                    {leadTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Source</Form.Label>
                  <Form.Select
                    name="source"
                    value={currentLead.source}
                    onChange={handleLeadChange}
                  >
                    {leadSources.map(source => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={currentLead.status}
                    onChange={handleLeadChange}
                  >
                    {leadStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control 
                type="text"
                value={currentLead.tags && currentLead.tags.length > 0 ? currentLead.tags.join(', ') : ''}
                onChange={handleTagsChange}
                placeholder="e.g. important, follow-up, interested"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control 
                type="text"
                name="assignedTo"
                value={currentLead.assignedTo}
                onChange={handleLeadChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                name="notes"
                value={currentLead.notes || notes}
                onChange={handleLeadChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {currentLead.id && (
            <Button 
              variant="danger" 
              className="me-auto"
              onClick={() => {
                setShowLeadForm(false);
                setShowDeleteConfirm(true);
              }}
            >
              <FaTrash /> Delete Lead
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowLeadForm(false);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowLeadForm(false);
              setShowLeadSaveConfirm(true);
            }}
            disabled={!currentLead.firstName || !currentLead.lastName}
          >
            {currentLead.id ? 'Update Lead' : 'Create Lead'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Lead Save Confirmation Modal */}
      <Modal 
        show={showLeadSaveConfirm} 
        onHide={() => setShowLeadSaveConfirm(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{currentLead.id ? 'Update Lead' : 'Create Lead'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {currentLead.id ? 'update' : 'create'} this lead?
          
          <div className="mt-3">
            <strong>Name:</strong> {currentLead.firstName} {currentLead.lastName}<br />
            <strong>Company:</strong> {currentLead.company || 'Not specified'}<br />
            <strong>Status:</strong> {leadStatuses.find(s => s.value === currentLead.status)?.label || currentLead.status}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLeadSaveConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveLead}>
            {currentLead.id ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteConfirm} 
        onHide={() => setShowDeleteConfirm(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-danger">
            <strong>Warning:</strong> This action cannot be undone.
          </div>
          <p className="mt-3">
            Are you sure you want to delete the lead for {currentLead.firstName} {currentLead.lastName} 
            {currentLead.company ? ` from ${currentLead.company}` : ''}?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteLead}>
            Delete Lead
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Lead Browser Modal */}
      <Modal 
        show={showLeadBrowser} 
        onHide={() => {
          setShowLeadBrowser(false);
          setSearchQuery('');
          setFilteredLeads([]);
        }}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Browse Leads</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Filter leads..."
            className="mb-3"
            value={searchQuery}
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
              
              // When in the modal, show all matching results
              if (!query.trim()) {
                setFilteredLeads(allLeads);
              } else {
                setFilteredLeads(allLeads.filter(lead => {
                  const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
                  const company = (lead.company || '').toLowerCase();
                  const email = (lead.email || '').toLowerCase();
                  const searchTerm = query.toLowerCase();
                  
                  return fullName.includes(searchTerm) || 
                        company.includes(searchTerm) || 
                        email.includes(searchTerm);
                }));
              }
            }}
          />
          
          <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <Table hover responsive>
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Last Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(searchQuery ? filteredLeads : allLeads).length > 0 ? (
                  (searchQuery ? filteredLeads : allLeads).map(lead => (
                    <tr key={lead.id}>
                      <td>{lead.firstName} {lead.lastName}</td>
                      <td>{lead.company || '-'}</td>
                      <td>
                        <Badge bg={
                          lead.status === 'won' ? 'success' : 
                          lead.status === 'lost' ? 'danger' : 
                          lead.status === 'negotiation' ? 'warning' :
                          'primary'
                        }>
                          {leadStatuses.find(s => s.value === lead.status)?.label || lead.status}
                        </Badge>
                      </td>
                      <td>{leadTypes.find(t => t.value === lead.type)?.label || lead.type}</td>
                      <td>{lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : '-'}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            loadSelectedLead(lead);
                            setShowLeadBrowser(false);
                            setSearchQuery('');
                          }}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3">
                      No leads found. {searchQuery ? `No results for "${searchQuery}"` : 'Create a new lead to get started.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowLeadBrowser(false);
            setSearchQuery('');
            setFilteredLeads([]);
          }}>
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={() => {
              setShowLeadBrowser(false);
              setSearchQuery('');
              setFilteredLeads([]);
              setShowLeadForm(true);
              setIsEditing(false);
            }}
          >
            <FaPlus /> Create New Lead
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeadScriptNavigator;