import React from 'react';

// --- Reusable PDF Components ---
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-5xl font-black text-gray-900 tracking-tight">{children}</h1>;
const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-xl text-gray-600 mt-2">{children}</p>;
const SectionTitle: React.FC<{ children: React.ReactNode, isSub?: boolean, isSubSub?: boolean }> = ({ children, isSub = false, isSubSub = false }) => {
    if (isSubSub) {
        return <h4 className="text-xl font-bold text-gray-700 mt-6 mb-2">{children}</h4>;
    }
    if (isSub) {
        return <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-3 border-b-2 border-gray-300 pb-2">{children}</h3>;
    }
    return <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-yellow-400 pb-3 mb-6 mt-10 break-after-avoid">{children}</h2>;
};
const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`text-base text-gray-700 leading-relaxed my-3 ${className || ''}`}>{children}</p>;
const UL: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
    <ul className="list-disc list-inside space-y-2 pl-2">
        {items.map((item, i) => <li key={i} className="text-base text-gray-700">{item}</li>)}
    </ul>
);
const OL: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
    <ol className="list-decimal list-inside space-y-2 pl-2">
        {items.map((item, i) => <li key={i} className="text-base text-gray-700">{item}</li>)}
    </ol>
);
const Table: React.FC<{ headers: string[], rows: (string|React.ReactNode)[][] }> = ({ headers, rows }) => (
    <div className="my-6 overflow-x-auto break-inside-avoid">
        <table className="w-full text-left text-sm border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    {headers.map((header, i) => <th key={i} className="p-3 font-bold text-gray-700 border border-gray-300">{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-200 bg-white hover:bg-gray-50">
                        {row.map((cell, j) => <td key={j} className="p-3 border border-gray-300">{cell}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


const MoneyModelsGuidePdf: React.FC = () => {
    return (
        <div className="p-12 bg-white font-sans text-gray-900">
            <header className="text-center mb-12 pb-6 border-b-8 border-yellow-400">
                <Title>A Comprehensive Guide to Client Financed Acquisition and Money Models</Title>
            </header>
            <main>
                <SectionTitle>Intro</SectionTitle>
                <P>This guide serves as a comprehensive strategic playbook for business owners and executives seeking to achieve scalable, profitable growth. It is built on a central premise: the primary constraint on business growth is not a lack of capital, but the absence of a sophisticated monetization strategy. The core problem this guide solves is the prevalent issue of unprofitable advertising, a challenge that forces businesses to cease marketing efforts due to cash flow depletion long before they can recoup their customer acquisition costs. The solution presented herein is a systematic framework known as "Money Models," designed to engineer a self-funding customer acquisition engine.</P>
                <P>The structure of this analysis will guide the reader on a strategic journey, beginning with an examination of the foundational financial metrics that govern profitable acquisition. It will then progress to the core principles of Client Financed Acquisition (CFA) before deconstructing the four primary types of offers that form the building blocks of any robust money model. The final sections provide a detailed tactical breakdown of over fifteen distinct offer structures and a clear roadmap for constructing a bespoke money model tailored to any business, thereby removing cash as a permanent constraint to growth.</P>
                
                <SectionTitle>Context: The "Why" Behind Money Models</SectionTitle>
                <P>To fully grasp the strategic importance of Money Models, it is essential to understand their place within the broader ecosystem of business growth. This ecosystem can be distilled into a trilogy of fundamental questions that every enterprise must answer:</P>
                <OL items={[
                    <strong>What do I sell?</strong>,
                    <strong>Who do I sell it to?</strong>,
                    <strong>How do I get them to pay?</strong>
                ]} />
                <P>Money Models are the definitive answer to the third question, serving as the crucial bridge between having a product and having leads. They are the engine of monetization that makes the entire system work profitably and sustainably.</P>
                <P>This reality is illustrated by the author's own entrepreneurial journey. While operating a gym, a sudden 5x increase in lead costs from Facebook threatened to bankrupt the business. The company was viable, the service was effective, but the cash flow could not sustain the new cost of acquisition. The solution was not to find cheaper leads but to make each customer more valuable, faster. This led to the development of a multi-offer system—selling supplements upfront—that generated enough immediate gross profit to pay for the advertising that acquired the customer. This innovation allowed the business to get paid to acquire new customers, effectively removing the cash constraint on growth.</P>
                
                <SectionTitle>How Businesses Make Money: The Foundational Equation</SectionTitle>
                <P>At its core, a viable business operates on a single, non-negotiable principle: the lifetime gross profit generated from a customer must exceed the cost to acquire that customer. This can be expressed as: <strong>LTGP &gt; CAC</strong> (Lifetime Gross Profit is greater than Cost to Acquire a Customer).</P>
                <P>As a benchmark for viability, a business should aim for a minimum LTGP-to-CAC ratio of <strong>3:1</strong>. To achieve scalable growth, a business must master the interplay of three critical levers:</P>
                <UL items={[
                    "Cost to Acquire a Customer (CAC)",
                    "Gross Profit (GP)",
                    "Payback Period (PPD)"
                ]} />

                <SectionTitle>CAC: Deconstructing the Cost to Acquire a Customer</SectionTitle>
                <P>The Cost to Acquire a Customer (CAC) is the total expense incurred to convert a prospect into a paying customer. A precise calculation of CAC is non-negotiable for understanding true profitability. It must be "fully loaded," encompassing all direct and indirect costs.</P>
                <SectionTitle isSub>CAC Calculation Matrix</SectionTitle>
                <Table 
                    headers={["Acquisition Channel", "Cost Components", "Example Monthly Cost", "Total Monthly Cost", "New Customers Acquired", "Calculated CAC"]}
                    rows={[
                        ["Paid Advertising", "Ad Spend, Media Buyer Salary, Sales Commissions, Software", "$20,000, $4,000, $10,000, $1,000", "$35,000", "10", "$3,500"],
                        ["Content Marketing", "Media Team Payroll, Sales Commissions", "$10,000, $1,000", "$11,000", "10", "$1,100"],
                        ["Direct Outreach", "Prospector Salary, Sales Commissions, Software", "$3,000, $800, $200", "$4,000", "8", "$500"]
                    ]}
                />
                <SectionTitle isSub>Strategies for Lowering CAC</SectionTitle>
                <P><strong>The Power of "Free":</strong> "Free" and "new" are the most potent words in advertising. Free offers can dramatically increase lead flow by removing all friction and risk.</P>
                <P><strong>The Optimization Framework:</strong> Create Flow {"->"} Monetize {"->"} Add Friction. Start with a compelling, low-friction offer to maximize leads, ensure you can convert them, and then add qualification steps to improve lead quality.</P>
                
                <SectionTitle>Gross Profit: The Engine of Scalable Growth</SectionTitle>
                <P>Gross Profit (GP) is the lifeblood of a scalable business. It is the difference between the price a customer pays and the Cost of Goods Sold (COGS). A critical benchmark for service-based businesses is to maintain gross margins of at least 80%.</P>
                
                <SectionTitle>Payback Period: The Critical Element of Speed</SectionTitle>
                <P>The Payback Period (PPD) measures the speed at which a business recoups its investment. The key to shortening the payback period is to make additional offers to the customer within the first 30 days of acquisition, capitalizing on their "hyper-buying mode."</P>
                
                <SectionTitle>CFA, Money Models: Introducing Client Financed Acquisition</SectionTitle>
                <P>Client Financed Acquisition (CFA) is when the gross profit from a single client within the first 30 days is greater than the cost of acquiring that customer. This leads to three levels of advertising mastery:</P>
                <OL items={[
                    <><strong>Level 1: The Viable Business (LTGP&gt;CAC):</strong> Profitable over time, but may be cash-flow constrained.</>,
                    <><strong>Level 2: The Self-Funding Business (30-Day GP&gt;CAC):</strong> Acquiring customers for free, limited only by credit line.</>,
                    <><strong>Level 3: The Compounding Business (30-Day GP&gt;2xCAC):</strong> Each customer pays for themselves and the next customer, removing all financial limits to growth.</>
                ]} />
                
                <SectionTitle>4 Types of Offers: The Four-Pronged Framework</SectionTitle>
                <Table
                    headers={["Offer Type", "Primary Objective", "Key Metric Influenced", "Ideal Timing", "Example Models"]}
                    rows={[
                        ["Attraction", "Liquidate CAC", "CAC, Lead Volume", "First Interaction", "Win Your Money Back, Decoy Offer, Free Giveaway"],
                        ["Upsell", "Maximize Profit", "Average Order Value, 30-Day GP", "Immediately Post-Purchase", "Anchor Upsell, Menu Upsell, Rollover Upsell"],
                        ["Downsell", "Maximize Conversion", "Conversion Rate", "After a 'No'", "Payment Plan, Free Trial, Feature Downsell"],
                        ["Continuity", "Stabilize Cash Flow & Maximize LTV", "LTV, Churn Rate", "End of Initial Service / As an Upsell", "Continuity Bonus, Waived Fee, Continuity Discount"]
                    ]}
                />

                <SectionTitle>Attraction Offers</SectionTitle>
                <UL items={[
                    <><strong>Win Your Money Back:</strong> Customer pays upfront and gets a refund or credit if they hit a specific goal.</>,
                    <><strong>Free Giveaways:</strong> A high-value grand prize draw where all non-winners get a discount offer.</>,
                    <><strong>Decoy Offers:</strong> Advertise a basic free/cheap option, but present a much better premium option alongside it to encourage upgrades.</>,
                    <><strong>Buy X Get Y Free:</strong> Reframes a discount into a more compelling "free" offer (e.g., "Buy 1, Get 2 Free" instead of "66% off").</>,
                    <><strong>Pay Less Now or Pay More Later:</strong> A risk-free trial where the customer pays later, with an option for a discount if they pay now.</>,
                    <><strong>Free with Consumption:</strong> Deliver significant value upfront (webinar, challenge) before presenting a high-ticket offer.</>
                ]} />

                <SectionTitle>Upsell Offers</SectionTitle>
                 <UL items={[
                    <><strong>Classic Upsell:</strong> The "fries with that" offer. The next logical product/service they need.</>,
                    <><strong>Menu Upsell:</strong> A 4-step process: Unsell (build trust), Prescribe (tell them what they need), Ask A or B (assumed close), and Make it Easy to Pay.</>,
                    <><strong>Anchor Upsell:</strong> Present a very expensive option first to make the main offer seem like a bargain.</>,
                    <><strong>Rollover Upsell:</strong> Credit a customer's past purchase towards a new, more expensive one.</>
                ]} />

                <SectionTitle>Downsell Offers</SectionTitle>
                <UL items={[
                    <><strong>Payment Plans:</strong> Break a large price into smaller, manageable payments.</>,
                    <><strong>Free Trials (with Penalty):</strong> A free trial that requires a credit card and charges a fee for non-compliance with required actions.</>,
                    <><strong>Feature Downsells:</strong> Lower the price by removing features, forcing the customer to weigh cost vs. value.</>
                ]} />
                
                <SectionTitle>Continuity Offers</SectionTitle>
                 <UL items={[
                    <><strong>Continuity Bonus:</strong> Give a high-value bonus for free to customers who sign up for a subscription.</>,
                    <><strong>Continuity Discount:</strong> Offer free or discounted time in exchange for a longer-term commitment.</>,
                    <><strong>Waived Fee:</strong> Present a large setup fee that is waived if the customer agrees to a long-term contract.</>
                ]} />

                <SectionTitle>Next Steps: Make Your Own Money Model</SectionTitle>
                <P>The process of building a money model should be iterative. Don't try to do everything at once.</P>
                <OL items={[
                    "Perfect an Attraction Offer.",
                    "Add an Upsell Offer.",
                    "Add a Downsell Offer.",
                    "Add a Continuity Offer."
                ]} />
                <P>Remember: simple scales, fancy fails. The goal is to create the simplest sequence of offers that achieves Client-Financed Acquisition. Once you master this, cash will no longer be a constraint, and your growth will be truly limitless.</P>

            </main>
        </div>
    );
};

export default MoneyModelsGuidePdf;