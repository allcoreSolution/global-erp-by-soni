import React, { useState } from 'react';
import { Landmark, Printer, Download, FileText, Check, ChevronRight, X } from 'lucide-react';

const SalarySlips = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('EMP-001');
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedTemplate, setSelectedTemplate] = useState('1'); // 1 to 5

  const employees = [
    { id: 'EMP-001', name: 'Vikram Singh', role: 'Technical Lead', dept: 'IT Department', bank: 'HDFC Bank A/c', acNo: '50100439281', basic: 60000, hra: 24000, da: 12000, allowance: 15000, pf: 7200, esi: 0, loan: 2000, workingDays: 31, paidDays: 30 },
    { id: 'EMP-002', name: 'Neha Gupta', role: 'Sales Lead', dept: 'Marketing Dept', bank: 'ICICI Bank A/c', acNo: '00230156782', basic: 30000, hra: 12000, da: 6000, allowance: 8000, pf: 3600, esi: 350, loan: 0, workingDays: 31, paidDays: 31 },
    { id: 'EMP-003', name: 'Rajesh Kumar', role: 'Operator', dept: 'Production Dept', bank: 'SBI Bank A/c', acNo: '31049281729', basic: 15000, hra: 6000, da: 3000, allowance: 4000, pf: 1800, esi: 250, loan: 500, workingDays: 31, paidDays: 28 },
    { id: 'EMP-004', name: 'Priya Patel', role: 'UI/UX Designer', dept: 'Creative Dept', bank: 'HDFC Bank A/c', acNo: '50100782631', basic: 40000, hra: 16000, da: 8000, allowance: 10000, pf: 4800, esi: 0, loan: 0, workingDays: 31, paidDays: 31 },
    { id: 'EMP-005', name: 'Amit Sharma', role: 'Senior Accountant', dept: 'Accounts Dept', bank: 'AXIS Bank A/c', acNo: '91202873619', basic: 35000, hra: 14000, da: 7000, allowance: 8000, pf: 4200, esi: 0, loan: 1500, workingDays: 31, paidDays: 30 }
  ];

  const templates = [
    { id: '1', name: 'Standard Corporate' },
    { id: '2', name: 'Classic Retro Simple' },
    { id: '3', name: 'Minimalist Modern' },
    { id: '4', name: 'Executive Premium (Dark Theme)' },
    { id: '5', name: 'Compact Pocket Slip' }
  ];

  const activeEmp = employees.find(e => e.id === selectedEmployeeId) || employees[0];

  // Calculations
  const getEarnings = () => activeEmp.basic + activeEmp.hra + activeEmp.da + activeEmp.allowance;
  const getDeductions = () => activeEmp.pf + activeEmp.esi + activeEmp.loan;
  const getNetPay = () => getEarnings() - getDeductions();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200/70 shadow-sm min-h-screen space-y-6 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 no-print">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-indigo-600" size={24} /> Salary Pay Slip Manager
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500">
            Generate and customize monthly salary slips with 5 diverse styling templates, print spooling, and PDF download support.
          </p>
        </div>
      </div>

      {/* Main Container splits into Side Selector & Template View */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side Controller Panel */}
        <div className="w-full lg:w-80 bg-slate-50 dark:bg-slate-50/50 shadow-inner border border-slate-200 border dark:border-slate-200 p-4 rounded-xl shrink-0 space-y-4 no-print">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b pb-2">
            Selection & Config
          </div>

          <div className="space-y-3.5 text-xs font-semibold text-gray-700">
            {/* Choose Employee */}
            <div>
              <label className="block mb-1 text-gray-600">Select Employee</label>
              <select 
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none dark:bg-slate-800"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
            </div>

            {/* Choose Period */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-gray-600">Month</label>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500"
                >
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-gray-600">Year</label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500"
                >
                  {['2025', '2026', '2027'].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Choose Template Grade */}
            <div>
              <label className="block mb-1 text-gray-600">Select Payslip Template</label>
              <div className="space-y-1.5 mt-1">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`w-full text-left p-2 rounded border transition text-[11px] font-bold ${
                      selectedTemplate === t.id 
                        ? 'border-blue-500 bg-blue-50/10 text-indigo-600' 
                        : 'border-transparent hover:bg-slate-100'
                    }`}
                  >
                    {t.id}. {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 border-t space-y-2">
              <button 
                onClick={handlePrint}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-slate-800 rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Printer size={14} /> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Live Preview Panel */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950/20 border p-4 sm:p-8 rounded-xl flex justify-center overflow-y-auto">
          
          <div id="print-area" className="bg-white text-slate-850 p-6 shadow-sm border rounded w-full max-w-[650px] font-sans text-xs leading-relaxed">
            
            {/* 1. STANDARD CORPORATE TEMPLATE */}
            {selectedTemplate === '1' && (
              <div className="space-y-4">
                <div className="text-center border-b-2 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider">ALLCORE SOLUTION PVT. LTD.</h2>
                  <p className="text-[10px] text-gray-500">Corporate HQ: Mumbai, Maharashtra | GSTIN: 27AAAAA0000A1Z2</p>
                  <h3 className="text-xs font-bold mt-2 bg-slate-100 px-3 py-1 rounded inline-block text-slate-700">SALARY SLIP FOR {selectedMonth.toUpperCase()} {selectedYear}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[10px] border-b pb-3">
                  <div className="space-y-1">
                    <p><strong>Employee Name:</strong> {activeEmp.name}</p>
                    <p><strong>Employee ID:</strong> {activeEmp.id}</p>
                    <p><strong>Designation:</strong> {activeEmp.role}</p>
                    <p><strong>Department:</strong> {activeEmp.dept}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Bank Account:</strong> {activeEmp.bank} ({activeEmp.acNo})</p>
                    <p><strong>LOP / Paid Days:</strong> {activeEmp.workingDays - activeEmp.paidDays} / {activeEmp.paidDays} Days</p>
                    <p><strong>Working Days:</strong> {activeEmp.workingDays} Days</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 border border-gray-200 divide-x text-[10px]">
                  {/* Earnings Column */}
                  <div>
                    <div className="bg-slate-50 font-bold p-2 border-b">EARNINGS</div>
                    <div className="p-2 space-y-1.5">
                      <div className="flex justify-between"><span>Basic Salary:</span><span>₹{activeEmp.basic.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>HRA Allowance:</span><span>₹{activeEmp.hra.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>DA Allowance:</span><span>₹{activeEmp.da.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Special Allowances:</span><span>₹{activeEmp.allowance.toLocaleString()}</span></div>
                    </div>
                  </div>
                  {/* Deductions Column */}
                  <div>
                    <div className="bg-slate-50 font-bold p-2 border-b">DEDUCTIONS</div>
                    <div className="p-2 space-y-1.5">
                      <div className="flex justify-between"><span>PF Contribution:</span><span>₹{activeEmp.pf.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>ESI Contribution:</span><span>₹{activeEmp.esi.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Loan / Advance Deduction:</span><span>₹{activeEmp.loan.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 border border-t-0 border-gray-200 divide-x text-[10px] font-bold">
                  <div className="flex justify-between p-2"><span>Gross Earnings:</span><span>₹{getEarnings().toLocaleString()}</span></div>
                  <div className="flex justify-between p-2"><span>Total Deductions:</span><span>₹{getDeductions().toLocaleString()}</span></div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center text-xs font-bold text-blue-900 mt-4">
                  <span>NET TAKE-HOME PAYABLE:</span>
                  <span className="text-sm font-extrabold">₹{getNetPay().toLocaleString()}</span>
                </div>

                <div className="flex justify-between pt-12 text-[9px] text-gray-500">
                  <div className="text-center border-t border-dashed w-32 pt-1">Employee Signature</div>
                  <div className="text-center border-t border-dashed w-32 pt-1">Authorised Signatory</div>
                </div>
              </div>
            )}

            {/* 2. CLASSIC RETRO SIMPLE */}
            {selectedTemplate === '2' && (
              <div className="border-4 double border-double border-slate-200 p-4 space-y-3 font-mono text-[10px]">
                <div className="text-center border-b pb-2">
                  <h2 className="text-xs font-bold">ALLCORE SOLUTION SALARY SHEET</h2>
                  <p>PAY PERIOD: {selectedMonth} {selectedYear}</p>
                </div>
                <div className="border-b pb-2">
                  <p>EMP: {activeEmp.name} | ROLE: {activeEmp.role}</p>
                  <p>BANK: {activeEmp.bank} | AC: {activeEmp.acNo}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>Basic Pay:</span><span>₹{activeEmp.basic}</span></div>
                  <div className="flex justify-between"><span>HRA:</span><span>₹{activeEmp.hra}</span></div>
                  <div className="flex justify-between"><span>DA:</span><span>₹{activeEmp.da}</span></div>
                  <div className="flex justify-between"><span>Allowances:</span><span>₹{activeEmp.allowance}</span></div>
                  <div className="flex justify-between border-t border-dashed pt-1 text-rose-600"><span>Deductions Total (PF/ESI/Loan):</span><span>-₹{getDeductions()}</span></div>
                  <div className="flex justify-between border-t font-bold text-xs pt-1"><span>NET PAY:</span><span>₹{getNetPay()}</span></div>
                </div>
              </div>
            )}

            {/* 3. MINIMALIST MODERN */}
            {selectedTemplate === '3' && (
              <div className="space-y-6 font-sans text-xs">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h2 className="text-sm font-extrabold text-indigo-600 uppercase">Allcore Solution</h2>
                    <span className="text-[10px] text-gray-400">Payroll Division</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">SALARY SLIP</span>
                    <strong className="text-gray-800 font-bold">{selectedMonth} {selectedYear}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-600 bg-slate-50 p-3 rounded-lg">
                  <div>
                    <span className="text-gray-400 font-bold block mb-0.5">EMPLOYEE</span>
                    <strong>{activeEmp.name}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block mb-0.5">DESIGNATION</span>
                    <strong>{activeEmp.role}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block mb-0.5">PAYMENT MODE</span>
                    <strong>Bank Transfer</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-1 font-bold text-gray-400 text-[10px]">
                    <span>PARTICULARS</span>
                    <span>AMOUNT (₹)</span>
                  </div>
                  <div className="flex justify-between"><span>Basic Salary</span><span>₹{activeEmp.basic}</span></div>
                  <div className="flex justify-between"><span>House Rent Allowance (HRA)</span><span>₹{activeEmp.hra}</span></div>
                  <div className="flex justify-between"><span>Dearness Allowance (DA)</span><span>₹{activeEmp.da}</span></div>
                  <div className="flex justify-between text-rose-500"><span>PF Deduction</span><span>-₹{activeEmp.pf}</span></div>
                  {activeEmp.esi > 0 && <div className="flex justify-between text-rose-500"><span>ESI Contribution</span><span>-₹{activeEmp.esi}</span></div>}
                  {activeEmp.loan > 0 && <div className="flex justify-between text-rose-500"><span>Loan installment</span><span>-₹{activeEmp.loan}</span></div>}
                </div>

                <div className="flex justify-between items-center pt-3 border-t font-bold">
                  <span className="text-slate-800">Net Take-Home Payable:</span>
                  <span className="text-base text-indigo-600 font-black">₹{getNetPay().toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* 4. EXECUTIVE PREMIUM (DARK THEME TITLE) */}
            {selectedTemplate === '4' && (
              <div className="space-y-4 font-sans text-xs">
                <div className="bg-slate-50/50 shadow-inner border border-slate-200 text-slate-800 p-4 rounded-t-lg flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-wider text-blue-400">Allcore Executive Slip</h2>
                    <p className="text-[9px] text-gray-300">Confidential Salary Statement</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold bg-indigo-600 px-2 py-0.5 rounded text-slate-800">{selectedMonth} {selectedYear}</span>
                  </div>
                </div>

                <div className="p-4 border border-t-0 rounded-b-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-[10px] bg-slate-50 p-2.5 rounded">
                    <p><strong>Employee:</strong> {activeEmp.name} ({activeEmp.id})</p>
                    <p className="text-right"><strong>Role:</strong> {activeEmp.role}</p>
                  </div>

                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="border-b font-bold text-gray-500">
                        <th className="py-1">Salary Heads</th>
                        <th className="py-1 text-right">Earnings</th>
                        <th className="py-1 text-right text-rose-600">Deductions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1.5 font-semibold">Basic Pay Structure</td>
                        <td className="py-1.5 text-right font-mono">₹{activeEmp.basic}</td>
                        <td className="py-1.5 text-right">--</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 font-semibold">HRA & DA Allowances</td>
                        <td className="py-1.5 text-right font-mono">₹{activeEmp.hra + activeEmp.da}</td>
                        <td className="py-1.5 text-right">--</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 font-semibold">PF & ESI Deductibles</td>
                        <td className="py-1.5 text-right">--</td>
                        <td className="py-1.5 text-right font-mono text-rose-600">₹{activeEmp.pf + activeEmp.esi}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex justify-between font-bold text-xs pt-2">
                    <span>Final Salary Disbursed (Net):</span>
                    <span className="text-slate-900 border-b-2 border-blue-600 pb-0.5">₹{getNetPay()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. COMPACT POCKET SLIP */}
            {selectedTemplate === '5' && (
              <div className="max-w-[210px] mx-auto text-center space-y-2 font-mono text-[9px] leading-tight">
                <div className="border-b border-dashed pb-1.5">
                  <h4 className="font-bold uppercase text-[10px]">ALLCORE PAY</h4>
                  <p>SLIP: {selectedMonth.slice(0, 3)}-{selectedYear}</p>
                </div>
                <div className="text-left space-y-0.5 border-b border-dashed pb-1.5">
                  <p>EMP: {activeEmp.name.split(' ')[0]}</p>
                  <p>DEPT: {activeEmp.dept.split(' ')[0]}</p>
                </div>
                <div className="text-left space-y-0.5">
                  <div className="flex justify-between"><span>BASIC:</span><span>₹{activeEmp.basic}</span></div>
                  <div className="flex justify-between"><span>ALLOWANCES:</span><span>₹{activeEmp.hra + activeEmp.da + activeEmp.allowance}</span></div>
                  <div className="flex justify-between text-slate-500"><span>DED:</span><span>-₹{getDeductions()}</span></div>
                  <div className="flex justify-between text-[10px] border-t border-dashed pt-0.5 font-black"><span>NET DISB:</span><span>₹{getNetPay()}</span></div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* PRINT SCALED ONLY INJECTOR */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-area, #print-area * {
            visibility: visible !important;
          }
          #print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}} />

    </div>
  );
};

export default SalarySlips;
