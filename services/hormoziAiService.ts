import {
    BusinessData, GeneratedPlaybook, OfferStackItem, GeneratedDiagnosis,
    GeneratedMoneyModelAnalysis, GeneratedMoneyModel, GeneratedMoneyModelMechanisms,
    GeneratedOperationsPlan, GeneratedOffer, GeneratedDownsell, GeneratedProfitPath,
    GeneratedMarketingModel, GeneratedSalesFunnel, GeneratedKpiDashboard, ChatMessage,
} from '../types';

// Helper function to call our secure backend function
async function generate<T>(action: string, payload: any): Promise<T> {
    try {
        const response = await fetch('/.netlify/functions/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, payload }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        return await response.json() as T;
    } catch (e) {
        console.error(`AI Generation Error for action "${action}":`, e);
        if (e instanceof Error) {
            throw new Error(`Failed to generate content: ${e.message}`);
        }
        throw new Error("An unknown error occurred during AI generation.");
    }
}

async function generateStream(action: string, payload: any) {
    const response = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
    });

    if (!response.ok || !response.body) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream({
        async start(controller) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                const chunk = decoder.decode(value, { stream: true });
                // Sometimes multiple JSON objects can be concatenated in a single chunk
                chunk.split('}{').forEach((part, index, array) => {
                    if (array.length > 1 && index > 0) part = '{' + part;
                    if (array.length > 1 && index < array.length - 1) part = part + '}';
                    try {
                        const json = JSON.parse(part);
                        controller.enqueue(json);
                    } catch (e) {
                        // Ignore parsing errors for incomplete chunks
                    }
                });
            }
            controller.close();
            reader.releaseLock();
        }
    });
}


// --- EXPORTED GENERATION FUNCTIONS ---

export const generateDiagnosis = (data: BusinessData) => generate<GeneratedDiagnosis>('generateDiagnosis', data);
export const generateMoneyModelAnalysis = (data: BusinessData) => generate<GeneratedMoneyModelAnalysis>('generateMoneyModelAnalysis', data);
export const generateMoneyModelMechanisms = (data: BusinessData) => generate<GeneratedMoneyModelMechanisms>('generateMoneyModelMechanisms', data);
export const generateMoneyModel = (data: BusinessData) => generate<GeneratedMoneyModel>('generateMoneyModel', data);
export const generateOffer1 = (data: BusinessData) => generate<GeneratedOffer>('generateOffer1', data);
export const generateOffer2 = (data: BusinessData) => generate<GeneratedOffer>('generateOffer2', data);
export const generateDownsell = (data: BusinessData) => generate<GeneratedDownsell>('generateDownsell', data);
export const generateMarketingModel = (data: BusinessData) => generate<GeneratedMarketingModel>('generateMarketingModel', data);
export const generateSalesFunnel = (data: BusinessData) => generate<GeneratedSalesFunnel>('generateSalesFunnel', data);
export const generateProfitPath = (data: BusinessData) => generate<GeneratedProfitPath>('generateProfitPath', data);
export const generateOperationsPlan = (data: BusinessData) => generate<GeneratedOperationsPlan>('generateOperationsPlan', data);
export const generateKpiDashboard = (data: BusinessData) => generate<GeneratedKpiDashboard>('generateKpiDashboard', data);
export const generateAssetContent = (item: OfferStackItem, businessData: BusinessData) => generate<string>('generateAssetContent', { item, businessData });
export const autofillBusinessData = (description: string, url?: string) => generate<Partial<BusinessData>>('autofillBusinessData', { description, url });
export const generateFieldSuggestion = (data: Partial<BusinessData>, fieldName: keyof BusinessData) => generate<string>('generateFieldSuggestion', { data, fieldName });
export const generateVideoOverviewScript = (playbook: GeneratedPlaybook, businessData: BusinessData) => generate<string>('generateVideoOverviewScript', { playbook, businessData });


export const generateChatResponseStream = async (
    businessData: BusinessData,
    playbook: GeneratedPlaybook,
    history: ChatMessage[]
) => {
    const stream = await generateStream('generateChatResponseStream', { businessData, playbook, history });
    const reader = stream.getReader();

    return (async function*() {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            yield value;
        }
    })();
};

export const generateAndPollVideo = async (
    script: string,
    onProgress: (status: string, progress: number) => void
): Promise<string> => {
    try {
        const { operationId } = await generate<{operationId: string}>('startVideoGeneration', { script });

        onProgress("Video synthesis in progress... (this can take several minutes)", 30);
        let progress = 30;
        const messages = [
            "Analyzing script and preparing scenes...",
            "Rendering visual elements...",
            "Compositing video layers...",
            "Almost there, finalizing the video..."
        ];
        let messageIndex = 0;

        while (true) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds

            const pollResult = await generate<{done: boolean, downloadLink?: string}>('pollVideoGeneration', { operationId });
            
            if (pollResult.done) {
                onProgress("Finalizing video...", 95);
                if (!pollResult.downloadLink) {
                     throw new Error("Video generation completed, but no download link was found.");
                }

                const videoResponse = await fetch(pollResult.downloadLink);
                 if (!videoResponse.ok) {
                    throw new Error(`Failed to download the video. Status: ${videoResponse.status}`);
                }

                const videoBlob = await videoResponse.blob();
                onProgress("Video ready!", 100);

                return URL.createObjectURL(videoBlob);
            }

            progress = Math.min(90, progress + 5); 
            onProgress(messages[messageIndex % messages.length], progress);
            messageIndex++;
        }
    } catch (e) {
        console.error("Video Generation Error:", e);
        if (e instanceof Error) {
            throw new Error(`Failed to generate video: ${e.message}`);
        }
        throw new Error("An unknown error occurred during video generation.");
    }
};