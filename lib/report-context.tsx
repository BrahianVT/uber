"use client";

import React, { createContext, useState, useContext, useMemo } from 'react';
import type { ReportData, FormData } from './types';

interface ReportContextType {
  reportData: ReportData | null;
  setReportData: (data: ReportData | null) => void;
  formData: FormData | null;
  setFormData: (data: FormData | null) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  const value = useMemo(() => {
    return {
      reportData,
      setReportData,
      formData,
      setFormData,
    };
  }, [reportData, formData]);

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
}
