import * as Tabs from "@radix-ui/react-tabs";
import { ArticleTitle, MutedText, SectionSubheading } from "./ui/Typography";
import { OneLiner } from "./OneLiner";
import CopyButton from "./CopyButton";
import { buildInstallUrl } from "../utils/url-util";
import { type FrontendTemplate, FRONTEND_TEMPLATES } from "../config/constants";
import launcherContent from "../content/launcher.json";

interface InstallationSectionProps {
  frontendTemplate: FrontendTemplate;
  textboxValue: string;
  account: { bech32Address: string } | undefined;
}

export function InstallationSection({
  frontendTemplate,
  textboxValue,
  account,
}: InstallationSectionProps) {
  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>{frontendTemplate === FRONTEND_TEMPLATES.RUM ? "Step 3: " : "Step 4: "}{launcherContent.step_3_title}</ArticleTitle>
        <MutedText>{launcherContent.step_3_description}</MutedText>
      </header>

      <Tabs.Root defaultValue="one-liner" className="w-full">
        <Tabs.List className="flex border-b border-white/10 mb-6">
          <Tabs.Trigger
            value="one-liner"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white transition-colors"
          >
            {launcherContent.tabs.one_liner.title}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="manual"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white transition-colors"
          >
            {launcherContent.tabs.manual.title}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="one-liner" className="outline-none">
          <section className="flex flex-col gap-4 mb-6">
            <SectionSubheading
              title={launcherContent.tabs.one_liner.subheading}
              description={launcherContent.tabs.one_liner.description}
            />
            <OneLiner
              url={buildInstallUrl(
                window.location.origin,
                account?.bech32Address,
                frontendTemplate
              )}
            />
          </section>
        </Tabs.Content>

        <Tabs.Content value="manual" className="outline-none">
          <section className="flex flex-col gap-4">
            <SectionSubheading
              title={launcherContent.tabs.manual.subheading}
              description={launcherContent.tabs.manual.description}
            />
            <div className="flex flex-col gap-4 bg-white/5 rounded-lg p-4">
              <div className="flex flex-col gap-2">
                <textarea
                  readOnly
                  className="w-full p-4 bg-white/10 rounded-lg font-mono text-sm"
                  rows={7}
                  value={textboxValue}
                />
                <div className="flex justify-end gap-2">
                  <CopyButton text={textboxValue} />
                </div>
              </div>
            </div>
          </section>
        </Tabs.Content>
      </Tabs.Root>
    </article>
  );
}
