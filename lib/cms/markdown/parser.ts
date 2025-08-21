import { CustomComponent } from '@/types/cms';

export function parseCustomComponents(content: string): string {
  // Parse <ComponentName prop="value" /> syntax
  const componentRegex = /<(\w+)([^>]*?)(?:\s*\/\s*>|>\s*<\/\1>)/g;
  
  return content.replace(componentRegex, (match, componentName, propsString) => {
    const props = parseProps(propsString.trim());
    
    // Create a placeholder div that the renderer can replace
    return `<div class="custom-component" data-component="${componentName}" data-props='${JSON.stringify(props)}'></div>`;
  });
}

function parseProps(propsString: string): Record<string, any> {
  const props: Record<string, any> = {};
  
  if (!propsString.trim()) return props;
  
  // Handle both quoted and unquoted prop values
  const propRegex = /(\w+)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  
  let match;
  while ((match = propRegex.exec(propsString)) !== null) {
    const [, propName, doubleQuoted, singleQuoted, unquoted] = match;
    props[propName] = doubleQuoted || singleQuoted || unquoted;
  }
  
  return props;
}

export function extractCustomComponents(content: string): CustomComponent[] {
  const components: CustomComponent[] = [];
  const componentRegex = /<(\w+)([^>]*?)(?:\s*\/\s*>|>\s*<\/\1>)/g;
  
  let match;
  while ((match = componentRegex.exec(content)) !== null) {
    const [, componentName, propsString] = match;
    const props = parseProps(propsString.trim());
    
    components.push({
      name: componentName,
      props,
    });
  }
  
  return components;
}
