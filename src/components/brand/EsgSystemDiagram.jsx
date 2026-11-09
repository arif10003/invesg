import React from 'react';
import { Leaf, Users, Building2 } from 'lucide-react';

export const esgFactors = [
  { letter: 'E', title: 'Environment', description: 'Manage nature, climate, and resource impacts.', Icon: Leaf },
  { letter: 'S', title: 'Social', description: 'Create positive outcomes for people and communities.', Icon: Users },
  { letter: 'G', title: 'Governance', description: 'Build trust through accountability, ethics, and sound oversight.', Icon: Building2 },
];
export default function EsgSystemDiagram() {
  return <div className="esg-system-diagram" role="group" aria-label="Interconnected environmental, social and governance considerations around sustainable value"><svg className="esg-system-connections" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="38" /><path d="M50 12V48M17 69L50 48L83 69" /></svg>{esgFactors.map(({ letter, title, description, Icon }) => <div className={`esg-factor esg-factor-${letter.toLowerCase()}`} key={letter}><Icon aria-hidden="true" /><b>{letter}</b><strong>{title}</strong><span>{description}</span></div>)}<div className="esg-system-value"><Leaf aria-hidden="true" /><strong>Sustainable<br />Value</strong><span>Resilience. Growth.<br />Long-term impact.</span></div></div>;
}
