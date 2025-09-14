import React, { useState } from 'react';
import { XMarkIcon, ChevronRightIcon } from './icons/Icons';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Cadre = 'officer' | 'manager' | 'executive';

const syllabusData = [
  { name: 'HRD', officer: ['Basic Concepts in Management & leadership', 'Disciplinary process', 'Leave administration', 'Performance management system', 'Dress Code', 'Employee life cycle', 'CBN Culture'], manager: ['Basic Concepts in Management & leadership', 'Grievance resolution', 'Performance management system', 'Dress Code', 'Employee life cycle', 'CBN Culture'], executive: ['Management & leadership', 'Performance management system', 'Pension management', 'Dress Code', 'CBN Culture'] },
  { name: 'MSD', officer: ['Healthy lifestyle', 'Common diseases & treatments', 'Blood groups'], manager: ['Healthy lifestyle', 'Common diseases & treatments'], executive: ['Healthy lifestyle', 'Common diseases & treatments'] },
  { name: 'CSD', officer: ['CBN Governance Structure'], manager: ['Records Management', 'Meetings & Sceretariat identity', 'Board Administration'], executive: ['FOI & Public Complaints', 'Memorandum Writing'] },
  { name: 'COD', officer: ['Currency Management life cycle', 'Banknote security features', 'Naira Note Redesign', 'Forensic Currency Laboratory'], manager: ['Currency Management Initiatives', 'Naira Note Redesign', 'Forensic Currency Laboratory'], executive: ['Naira Note Redesign', 'Forensic Currency Laboratory'] },
  { name: 'ITD', officer: ['Information-Cyber Security + ISO27001', 'CBN IT applications', 'eNaira'], manager: ['Information-Cyber Security + ISO27001', 'CBN IT applications', 'Current Technology Trends-CBDC, Cloud, Socremedra'], executive: ['Information-Cyber Security + ISO27001'] },
  { name: 'BKSD', officer: ["Features of cheques", "Bankers' Clearing and Settlement System"], manager: ["Types of Government Securities", "Government Account Management", "Discounts Window Operations and Securities Setlement"], executive: ["International Payment System and Documentary Credit Operation"] },
  { name: 'GVD', officer: ['SERVICOM', 'Ethics and Anti-corruption Issues', 'Environmental sustainability'], manager: ['Ethics and Anti-corruption Issues', 'Anti Money Laundering/CFT', 'Environmental sustainability'], executive: ['Ethics and Anti-corruption Issues', 'Anti Money Laundering/CFT'] },
  { name: 'PSMD', officer: ['Payments System Initiatives', 'Payments System Strategy - Cashless policy', 'Agent banking'], manager: ['Payments System Strategy - Cashless policy', 'Agent banking', 'Open Banking', 'Regulator Sandbox', 'Mobile Money'], executive: ['Payments System Strategy', 'Open Banking', 'Regulator Sandbox', 'Mobile Money'] },
  { name: 'CDD', officer: ['Training cycle', 'Learning Technologies (Automation)'], manager: ['Training evaluation', 'Future of learning', 'Learning Technologies (Automation)', 'CDD Programmes & Offerings'], executive: ['CBN Training Policy', 'Future of learning', 'CDD Programmes & Offerings'] },
  { name: 'DFD', officer: ['CBN Interventions', 'Financial Inclusion'], manager: ['CBN Interventions', 'Financial Inclusion', 'NCR-National Collateral Registry', 'NCX-Nigeria Commodity Exchange'], executive: ['New CBN Interventions', 'Financial Inclusion', 'NCR-National Collateral Registry', 'NCX-Nigeria Commodity Exchange'] },
  { name: 'CPD', officer: ['Consumer protection principles'], manager: ['Rationale for Consumer protection', 'Consumer protection at the CBN'], executive: ['Consumer Protection Framework'] },
  { name: 'MPD', officer: ['Monetary policy & instruments'], manager: ['Monetary and Fiscal Policy Coordination', 'International Economic Relations'], executive: ['MPC Communique', 'International Economic Relations'] },
  { name: 'PSSD', officer: ['Basic Facilities Management Principles'], manager: ['Procurement', 'Basic project management principles', 'Basic Facilities Management Principles'], executive: ['Basic project management principles', 'Contract Management'] },
  { name: 'FMD', officer: ['Overview of the Nigerian Financial Markets', 'Instruments of financial markets'], manager: ['Instruments of financial markets', 'The Non-interest Financial Market', 'The Nigerian Foreign Exchange Market Development'], executive: ['CBN Liquidity Management', 'Inter-Bank Market Activities'] },
  { name: 'RMD', officer: ['Types, classification & basic risk management.'], manager: ['Types, classification & basic risk management.', 'Business Continiuty'], executive: ['Business Continiuty'] },
  { name: 'OFISD', officer: ['Types and Functions of Financial Institutions in Nigeria'], manager: ['Supervisory approach'], executive: [] },
  { name: 'STD', officer: ['Balance of Payments Basics'], manager: ['Analytical Balance Sheet', 'Government Finance Structure Compilation Basics'], executive: ['Real Sectors Indicators'] },
  { name: 'FPRD', officer: ['Licensing'], manager: ['Code of Corporate Governance'], executive: ['Policy formulation'] },
  { name: 'LSD', officer: ['Legal concepts in banking e.g. Ganishee orders'], manager: ['Highlights of BOFIA', 'CBN Act'], executive: ['CBN Act'] },
  { name: 'SSD', officer: ['Security tools'], manager: ['Security Policy/Manual'], executive: ['Security Policy/Manual'] },
  { name: 'IAD', officer: ['Audit types', 'Code of ethics'], manager: ['Internal Audit methodology & cycle', 'Code of ethics'], executive: ['Internal audit concepts: charter'] },
  { name: 'BOD', officer: ['Operation of branches'], manager: ['Operation of branches'], executive: [] },
  { name: 'FND', officer: ['Financial Reporting & Spend Account'], manager: ['Budgeting & forecasting', 'Financial Reporting & Spend Account'], executive: ['Budgeting & forecasting'] },
  { name: 'SMD', officer: ['CBN Mandates', 'CBN Vision & Mission', 'CBN Organisation structure', 'CBN Values'], manager: ['CBN strategy', 'CBN Mandates', 'CBN Values'], executive: ['CBN strategy'] },
  { name: 'RED', officer: ['External Reserves Management: Definitions, Composition'], manager: ['External Reserves Management: Definitions, Composition, Reasons, Ownership structure of reserves'], executive: ['External Reserves Management: Reasons, Ownership structure of reserves', 'External Reserve Governance Structure'] },
  { name: 'BSD', officer: ['Prudential Guidelines for financial institutions'], manager: ['Prudential Guidelines for financial institutions', 'Corporate Governance for financial institutions'], executive: ['Corporate Governance for financial institutions'] },
  { name: 'CCD', officer: ['Understanding Communication', 'Communication channels & tools'], manager: ['CBN Brand/Identity'], executive: ['Communication framework/Strategy'] },
  { name: 'TED', officer: ['Trade documents', 'Forms of international trade payments'], manager: ['Export & Import trade', 'Forex inflow & Outflow'], executive: ['Forex inflow & Outflow'] },
  { name: 'RSD', officer: ['Basic economic concepts: Demand, Supply, Inflation, GDP'], manager: ['Basic economic concepts: Unemployment, Price- Exchange Rate, Interest rate, Recession', 'Trade Barriers & Trade related organisations'], executive: ['Basic economic concepts: Inflation, Unemployment, Price- Exchange Rate, Interest rate, GDP, Recession', 'Current Developments in the local & International Economy'] },
];


const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 text-center font-semibold p-3 rounded-md cursor-pointer transition-all duration-300 ${active ? 'bg-cbn-green text-white shadow-md' : 'dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
    >
        {children}
    </button>
);


interface AccordionItemProps {
    title: string;
    topics: string[];
    isOpen: boolean;
    onClick: () => void;
}
const AccordionItem: React.FC<AccordionItemProps> = ({ title, topics, isOpen, onClick }) => (
    <div className="border-b dark:border-gray-700">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{title}</h3>
            <ChevronRightIcon className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                {topics.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 pl-2">
                        {topics.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                ) : (
                     <p className="text-gray-500 italic">No specific topics listed for this cadre.</p>
                )}
            </div>
        </div>
    </div>
);


const SyllabusModal: React.FC<SyllabusModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Cadre>('officer');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  if (!isOpen) return null;
  
  const handleAccordionClick = (departmentName: string) => {
    setOpenAccordion(openAccordion === departmentName ? null : departmentName);
  };

  const handleTabClick = (cadre: Cadre) => {
    setActiveTab(cadre);
    setOpenAccordion(null); // Collapse any open accordion when switching tabs
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
      >
        <header className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-cbn-green dark:text-cbn-gold">Examination Curriculum</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XMarkIcon />
          </button>
        </header>

        <main className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b dark:border-gray-700">
             <div className="flex flex-col sm:flex-row gap-2 rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
                <TabButton active={activeTab === 'officer'} onClick={() => handleTabClick('officer')}>Officer</TabButton>
                <TabButton active={activeTab === 'manager'} onClick={() => handleTabClick('manager')}>Manager</TabButton>
                <TabButton active={activeTab === 'executive'} onClick={() => handleTabClick('executive')}>Executive</TabButton>
             </div>
          </div>

          <div className="p-2 overflow-y-auto">
             {syllabusData.map(dept => (
                <AccordionItem
                    key={dept.name}
                    title={dept.name}
                    topics={dept[activeTab]}
                    isOpen={openAccordion === dept.name}
                    onClick={() => handleAccordionClick(dept.name)}
                />
             ))}
          </div>
        </main>
        
        <footer className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl flex justify-end items-center">
          <button
            onClick={onClose}
            className="py-2 px-5 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Close
          </button>
        </footer>

      </div>
        <style dangerouslySetInnerHTML={{ __html: `
            @keyframes scale-in {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        ` }} />
    </div>
  );
};

export default SyllabusModal;