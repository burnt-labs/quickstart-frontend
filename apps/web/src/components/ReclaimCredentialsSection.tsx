export interface ReclaimCredentials {
  appId: string;
  appSecret: string;
  providerId: string;
}

interface ReclaimCredentialsSectionProps {
  credentials: ReclaimCredentials;
  onCredentialsChange: (credentials: ReclaimCredentials) => void;
}

import { ArticleTitle, MutedText } from "./ui/Typography";
import launcherContent from "../content/launcher.json";

export function ReclaimCredentialsSection({
  credentials,
  onCredentialsChange,
}: ReclaimCredentialsSectionProps) {
  const isComplete = credentials.appId && credentials.providerId;
  
  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>{launcherContent.step_3_title}</ArticleTitle>
        <MutedText>{launcherContent.step_3_description}</MutedText>
      </header>
      
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
        {!isComplete && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-400 mb-4">
            <p>ℹ️ Please provide your App ID and Provider ID to continue to Step 4</p>
          </div>
        )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="reclaim-app-id" className="block text-sm font-medium mb-2">
            Reclaim App ID <span className="text-red-500">*</span>
          </label>
          <input
            id="reclaim-app-id"
            type="text"
            value={credentials.appId}
            onChange={(e) => onCredentialsChange({ ...credentials, appId: e.target.value })}
            placeholder="Your Reclaim application ID"
            className="w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        
        
        <div>
          <label htmlFor="reclaim-provider-id" className="block text-sm font-medium mb-2">
            Reclaim Provider ID <span className="text-red-500">*</span>
          </label>
          <input
            id="reclaim-provider-id"
            type="text"
            value={credentials.providerId}
            onChange={(e) => onCredentialsChange({ ...credentials, providerId: e.target.value })}
            placeholder="Your Reclaim provider ID"
            className="w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mt-4">
        Get these credentials from your <a href="https://dev.reclaimprotocol.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Reclaim Protocol dashboard</a>
      </p>
      </section>
    </article>
  );
}