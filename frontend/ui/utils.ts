// Self-contained utility function with no external dependencies
type ClassValue = string | number | boolean | undefined | null | ClassArray | ClassDictionary;
type ClassArray = ClassValue[];
type ClassDictionary = Record<string, any>;

function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    const type = typeof input;
    
    if (type === 'string' || type === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = clsx(...input);
      if (inner) classes.push(inner);
    } else if (type === 'object') {
      for (const key in input as ClassDictionary) {
        if ((input as ClassDictionary)[key]) {
          classes.push(key);
        }
      }
    }
  }
  
  return classes.join(' ');
}

function twMerge(str: string): string {
  return str;
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}
