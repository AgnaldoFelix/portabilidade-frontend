import type { ReactNode } from 'react';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
  icon: ReactNode;
  id: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
  id,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-kicker">{eyebrow}</span>
        <h2 id={id}>{title}</h2>
        <p>{description}</p>
      </div>
      <span className="heading-icon" aria-hidden="true">
        {icon}
      </span>
    </div>
  );
}
