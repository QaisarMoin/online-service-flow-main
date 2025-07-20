export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  estimatedTime: string;
  category: string;
  isPopular?: boolean;
  requiredDocuments: string[];
  instructions?: string[];
  processingSteps?: string[];
}

export const services: Service[] = [
  {
    id: "aadhar-update",
    title: "Aadhar Card Update",
    description: "Update your Aadhar card details including name, address, mobile number, and photo",
    price: 150,
    estimatedTime: "2-3 business days",
    category: "Identity Documents",
    isPopular: true,
    requiredDocuments: [
      "Original Aadhar Card (both sides scan)",
      "Proof of Address (Electricity/Water bill less than 3 months old)",
      "Passport-sized photograph (recent)",
      "Mobile number for OTP verification",
    ],
    instructions: [
      "Ensure all documents are clearly visible and readable",
      "Photos should be recent and passport-sized",
      "Address proof should be in your name",
    ],
    processingSteps: [
      "Document verification and validation",
      "Online form submission to UIDAI",
      "Biometric verification (if required)",
      "Processing and approval",
      "Updated Aadhar card delivery",
    ],
  },
  {
    id: "samagra-id",
    title: "Samagra ID Registration/Update",
    description: "New Samagra ID registration or update existing details for MP government schemes",
    price: 100,
    estimatedTime: "1-2 business days",
    category: "Government ID",
    isPopular: true,
    requiredDocuments: [
      "Aadhar Card (scan copy)",
      "Ration Card (if available)",
      "Income Certificate",
      "Caste Certificate (if applicable)",
      "Bank Account Details",
    ],
    instructions: [
      "Provide accurate family details",
      "Income certificate should be recent",
      "All family members' details required for family ID",
    ],
    processingSteps: [
      "Family details verification",
      "Document validation",
      "Online portal submission",
      "ID generation",
      "SMS/Email confirmation",
    ],
  },
  {
    id: "electricity-bill",
    title: "Electricity Bill Payment",
    description: "Pay your MP electricity board bills online with instant confirmation",
    price: 25,
    estimatedTime: "Instant",
    category: "Bill Payments",
    requiredDocuments: [
      "Latest electricity bill copy",
      "Consumer number",
      "Payment amount confirmation",
    ],
    instructions: [
      "Have your consumer number ready",
      "Verify bill amount before payment",
      "Payment receipt will be sent via SMS/Email",
    ],
    processingSteps: [
      "Bill details verification",
      "Online payment processing",
      "Payment confirmation",
      "Receipt generation",
    ],
  },
  {
    id: "income-certificate",
    title: "Income Certificate",
    description: "Apply for income certificate from competent authority for various purposes",
    price: 200,
    estimatedTime: "5-7 business days",
    category: "Certificates",
    requiredDocuments: [
      "Aadhar Card",
      "Samagra ID",
      "Bank statements (last 3 months)",
      "Salary certificate (if employed)",
      "Property documents (if any)",
      "Affidavit on stamp paper",
    ],
    instructions: [
      "All income sources must be declared",
      "Documents should be recent and valid",
      "Affidavit should be notarized",
    ],
    processingSteps: [
      "Application form filling",
      "Document verification",
      "Field verification (if required)",
      "Authority approval",
      "Certificate issuance",
    ],
  },
  {
    id: "caste-certificate",
    title: "Caste Certificate",
    description: "Apply for caste certificate for SC/ST/OBC categories",
    price: 180,
    estimatedTime: "7-10 business days",
    category: "Certificates",
    requiredDocuments: [
      "Aadhar Card",
      "Samagra ID",
      "Father's caste certificate (if available)",
      "Birth certificate",
      "Educational certificates",
      "Affidavit on stamp paper",
    ],
    instructions: [
      "Lineage documents may be required",
      "All certificates should be original scans",
      "Additional verification may be needed",
    ],
    processingSteps: [
      "Application submission",
      "Genealogy verification",
      "Field inquiry",
      "Committee approval",
      "Certificate dispatch",
    ],
  },
  {
    id: "birth-certificate",
    title: "Birth Certificate",
    description: "Apply for birth certificate from municipal corporation/gram panchayat",
    price: 120,
    estimatedTime: "3-4 business days",
    category: "Certificates",
    requiredDocuments: [
      "Hospital discharge summary/Birth record",
      "Parents' Aadhar cards",
      "Parents' marriage certificate",
      "Affidavit (if late registration)",
    ],
    instructions: [
      "For births within 1 year - no additional requirements",
      "For late registration - affidavit and additional documents needed",
      "Hospital records must be authentic",
    ],
    processingSteps: [
      "Document verification",
      "Registration in municipal records",
      "Approval by competent authority",
      "Certificate printing",
      "Delivery/Collection",
    ],
  },
  {
    id: "pension-application",
    title: "Pension Scheme Application",
    description: "Apply for various government pension schemes (Old age, Widow, Disability)",
    price: 300,
    estimatedTime: "10-15 business days",
    category: "Social Welfare",
    requiredDocuments: [
      "Aadhar Card",
      "Samagra ID",
      "Age proof (Birth certificate/School certificate)",
      "Income certificate",
      "Bank account details with passbook",
      "Medical certificate (for disability pension)",
      "Death certificate of spouse (for widow pension)",
    ],
    instructions: [
      "Different documents for different pension types",
      "Age criteria must be met",
      "Bank account should be active",
      "Medical certificate from government doctor",
    ],
    processingSteps: [
      "Eligibility verification",
      "Document validation",
      "Field verification",
      "Committee approval",
      "Pension activation",
    ],
  },
  {
    id: "water-bill",
    title: "Water Bill Payment",
    description: "Pay municipal water bills and get instant payment confirmation",
    price: 20,
    estimatedTime: "Instant",
    category: "Bill Payments",
    requiredDocuments: [
      "Latest water bill",
      "Consumer number",
    ],
    instructions: [
      "Verify consumer number",
      "Check bill amount",
      "Payment receipt sent via SMS",
    ],
    processingSteps: [
      "Bill verification",
      "Payment processing",
      "Confirmation",
      "Receipt generation",
    ],
  },
];