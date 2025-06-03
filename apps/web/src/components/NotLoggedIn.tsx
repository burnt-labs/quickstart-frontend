import { useModal } from "@burnt-labs/abstraxion";
import { BaseButton } from "./ui/BaseButton";
import { PageTitle, SubsectionTitle } from "./ui/Typography";
import content from "../content/landing.json";

const ActionCard = ({
  title,
  description,
  link,
  link_text,
  onClick,
}: {
  title: string;
  description: string;
  link: string;
  link_text: string;
  onClick?: () => void;
}) => {
  return (
    <section className="flex flex-col gap-2 max-w-[375px] bg-white/5 rounded-lg p-8">
      <SubsectionTitle>{title}</SubsectionTitle>
      <p>{description}</p>
      <BaseButton
        onClick={onClick ? onClick : () => window.open(link, "_blank")}
      >
        {link_text}
      </BaseButton>
    </section>
  );
};

export function NotLoggedIn() {
  const [, setShowModal] = useModal();

  const handleLoginClick = () => {
    setShowModal(true);
  };

  return (
    <article className="flex flex-col items-center">
      <PageTitle className="text-center mb-4">{content.title}</PageTitle>
      <SubsectionTitle className="mb-8 text-center">
        {content.tagline}
      </SubsectionTitle>
      <div className="flex flex-col gap-4 md:flex-row ">
        {content.action_cards.map((card, index) => (
          <ActionCard
            key={index}
            {...card}
            onClick={index === 1 ? handleLoginClick : undefined}
          />
        ))}
      </div>
    </article>
  );
}
