"use client";

import React from "react";
import { X, ShieldCheck, CheckCircle2, FileText, Download, Award } from "lucide-react";

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    lab_name: string;
    report_no: string;
    report_url: string;
    tested_on: string;
    parameters: Record<string, any>;
    result: string;
  } | null;
  productName: string;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  onClose,
  report,
  productName
}) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-amber-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header */}
        <div className="flex items-start gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
            <Award className="w-7 h-7 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                FSSAI / NABL Accredited
              </span>
              <span className="text-xs text-slate-500 font-medium">Tested: {report.tested_on}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              Purity Inspection Certificate
            </h3>
            <p className="text-sm text-slate-600 font-medium">{productName}</p>
          </div>
        </div>

        {/* Lab info banner */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5 mb-5 flex items-center justify-between text-xs">
          <div>
            <p className="text-emerald-900 font-bold">{report.lab_name}</p>
            <p className="text-emerald-700 mt-0.5">Report ID: <span className="font-mono font-bold">{report.report_no}</span></p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>{report.result.replace("_", " ")}</span>
          </div>
        </div>

        {/* Tested Parameter Table */}
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Laboratory Quality & Safety Parameters
        </h4>
        <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 mb-6">
          {Object.entries(report.parameters).map(([key, value]) => {
            const label = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());
            return (
              <div key={key} className="flex justify-between items-center py-2.5 px-3.5 text-sm hover:bg-slate-50/80 transition">
                <span className="text-slate-600 font-medium">{label}</span>
                <span className="font-bold text-emerald-950 font-mono bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-100">
                  {typeof value === "number" ? `${value}%` : String(value)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Authenticity Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Traceable to AapnoKhet Warehouse Batch
          </p>
          <a
            href={report.report_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            Download Original PDF
          </a>
        </div>
      </div>
    </div>
  );
};
