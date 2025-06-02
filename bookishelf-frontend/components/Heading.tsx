'use client';

import React, { useEffect, useRef, forwardRef } from 'react';

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  id?: string;
  visuallyHidden?: boolean;
  autoFocus?: boolean;
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, children, id, visuallyHidden = false, autoFocus = false }, ref) => {
    const innerRef = useRef<HTMLHeadingElement>(null);

    const combinedRef = (node: HTMLHeadingElement | null) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      innerRef.current = node;
    };

    useEffect(() => {
      if (autoFocus && level === 1 && innerRef.current) {
        innerRef.current.focus();
      }
    }, [autoFocus, level]);

    const tagMap = {
      1: 'h1',
      2: 'h2',
      3: 'h3',
      4: 'h4',
      5: 'h5',
      6: 'h6',
    } as const;

    const Tag = tagMap[level] || 'h1';

    const hiddenClass = visuallyHidden ? 'sr-only' : '';

    const baseClasses = 'font-semibold';

    const sizeClasses = {
      1: 'text-3xl mt-4',
      2: 'text-xl mb-4',
      3: 'text-lg my-2',
      4: 'text-md my-2',
      5: 'text-sm my-2',
      6: 'text-base my-1',
    };

    const classes = `${baseClasses} ${sizeClasses[level]} ${hiddenClass}`.trim();

    return (
      <Tag id={id} className={classes} tabIndex={level === 1 ? 0 : undefined} ref={combinedRef}>
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';
