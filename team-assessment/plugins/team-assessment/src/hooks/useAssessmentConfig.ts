import { useEffect, useState } from 'react';
import yaml from 'js-yaml';

type AssessmentConfig = {
  'Soft Skills': {
    area: string;
    title: string;
    description: string;
    labels: string[];
  }[];
  'Hard Skills': {
    title: string;
    description: string;
    labels: string[];
  }[];
};

export function useAssessmentConfig() {
  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/assessment-config.yaml');
        const text = await res.text();
        const parsed = yaml.load(text);

        // Додай логування, щоб переконатися що зчитано вірно
        console.log('Parsed YAML config:', parsed);

        // Перевіряємо наявність потрібних ключів
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'Soft Skills' in parsed &&
          'Hard Skills' in parsed
        ) {
          setConfig(parsed as AssessmentConfig);
        } else {
          throw new Error('Missing required keys in YAML config');
        }
      } catch (err: any) {
        console.error('❌ Failed to load assessment config:', err);
        setError(err.message || 'Error loading config');
      }
    };

    loadConfig();
  }, []);

  return { config, error };
}
