import React from 'react';
import { useCountUp, formatNumber } from '../hooks/useCountUp';

export const CountStat = ({ target, suffix = '', prefix = '', duration = 1800, className = '' }) => {
  const { value, ref } = useCountUp(target, { duration });
  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(value)}
      {suffix}
    </span>
  );
};
