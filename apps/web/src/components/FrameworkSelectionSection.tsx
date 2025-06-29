import { ArticleTitle, MutedText } from "./ui/Typography";
import { FrameworkCard } from "./FrameworkCard";
import { FRONTEND_TEMPLATES, type FrontendTemplate } from "../config/constants";
import launcherContent from "../content/launcher.json";

interface FrameworkSelectionSectionProps {
  frontendTemplate: FrontendTemplate;
  onTemplateChange: (template: FrontendTemplate) => void;
}

export function FrameworkSelectionSection({
  frontendTemplate,
  onTemplateChange,
}: FrameworkSelectionSectionProps) {
  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>Step 3: Select Frontend Framework</ArticleTitle>
        <MutedText>Choose your preferred frontend framework for the User Map application</MutedText>
      </header>
      <section className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <FrameworkCard
            name={FRONTEND_TEMPLATES.WEBAPP}
            description={launcherContent.webapp_description}
            selected={FRONTEND_TEMPLATES.WEBAPP === frontendTemplate}
            onClick={() => onTemplateChange(FRONTEND_TEMPLATES.WEBAPP)}
            templateUrl={launcherContent.webapp_template_url}
          />

          <FrameworkCard
            name={FRONTEND_TEMPLATES.MOBILE}
            description={launcherContent.mobile_description}
            selected={FRONTEND_TEMPLATES.MOBILE === frontendTemplate}
            onClick={() => onTemplateChange(FRONTEND_TEMPLATES.MOBILE)}
            templateUrl={launcherContent.mobile_template_url}
          />

        </div>
      </section>
    </article>
  );
}
