import React, { useState, useRef, useEffect } from 'react';

// --- Configuration ---
// The API URL for the backend service.
const API_BASE_URL = 'https://web-production-21f8.up.railway.app/';

// --- Hardcoded Data Definitions ---

// Data for CP23 Notice
const cp23MockData = {
    noticeType: 'CP23',
    taxYear: '2023',
    noticeFor: 'JAMES Q. SPARROW ', // Placeholder
    address: '22 BOULDER STREET HANSON, CT 00000-7253', // Placeholder
    ssn: 'NNN-NN-NNNN', // Placeholder
    amountDue: '$328.45',
    payBy: 'March 15, 2024',
    summary: {
        title: 'Quick Overview of the Notice',
        overview: "The IRS sent Notice CP23 because during their review, they identified issues with your tax return. Main reasons for CP23 Notices include Payment Discrepancies, Administrative Changes, or Tax Calculation Adjustments made by the IRS due to documentation issues or adjustments in income, deductions, exemptions, or credits.",
        keyPoints: [
            "This is a CP23 notice regarding changes made by the IRS to your 2023 tax return",
            "Action Required: You have 30 days to either pay the additional amount due ($328.45) or contact the IRS if you disagree with the adjustment"
        ]
    },
    why: [
        { title: "Notice Type: CP23", text: "This is a CP23 notice regarding changes made by the IRS to your 2023 tax return. The IRS indicates your State and Local Tax (SALT) deduction exceeded the $10,000 annual limit imposed by current tax law." },
        { title: "What Is The SALT Deduction Limit?", text: "Click to learn more about the SALT Deduction Limit.", isClickable: true, id: 'salt' },
        { title: "Tax Year 2017", text: "This notice pertains to adjustments made to your 2017 tax return filing." },
        { title: "What Happens Next?", text: "The IRS has automatically corrected your tax return by reducing your itemized deductions to comply with federal tax law limits. This correction increased your taxable income and resulted in additional tax, penalty, and interest charges. If you believe there's an error, gather your supporting tax documents and contact the IRS within 30 days to dispute the adjustment." }
    ],
    breakdown: {
        // This is a simplified table. The prompt's table is complex and better represented as an image or a more complex component.
        // For this implementation, we'll summarize the key financial figures.
        items: [
            { item: "Federal Income Tax Difference", amount: "-$278.00", detail: "Income increase due to corrections" },
            { item: "SALT Deduction Difference", amount: "$5,000.00", detail: "Correction by IRS to meet $10k limit" },
            { item: "Taxable Income Increase", amount: "-$5,000.00", detail: "" },
            { item: "Additional Tax (22% bracket)", amount: "-$278.00", detail: "Tax increase from corrections" },
            { item: "Failure-to-Pay Penalty (0.5%)", amount: "-$13.90", detail: "0.5% per month on unpaid balance" },
            { item: "Interest on Underpayment", amount: "-$36.55", detail: "Compounded daily on total balance" },
            { item: "Total Amount Due", amount: "$328.45", detail: "Final balance to be paid", isTotal: true }
        ],
        notes: []
    },
    fix: {
        steps: [
            {
                title: "Step 1: Check Your Numbers",
                points: [
                    "Add up your state and local taxes: State income tax + property tax + local taxes",
                    "Confirm it's over $10,000: If your total is more than $10,000, the IRS adjustment is correct",
                    "Check your filing status: Make sure you're using the right limit ($10,000 or $5,000)",
                    "Look at your tax forms: Review Schedule A to see what you claimed"
                ]
            },
            {
                title: "If The IRS Is Right:",
                points: [
                    "Pay the amount due: $328.45 by March 15, 2024",
                    "Use the payment slip that came with this notice",
                    "Keep this notice with your tax records",
                    "Remember the $10,000 limit for next year's taxes"
                ]
            },
            {
                title: "If You Think The IRS Is Wrong:",
                points: [
                    "Call within 30 days: 1-800-829-0922",
                    "Have these ready: Your tax return, state tax forms, property tax bills",
                    "Common reasons to call: IRS double-counted something or miscategorized a deduction",
                    "Send a letter if needed: Include copies of your tax documents"
                ]
            }
        ]
    },
    // Payment and help sections can be reused or customized if needed
    paymentOptions: [
        { icon: '🌐', title: "Online Payment", details: ["Website: www.irs.gov/payments", "Amount Due: $328.45", "Options: Bank transfer, debit/credit card"] },
        { icon: '📅', title: "Payment Plan Setup", details: ["Online: www.irs.gov/paymentplan", "Note: Must be current on all tax filings"] },
    ],
    help: {
        irsPhone: "1-800-829-0922",
        tas: "The Taxpayer Advocate Service (TAS) can help protect your taxpayer rights. Visit www.taxpayeradvocate.irs.gov or call 1-877-777-4778."
    },
    emailTemplate: `Subject: Important: Action Required - IRS Notice CP23

Dear [Taxpayer Name],

This is a follow-up regarding the IRS Notice CP23 for tax year 2023. The notice indicates a balance due of $328.45, which must be paid by March 15, 2024.

The IRS made adjustments to your return because the State and Local Tax (SALT) deduction claimed exceeded the $10,000 limit.

Please review the notice and your tax documents. If you agree with the changes, please submit the payment by the due date. If you disagree, you must contact the IRS within 30 days.

Best regards,
[Your Name]`,
    irsResponseTemplate: `Internal Revenue Service
[IRS Processing Center Address from Notice]

Re: Notice CP23 - Response
Taxpayer: [Taxpayer Name]
SSN: XXX-XX-[Last 4 digits]
Tax Year: 2023
Notice Date: [Notice Date]

Dear IRS Representative,

I am writing in response to the CP23 notice dated [Notice Date].

[SELECT ONE OPTION]

Option 1: I agree with the changes and have submitted payment for the full amount of $328.45.

Option 2: I disagree with the changes. [Explain why you disagree and include supporting documents].

Sincerely,
[Signature]
[Printed Name]`
};

// Data for CP503C Notice (from original commented code)
const cp503cMockData = {
    noticeType: 'CP503C',
    taxYear: '2019',
    noticeFor: 'MICHAEL & JENNIFER L. RODRIGUEZ',
    address: '789 OAK STREET\nPHOENIX, AZ 85001-5678',
    ssn: 'NNN-NN-NNNN',
    amountDue: '$9,533.53',
    payBy: 'March 15, 2025',
    summary: {
        title: 'IRS Notice CP503 is a second reminder from the IRS',
        overview: "The IRS sent Notice CP503 because they haven't received payment or a response to earlier communications about your unpaid tax balance. This is the second reminder and encourages you to act promptly to avoid further penalties or enforced collection efforts, such as a federal tax lien.",
        keyPoints: [
            "This is your second notice regarding unpaid taxes",
            "Previous communications were sent but no response received",
            "Immediate action required to prevent escalation",
            "Risk of federal tax lien if unresolved"
        ]
    },
    why: [
        { title: "Notice Type: CP503", text: "This is your second reminder about unpaid taxes. The IRS has already sent you a first notice (CP501) which was not resolved." },
        { title: "Tax Year: 2016", text: "The unpaid balance relates to your 2016 tax return (Form 1040A) filed for the tax year ending December 31, 2016." },
        { title: "🚩 What Happens Next?", text: "If this notice is not addressed, the IRS may take collection actions including liens, levies, or wage garnishment." }
    ],
    breakdown: {
        items: [
            { item: "Original amount owed", amount: "$9,444.07", detail: "Tax liability from 2016 Form 1040A" },
            { item: "Failure-to-pay penalty", amount: "$34.98", detail: "Internal Revenue Code Section 6651" },
            { item: "Interest charges", amount: "$54.48", detail: "Internal Revenue Code Section 6601" },
            { item: "Total Amount Due", amount: "$9,533.53", detail: "As of notice date", isTotal: true }
        ],
        notes: [
            { title: "Legal Framework", text: "Internal Revenue Code Section 6601: Authorizes interest on unpaid taxes from the due date until paid in full." },
            { title: "Penalty Authority", text: "Internal Revenue Code Sections 6651 & 6654: Establish failure-to-pay penalties for late tax payments." }
        ]
    },
    fix: {
        steps: [
            {
                title: "Step 1: Review Your Records First",
                points: [
                    "Verify all payments made: Check bank statements, canceled checks, and payment confirmations",
                    "Review payment timing: Ensure payments were processed by the IRS before the due date",
                ]
            },
            {
                title: "Step 2: If You Agree with the Amount",
                points: [
                    "Pay immediately to stop interest and penalties from accruing",
                    "Set up installment agreement if you cannot pay in full",
                ]
            },
            {
                title: "If You Disagree with the Amount",
                points: [
                    "Contact IRS immediately - don't wait for the deadline",
                    "Gather documentation (returns, payment records, correspondence)",
                ]
            }
        ]
    },
    paymentOptions: [
        { icon: '🌐', title: "Online Payment", details: ["Website: www.irs.gov/payments", "Amount Due: $9,533.53", "Options: Bank transfer, debit/credit card", "Status: ✅ Available 24/7"] },
        { icon: '📞', title: "Phone Payment", details: ["Number: 1-888-PAY-1040", "Hours: 24/7 automated system", "Status: ✅ Immediate processing"] },
        { icon: '📮', title: "Mail Payment", details: ["Address: Internal Revenue Service P.O. Box 1218 Charlotte, NC 28201-1218", "Include: Payment voucher from notice", "Status: ⚠️ May be too slow for this notice"] },
        { icon: '📅', title: "Payment Plan Setup", details: ["Online: www.irs.gov/paymentplan", "Setup Fee: $31 online, $149 phone/mail", "Status: ✅ Prevents collection actions"] },
    ],
    help: {
        irsPhone: "1-800-829-0922",
        tas: "The Taxpayer Advocate Service (TAS) can help protect your taxpayer rights. Visit www.taxpayeradvocate.irs.gov or call 1-877-777-4778."
    },
    emailTemplate: `Subject: Important: Action Required - Second IRS notice balance due to be paid

Dear [Taxpayer Name],

You have received the: CP503 (Second Notice) for Tax Year: 2016 indicating a balance due for $9,533.53.

This is the second reminder, and it's crucial that you take action promptly to avoid further penalties, interest charges, or enforced collection efforts such as a federal tax lien.

If you have any questions or need assistance, please don't hesitate to contact me.

Best regards,
[Your Name]`,
    irsResponseTemplate: `Internal Revenue Service
[IRS Processing Center Address from Notice]

Re: Notice CP503 - Second Notice Response
Taxpayer: [Taxpayer Name]
SSN: XXX-XX-[Last 4 digits]
Tax Year: 2016
Notice Date: [Notice Date]

Dear IRS Representative,

I am writing in response to the CP503 notice dated [Notice Date] regarding an unpaid tax balance of $9,533.53 for tax year 2016.

[SELECT RESPONSE OPTION]

Sincerely,
[Signature]
[Printed Name]`
};

// --- Data ---
const countryCodes = [
    { "name": "United States", "dial_code": "+1", "code": "US" },
    { "name": "United Kingdom", "dial_code": "+44", "code": "GB" },
    { "name": "Canada", "dial_code": "+1", "code": "CA" },
    { "name": "Australia", "dial_code": "+61", "code": "AU" },
    { "name": "Germany", "dial_code": "+49", "code": "DE" }
];

// --- API Service ---
// const api = {
//     async register(payload) {
//         console.log("Registering:", payload);
//         // This simulates a real API call for registration
//         const response = await fetch(`${API_BASE_URL}/register`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         }).catch(e => console.error("API call failed:", e));
//         // For demo purposes, we'll return a success response without a real backend
//         return { success: true, user: { id: Date.now(), ...payload } };
//     },
//     async login(payload) {
//         console.log("Logging in:", payload);
//         // This simulates a real API call for login
//         const response = await fetch(`${API_BASE_URL}/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         }).catch(e => console.error("API call failed:", e));
//         // For demo purposes, we'll return a success response
//         if (payload.email && payload.password) {
//             return { success: true, user: { id: Date.now(), firstName: "Alex", lastName: "Doe", email: payload.email } };
//         }
//         return { success: false, message: "Invalid credentials" };
//     },
//     // The summarize function is now handled locally in handleFileUpload
// };
const api = {
    async register(payload) {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return response.json();
    },
    async login(payload) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return response.json();
    },}

// --- SVG Icons ---
const UploadCloudIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" />
  </svg>
);

const EyeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

// --- Reusable UI Components ---

const Toast = ({ message, type, isActive }) => {
    if (!isActive) return null;
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className={`fixed bottom-5 right-5 ${bgColor} text-white py-3 px-6 rounded-lg shadow-lg animate-fade-in z-50`}>
            {message}
        </div>
    );
};

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-black">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-black transition-colors rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};

const PasswordStrengthMeter = ({ password }) => {
    const getStrength = () => {
        let score = 0;
        if (!password) return 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getStrength();
    const color = ['bg-slate-200', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength];
    const label = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][strength];

    return (
        <div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${(strength / 4) * 100}%` }}></div>
            </div>
            <p className="text-xs text-right text-slate-500 mt-1">{label}</p>
        </div>
    );
};

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-500" style={{borderColor: '#ff6b00'}}></div>
        <p className="text-black font-semibold text-lg">AI is analyzing your notice...</p>
        <p className="text-slate-500">This may take a moment. Please don't close the window.</p>
    </div>
);

// --- Screen Components ---

const AuthScreen = ({ isLogin, onSubmit, error, setView, clearFormFields }) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
        dob: '', mobileNumber: '', countryCode: '+1'
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCountryCodeChange = (code) => {
        setFormData(prev => ({ ...prev, countryCode: code }));
        setIsDropdownOpen(false);
        setCountrySearch('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (!isLogin) payload.mobileNumber = `${payload.countryCode}${payload.mobileNumber}`;
        onSubmit(payload);
    };

    const switchView = () => {
        clearFormFields();
        setView(isLogin ? 'register' : 'login');
    };

    const filteredCountries = countryCodes.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.dial_code.includes(countrySearch)
    );

    return (
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-black mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p className="text-center text-slate-500 mb-8">{isLogin ? "Please enter your details to sign in." : "Simplify your tax notices today."}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                        </div>
                        <input type="text" name="dob" placeholder="Date of Birth" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }} value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                        <div className="flex">
                            <div className="relative w-1/3" ref={dropdownRef}>
                                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full h-full bg-slate-50 border border-r-0 border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 px-3 py-3 text-slate-700 flex justify-between items-center">
                                    <span>{formData.countryCode}</span>
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-72 bg-white border border-slate-300 rounded-md shadow-lg">
                                        <input type="text" placeholder="Search..." value={countrySearch} onChange={e => setCountrySearch(e.target.value)} className="w-full px-3 py-2 border-b border-slate-200 focus:outline-none"/>
                                        <ul className="max-h-48 overflow-auto">
                                            {filteredCountries.map(country => (
                                                <li key={country.code} onClick={() => handleCountryCodeChange(country.dial_code)} className="px-4 py-2 text-slate-700 hover:bg-orange-100 cursor-pointer">
                                                    {country.name} ({country.dial_code})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <input type="tel" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="w-2/3 px-4 py-3 bg-white border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                        </div>
                    </>
                )}
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                <div className="relative">
                    <input type={isPasswordVisible ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                    <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500">
                        {isPasswordVisible ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                    </button>
                </div>
                {!isLogin && (
                    <>
                        <div className="relative">
                            <input type={isPasswordVisible ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                        </div>
                        <PasswordStrengthMeter password={formData.password} />
                    </>
                )}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-orange-200 !mt-6" style={{backgroundColor: '#ff6b00'}}>
                    {isLogin ? "Sign In" : "Create Account"}
                </button>
            </form>
            <p className="text-center text-sm text-slate-600 mt-6">
                {isLogin ? "No account?" : "Already have an account?"}
                <button onClick={switchView} className="font-semibold text-orange-500 hover:underline ml-1" style={{color: '#ff6b00'}}>{isLogin ? "Sign up" : "Sign in"}</button>
            </p>
        </div>
    );
};

const DashboardScreen = ({ user, handleLogout, history, handleHistoryClick, handleFileUpload }) => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    return (
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 max-w-4xl w-full animate-fade-in">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                    <p className="text-slate-500">Welcome back, {user?.firstName} {user?.lastName}!</p>
                </div>
                <div className="space-x-4">
                    <button onClick={() => setIsProfileModalOpen(true)} className="text-slate-500 hover:text-black font-semibold transition-colors">Profile</button>
                    <button onClick={handleLogout} className="text-slate-500 hover:text-black font-semibold transition-colors">Sign Out</button>
                </div>
            </header>

            <main className="grid lg:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-xl font-bold text-black mb-4">New Analysis</h2>
                    <UploadScreen handleFileUpload={handleFileUpload} />
                </section>
                
                <section className="flex flex-col">
                    <h2 className="text-xl font-bold text-black mb-4">Analysis History</h2>
                    <div className="bg-white p-6 rounded-xl border-2 border-slate-200 flex-grow">
                        {history.length > 0 ? (
                            <ul className="space-y-3">
                                {history.map(item => (
                                    <li key={item.id} onClick={() => handleHistoryClick(item)} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-orange-100 cursor-pointer transition-colors">
                                        <div>
                                            <p className="font-semibold text-black">{item.noticeFor}</p>
                                            <p className="text-sm text-slate-500">Notice: {item.noticeType}</p>
                                        </div>
                                        <span className="text-sm font-semibold" style={{color: '#ff6b00'}}>
                                            {item.amountDue}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-center text-slate-500">No past analyses found. Upload a PDF to begin.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="My Profile">
                <div className="space-y-2 text-black">
                    <p><strong>Full Name:</strong> {user?.firstName} {user?.lastName}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Date of Birth:</strong> {user?.dob || 'Not available'}</p>
                    <p><strong>Mobile Number:</strong> {user?.mobileNumber || 'Not available'}</p>
                    <p className="text-sm text-slate-500 pt-4">Profile editing is not yet available. Full details are shown for the current session after registration.</p>
                </div>
            </Modal>
        </div>
    );
};

const UploadScreen = ({ handleFileUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragEvents = (e, dragging) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragging);
    };

    const handleDrop = (e) => {
        handleDragEvents(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    };

    return (
        <div
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-white'}`}
            onDragEnter={e => handleDragEvents(e, true)}
            onDragLeave={e => handleDragEvents(e, false)}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
        >
            <UploadCloudIcon className={`mx-auto h-16 w-16 mb-4 transition-colors ${isDragging ? 'text-orange-600' : 'text-slate-400'}`} style={{color: isDragging ? '#ff6b00' : ''}} />
            <p className="mt-4 text-lg text-black font-semibold">Drop your PDF file here</p>
            <p className="text-sm text-slate-500 mt-1">or</p>
            <button type="button" className="mt-4 bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors" style={{backgroundColor: '#ff6b00'}}>
                Select a File
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileSelect} />
        </div>
    );
};

const SummaryScreen = ({ summaryData, resetApp, showToast }) => {
    const [activeSection, setActiveSection] = useState(null);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showIrsModal, setShowIrsModal] = useState(false);
    const [showSaltModal, setShowSaltModal] = useState(false);


    const accentColor = '#ff6b00';

    if (!summaryData) {
        return (
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full animate-fade-in text-center">
                <h2 className="text-2xl font-bold text-black mb-4">Data Not Available</h2>
                <p className="text-slate-600 mb-6">There was an issue loading the summary data.</p>
                <button onClick={resetApp} className="bg-slate-700 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-black transition-colors">
                    Back to Dashboard
                </button>
            </div>
        );
    }
    
    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const copyToClipboard = (text) => {
        // A fallback for environments where navigator.clipboard is not available.
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Copied to clipboard!', 'success');
        } catch (err) {
            showToast('Failed to copy.', 'error');
        }
    };

    const ActiveSectionContent = () => {
        if (!activeSection) return null;

        let title, content;

        switch (activeSection) {
            case 'summary':
                title = `Understanding Your Notice (${summaryData.noticeType})`;
                content = (
                    <div>
                        <p className="text-slate-600 mb-4">{summaryData.summary?.overview}</p>
                        <h4 className="font-bold text-black mb-2">Key Points:</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                            {summaryData.summary?.keyPoints?.map((point, i) => <li key={i}>{point}</li>)}
                        </ul>
                    </div>
                );
                break;
            case 'why':
                title = "Why did I receive this?";
                content = (
                    <div>
                        {summaryData.why?.map((item, i) => (
                            <div key={i} className="mb-4 last:mb-0">
                                <h4 className="font-bold text-black">{item.title}</h4>
                                {item.isClickable ? (
                                    <p className="text-slate-600 underline cursor-pointer hover:text-orange-500" onClick={() => setShowSaltModal(true)}>{item.text}</p>
                                ) : (
                                    <p className="text-slate-600">{item.text}</p>
                                )}
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'breakdown':
                 title = "Amount Breakdown";
                 content = (
                     <div>
                         <table className="w-full text-sm mb-4 text-black">
                             <tbody>
                                 {summaryData.breakdown?.items?.map((item, i) => (
                                     <tr key={i} className={`border-b ${item.isTotal ? 'font-bold' : ''}`} style={{borderColor: '#F1F5F9'}}>
                                         <td className="p-2">{item.item}</td>
                                         <td className={`p-2 text-right font-mono ${item.isTotal ? 'text-orange-500' : ''}`}>{item.amount}</td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                         <div className="space-y-4">
                             {summaryData.breakdown?.notes?.map((note, i) => (
                                 <div key={i}>
                                     <h5 className="font-bold text-black">{note.title}</h5>
                                     <p className="text-sm text-slate-600">{note.text}</p>
                                 </div>
                             ))}
                         </div>
                     </div>
                 );
                 break;
            case 'fix':
                title = "How should I fix this?";
                content = (
                    <div>
                        {summaryData.fix?.steps?.map((item, i) => (
                            <div key={i} className="mb-4 last:mb-0">
                                <h4 className="font-bold text-black">{item.title}</h4>
                                <ul className="list-disc list-inside text-slate-600">
                                    {item.points.map((point, j) => <li key={j}>{point}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'payment':
                title = "Payment Options";
                content = (
                    <div className="grid md:grid-cols-2 gap-4">
                        {summaryData.paymentOptions?.map((item, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg border border-slate-200">
                                <h4 className="font-bold text-black flex items-center gap-2"><span className="text-xl">{item.icon}</span>{item.title}</h4>
                                <ul className="text-sm text-slate-600 mt-2 space-y-1">
                                    {item.details.map((detail, j) => <li key={j}>{detail}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
                break;
            default:
                return null;
        }

        return (
            <div className="transition-all duration-500 overflow-hidden rounded-lg bg-slate-50 max-h-screen">
                <div className="flex justify-between items-center p-4">
                       <h3 className="text-lg font-bold text-black flex items-center gap-4">
                           <span className="text-2xl" style={{color: accentColor}}>{
                               {
                                   summary: '📄',
                                   why: '❓',
                                   breakdown: '💲',
                                   fix: '✔️',
                                   payment: '💳',
                                   help: '🙋'
                               }[activeSection]
                           }</span>
                           {title}
                       </h3>
                       <button onClick={() => toggleSection(null)} className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-transform transform hover:scale-110 text-xl">×</button>
                </div>
                <div className="p-6 border-t border-slate-200">
                    {content}
                </div>
            </div>
        );
    };
    
    const InfoTile = ({ id, icon, title, preview }) => (
         <div onClick={() => toggleSection(id)} className={`p-4 cursor-pointer transition-all duration-300 border rounded-lg hover:shadow-md hover:-translate-y-0.5 bg-white ${activeSection === id ? 'border-orange-500' : 'border-slate-200'}`}>
             <div className="flex items-center gap-4">
                 <div className="text-2xl" style={{color: accentColor}}>{icon}</div>
                 <div className="flex-1">
                     <p className="text-base font-semibold text-black">{title}</p>
                     <p className="text-slate-500 text-sm">{preview}</p>
                 </div>
                 <div className="text-orange-500 transition-transform duration-300" style={{transform: activeSection === id ? 'rotate(90deg)' : '', color: accentColor}}>▶</div>
             </div>
         </div>
    );

    return (
        <div className="w-full font-sans">
             <div className="container max-w-4xl mx-auto">
                 <div className="header text-center mb-8">
                     <h1 className="text-black text-4xl font-bold mb-2">IRS Notice Analysis</h1>
                     <p className="text-slate-500 text-lg">Professional breakdown and action plan for your tax notice</p>
                 </div>
                 <div className="notice-container bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                     <div className="notice-header text-white p-8 text-center relative" style={{backgroundColor: accentColor}}>
                         <div className="notice-title text-2xl font-bold mb-4 relative z-10">Summary of Your {summaryData.taxYear} IRS Notice {summaryData.noticeType}</div>
                         <div className="notice-type bg-white bg-opacity-20 px-4 py-2 rounded-full inline-block font-semibold relative z-10">Analysis Complete</div>
                     </div>

                     <div className="notice-body p-8">
                         <div className="client-info bg-slate-50 rounded-xl p-6 mb-8 border-l-4" style={{borderColor: accentColor}}>
                             <div className="client-name text-xl font-bold text-black mb-1">{summaryData.noticeFor}</div>
                             <div className="client-address text-slate-600 mb-4 whitespace-pre-line">{summaryData.address}</div>
                             <div className="ssn-info text-sm text-slate-500">Social Security Number: {summaryData.ssn}</div>
                             <div className="ssn-info text-sm mt-2 font-bold" style={{color: accentColor}}>Tax Year: {summaryData.taxYear}</div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                             <div className="p-6 rounded-xl text-white text-center shadow-lg flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, #ff6b00 0%, #ff8533 100%)' }}>
                                 <div className="text-sm opacity-90 mb-2">Total Amount Due</div>
                                 <div className="text-4xl font-bold mb-3">{summaryData.amountDue}</div>
                             </div>
                             <div className="p-6 rounded-xl text-black text-center shadow-lg flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)' }}>
                                 <div className="text-sm opacity-80 mb-2">Payment Due Date</div>
                                 <div className="text-3xl font-bold mb-3">{summaryData.payBy}</div>
                                 <div className="inline-flex items-center justify-center gap-2 font-bold text-sm self-center">
                                     <span className="text-lg">⏰</span>
                                     Immediate Action Required
                                 </div>
                             </div>
                         </div>

                         <div className="space-y-2">
                             <InfoTile id="summary" icon="📄" title="Understanding Your Notice" preview="What this notice means" />
                             <InfoTile id="why" icon="❓" title="Why did I receive this?" preview="Details from the IRS" />
                             <InfoTile id="breakdown" icon="💲" title="Amount Breakdown" preview="Itemized charges" />
                             <InfoTile id="fix" icon="✔️" title="How should I fix this?" preview="Next steps and options" />
                             <InfoTile id="payment" icon="💳" title="Payment Options" preview="Ways to pay your balance" />
                         </div>
                         
                         <div className="mt-8">
                             <ActiveSectionContent />
                         </div>
                         
                         <div className="text-center mt-8 pt-6 border-t border-slate-200">
                             <div className="flex justify-center gap-4 mb-4">
                                 <button onClick={() => setShowEmailModal(true)} className="font-semibold py-2 px-5 rounded-lg transition-colors bg-orange-500 text-white hover:bg-orange-600" style={{backgroundColor: accentColor}}>Email to Taxpayer</button>
                                 <button onClick={() => setShowIrsModal(true)} className="font-semibold py-2 px-5 rounded-lg transition-colors bg-orange-500 text-white hover:bg-orange-600" style={{backgroundColor: accentColor}}>Draft IRS Response</button>
                             </div>
                             <button onClick={resetApp} className="font-bold py-3 px-8 rounded-lg transition-colors bg-orange-500 text-white hover:bg-orange-600" style={{backgroundColor: accentColor}}>
                                 Analyze Another Notice
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
             <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} title="Email to Taxpayer">
                 <pre className="bg-slate-100 p-4 rounded-lg text-sm text-black whitespace-pre-wrap font-sans">{summaryData.emailTemplate}</pre>
                 <button onClick={() => copyToClipboard(summaryData.emailTemplate)} className="mt-4 bg-orange-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-orange-600" style={{backgroundColor: accentColor}}>Copy to Clipboard</button>
             </Modal>
             <Modal isOpen={showIrsModal} onClose={() => setShowIrsModal(false)} title="Draft IRS Response">
                 <pre className="bg-slate-100 p-4 rounded-lg text-sm text-black whitespace-pre-wrap font-sans">{summaryData.irsResponseTemplate}</pre>
                 <button onClick={() => copyToClipboard(summaryData.irsResponseTemplate)} className="mt-4 bg-orange-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-orange-600" style={{backgroundColor: accentColor}}>Copy to Clipboard</button>
             </Modal>
             <Modal isOpen={showSaltModal} onClose={() => setShowSaltModal(false)} title="What Is The SALT Deduction Limit?">
                <div className="space-y-4 text-slate-700">
                    <p>Since 2018, there's a <strong>$10,000 yearly limit</strong> on how much you can deduct for state and local taxes. You claimed $15,000, but the maximum allowed is $10,000.</p>
                    <div>
                        <h4 className="font-bold text-black">What Counts As State and Local Taxes?</h4>
                        <ul className="list-disc list-inside mt-2">
                            <li>State income tax you paid</li>
                            <li>Property taxes on your home</li>
                            <li>Local city or county taxes</li>
                        </ul>
                        <p className="mt-2">All of these combined cannot exceed $10,000.</p>
                    </div>
                    <p>The IRS computer automatically checks all tax returns for this limit. When it found you claimed more than $10,000, it automatically reduced your deduction to the legal maximum.</p>
                </div>
             </Modal>
        </div>
    );
};


// --- Main Application Component ---
export default function App() {
    const [view, setView] = useState('login');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [summaryData, setSummaryData] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '', isActive: false });
    const [history, setHistory] = useState([]);
    const [currentPdf, setCurrentPdf] = useState(null);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            body { background-color: #f8f9fa !important; }
            @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, isActive: true });
        setTimeout(() => {
            setToast({ message: '', type: '', isActive: false });
        }, 3000);
    };

    const clearFormFields = () => setError('');

    const handleRegister = async (formData) => {
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        const result = await api.register(formData);
        if (result.success) {
            setUser(result.user);
            setView('dashboard');
        } else {
            setError(result.message || "Registration failed.");
        }
    };

    const handleLogin = async (formData) => {
        setError('');
        const result = await api.login(formData);
        if (result.success) {
            setUser(result.user);
            setView('dashboard');
        } else {
            setError(result.message || "Login failed.");
        }
    };

    const handleLogout = () => {
        setUser(null);
        setView('login');
    };
    
    const resetApp = () => {
        setView('dashboard');
        setSummaryData(null);
        setCurrentPdf(null);
        setError('');
    };

    const handleFileUpload = (file) => {
        if (!file || file.type !== "application/pdf") {
            showToast('Please upload a valid PDF file.', 'error');
            return;
        }

        setView('analyzing');

        // Simulate backend processing and notice type detection from filename
        setTimeout(() => {
            const fileName = file.name.toLowerCase();
            let detectedData = null;

            if (fileName.includes('cp23')) {
                detectedData = cp23MockData;
            } else if (fileName.includes('cp503') || fileName.includes('cp503c')) {
                detectedData = cp503cMockData;
            }

            if (detectedData) {
                const newHistoryItem = { ...detectedData, id: Date.now(), pdfFile: file };
                setHistory(prevHistory => [newHistoryItem, ...prevHistory].slice(0, 10));
                setSummaryData(detectedData);
                setCurrentPdf(file);
                setView('summary');
            } else {
                setView('dashboard');
                showToast('Could not identify notice type (CP23 or CP503C) from filename.', 'error');
            }
        }, 2000); // 2-second delay to simulate analysis
    };

    const handleHistoryClick = (historyItem) => {
        setSummaryData(historyItem);
        setCurrentPdf(historyItem.pdfFile);
        setView('summary');
    };

    const renderView = () => {
        switch (view) {
            case 'register':
                return <AuthScreen isLogin={false} onSubmit={handleRegister} error={error} setView={setView} clearFormFields={clearFormFields} />;
            case 'login':
                return <AuthScreen isLogin={true} onSubmit={handleLogin} error={error} setView={setView} clearFormFields={clearFormFields} />;
            case 'dashboard':
                return <DashboardScreen user={user} handleLogout={handleLogout} history={history} handleHistoryClick={handleHistoryClick} handleFileUpload={handleFileUpload} />;
            case 'analyzing':
                return <LoadingSpinner />;
            case 'summary':
                return <SummaryScreen summaryData={summaryData} resetApp={resetApp} showToast={showToast} />;
            default:
                return <AuthScreen isLogin={true} onSubmit={handleLogin} error={error} setView={setView} clearFormFields={clearFormFields} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            {renderView()}
            <Toast message={toast.message} type={toast.type} isActive={toast.isActive} />
        </div>
    );
}
