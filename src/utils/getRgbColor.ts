const getRgbColor = (color: string) => {
  if ([ 'primary', 'accent' ].includes(color)) {
    return `var(--rgb-${color}-color)`;
  }

  return `var(--rgb-${color})`;
};

export {
  getRgbColor
};
