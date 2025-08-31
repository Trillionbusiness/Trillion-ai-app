import React, { useState, useCallback, useRef, useEffect } from 'react';
import JSZip from 'jszip';

import { BusinessData, GeneratedPlaybook, OfferStackItem, GeneratedOffer, ChatMessage } from './types';
import { 
    generateDiagnosis, generateMoneyModelAnalysis, generateMoneyModel, 
    generateMoneyModelMechanisms, generateOperationsPlan, generateOffer1, 
    generateOffer2, generateDownsell, generateProfitPath, 
    generateMarketingModel, generateSalesFunnel, generateKpiDashboard,
    generateAssetContent, generateChatResponseStream,
    generateVideoOverviewScript, generateAndPollVideo
} from './services/hormoziAiService';
import Step1Form from './components/Step1Form';
import ProgressBar from './components/common/ProgressBar';
import CircularProgress from './components/common/CircularProgress';
import FullPlaybook from './components/FullPlaybook';
import DropdownButton from './components/common/DropdownButton';
import AllPdfs from './components/pdf/AllPdfs';
import OfferPreviewModal from './components/OfferPreviewModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import Card from './components/common/Card';


const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Starting...');
  const [elapsedTime, setElapsedTime] = useState(0);

  const [pdfProgress, setPdfProgress] = useState(0);
  const [zipProgress, setZipProgress] = useState(0);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [pdfType, setPdfType] = useState<string | null>(null);
  const [assetForPdf, setAssetForPdf] = useState<NonNullable<OfferStackItem['asset']> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playbook, setPlaybook] = useState<GeneratedPlaybook | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [generatingAsset, setGeneratingAsset] = useState<OfferStackItem | null>(null);
  const [assetBundleForPdf, setAssetBundleForPdf] = useState<GeneratedOffer | null>(null);
  const [generatingAssetBundleFor, setGeneratingAssetBundleFor] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [showAllPdfsForZip, setShowAllPdfsForZip] = useState(false);
  const [processedPlaybookForZip, setProcessedPlaybookForZip] = useState<GeneratedPlaybook | null>(null);
  const [assetToPreview, setAssetToPreview] = useState<OfferStackItem | null>(null);
  const [isVideoGenerating, setIsVideoGenerating] = useState<boolean>(false);
  const [videoGenerationProgress, setVideoGenerationProgress] = useState(0);
  const [videoGenerationText, setVideoGenerationText] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const pdfSingleRenderRef = useRef<HTMLDivElement>(null);
  const pdfAssetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: number;
    if (isLoading) {
      setElapsedTime(0);
      timer = window.setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isLoading]);

  const handleFormSubmit = useCallback(async (data: BusinessData) => {
    setIsLoading(true);
    setError(null);
    setPlaybook(null);
    setBusinessData(data);
    setLoadingProgress(0);

    try {
        const fullPlaybook: Partial<GeneratedPlaybook> = {};
        const steps = [
            { name: "Analyzing Your Business...", fn: () => generateDiagnosis(data), key: 'diagnosis' },
            { name: "Building Your Money Plan...", fn: () => generateMoneyModelAnalysis(data), key: 'moneyModelAnalysis' },
            { name: "Creating Your Money Toolkit...", fn: () => generateMoneyModelMechanisms(data), key: 'moneyModelMechanisms' },
            { name: "Designing Your Money Funnel...", fn: () => generateMoneyModel(data), key: 'moneyModel' },
            { name: "Crafting Your Best Offers...", fn: () => generateOffer1(data), key: 'offer1' },
            { name: "Creating a Second Offer...", fn: () => generateOffer2(data), key: 'offer2' },
            { name: "Making a 'Hello' Offer...", fn: () => generateDownsell(data), key: 'downsell' },
            { name: "Finding Your Customer Path...", fn: () => generateMarketingModel(data), key: 'marketingModel' },
            { name: "Building Your Sales Funnel...", fn: () => generateSalesFunnel(data), key: 'salesFunnel' },
            { name: "Designing Your Profit Steps...", fn: () => generateProfitPath(data), key: 'profitPath' },
            { name: "Planning Your Daily Actions...", fn: () => generateOperationsPlan(data), key: 'operationsPlan' },
            { name: "Setting Up Your Scorecard...", fn: () => generateKpiDashboard(data), key: 'kpiDashboard' },
        ];
        
        for (let i = 0; i < steps.length; i++) {
            setLoadingText(steps[i].name);
            // @ts-ignore
            fullPlaybook[steps[i].key] = await steps[i].fn();
            setLoadingProgress(((i + 1) / steps.length) * 100);
        }
        
        setLoadingText('Finalizing your plan...');
        const finalPlaybook = fullPlaybook as GeneratedPlaybook;

        setPlaybook(finalPlaybook);
        setLoadingText('Plan Complete!');
        setStep(2);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Reload and try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  const resetApp = () => {
      setStep(1);
      setPlaybook(null);
      setError(null);
      setIsLoading(false);
      setIsZipping(false);
      setPdfType(null);
      setAssetForPdf(null);
      setBusinessData(null);
      setGeneratingAsset(null);
      setAssetBundleForPdf(null);
      setGeneratingAssetBundleFor(null);
      setChatHistory([]);
      setIsChatLoading(false);
      setShowAllPdfsForZip(false);
      setProcessedPlaybookForZip(null);
      setAssetToPreview(null);
      setIsVideoGenerating(false);
      setGeneratedVideoUrl(null);
  };

  const prepareAndDownloadPdf = useCallback((type: string) => {
    if (isGeneratingPdf || isZipping) return;
    setAssetBundleForPdf(null);
    setAssetForPdf(null);
    setPdfType(type);
    setIsGeneratingPdf(true);
    setPdfProgress(0);
  }, [isGeneratingPdf, isZipping]);
  
  const prepareAndDownloadAssetPdf = useCallback(async (item: OfferStackItem) => {
    if (!item.asset || !businessData || isGeneratingPdf || isZipping) {
        if (!item.asset || !businessData) setError("Cannot generate asset: Missing asset details or business context.");
        return;
    }
    
    setAssetBundleForPdf(null);
    setPdfType(null);
    setIsGeneratingPdf(true);
    setPdfProgress(0);
    setGeneratingAsset(item);
    
    try {
        let contentToUse = item.asset.content;
        
        setPdfProgress(25);
        if (!contentToUse || contentToUse.trim() === '' || contentToUse.length < 50) {
            contentToUse = await generateAssetContent(item, businessData);
        }
        setPdfProgress(75);

        setAssetForPdf({
            ...item.asset,
            name: item.asset.name,
            content: contentToUse
        });
        
    } catch (err) {
        setError(err instanceof Error ? `Asset Generation Failed: ${err.message}` : 'An unknown error occurred during asset generation.');
        setIsGeneratingPdf(false);
        setGeneratingAsset(null);
    }
  }, [businessData, isGeneratingPdf, isZipping]);
  
  const prepareAndDownloadAssetBundlePdf = useCallback(async (offer: GeneratedOffer) => {
    if (!businessData || isGeneratingPdf || isZipping) {
        if(!businessData) setError("Cannot generate assets: Missing business context.");
        return;
    }

    setIsGeneratingPdf(true);
    setPdfProgress(0);
    setGeneratingAssetBundleFor(offer.name);
    setPdfType(null);
    setAssetForPdf(null);

    try {
        const totalAssets = offer.stack.filter(item => item.asset).length;
        let assetsProcessed = 0;
        
        const processedStack = await Promise.all(
            offer.stack.map(async (item) => {
                if (!item.asset) return item;
                let newContent = item.asset.content;
                if (!item.asset.content || item.asset.content.trim() === '' || item.asset.content.length < 50) {
                    newContent = await generateAssetContent(item, businessData);
                }
                assetsProcessed++;
                setPdfProgress((assetsProcessed / totalAssets) * 90); // Process up to 90%
                return { ...item, asset: { ...item.asset, content: newContent } };
            })
        );
        
        const offerWithContent = { ...offer, stack: processedStack };
        setAssetBundleForPdf(offerWithContent);
        
    } catch (err) {
        setError(err instanceof Error ? `Asset Bundle Generation Failed: ${err.message}` : 'An unknown error occurred during asset bundle generation.');
        setIsGeneratingPdf(false);
        setGeneratingAssetBundleFor(null);
    }
  }, [businessData, isGeneratingPdf, isZipping]);

  const processAllAssets = async (playbookToProcess: GeneratedPlaybook) => {
    if (!businessData) return playbookToProcess;

    const allOffers = [playbookToProcess.offer1, playbookToProcess.offer2, playbookToProcess.downsell.offer];
    const totalAssets = allOffers.reduce((sum, offer) => sum + offer.stack.filter(item => item.asset).length, 0);
    let assetsProcessed = 0;

    const processOffer = async (offer: GeneratedOffer) => {
        const processedStack = await Promise.all(
            offer.stack.map(async (item) => {
                if (!item.asset) return item;
                let newContent = item.asset.content;
                if (!item.asset.content || item.asset.content.trim() === '' || item.asset.content.length < 50) {
                    newContent = await generateAssetContent(item, businessData);
                }
                assetsProcessed++;
                setZipProgress((assetsProcessed / totalAssets) * 50); // Asset processing is first 50%
                return { ...item, asset: { ...item.asset, content: newContent }};
            })
        );
        return { ...offer, stack: processedStack };
    };

    const [processedOffer1, processedOffer2, processedDownsellOffer] = await Promise.all([
        processOffer(playbookToProcess.offer1),
        processOffer(playbookToProcess.offer2),
        processOffer(playbookToProcess.downsell.offer)
    ]);

    return {
        ...playbookToProcess,
        offer1: processedOffer1,
        offer2: processedOffer2,
        downsell: { ...playbookToProcess.downsell, offer: processedDownsellOffer }
    };
  };

  const handleDownloadAll = async () => {
    if (!playbook || isZipping || isGeneratingPdf) return;
    setIsZipping(true);
    setZipProgress(0);
    setError(null);
    try {
      const processed = await processAllAssets(playbook);
      setProcessedPlaybookForZip(processed);
      setShowAllPdfsForZip(true);
    } catch(err) {
      setError(err instanceof Error ? `Asset Processing Failed: ${err.message}` : 'An unknown error occurred while preparing assets.');
      setIsZipping(false);
    }
  };

  const handlePreviewAsset = useCallback(async (item: OfferStackItem) => {
    if (!item.asset || !businessData) {
        setError("Cannot preview asset: Missing asset details or business context.");
        return;
    }
    
    // If content is missing, generate it first
    if (!item.asset.content || item.asset.content.trim() === '' || item.asset.content.length < 50) {
        try {
            // To provide a better UX, we can show a mini-loader on the preview button itself
            const newContent = await generateAssetContent(item, businessData);
            setAssetToPreview({ ...item, asset: { ...item.asset, content: newContent } });
        } catch (err) {
            setError(err instanceof Error ? `Asset Generation Failed: ${err.message}` : 'An unknown error occurred during asset generation.');
        }
    } else {
        setAssetToPreview(item);
    }
  }, [businessData]);

  const handleGenerateVideoOverview = useCallback(async () => {
    if (!playbook || !businessData) {
        setError("Cannot generate video: Missing playbook or business data.");
        return;
    }
    setIsVideoGenerating(true);
    setVideoGenerationProgress(0);
    setError(null);

    try {
        const onProgress = (status: string, progress: number) => {
            setVideoGenerationText(status);
            setVideoGenerationProgress(progress);
        };

        onProgress("Generating video script...", 5);
        const script = await generateVideoOverviewScript(playbook, businessData);
        
        const videoUrl = await generateAndPollVideo(script, onProgress);
        
        setGeneratedVideoUrl(videoUrl);

    } catch (err) {
        setError(err instanceof Error ? `Video Generation Failed: ${err.message}` : 'An unknown error occurred during video generation.');
    } finally {
        setIsVideoGenerating(false);
    }
  }, [playbook, businessData]);

  const generateOfflineIndexHtml = (playbook: GeneratedPlaybook, businessData: BusinessData): string => {
    const sanitizeName = (name: string) => name.replace(/[\\/:*?"<>|]/g, '').replace(/ /g, '_');
    
    const assetLinks = (offer: GeneratedOffer, folderPath: string) => 
        offer.stack.filter(i => i.asset).map(item => 
            `<li><a href="./${folderPath}/${sanitizeName(item.asset.type)}_${sanitizeName(item.asset.name)}.pdf" download>${item.asset.name}</a></li>`
        ).join('');

    const offerSection = (offer: GeneratedOffer, title: string) => {
        const folder = `04_Asset_Library/${sanitizeName(offer.name)}`;
        return `
            <div class="offer-group">
                <h3>${title}: <span class="offer-name">${offer.name}</span></h3>
                <ul>
                    <li><a href="./${folder}/00_Full_Asset_Bundle.pdf" download><strong>Full Asset Bundle (PDF)</strong></a></li>
                    ${assetLinks(offer, folder)}
                </ul>
            </div>`;
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hormozi AI Business Plan</title>
    <!-- 
        IMPORTANT: This file is designed to work offline with the files from the 'Hormozi_AI_Business_Plan.zip'.
        Make sure this HTML file is in the same main folder as the '01_Core_Plan', '02_Money_Models', etc. folders.
    -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #111827; color: #E5E7EB; margin: 0; padding: 2rem; }
        .container { max-width: 900px; margin: auto; }
        header { text-align: center; border-bottom: 4px solid #FBBF24; padding-bottom: 1.5rem; margin-bottom: 2rem; }
        h1 { font-size: 3rem; font-weight: 900; margin: 0; color: white; }
        h1 span { color: #FBBF24; }
        header p { color: #9CA3AF; font-size: 1.25rem; margin-top: 0.5rem; }
        h2 { font-size: 2rem; font-weight: 900; color: #FBBF24; border-bottom: 2px solid #4B5563; padding-bottom: 0.5rem; margin-top: 3rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .card { background-color: #1F2937; border: 1px solid #374151; padding: 1.5rem; border-radius: 0.75rem; }
        .card h3 { font-size: 1.5rem; font-weight: 700; color: white; margin-top: 0; margin-bottom: 1rem; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 0.75rem; }
        a { color: #60A5FA; text-decoration: none; font-weight: bold; background-color: #374151; padding: 0.5rem 1rem; border-radius: 0.375rem; display: block; transition: background-color 0.2s, color 0.2s; }
        a:hover { background-color: #4B5563; color: white; }
        strong { color: #FBBF24; }
        .offer-group { margin-top: 1.5rem; background-color: #1a222e; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #FBBF24; }
        .offer-group h3 { margin-top: 0; font-size: 1.25rem; color: #FBBF24;}
        .offer-name { color: white; }
        footer { text-align: center; margin-top: 4rem; font-size: 0.875rem; color: #6B7280; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Your <span>Hormozi AI</span> Business Growth Kit</h1>
            <p>A complete, offline-ready package for your ${businessData.businessType}</p>
        </header>
        <main>
            <div class="grid">
                <div class="card">
                    <h3>🚀 Getting Started</h3>
                    <ul>
                        <li><a href="./00_START_HERE_Guide.pdf" download><strong>START HERE: Read Me First</strong></a></li>
                        <li><a href="./01_Core_Plan/Business_Concepts_Guide.pdf" download>Explain The Concepts</a></li>
                    </ul>
                </div>
                <div class="card">
                    <h3>📝 Core Plan</h3>
                    <ul>
                        <li><a href="./01_Core_Plan/Full_Business_Playbook.pdf" download>Full Business Playbook</a></li>
                        <li><a href="./01_Core_Plan/Business_Scorecard_(KPIs).pdf" download>Business Scorecard (KPIs)</a></li>
                        <li><a href="./01_Core_Plan/Offer_Presentation_Slides.pdf" download>Offer Presentation Slides</a></li>
                    </ul>
                </div>
                 <div class="card">
                    <h3>💰 Money Models</h3>
                    <ul>
                        <li><a href="./02_Money_Models/Your_Money_Making_Plan.pdf" download>Your Money Making Plan</a></li>
                    </ul>
                </div>
                <div class="card">
                    <h3>📢 Marketing Materials</h3>
                    <ul>
                        <li><a href="./03_Marketing_Materials/High-Converting_Landing_Page.pdf" download>High-Converting Landing Page</a></li>
                        <li><a href="./03_Marketing_Materials/Simple_Offer_Flyer.pdf" download>Simple Offer Flyer</a></li>
                        <li><a href="./03_Marketing_Materials/Customer_Follow-Up_Note.pdf" download>Customer Follow-Up Note</a></li>
                    </ul>
                </div>
            </div>
            
            <h2>📚 Asset Library</h2>
            <div class="card">
                ${offerSection(playbook.offer1, "Grand Slam Offer 1")}
                ${offerSection(playbook.offer2, "Grand Slam Offer 2")}
                ${offerSection(playbook.downsell.offer, "Downsell 'Hello' Offer")}
            </div>
        </main>
        <footer>
            <p>Generated by Hormozi AI. Good luck!</p>
        </footer>
    </div>
</body>
</html>`;
  };

  const handleDownloadHtmlPage = () => {
    if (!playbook || !businessData) {
        setError("Cannot generate HTML page: Missing playbook or business data.");
        return;
    }
    try {
        const htmlContent = generateOfflineIndexHtml(playbook, businessData);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "index.html"; // name it index.html so it's easy to replace
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        setError(err instanceof Error ? `HTML Generation Failed: ${err.message}` : 'An unknown error occurred during HTML generation.');
    }
  };


  useEffect(() => {
    if (showAllPdfsForZip && isZipping && processedPlaybookForZip && businessData) {
      const performZipping = async () => {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const zip = new JSZip();
          const { jsPDF } = (window as any).jspdf;
          const pdfElements = Array.from(document.querySelectorAll('[data-pdf-output]')) as HTMLElement[];
          let zippingProgress = 50;
          const progressStep = 48 / pdfElements.length;

          for (let i = 0; i < pdfElements.length; i++) {
              const el = pdfElements[i];
              const filePath = el.dataset.pdfPath || `document_${i}.pdf`;
              
              const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
              await pdf.html(el, {
                  autoPaging: 'text',
                  x: 0,
                  y: 0,
                  width: 210, // A4 width
                  windowWidth: 800,
                  margin: 0,
              });
              const blob = pdf.output('blob');
              zip.file(filePath, blob);
              zippingProgress += progressStep;
              setZipProgress(zippingProgress);
          }
          
          const offlineIndexHtml = generateOfflineIndexHtml(processedPlaybookForZip, businessData);
          zip.file('index.html', offlineIndexHtml);
          setZipProgress(99);

          zip.generateAsync({ type: "blob" })
              .then(function(content) {
                  setZipProgress(100);
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(content);
                  link.download = "Hormozi_AI_Business_Plan.zip";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  setShowAllPdfsForZip(false);
                  setProcessedPlaybookForZip(null);
                  setIsZipping(false);
              });
      };
      performZipping();
    }
  }, [showAllPdfsForZip, isZipping, processedPlaybookForZip, businessData]);

  useEffect(() => {
    if (playbook && chatHistory.length === 0) {
        setChatHistory([{
            role: 'model',
            content: "I've created your first plan. Now, let's make it perfect. Ask me to change a section, give you new ideas, or explain a concept. How can I help?"
        }]);
    }
  }, [playbook, chatHistory.length]);

  const handleSendMessage = async (message: string) => {
      if (!message.trim() || isChatLoading || !businessData || !playbook) return;

      const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
      setChatHistory(newHistory);
      setIsChatLoading(true);

      try {
          const stream = await generateChatResponseStream(businessData, playbook, newHistory);
          
          let aiResponse = '';
          setChatHistory(prev => [...prev, { role: 'model', content: '' }]);

          for await (const chunk of stream) {
              aiResponse += chunk.text;
              setChatHistory(prev => {
                  const updatedHistory = [...prev];
                  updatedHistory[updatedHistory.length - 1].content = aiResponse;
                  return updatedHistory;
              });
          }

      } catch (err) {
          const errorMessage = err instanceof Error ? `Chat Error: ${err.message}` : 'An unknown chat error occurred.';
          setChatHistory(prev => [...prev, { role: 'model', content: `Sorry, I ran into a problem: ${errorMessage}` }]);
      } finally {
          setIsChatLoading(false);
      }
  };

  useEffect(() => {
    if (!isGeneratingPdf || !playbook) return;
    if (!pdfType && !assetForPdf && !assetBundleForPdf) return;

    const generatePdf = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));

      setPdfProgress(95); // Content is ready, now generating PDF

      let sourceElement: HTMLDivElement | null = null;
      let fileName: string = '';

      if (assetForPdf) {
          sourceElement = pdfAssetRef.current;
          fileName = assetForPdf.name ? `${assetForPdf.name.replace(/ /g, '_')}` : 'Hormozi_AI_Asset';
      } else if (assetBundleForPdf) {
          sourceElement = pdfSingleRenderRef.current;
          fileName = `Hormozi_AI_Assets_${assetBundleForPdf.name.replace(/ /g, '_')}`;
      } else if (pdfType) {
          sourceElement = pdfSingleRenderRef.current;
          fileName = `Hormozi_AI_${pdfType.replace(/ /g, '_')}`;
      }

      if (!sourceElement) {
        setError('Could not find content to generate PDF from.');
        setIsGeneratingPdf(false);
        setPdfType(null);
        setAssetForPdf(null);
        setGeneratingAsset(null);
        setAssetBundleForPdf(null);
        setGeneratingAssetBundleFor(null);
        return;
      }

      const { jsPDF } = (window as any).jspdf;
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      
      pdf.html(sourceElement, {
        autoPaging: 'text',
        x: 0,
        y: 0,
        width: 210, // A4 width
        windowWidth: 800,
        margin: 0,
        callback: function(doc: any) {
          doc.save(`${fileName}.pdf`);
          setPdfProgress(100);
          // Reset state after a short delay
          setTimeout(() => {
            setIsGeneratingPdf(false);
            setPdfType(null);
            setAssetForPdf(null);
            setGeneratingAsset(null);
            setAssetBundleForPdf(null);
            setGeneratingAssetBundleFor(null);
          }, 500);
        }
      });
    };

    generatePdf();
  }, [isGeneratingPdf, pdfType, assetForPdf, assetBundleForPdf, playbook]);

  if (isLoading) {
    const AVERAGE_TIME_PER_STEP_SECONDS = 8;
    const TOTAL_STEPS = 12;
    const estimatedTotalTime = TOTAL_STEPS * AVERAGE_TIME_PER_STEP_SECONDS;
    const timeRemaining = Math.max(0, estimatedTotalTime - elapsedTime);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    let timeRemainingText = '';
    if (loadingProgress < 5) {
        timeRemainingText = `Estimating time...`;
    } else if (timeRemaining > 0 && loadingProgress < 100) {
        timeRemainingText = `About ${minutes > 0 ? `${minutes}m ` : ''}${seconds.toString().padStart(2, '0')}s remaining`;
    } else if (loadingProgress < 100) {
        timeRemainingText = `Finishing up...`;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg text-center">
            <h2 className="text-3xl font-black text-white mb-4">Building Your Plan...</h2>
            <p className="text-gray-400 mb-8">Your AI assistant is analyzing your business and crafting your custom growth plan. This might take a moment.</p>
            <ProgressBar progress={loadingProgress} loadingText={loadingText} timeRemainingText={timeRemainingText} />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 text-center">
            <Card>
                <h2 className="text-2xl font-bold text-red-400 mb-4">An Error Occurred</h2>
                <p className="text-gray-300 bg-gray-900 p-4 rounded-md">{error}</p>
                <button 
                    onClick={resetApp}
                    className="mt-6 px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
                >
                    Start Over
                </button>
            </Card>
        </div>
    );
  }

  if (step === 2 && playbook && businessData) {
      return (
          <div className="p-4 md:p-8">
              {isZipping && (
                <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4 text-center">
                   <h2 className="text-3xl font-black text-white mb-4">Preparing Your Download...</h2>
                   <p className="text-gray-400 mb-8 max-w-lg">{zipProgress < 50 ? 'First, your AI is generating all the custom asset content for your offers...' : 'Now, all your documents are being compiled into a single ZIP file...'}</p>
                   <div className="w-full max-w-lg">
                      <ProgressBar progress={zipProgress} loadingText={zipProgress < 50 ? 'Generating Assets' : 'Creating Zip File'} />
                   </div>
                </div>
              )}
              {showAllPdfsForZip && processedPlaybookForZip && <div className="opacity-0 absolute -z-10"><AllPdfs playbook={processedPlaybookForZip} businessData={businessData} type="all" /></div>}
              
              <div ref={pdfSingleRenderRef} className={isGeneratingPdf && (pdfType || assetBundleForPdf) ? 'fixed top-0 left-0 -z-10 opacity-0' : 'hidden'}>
                {playbook && businessData && (pdfType || assetBundleForPdf) && <AllPdfs playbook={playbook} businessData={businessData} type={pdfType} assetBundle={assetBundleForPdf} />}
              </div>
              <div ref={pdfAssetRef} className={isGeneratingPdf && assetForPdf ? 'fixed top-0 left-0 -z-10 opacity-0' : 'hidden'}>
                {assetForPdf && <AllPdfs playbook={playbook} businessData={businessData} type={null} singleAsset={assetForPdf} />}
              </div>
              {assetToPreview && <OfferPreviewModal asset={assetToPreview.asset!} onClose={() => setAssetToPreview(null)} />}
              {generatedVideoUrl && <VideoPlayerModal videoUrl={generatedVideoUrl} onClose={() => setGeneratedVideoUrl(null)} />}
              {isVideoGenerating && (
                 <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4 text-center">
                   <h2 className="text-3xl font-black text-white mb-4">Generating Your Video Overview...</h2>
                   <p className="text-gray-400 mb-8 max-w-lg">{videoGenerationText}</p>
                   <div className="w-full max-w-lg">
                      <ProgressBar progress={videoGenerationProgress} loadingText={videoGenerationText} />
                   </div>
                </div>
              )}


              <div className="max-w-7xl mx-auto">
                  <header className="text-center mb-12">
                      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Your <span className="text-yellow-400">Super Simple</span> Business Plan</h1>
                      <p className="text-gray-400 mt-4 max-w-3xl mx-auto">This is your complete growth plan. Use the sections below to understand the strategy, and use the download buttons to get your ready-to-use assets.</p>
                      <div className="mt-8 flex flex-wrap gap-4 items-center justify-center">
                          <button 
                              onClick={resetApp}
                              className="px-6 py-3 bg-gray-700 text-yellow-300 font-bold rounded-lg hover:bg-gray-600 transition-colors"
                          >
                              Start a New Plan
                          </button>
                           <button
                              onClick={handleGenerateVideoOverview}
                              disabled={isVideoGenerating}
                              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50"
                            >
                                Generate Video Overview
                            </button>
                          <DropdownButton
                            label="Download PDFs"
                            isLoading={isGeneratingPdf}
                            progress={pdfProgress}
                            options={[
                                { label: 'Full Playbook', onClick: () => prepareAndDownloadPdf('full') },
                                { label: 'Concepts Guide', onClick: () => prepareAndDownloadPdf('concepts-guide') },
                                { label: 'Money Models Guide', onClick: () => prepareAndDownloadPdf('money-models-guide') },
                                { label: 'Offer Presentation Slides', onClick: () => prepareAndDownloadPdf('offer-presentation') },
                                { label: 'Business Scorecard (KPIs)', onClick: () => prepareAndDownloadPdf('kpi-dashboard') },
                                { label: 'High-Converting Landing Page', onClick: () => prepareAndDownloadPdf('landing-page') },
                                { label: 'Simple Offer Flyer', onClick: () => prepareAndDownloadPdf('downsell-pamphlet') },
                                { label: 'Customer Follow-Up Note', onClick: () => prepareAndDownloadPdf('tripwire-followup') },
                                { label: 'Your Money Making Plan', onClick: () => prepareAndDownloadPdf('cfa-model') },
                            ]}
                          />
                          <button
                              onClick={handleDownloadAll}
                              disabled={isZipping || isGeneratingPdf}
                              className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                             Download Full Kit (.zip)
                          </button>
                          <button
                              onClick={handleDownloadHtmlPage}
                              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors"
                          >
                             Download Offline Page
                          </button>
                      </div>
                  </header>
                  <FullPlaybook 
                    playbook={playbook} 
                    onDownloadAsset={prepareAndDownloadAssetPdf}
                    onPreviewAsset={handlePreviewAsset}
                    isAnyPdfGenerating={isGeneratingPdf || isZipping}
                    generatingAsset={generatingAsset}
                    onDownloadAllAssets={prepareAndDownloadAssetBundlePdf}
                    generatingAssetBundleFor={generatingAssetBundleFor}
                    chatHistory={chatHistory}
                    isChatLoading={isChatLoading}
                    onSendMessage={handleSendMessage}
                    pdfProgress={pdfProgress}
                  />
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Step1Form onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default App;