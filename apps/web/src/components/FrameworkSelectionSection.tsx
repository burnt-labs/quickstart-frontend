import { ArticleTitle, MutedText } from "./ui/Typography";
import { FrameworkCard } from "./FrameworkCard";
import { FRONTEND_TEMPLATES, type FrontendTemplate } from "../config/constants";
import launcherContent from "../content/launcher.json";

interface FrameworkSelectionSectionProps {
  frontendTemplate: FrontendTemplate;
  onTemplateChange: (template: FrontendTemplate) => void;
  contractType?: "usermap" | "rum";
}

export function FrameworkSelectionSection({
  frontendTemplate,
  onTemplateChange,
  contractType = "usermap",
}: FrameworkSelectionSectionProps) {
  // RUM contracts only support mobile apps
  const isRum = contractType === "rum";
  
  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>{launcherContent.step_2_title}</ArticleTitle>
        <MutedText>
          {isRum 
            ? "RUM contracts are designed for mobile apps with zkTLS proof verification."
            : launcherContent.step_2_description}
        </MutedText>
      </header>
      <section className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {!isRum && (
            <FrameworkCard
              name={FRONTEND_TEMPLATES.WEBAPP}
              description={launcherContent.webapp_description}
              selected={FRONTEND_TEMPLATES.WEBAPP === frontendTemplate}
              onClick={() => onTemplateChange(FRONTEND_TEMPLATES.WEBAPP)}
              templateUrl={launcherContent.webapp_template_url}
            />
          )}

          <FrameworkCard
            name={FRONTEND_TEMPLATES.MOBILE}
            description={isRum 
              ? "Mobile app with Reclaim Protocol integration for zkTLS proof verification"
              : launcherContent.mobile_description}
            selected={FRONTEND_TEMPLATES.MOBILE === frontendTemplate}
            onClick={() => onTemplateChange(FRONTEND_TEMPLATES.MOBILE)}
            templateUrl={launcherContent.mobile_template_url}
          />
        </div>
      </section>
    </article>
  );
}
