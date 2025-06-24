import { ArticleTitle, MutedText } from "./ui/Typography";
import launcherContent from "../content/launcher.json";

export function AddSecretSection() {
  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>{launcherContent.step_5_title}</ArticleTitle>
        <MutedText>{launcherContent.step_5_description}</MutedText>
      </header>
      
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center">
            <span className="text-yellow-500 mr-2">⚠️</span>
            Security Notice
          </h4>
          <p className="text-sm mb-3">
            Your Reclaim App Secret is sensitive and should never be exposed publicly. Add it directly to your local .env.local file:
          </p>
          <div className="bg-black/50 rounded-lg p-3 font-mono text-sm">
            EXPO_PUBLIC_RECLAIM_APP_SECRET="your-actual-secret-here"
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold">Important Guidelines:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>Never commit the .env.local file to version control</li>
            <li>Add .env.local to your .gitignore file</li>
            <li>Keep your secret secure and rotate it regularly</li>
            <li>Use environment-specific secrets for production</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm">
            <strong>Next Steps:</strong> Once you've added your secret to the .env.local file, your Reclaim integration will be fully configured and ready to use.
          </p>
        </div>
      </section>
    </article>
  );
}