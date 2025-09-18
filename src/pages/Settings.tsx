import React, { useState } from "react";
import { getApiKey, setApiKey, testApiKey } from "../api/ai";
import { Button } from "../common/ui/Button";
import { Input } from "../common/ui/Input";
import { Switch } from "../common/ui/Switch";
import { FiCheck, FiX, FiKey, FiCpu, FiRefreshCw, FiSliders } from "react-icons/fi";
import { motion } from "framer-motion";

const Section: React.FC<{ title: string; description: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, description, icon, children }) => (
  <motion.div 
    className="bg-card p-6 rounded-xl border border-card shadow-sm" 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-start gap-4">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">{icon}</div>
      <div>
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
    <div className="mt-4 pl-12">
      {children}
    </div>
  </motion.div>
);

const Settings: React.FC = () => {
  const [apiKey, setApiKeyValue] = useState(getApiKey() || "");
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | boolean>(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSave = () => {
    setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestKey = async () => {
    setTesting(true);
    try {
      const valid = await testApiKey(apiKey);
      setTestResult(valid);
    } catch {
      setTestResult(false);
    } finally {
      setTesting(false);
      setTimeout(() => setTestResult(null), 3000);
    }
  };

  const handleReset = () => {
    setApiKeyValue("");
    setAiEnabled(true);
    setDarkMode(false);
    setSaved(false);
    setTestResult(null);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold font-poppins text-primary mb-8">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Section title="API Configuration" description="Manage your Gemini API key for AI-powered features." icon={<FiKey className="w-6 h-6" />}>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your Gemini API Key"
                  value={apiKey}
                  onChange={(e) => setApiKeyValue(e.target.value)}
                  className="flex-1 bg-background text-primary border-gray-300"
                />
                <Button onClick={handleSave} className="bg-[#133356] text-white hover:bg-[#133356]/80 flex items-center gap-1">
                  Save {saved && <FiCheck className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex gap-2 mt-2 items-center">
                <Button onClick={handleTestKey} variant="outline" size="sm" className="flex items-center gap-1" disabled={!apiKey || testing}>
                  {testing ? "Testing..." : "Test API Key"}
                </Button>
                {testResult !== null && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-sm flex items-center gap-1 ${testResult ? "text-green-600" : "text-red-600"}`}>
                    {testResult ? <FiCheck /> : <FiX />}
                    {testResult ? "Valid" : "Invalid"}
                  </motion.span>
                )}
              </div>
            </Section>
          </div>

          <div className="flex flex-col gap-8">
            <Section title="AI Features" description="Enable or disable the AI assistant." icon={<FiCpu className="w-6 h-6" />}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-light-text">Enable AI Assistant</span>
                <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
              </div>
            </Section>

            <Section title="Appearance" description="Customize the look and feel." icon={<FiSliders className="w-6 h-6" />}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-light-text">Dark Mode</span>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </Section>

            <Section title="Reset" description="Reset all settings to default." icon={<FiRefreshCw className="w-6 h-6" />}>
                <Button variant="destructive" size="sm" onClick={handleReset}>
                    Reset All Settings
                </Button>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
