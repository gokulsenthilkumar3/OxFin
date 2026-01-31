// Auto-Bill Parser Utilities
export interface ParsedBill {
    merchant: string;
    amount: number;
    dueDate: string;
    accountId?: string;
    category: string;
    source: 'sms' | 'email' | 'whatsapp';
}

// Regex patterns for bill extraction
const AMOUNT_PATTERN = /(?:Rs\.?|INR|₹|\$|USD)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i;
const DATE_PATTERN = /(?:due\s+(?:on|date|by)?:?\s*)?(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i;
const CONSUMER_ID_PATTERN = /(?:consumer\s+id|account\s+(?:no|number)|id):?\s*([A-Z0-9]{8,})/i;

// Common bill keywords by category
const BILL_CATEGORIES = {
    electricity: ['electricity', 'power', 'electric bill', 'bescom', 'msedcl'],
    water: ['water', 'water bill', 'municipal'],
    internet: ['internet', 'broadband', 'wifi', 'fiber'],
    mobile: ['mobile', 'phone', 'airtel', 'jio', 'vodafone'],
    gas: ['gas', 'lpg', 'cylinder'],
    insurance: ['insurance', 'policy', 'premium'],
};

// Parse SMS/Email text for bill information
export const parseBillText = (text: string, source: 'sms' | 'email' | 'whatsapp'): ParsedBill | null => {
    const lowerText = text.toLowerCase();

    // Extract amount
    const amountMatch = text.match(AMOUNT_PATTERN);
    if (!amountMatch) return null;
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));

    // Extract due date
    const dateMatch = text.match(DATE_PATTERN);
    const dueDate = dateMatch ? dateMatch[1] : 'Not specified';

    // Extract account/consumer ID
    const idMatch = text.match(CONSUMER_ID_PATTERN);
    const accountId = idMatch ? idMatch[1] : undefined;

    // Determine category
    let category = 'Other';
    let merchant = 'Unknown Merchant';

    for (const [cat, keywords] of Object.entries(BILL_CATEGORIES)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
            category = cat.charAt(0).toUpperCase() + cat.slice(1);
            merchant = keywords.find(k => lowerText.includes(k))?.toUpperCase() || merchant;
            break;
        }
    }

    return {
        merchant,
        amount,
        dueDate,
        accountId,
        category,
        source,
    };
};

// Validate Indian Consumer ID format (example: 8-15 alphanumeric)
export const validateIndianConsumerId = (id: string): boolean => {
    return /^[A-Z0-9]{8,15}$/i.test(id);
};

// Validate Chinese account format (example pattern)
export const validateChineseAccountId = (id: string): boolean => {
    return /^[\u4e00-\u9fa5A-Z0-9]{6,20}$/i.test(id);
};

// Mock bill parsing examples
export const mockBillTexts = [
    {
        text: "Your electricity bill of Rs. 1,245.50 is due on 25/01/2026. Consumer ID: ELEC12345678. Please pay before the due date to avoid late fees.",
        source: 'sms' as const,
    },
    {
        text: "Airtel Mobile Bill: Amount Due: ₹599.00. Due Date: 28/01/2026. Account Number: MOB987654321. Thank you for being with us.",
        source: 'email' as const,
    },
    {
        text: "Internet Bill Alert! Your broadband bill of $45.99 is due by 30-01-2026. ID: INET45678901.",
        source: 'whatsapp' as const,
    },
];

// Parse all mock bills
export const parseMockBills = (): ParsedBill[] => {
    return mockBillTexts
        .map(({ text, source }) => parseBillText(text, source))
        .filter((bill): bill is ParsedBill => bill !== null);
};
