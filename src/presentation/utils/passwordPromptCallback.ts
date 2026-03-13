let callback: ((value: string | null) => void) | null = null;

export const setPasswordPromptCallback = (cb: ((value: string | null) => void) | null): void => {
  // Warn if overriding an existing callback (indicates potential bug)
  if (callback && cb) {
    console.warn('[passwordPromptCallback] Overriding existing callback - this may indicate a bug');
  }
  callback = cb;
};

export const resolvePasswordPrompt = (value: string | null): void => {
  if (callback) {
    callback(value);
    callback = null;
  }
};
