
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { GoogleGenAI, Type, GenerateContentResponse, Content } from "@google/genai";
import {
    BusinessData, GeneratedPlaybook, OfferStackItem, GeneratedDiagnosis,
    GeneratedMoneyModelAnalysis, GeneratedMoneyModel, GeneratedMoneyModelMechanisms,
    GeneratedOperationsPlan, GeneratedOffer, GeneratedDownsell, GeneratedProfitPath,
    GeneratedMarketingModel, GeneratedSalesFunnel, GeneratedKpiDashboard, ChatMessage
} from '../../types';

// This is where your secret key is safely used, on the server!
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// --- ALL THE ORIGINAL AI LOGIC IS MOVED HERE, SAFELY ON THE SERVER ---

const escapeStringForJson = (str: string | undefined | null): string => {
    if (!str) return '';
    return str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
};

const hormoziMonetizationEngine = `
You are an expert business consultant modeled after Alex Hormozi, operating based on the following comprehensive framework. Your analysis must be rigorously structured around these principles.

The Hormozi framework operates as a logical, sequential chain where each pillar enables the next, creating compounding momentum. The entire structure is designed to systematically de-risk and self-fund business growth, transforming marketing from a speculative expense into a profit-generating, self-liquidating activity.

The Offer as Foundation: The process begins with the creation of a Grand Slam Offer (GSO). This is not merely a product or service but a meticulously constructed value proposition designed to be so compelling that prospects feel "stupid saying no". Its primary strategic function is to create a market distortion by offering a solution that is incomparable to any competitor, thereby shifting the customer's decision from a price comparison to a value judgment. This superior offer is the bedrock upon which all subsequent efforts are built, as it inherently makes lead generation easier and more effective.

Leads as the Engine: With a compelling offer in place, the business can then deploy the systematic processes outlined in the $100M Leads framework. This pillar provides the tactical playbook for attracting potential customers at scale, covering everything from low-risk warm outreach to high-scale paid advertising. The GSO acts as the potent fuel for this engine; a powerful offer dramatically increases the conversion rates of every lead generation activity.

The Money Model as the Fuel System: The leads generated are then monetized through the $100M Money Model. This is the economic architecture of the business, designed to ensure that the acquisition of customers is not a cost center but a profit generator from the very first transaction. By maximizing upfront cash flow and lifetime gross profit, this model provides the capital necessary for reinvestment into more lead generation, creating a self-sustaining growth loop.

The Scaling Roadmap as the GPS: Finally, the Scaling Roadmap provides the strategic lens for the CEO to navigate growth. It is a diagnostic framework based on the Theory of Constraints, which posits that any business is only ever limited by a single bottleneck at a time. This roadmap helps the entrepreneur identify their current primary constraint—whether it lies in the Offer, Leads, or Money Model—and focus all available resources on resolving it to advance to the next stage of growth.

This interconnected system is fundamentally a methodology for removing the constraints that inhibit growth. Traditional business scaling often relies on external capital to fund marketing and operations, accepting initial losses with the hope of recouping them through the long-term lifetime value (LTV) of a customer. This model carries significant financial risk. The Hormozi operating system inverts this paradigm. The Grand Slam Offer creates such a massive discrepancy between perceived value and price that it justifies a premium, enabling high margins. The Money Model is then structured to ensure that the gross profit from the initial transaction is greater than the cost to acquire that customer (CAC). This creates a self-liquidating acquisition loop where every new customer pays for the marketing required to acquire the next one, or even multiple new ones. Consequently, the framework is not merely about "growth" but about engineering a capital-efficient engine that eliminates the cash flow constraint that causes 82% of businesses to fail. It systematically replaces hope with mathematics, making scalable growth accessible without reliance on outside investment.

The Foundation of Growth: Crafting the Grand Slam Offer
De-Commoditization: The Strategy of a "Category of One"
The primary strategic objective of the Grand Slam Offer (GSO) is to solve the "commodity problem". In a commoditized market, products and services are seen as interchangeable, forcing businesses to compete primarily on price—a race to the bottom that erodes margins and makes scaling difficult. The GSO is an exercise in de-commoditization. It is an offer architected with such a unique combination of value, promotion, guarantee, and payment terms that it cannot be logically compared to any competitor. This forces the prospect to evaluate the offer on its own merits and its perceived value, rather than against a competitor's price tag, effectively creating a "category of one".

The Value Equation: Deconstructing Perceived Worth
The perceived value of any offer can be systematically engineered by manipulating four core variables. Hormozi codifies this relationship in his Value Equation, which serves as both a design tool for creating offers and a diagnostic tool for improving them. The equation is expressed as:
Value = (Dream Outcome × Perceived Likelihood of Achievement) / (Time Delay × Effort & Sacrifice)

The objective is to maximize the numerator variables and minimize the denominator variables to create an offer of overwhelmingly high perceived value.

Dream Outcome (Increase): This variable represents the ultimate result the customer desires. It is not the product or service itself, but the experience and status transformation the customer envisions.
Perceived Likelihood of Achievement (Increase): People pay for certainty. This variable is the prospect's belief that the offer will work for them. This conviction is built through tangible proof elements like testimonials, case studies, and risk-reversing guarantees.
Time Delay (Decrease): This is the period between the customer's purchase and their realization of the promised benefit. The shorter this "time to value," the more valuable the offer.
Effort & Sacrifice (Decrease): This variable encompasses all the costs—time, energy, inconvenience—that the customer must incur. An offer that requires less work from the customer is inherently more valuable.

Strategic Enhancements: The Psychological Levers
Scarcity: Limit the quantity available.
Urgency: Create a time-based deadline for the decision.
Bonuses: Stack multiple relevant, high-value bonuses to increase the total perceived value.
Guarantees: Reverse the risk for the customer with a powerful guarantee.
Naming (The M.A.G.I.C. Formula): Magnetic (reason for promotion), Avatar (who it's for), Goal (dream outcome), Interval (time frame), Container (package it as a system).

Market Selection: Finding the "Starving Crowd"
An ideal market has: Massive Pain, Purchasing Power, is Easy to Target, and is Growing.

Building the Engine: The $100M Leads Generation Machine
The "Core Four" Lead Generation Methods (in sequence for new businesses):
1. Warm Outreach: Leverage existing networks. Low cost, high trust.
2. Posting Content: Build an audience and authority. Creates a long-term asset.
3. Cold Outreach: Systematically contact new prospects. Proves the offer's strength to a cold audience.
4. Paid Ads: The most scalable method. Use when the offer is validated and cash flow exists.

The Economics of Scaling: The $100M Money Model
The Primacy of Cash Flow: Getting Paid to Grow
The guiding principle is: 30-day Gross Profit ≥ 2x CAC + COGS. This means the gross profit from a new customer in their first month must cover their cost of goods sold and the cost to acquire two more customers.

The LTV:CAC Ratio: The Ultimate Business Metric
LTV (based on Lifetime Gross Profit) to CAC ratio is the key metric. A 3:1 ratio is the baseline for viability.

The Four Levers of Monetization:
1. Attraction Offer: The GSO that brings a customer into the ecosystem.
2. Upsell: An immediate offer post-purchase to increase average order value.
3. Downsell: A lower-priced alternative for those who say "no".
4. Continuity: A recurring revenue stream (subscription, membership).

The Diagnostic and Scaling Roadmap
The Diagnostic Core: Theory of Constraints
A business is always limited by a single bottleneck. The CEO's job is to identify and eliminate it.

Primary Diagnostic Tool: Supply vs. Demand
- Supply-Constrained: Too many customers for the current capacity.
- Demand-Constrained: Excess capacity, not enough customers.
- The "Doubling Ad Spend" Test: If doubling ad spend tomorrow would cause chaos, you are Supply-constrained. If sales would just double, you are Demand-constrained.

The 10-Stage Scaling Roadmap provides a guide from inception to enterprise value, outlining the primary focus and likely constraint at each stage.
`;


// --- SCHEMAS ---

const offerSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        promise: { type: Type.STRING },
        stack: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    problem: { type: Type.STRING },
                    solution: { type: Type.STRING },
                    value: { type: Type.STRING, description: "The specific monetary value of this solution, e.g., '$2,000'." },
                    asset: {
                        type: Type.OBJECT,
                        description: "A mandatory downloadable asset. If the solution IS a tangible asset (template, etc.), this contains its content. If the solution is a service or concept, this contains a 'how-to' guide for it.",
                        properties: {
                            name: { type: Type.STRING, description: "The filename for the asset, e.g., 'High-Converting Ad Template'." },
                            type: { type: Type.STRING, description: "The type of asset, e.g., 'template', 'framework', 'checklist', 'script', 'guide'." },
                            content: { type: Type.STRING, description: "The full, ready-to-use text content of the asset or guide, formatted in simple Markdown." }
                        },
                        required: ["name", "type", "content"]
                    }
                },
                required: ["problem", "solution", "value", "asset"]
            }
        },
        strategyBehindStack: { type: Type.STRING, description: "The strategic rationale behind the composition of the value stack. Explain why these specific elements were chosen to solve the client's problem and create an irresistible offer." },
        totalValue: { type: Type.STRING, description: "The sum total monetary value of all items in the stack, e.g., '$20,000'." },
        guarantee: { type: Type.STRING },
        price: { type: Type.STRING }
    },
    required: ["name", "promise", "stack", "strategyBehindStack", "totalValue", "guarantee", "price"]
};

const diagnosisSchema = {
    type: Type.OBJECT,
    properties: {
        currentStage: { type: Type.STRING },
        yourRole: { type: Type.STRING },
        constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
        actions: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["currentStage", "yourRole", "constraints", "actions"]
};

const modelComparisonSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        metrics: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                },
                required: ["label", "value"]
            }
        }
    },
    required: ["title", "description", "metrics"]
};


const moneyModelAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        oldModel: modelComparisonSchema,
        newModel: modelComparisonSchema,
        ltvCacAnalysis: {
            type: Type.OBJECT,
            properties: {
                automationLevel: { type: Type.STRING },
                targetRatio: { type: Type.STRING },
                explanation: { type: Type.STRING }
            },
            required: ["automationLevel", "targetRatio", "explanation"]
        },
        projectedEconomics: {
            type: Type.OBJECT,
            properties: {
                estimatedCAC: { type: Type.STRING },
                targetLTV: { type: Type.STRING },
                projectedRatio: { type: Type.STRING },
                immediateProfit: { type: Type.STRING },
                explanation: { type: Type.STRING }
            },
            required: ["estimatedCAC", "targetLTV", "projectedRatio", "immediateProfit", "explanation"]
        }
    },
    required: ["oldModel", "newModel", "ltvCacAnalysis", "projectedEconomics"]
};

const moneyModelStepSchema = {
    type: Type.OBJECT,
    properties: {
        stepNumber: { type: Type.INTEGER, description: "The sequential number of the step, starting at 1." },
        title: { type: Type.STRING, description: "The title of the step, e.g., 'Step 1: The Attraction Offer'." },
        offerName: { type: Type.STRING, description: "The specific name of the offer in this step." },
        price: { type: Type.STRING, description: "The price point for this offer, e.g., '$499 Upfront'." },
        rationale: { type: Type.STRING, description: "The strategic reason for this step in the sequence." },
        hormoziTactic: { type: Type.STRING, description: "The specific Hormozi tactic being used, e.g., 'Win Your Money Back Challenge'." },
        details: { type: Type.STRING, description: "A detailed breakdown of what this step entails and how to execute it." }
    },
    required: ["stepNumber", "title", "offerName", "price", "rationale", "hormoziTactic", "details"]
};

const moneyModelSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A compelling title for the entire money model, e.g., 'The Client-Financed Acquisition Model'." },
        corePrinciple: { type: Type.STRING, description: "The core financial objective of the model, e.g., 'Generate >2x (CAC + COGS) in Gross Profit within 30 days'." },
        steps: {
            type: Type.ARRAY,
            items: moneyModelStepSchema
        },
        summary: { type: Type.STRING, description: "A concluding summary of why this model is powerful for the business." }
    },
    required: ["title", "corePrinciple", "steps", "summary"]
};

const moneyModelMechanismSchema = {
    type: Type.OBJECT,
    properties: {
        mechanismType: { type: Type.STRING, description: "The type of mechanism: 'Attraction', 'Upsell', 'Downsell', or 'Continuity'." },
        tacticName: { type: Type.STRING, description: "The name of the specific tactic, e.g., 'Win Your Money Back Challenge'." },
        strategy: { type: Type.STRING, description: "A detailed explanation of how this tactic applies to the user's business." },
        example: { type: Type.STRING, description: "A concrete example of an offer using this tactic for this business." },
        implementationNotes: { type: Type.STRING, description: "Practical, step-by-step advice on how to implement this tactic." }
    },
    required: ["mechanismType", "tacticName", "strategy", "example", "implementationNotes"]
};

const moneyModelMechanismsSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        corePrinciple: { type: Type.STRING },
        mechanisms: {
            type: Type.ARRAY,
            description: "An array of exactly 4 mechanisms, one for each type: Attraction, Upsell, Downsell, Continuity.",
            items: moneyModelMechanismSchema
        }
    },
    required: ["title", "corePrinciple", "mechanisms"]
};

const operationsPlanSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        corePrinciple: { type: Type.STRING },
        outcomesAndActivities: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    outcome: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    timeAllocation: { type: Type.STRING },
                    frequency: { type: Type.STRING }
                },
                required: ["outcome", "activity", "timeAllocation", "frequency"]
            }
        },
        bottleneckAnalysis: { type: Type.STRING },
        proposedRoles: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    roleTitle: { type: Type.STRING },
                    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    dailyStructure: { type: Type.STRING },
                    keyMetric: { type: Type.STRING }
                },
                required: ["roleTitle", "responsibilities", "dailyStructure", "keyMetric"]
            }
        }
    },
    required: ["title", "corePrinciple", "outcomesAndActivities", "bottleneckAnalysis", "proposedRoles"]
};

const profitPathSchema = {
    type: Type.OBJECT,
    properties: {
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    action: { type: Type.STRING },
                    example: { type: Type.STRING },
                    script: { type: Type.STRING, description: "Optional script. Provide if applicable." }
                },
                required: ["title", "action", "example"]
            }
        }
    },
    required: ["steps"]
};

const marketingModelSchema = {
    type: Type.OBJECT,
    properties: {
        steps: {
            type: Type.ARRAY,
            description: "Exactly 4 marketing model steps.",
            items: {
                type: Type.OBJECT,
                properties: {
                    method: { type: Type.STRING },
                    strategy: { type: Type.STRING },
                    example: { type: Type.STRING },
                    template: { type: Type.STRING, description: "Optional template. Provide if applicable." }
                },
                required: ["method", "strategy", "example"]
            }
        }
    },
    required: ["steps"]
};

const salesFunnelSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        corePrinciple: { type: Type.STRING },
        stages: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    stageName: { type: Type.STRING },
                    goal: { type: Type.STRING },
                    adCopy: {
                        type: Type.OBJECT,
                        properties: {
                            headline: { type: Type.STRING },
                            body: { type: Type.STRING },
                            cta: { type: Type.STRING }
                        },
                        required: ["headline", "body", "cta"]
                    },
                    landingPage: {
                        type: Type.OBJECT,
                        properties: {
                            headline: { type: Type.STRING },
                            elements: { type: Type.ARRAY, items: { type: Type.STRING } },
                            keyFocus: { type: Type.STRING }
                        },
                        required: ["headline", "elements", "keyFocus"]
                    },
                    salesProcess: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.STRING },
                            scriptFocus: { type: Type.STRING }
                        },
                        required: ["step", "scriptFocus"]
                    },
                    keyMetric: { type: Type.STRING }
                },
                required: ["stageName", "goal", "adCopy", "landingPage", "salesProcess", "keyMetric"]
            }
        }
    },
    required: ["title", "corePrinciple", "stages"]
};

const kpiDashboardSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        corePrinciple: { type: Type.STRING },
        kpis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    perspective: { type: Type.STRING, description: "'Financial', 'Customer', 'Operational', or 'Marketing'" },
                    description: { type: Type.STRING },
                    formula: { type: Type.STRING },
                    howToMeasure: { type: Type.STRING },
                    example: { type: Type.STRING },
                    importance: { type: Type.STRING }
                },
                required: ["name", "perspective", "description", "formula", "howToMeasure", "example", "importance"]
            }
        }
    },
    required: ["title", "corePrinciple", "kpis"]
};

const downsellSchema = {
    type: Type.OBJECT,
    properties: {
        rationale: { type: Type.STRING },
        offer: offerSchema
    },
    required: ["rationale", "offer"]
};

// --- HELPER FUNCTIONS ---

const generate = async <T>(prompt: string, schema: any): Promise<T> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: hormoziMonetizationEngine,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (e) {
        console.error("AI Generation Error:", e, "Prompt:", prompt);
        if (e instanceof Error) {
          throw new Error(`Failed to generate valid JSON for the requested content: ${e.message}`);
        }
        throw new Error("An unknown error occurred during AI generation.");
    }
};

const createBusinessContextPrompt = (data: BusinessData): string => {
    const escapedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, escapeStringForJson(value)])
    ) as Record<keyof BusinessData, string>;
    
    let businessStageContext = '';
    if (escapedData.businessStage === 'new') {
        businessStageContext = `
This is a brand new business idea. The user is starting from scratch.
Funding Status: ${escapedData.fundingStatus === 'bootstrapped' ? 'Bootstrapping (no money)' : 'Has funding/capital'}.
IMPORTANT: Tailor your advice for someone at the very beginning of their journey.
- For 'bootstrapped' businesses, focus on sweat equity, low-cost client acquisition (e.g., cold outreach, organic content), and getting to cash flow positive as fast as possible. Your advice should be scrappy and action-oriented.
- For 'funded' businesses, advise on how to intelligently deploy capital for faster growth, testing paid channels, and building systems early. Your advice should focus on leverage and speed.
`;
    } else {
        businessStageContext = `This is an existing business looking to improve and grow.`;
    }

    return `
You are Hormozi AI, an expert business consultant. Your advice is practical, actionable, and always customer-centric. You will analyze the business based on the comprehensive framework provided in the system instruction and generate the requested output.

Analyze the following business data and generate the requested output in the specified JSON format. Do not include any explanatory text before or after the JSON.

Business Situation:
${businessStageContext}

Business Data:
- Country: ${escapedData.country}
- Currency: ${escapedData.currency}
- Business Type: ${escapedData.businessType}
- Location: ${escapedData.location}
- Monthly Revenue: ${escapedData.monthlyRevenue} ${escapedData.currency}
- Employees: ${escapedData.employees}
- Marketing Methods: ${escapedData.marketingMethods}
- Biggest Challenge: ${escapedData.biggestChallenge}
- Core Offer: ${escapedData.coreOffer}
- Target Client: ${escapedData.targetClient}
- Offer Timeline: ${escapedData.offerTimeline}
- Has Sales Team: ${escapedData.hasSalesTeam}
- Monthly Ad Spend: ${escapedData.monthlyAdSpend} ${escapedData.currency}
- Profit Goal: ${escapedData.profitGoal} ${escapedData.currency}
- Has Certifications: ${escapedData.hasCertifications}
- Has Testimonials: ${escapedData.hasTestimonials}
- Physical Capacity: ${escapedData.physicalCapacity}
- Ancillary Products: ${escapedData.ancillaryProducts}
- Perceived Max Price (value of perfect result): ${escapedData.perceivedMaxPrice} ${escapedData.currency}
- Daily Time Commitment for Growth: ${escapedData.dailyTimeCommitment} hours
`;
};

// --- EXPORTED GENERATION FUNCTIONS ---

const generateDiagnosis = async (data: BusinessData): Promise<GeneratedDiagnosis> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Based on the business data, provide a diagnosis using the Scaling Roadmap and Theory of Constraints. Identify their primary constraint (Supply-constrained or Demand-constrained) using the 'Doubling Ad Spend' test logic. Determine their current stage on the 10-Stage Scaling Roadmap, their primary role, and the top actions they must take to resolve their primary constraint and advance to the next stage. Be brutally honest and direct.`;
    return generate<GeneratedDiagnosis>(prompt, diagnosisSchema);
};

const generateMoneyModelAnalysis = async (data: BusinessData): Promise<GeneratedMoneyModelAnalysis> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Analyze the business's current money model and propose a new, more effective one based on Hormozi's principles. Compare the 'Old Model' vs. 'New Model'. Project the LTV/CAC analysis and the potential immediate profit from a new customer under the new model. The analysis must be grounded in the goal of achieving a 3:1 LTV:CAC ratio and Client-Financed Acquisition.`;
    return generate<GeneratedMoneyModelAnalysis>(prompt, moneyModelAnalysisSchema);
};

const generateMoneyModelMechanisms = async (data: BusinessData): Promise<GeneratedMoneyModelMechanisms> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Generate a "Money Model Toolkit". Provide one specific, powerful tactic for each of the four monetization levers: Attraction, Upsell, Downsell, and Continuity. For each tactic, explain the strategy, provide a concrete example tailored to this business, and give practical implementation notes.`;
    return generate<GeneratedMoneyModelMechanisms>(prompt, moneyModelMechanismsSchema);
};

const generateMoneyModel = async (data: BusinessData): Promise<GeneratedMoneyModel> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Design a complete Money Model (the fuel system) for this business. The primary goal is to achieve Client-Financed Acquisition, where '30-Day Gross Profit ≥ 2x CAC + COGS'. Give it a compelling title and core principle. Detail 3-5 sequential steps using the four levers (Attraction, Upsell, Downsell, Continuity) to maximize LTV and immediate cash flow.`;
    return generate<GeneratedMoneyModel>(prompt, moneyModelSchema);
};

const generateOffer1 = async (data: BusinessData): Promise<GeneratedOffer> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a compelling "Grand Slam Offer" (GSO) to serve as the foundation of the business. Use the Value Equation (Dream Outcome, Perceived Likelihood of Achievement, Time Delay, Effort & Sacrifice) to construct the offer. Incorporate psychological levers like scarcity, urgency, bonuses, and a strong risk-reversing guarantee. Give it a compelling name using the M.A.G.I.C. formula. The value stack must have 5-8 elements, each with a downloadable asset. For each asset, provide the FULL, ready-to-use text content in simple Markdown. This is not a summary; it is the complete asset itself.`;
    return generate<GeneratedOffer>(prompt, offerSchema);
};

const generateOffer2 = async (data: BusinessData): Promise<GeneratedOffer> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a SECOND, alternative "Grand Slam Offer". It should solve the same core problem as the first but from a different angle or for a slightly different avatar. Follow all rules: compelling name using M.A.G.I.C., dream promise, 5-8 value stack items based on the Value Equation, a bold guarantee, and a 10x value-to-price ratio. For each asset, provide the FULL, ready-to-use text content in simple Markdown.`;
    return generate<GeneratedOffer>(prompt, offerSchema);
};

const generateDownsell = async (data: BusinessData): Promise<GeneratedDownsell> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create an "Attraction Offer" that can serve as a downsell or tripwire. This is a low-cost, high-value, easy-to-say-yes-to offer that solves one small, specific problem. Explain the rationale. The offer should have a name, promise, a stack of 2-4 items (each with a full Markdown asset), a guarantee, and a low price point (e.g., $7-$47). For each asset, provide the FULL, ready-to-use text content in simple Markdown.`;
    return generate<GeneratedDownsell>(prompt, downsellSchema);
};

const generateMarketingModel = async (data: BusinessData): Promise<GeneratedMarketingModel> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a 4-step lead generation plan using the 'Core Four' methods in their strategic sequence: 1. Warm Outreach, 2. Posting Content (with a high-value Lead Magnet), 3. Cold Outreach, 4. Paid Ads. This plan should be appropriate for the business's current stage. For each method, provide the specific strategy, a concrete example, and a copy-pasteable template if applicable.`;
    return generate<GeneratedMarketingModel>(prompt, marketingModelSchema);
};

const generateSalesFunnel = async (data: BusinessData): Promise<GeneratedSalesFunnel> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Design a simple, high-converting Sales Funnel as part of the Leads Engine. Give it a title and core principle. Detail 2-3 key stages. For each stage, specify the goal, provide ad copy, describe landing page elements, outline the sales process, and identify the single most important metric.`;
    return generate<GeneratedSalesFunnel>(prompt, salesFunnelSchema);
};

const generateProfitPath = async (data: BusinessData): Promise<GeneratedProfitPath> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a "Profit Path" composed of immediate upsells to maximize cash flow, a key part of the Money Model. These should be offered right after the initial sale. Each step should have a title, a clear action, and an example. Where applicable, provide a simple script.`;
    return generate<GeneratedProfitPath>(prompt, profitPathSchema);
};

const generateOperationsPlan = async (data: BusinessData): Promise<GeneratedOperationsPlan> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a simple Operations Plan to address the business's primary constraint, as identified by the Scaling Roadmap. Define the core operational principle. Identify high-leverage outcomes and activities. Propose 1-2 key team roles needed to solve the current bottleneck, detailing responsibilities, daily structure, and their key metric.`;
    return generate<GeneratedOperationsPlan>(prompt, operationsPlanSchema);
};

const generateKpiDashboard = async (data: BusinessData): Promise<GeneratedKpiDashboard> => {
    const prompt = `${createBusinessContextPrompt(data)}\nTASK: Create a "Business Scorecard" with the 5-7 most critical KPIs to track progress against the Scaling Roadmap. The central KPI should be the LTV:CAC ratio. Give it a title and core principle. For each KPI, provide its name, perspective (Financial, Customer, Operational, Marketing), description, formula, how to measure, a practical example, and its importance for this business.`;
    return generate<GeneratedKpiDashboard>(prompt, kpiDashboardSchema);
};

const generateAssetContent = async (item: OfferStackItem, businessData: BusinessData): Promise<string> => {
    const prompt = `You are Hormozi AI, an expert business consultant and content creator. A business is creating a downloadable asset for their offer. Your task is to write the full, complete text content for this asset. Do not provide a summary; provide the actual, ready-to-use content. Format the output in simple Markdown.

Business Context:
- Business Type: ${businessData.businessType}
- Target Client: ${businessData.targetClient}
- Core Offer: ${businessData.coreOffer}

Asset Details:
- Asset Name: "${item.asset.name}"
- Asset Type: ${item.asset.type}
- It solves this problem: "${item.problem}"
- As part of a solution called: "${item.solution}"

TASK: Write the full, ready-to-use content for the asset described above.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

const generateSimpleText = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text.trim();
    } catch (e) {
        console.error("AI Simple Text Generation Error:", e, "Prompt:", prompt);
        if (e instanceof Error) {
            throw new Error(`Failed to generate text: ${e.message}`);
        }
        throw new Error("An unknown error occurred during AI generation.");
    }
};

const businessDataSchema = {
    type: Type.OBJECT,
    properties: {
        country: { type: Type.STRING, description: "The country the business operates in." },
        currency: { type: Type.STRING, description: "The currency used, e.g., USD, GBP." },
        businessType: { type: Type.STRING, description: "The type of business, e.g., SaaS, Gym." },
        location: { type: Type.STRING, description: "The city and state/province." },
        monthlyRevenue: { type: Type.STRING, description: "A string representing the monthly revenue number." },
        employees: { type: Type.STRING, description: "A string representing the number of employees." },
        marketingMethods: { type: Type.STRING, description: "How the business finds customers." },
        biggestChallenge: { type: Type.STRING, description: "The main problem the business faces." },
        coreOffer: { type: Type.STRING, description: "The primary product/service and its price." },
        targetClient: { type: Type.STRING, description: "A description of the ideal customer." },
        offerTimeline: { type: Type.STRING, description: "Should be one of: 'monthly', 'quarterly', 'half_yearly', 'one_time'." },
        hasSalesTeam: { type: Type.STRING, description: "Should be 'yes' or 'no'." },
        monthlyAdSpend: { type: Type.STRING, description: "A string representing the monthly ad spend number." },
        profitGoal: { type: Type.STRING, description: "A string representing the desired monthly profit number." },
        hasCertifications: { type: Type.STRING, description: "Should be 'yes' or 'no'." },
        hasTestimonials: { type: Type.STRING, description: "Should be 'yes' or 'no'." },
        physicalCapacity: { type: Type.STRING, description: "Any physical capacity constraints." },
        ancillaryProducts: { type: Type.STRING, description: "Other products or services sold." },
        perceivedMaxPrice: { type: Type.STRING, description: "A string representing the value of a perfect result to a customer." },
        dailyTimeCommitment: { type: Type.STRING, description: "A string representing the hours per day for growth." },
        businessStage: { type: Type.STRING, description: "Should be 'new' or 'existing'." },
        fundingStatus: { type: Type.STRING, description: "For new businesses, should be 'funded' or 'bootstrapped'." },
    },
};

const autofillBusinessData = async (description: string, url?: string): Promise<Partial<BusinessData>> => {
    const prompt = `
You are an expert business analyst AI. A user has provided a description and an optional URL for their business.
Your task is to analyze this information and populate a business data form.
Provide your response as a valid JSON object matching the provided schema.
Make intelligent estimations for any missing information. If a field cannot be determined, omit it from the JSON.
For currency, infer from the country if not specified (e.g., USA -> USD, UK -> GBP).
For yes/no fields, use "yes" or "no".
For businessStage, determine if the business sounds new or existing based on the language used ("idea", "plan" vs "we have customers").
---
Business URL: ${url || 'Not provided'}
Business Description: "${escapeStringForJson(description)}"
---
TASK: Fill out the business data form based on the information above. Your response must be only the JSON object.
`;
    return generate<Partial<BusinessData>>(prompt, businessDataSchema);
};

const generateFieldSuggestion = async (data: Partial<BusinessData>, fieldName: keyof BusinessData): Promise<string> => {
    const contextData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value && key !== fieldName)
    );
    const fieldLabels: Record<string, string> = {
        businessType: "Business Type or Idea", biggestChallenge: "Biggest Challenge or Question", coreOffer: "Main Offer & Price (or idea)",
        targetClient: "Your Ideal Customer", marketingMethods: "Current or Planned Marketing", ancillaryProducts: "Other Items for Sale?"
    };
    const fieldLabel = fieldLabels[fieldName] || fieldName;
    const prompt = `
You are an AI assistant designed to help entrepreneurs brainstorm.
Based on the following business information, generate a single, concise, and creative suggestion for the field: "${fieldLabel}".
Business Information: ${JSON.stringify(contextData, null, 2)}
Your task is to provide a suggestion for the "${fieldLabel}" field.
The suggestion should be a short string, suitable for direct use in a form field.
Do not add any extra explanation, labels, or quotation marks. Just return the pure text suggestion.
Suggestion for "${fieldLabel}":
`;
    const suggestion = await generateSimpleText(prompt);
    return suggestion.replace(/^"|"$/g, '');
};

const generateChatResponseStream = async (
    businessData: BusinessData,
    playbook: GeneratedPlaybook,
    history: ChatMessage[]
) => {
    const formattedHistory = history.map(msg => `${msg.role === 'user' ? 'USER' : 'AI'}: ${msg.content}`).join('\n\n');
    const prompt = `
You are Hormozi AI, an expert business consultant. You have already generated a business plan for a user. Now, you are in a chat conversation to refine that plan. Your responses must be helpful, concise, and directly address the user's latest request. You must act as a collaborative partner. Your responses should be in simple markdown.
Here is the original business data you used:
\`\`\`json
${JSON.stringify(businessData, null, 2)}
\`\`\`
Here is the complete business plan you have generated so far. You should refer to this and modify it in your responses if the user asks you to.
\`\`\`json
${JSON.stringify(playbook, null, 2)}
\`\`\`
---
CHAT HISTORY:
${formattedHistory}
---
TASK: Based on all the context above, provide a direct and helpful response to the last user message. Keep your response conversational and focused on improving their business plan.
AI:
`;

    const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return responseStream;
};

const generateVideoOverviewScript = async (playbook: GeneratedPlaybook, businessData: BusinessData): Promise<string> => {
    const prompt = `
You are an expert scriptwriter for short, engaging business overview videos.
Based on the provided business data and the generated playbook, create a concise and powerful voice-over script for a 60-90 second video.
The script should:
- Start with a strong hook that grabs the attention of the business owner.
- Briefly summarize the business's main challenge, based on the diagnosis.
- Introduce the primary "Grand Slam Offer" as the core solution.
- Highlight 2-3 of the most impactful benefits from the offer stack.
- Mention the powerful guarantee to build trust and reverse risk.
- End with an inspiring call to action, encouraging the business owner to implement this new plan.
- The tone must be motivational, clear, and confident, mirroring Alex Hormozi's direct style.
- The output should be ONLY the script text, suitable for a text-to-speech engine. Do not include any labels, formatting, or scene directions like "(upbeat music)".
Business Data:
${JSON.stringify(businessData, null, 2)}
Playbook (summary for script):
${JSON.stringify({ diagnosis: playbook.diagnosis, offer1: playbook.offer1 }, null, 2)}
SCRIPT:
`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

const startVideoGeneration = async (script: string): Promise<{operationId: string}> => {
     let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: script,
        config: { numberOfVideos: 1 }
    });
    return { operationId: operation.name };
};

const pollVideoGeneration = async (operationId: string): Promise<{done: boolean, downloadLink?: string}> => {
    // FIX: The `getVideosOperation` method's type signature expects a full `GenerateVideosOperation` object.
    // In a stateless polling architecture where only the operation name is available, we construct
    // a partial object and cast to `any` to bypass the type check, as the API can look up
    // the operation by its name.
    let operation = await ai.operations.getVideosOperation({ operation: { name: operationId } as any });
    if(operation.done) {
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
             return { done: true };
        }
        const fullLink = `${downloadLink}&key=${process.env.API_KEY}`;
        return { done: true, downloadLink: fullLink };
    }
    return { done: false };
};


// The main handler for the Netlify Function
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { action, payload } = JSON.parse(event.body || '{}');

        if (!action) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing action' }) };
        }

        if (action === 'generateChatResponseStream') {
            const { businessData, playbook, history } = payload;
            const stream = await generateChatResponseStream(businessData, playbook, history);
            const body = new ReadableStream({
                async start(controller) {
                    for await (const chunk of stream) {
                        controller.enqueue(JSON.stringify(chunk));
                    }
                    controller.close();
                }
            });
            // FIX: Cast the streaming response to 'any' to satisfy the Handler type.
            // The Netlify Functions runtime supports ReadableStream in the body, but the @netlify/functions types expect a string.
            // This assertion tells TypeScript that we are intentionally returning a stream, which is valid for the runtime.
            return { statusCode: 200, body } as any;
        }

        let result;
        switch (action) {
            case 'generateDiagnosis': result = await generateDiagnosis(payload); break;
            case 'generateMoneyModelAnalysis': result = await generateMoneyModelAnalysis(payload); break;
            case 'generateMoneyModelMechanisms': result = await generateMoneyModelMechanisms(payload); break;
            case 'generateMoneyModel': result = await generateMoneyModel(payload); break;
            case 'generateOffer1': result = await generateOffer1(payload); break;
            case 'generateOffer2': result = await generateOffer2(payload); break;
            case 'generateDownsell': result = await generateDownsell(payload); break;
            case 'generateMarketingModel': result = await generateMarketingModel(payload); break;
            case 'generateSalesFunnel': result = await generateSalesFunnel(payload); break;
            case 'generateProfitPath': result = await generateProfitPath(payload); break;
            case 'generateOperationsPlan': result = await generateOperationsPlan(payload); break;
            case 'generateKpiDashboard': result = await generateKpiDashboard(payload); break;
            case 'generateAssetContent': result = await generateAssetContent(payload.item, payload.businessData); break;
            case 'autofillBusinessData': result = await autofillBusinessData(payload.description, payload.url); break;
            case 'generateFieldSuggestion': result = await generateFieldSuggestion(payload.data, payload.fieldName); break;
            case 'generateVideoOverviewScript': result = await generateVideoOverviewScript(payload.playbook, payload.businessData); break;
            case 'startVideoGeneration': result = await startVideoGeneration(payload.script); break;
            case 'pollVideoGeneration': result = await pollVideoGeneration(payload.operationId); break;
            default:
                return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action' }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result),
        };

    } catch (e) {
        console.error('Function Error:', e);
        const message = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            statusCode: 500,
            body: JSON.stringify({ error: message }),
        };
    }
};

export { handler };
