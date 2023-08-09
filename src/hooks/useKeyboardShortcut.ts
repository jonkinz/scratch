import { useCallback, useEffect } from 'react';

type OptionalConfig = Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'shiftKey'>;

interface ShortcutConfig extends Partial<OptionalConfig> {
  code: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  shortcutTarget?: HTMLElement;
}

type ShortcutAction = (e: KeyboardEvent) => void;

// Custom type guard for keyboard event
function isKeyBoardEvent(e: Event): e is KeyboardEvent {
  return 'code' in e;
}

export default function useKeyboardShortcut( //args
  shortcutAction: ShortcutAction,
  config: ShortcutConfig
) {
  const targetElement = config.shortcutTarget || document;
  const eventHandler = useCallback(
    (e: Event) => {
      // e should be a keyboard event, so use a type guard here, as described here:
      // https://stackoverflow.com/questions/47166369/argument-of-type-e-customevent-void-is-not-assignable-to-parameter-of-ty
      // can just use instanceOf KeyboardEvent here
      if (!isKeyBoardEvent(e)) throw new Error('not a keyboard event');
      const { code, ctrlKey, altKey, shiftKey } = e;
      // Uncomment to discover handy key codes
      // console.log(code);
      if (config.code !== code) return;
      if (config.ctrlKey && !ctrlKey) return;
      if (config.shiftKey && !shiftKey) return;
      if (config.altKey && !altKey) return;

      // I'm assuming that you will always want to prevent the default action
      e.preventDefault();
      shortcutAction(e);
    },
    [shortcutAction, config]
  );

  useEffect(() => {
    targetElement.addEventListener('keydown', eventHandler);
    return () => targetElement.removeEventListener('keydown', eventHandler);
  }, [targetElement, eventHandler]);
}
