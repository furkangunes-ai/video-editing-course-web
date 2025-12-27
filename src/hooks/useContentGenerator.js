/**
 * Instagram İçerik Oluşturma React Hook
 */

import { useState, useCallback } from 'react';
import { generateContent, generateContentStream } from '../api/contentApi';

export function useContentGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepName, setStepName] = useState('');
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setCurrentStep(0);
    setStepName('');
    setSteps([]);
    setResult(null);
    setError(null);
  }, []);

  // Tek seferde oluştur (streaming olmadan)
  const generate = useCallback(async (topic) => {
    reset();
    setIsLoading(true);

    try {
      const response = await generateContent(topic);

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || 'Bilinmeyen hata');
      }
    } catch (err) {
      setError(err.message || 'Bağlantı hatası');
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  // Streaming ile adım adım oluştur
  const generateWithStream = useCallback(async (topic) => {
    reset();
    setIsLoading(true);

    await generateContentStream(
      topic,
      // Her adım güncellemesinde
      (step) => {
        setCurrentStep(step.step);
        setStepName(step.name);
        setSteps((prev) => {
          const existing = prev.findIndex((s) => s.step === step.step);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = step;
            return updated;
          }
          return [...prev, step];
        });
      },
      // Tamamlandığında
      (finalResult) => {
        setResult(finalResult);
        setIsLoading(false);
      },
      // Hata durumunda
      (errorMsg) => {
        setError(errorMsg);
        setIsLoading(false);
      }
    );
  }, [reset]);

  return {
    isLoading,
    currentStep,
    stepName,
    steps,
    result,
    error,
    generate,
    generateWithStream,
    reset,
  };
}
