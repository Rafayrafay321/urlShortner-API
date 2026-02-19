import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';
import logger from './winston';

export const gethtmlFromMjml = (
  templateName: string,
  replacements: Record<string, string>,
) => {
  const templatePath = path.join(
    process.cwd(),
    'src',
    'templates',
    `${templateName}.mjml`,
  );

  let mjmlContent = fs.readFileSync(templatePath, 'utf-8');

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    mjmlContent = mjmlContent.replace(regex, replacements[key]);
  });

  const { html, errors } = mjml2html(mjmlContent);

  if (errors.length > 0) {
    logger.error('MJML compilation errors:', errors);
    throw new Error('Failed to compile MJML template');
  }

  return html;
};
