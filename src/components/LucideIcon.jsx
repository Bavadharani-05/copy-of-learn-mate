import React from 'react';
import * as Icons from 'lucide-react';

/**
 * Renders a Lucide icon dynamically from a kebab-case or camelCase string name.
 * e.g. "graduation-cap" -> <Icons.GraduationCap />
 */
export function LucideIcon({ name, className }) {
  // Convert kebab-case names to PascalCase
  const toPascalCase = (str) => {
    if (!str) return 'HelpCircle';
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };

  const pascalName = toPascalCase(name);
  const IconComponent = Icons[pascalName] || Icons.HelpCircle;

  return <IconComponent className={className} />;
}

export default LucideIcon;
